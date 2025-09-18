const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const User = require('../models/User');
const Doodle = require('../models/Doodle');

class BadgeService {
  /**
   * Check and update badge progress for a user
   * @param {string} userId - User ID
   * @param {string} criteriaType - Type of criteria to check
   * @param {number} currentValue - Current value for the criteria
   */
  static async checkAndUpdateBadgeProgress(userId, criteriaType, currentValue) {
    try {
      // Get all badges for this criteria type
      const badges = await Badge.getByCriteriaType(criteriaType);
      const newlyUnlockedBadges = [];

      for (const badge of badges) {
        // Create or update user badge progress
        const userBadge = await UserBadge.createOrUpdateProgress(
          userId,
          badge._id,
          currentValue,
          badge.criteria.threshold
        );

        // Check if badge was just unlocked
        if (userBadge.progress.current >= userBadge.progress.target && !userBadge.isUnlocked) {
          await userBadge.unlock();
          newlyUnlockedBadges.push({
            badge: badge,
            userBadge: userBadge
          });
        }
      }

      // Update user's badge statistics
      if (newlyUnlockedBadges.length > 0) {
        const user = await User.findById(userId);
        await user.updateBadgeStats();
      }

      return newlyUnlockedBadges;
    } catch (error) {
      console.error('Error checking badge progress:', error);
      throw error;
    }
  }

  /**
   * Check doodles completed badges
   * @param {string} userId - User ID
   */
  static async checkDoodlesCompletedBadges(userId) {
    try {
      const doodlesCount = await Doodle.countDocuments({ userId });
      return await this.checkAndUpdateBadgeProgress(userId, 'doodles_completed', doodlesCount);
    } catch (error) {
      console.error('Error checking doodles completed badges:', error);
      throw error;
    }
  }

  /**
   * Check challenges participated badges
   * @param {string} userId - User ID
   */
  static async checkChallengesParticipatedBadges(userId) {
    try {
      const uniqueChallenges = await Doodle.distinct('challengeId', { userId });
      const challengesCount = uniqueChallenges.length;
      return await this.checkAndUpdateBadgeProgress(userId, 'challenges_participated', challengesCount);
    } catch (error) {
      console.error('Error checking challenges participated badges:', error);
      throw error;
    }
  }

  /**
   * Check likes received badges
   * @param {string} userId - User ID
   */
  static async checkLikesReceivedBadges(userId) {
    try {
      const totalLikes = await Doodle.aggregate([
        { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
        { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
      ]);

      const likesCount = totalLikes.length > 0 ? totalLikes[0].totalLikes : 0;
      return await this.checkAndUpdateBadgeProgress(userId, 'likes_received', likesCount);
    } catch (error) {
      console.error('Error checking likes received badges:', error);
      throw error;
    }
  }

  /**
   * Check days streak badges
   * @param {string} userId - User ID
   */
  static async checkDaysStreakBadges(userId) {
    try {
      const user = await User.findById(userId);
      const streakDays = user.progress.streakDays;
      return await this.checkAndUpdateBadgeProgress(userId, 'days_streak', streakDays);
    } catch (error) {
      console.error('Error checking days streak badges:', error);
      throw error;
    }
  }

  /**
   * Check perfect ratings badges
   * @param {string} userId - User ID
   */
  static async checkPerfectRatingsBadges(userId) {
    try {
      const perfectRatings = await Doodle.countDocuments({
        userId,
        rating: { $gte: 4.5 }
      });
      return await this.checkAndUpdateBadgeProgress(userId, 'perfect_ratings', perfectRatings);
    } catch (error) {
      console.error('Error checking perfect ratings badges:', error);
      throw error;
    }
  }

  /**
   * Check community contributor badges
   * @param {string} userId - User ID
   */
  static async checkCommunityContributorBadges(userId) {
    try {
      const user = await User.findById(userId);
      const totalLikes = await Doodle.aggregate([
        { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
        { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
      ]);

      const likesCount = totalLikes.length > 0 ? totalLikes[0].totalLikes : 0;
      const doodlesCount = await Doodle.countDocuments({ userId });
      
      // Community contributor score based on likes and doodles
      const contributorScore = Math.floor((likesCount * 0.7) + (doodlesCount * 0.3));
      return await this.checkAndUpdateBadgeProgress(userId, 'community_contributor', contributorScore);
    } catch (error) {
      console.error('Error checking community contributor badges:', error);
      throw error;
    }
  }

  /**
   * Check all badge types for a user
   * @param {string} userId - User ID
   */
  static async checkAllBadges(userId) {
    try {
      const results = {
        doodlesCompleted: await this.checkDoodlesCompletedBadges(userId),
        challengesParticipated: await this.checkChallengesParticipatedBadges(userId),
        likesReceived: await this.checkLikesReceivedBadges(userId),
        daysStreak: await this.checkDaysStreakBadges(userId),
        perfectRatings: await this.checkPerfectRatingsBadges(userId),
        communityContributor: await this.checkCommunityContributorBadges(userId)
      };

      const allNewlyUnlocked = Object.values(results).flat();
      return {
        results,
        totalNewlyUnlocked: allNewlyUnlocked.length,
        newlyUnlockedBadges: allNewlyUnlocked
      };
    } catch (error) {
      console.error('Error checking all badges:', error);
      throw error;
    }
  }

  /**
   * Get user's badge progress summary
   * @param {string} userId - User ID
   */
  static async getUserBadgeSummary(userId) {
    try {
      const user = await User.findById(userId);
      const summary = await user.getBadgeProgressSummary();
      const userProgress = await UserBadge.getUserProgress(userId);

      return {
        summary,
        userProgress,
        badgeStats: user.badgeStats
      };
    } catch (error) {
      console.error('Error getting user badge summary:', error);
      throw error;
    }
  }

  /**
   * Award a specific badge to a user (admin function)
   * @param {string} userId - User ID
   * @param {string} badgeId - Badge ID
   */
  static async awardBadge(userId, badgeId) {
    try {
      const badge = await Badge.findById(badgeId);
      if (!badge) {
        throw new Error('Badge not found');
      }

      const userBadge = await UserBadge.findOneAndUpdate(
        { userId, badgeId },
        {
          $set: {
            isUnlocked: true,
            unlockedAt: new Date(),
            progress: {
              current: badge.criteria.threshold,
              target: badge.criteria.threshold,
              percentage: 100
            },
            lastUpdated: new Date()
          }
        },
        {
          upsert: true,
          new: true
        }
      );

      // Update user's badge statistics
      const user = await User.findById(userId);
      await user.updateBadgeStats();

      return userBadge;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }
}

module.exports = BadgeService;
