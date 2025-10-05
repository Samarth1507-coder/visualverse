const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
      const badges = await Badge.getByCriteriaType(criteriaType);
      const newlyUnlockedBadges = [];

      for (const badge of badges) {
        const userBadge = await UserBadge.createOrUpdateProgress(
          userId,
          badge._id,
          currentValue,
          badge.criteria.threshold
        );

        if (userBadge.progress.current >= userBadge.progress.target && !userBadge.isUnlocked) {
          await userBadge.unlock();
          newlyUnlockedBadges.push({ badge, userBadge });
          console.log(`✅ User ${userId} unlocked badge: ${badge.name}`);
        }
      }

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
   * Get basic doodle stats for a user to avoid repeated DB queries
   */
  static async getUserDoodleStats(userId) {
    const userObjectId = ObjectId(userId);

    const [totalLikesAgg, doodlesCount, uniqueChallenges] = await Promise.all([
      Doodle.aggregate([
        { $match: { userId: userObjectId } },
        { $group: { _id: null, totalLikes: { $sum: '$likes' } } }
      ]),
      Doodle.countDocuments({ userId: userObjectId }),
      Doodle.distinct('challengeId', { userId: userObjectId })
    ]);

    const totalLikes = totalLikesAgg.length > 0 ? totalLikesAgg[0].totalLikes : 0;
    return { totalLikes, doodlesCount, challengesCount: uniqueChallenges.length };
  }

  static async checkDoodlesCompletedBadges(userId) {
    try {
      const { doodlesCount } = await this.getUserDoodleStats(userId);
      return await this.checkAndUpdateBadgeProgress(userId, 'doodles_completed', doodlesCount);
    } catch (error) {
      console.error('Error checking doodles completed badges:', error);
      throw error;
    }
  }

  static async checkChallengesParticipatedBadges(userId) {
    try {
      const { challengesCount } = await this.getUserDoodleStats(userId);
      return await this.checkAndUpdateBadgeProgress(userId, 'challenges_participated', challengesCount);
    } catch (error) {
      console.error('Error checking challenges participated badges:', error);
      throw error;
    }
  }

  static async checkLikesReceivedBadges(userId) {
    try {
      const { totalLikes } = await this.getUserDoodleStats(userId);
      return await this.checkAndUpdateBadgeProgress(userId, 'likes_received', totalLikes);
    } catch (error) {
      console.error('Error checking likes received badges:', error);
      throw error;
    }
  }

  static async checkDaysStreakBadges(userId) {
    try {
      const user = await User.findById(userId);
      const streakDays = user.progress?.streakDays || 0;
      return await this.checkAndUpdateBadgeProgress(userId, 'days_streak', streakDays);
    } catch (error) {
      console.error('Error checking days streak badges:', error);
      throw error;
    }
  }

  static async checkPerfectRatingsBadges(userId) {
    try {
      const perfectRatings = await Doodle.countDocuments({
        userId: ObjectId(userId),
        rating: { $gte: 4.5 }
      });
      return await this.checkAndUpdateBadgeProgress(userId, 'perfect_ratings', perfectRatings);
    } catch (error) {
      console.error('Error checking perfect ratings badges:', error);
      throw error;
    }
  }

  static async checkCommunityContributorBadges(userId) {
    try {
      const { totalLikes, doodlesCount } = await this.getUserDoodleStats(userId);
      const contributorScore = Math.floor(totalLikes * 0.7 + doodlesCount * 0.3);
      return await this.checkAndUpdateBadgeProgress(userId, 'community_contributor', contributorScore);
    } catch (error) {
      console.error('Error checking community contributor badges:', error);
      throw error;
    }
  }

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

      const newlyUnlockedBadges = Object.values(results).flat();
      return { results, totalNewlyUnlocked: newlyUnlockedBadges.length, newlyUnlockedBadges };
    } catch (error) {
      console.error('Error checking all badges:', error);
      throw error;
    }
  }

  static async getUserBadgeSummary(userId) {
    try {
      const user = await User.findById(userId);
      const summary = await user.getBadgeProgressSummary();
      const userProgress = await UserBadge.getUserProgress(userId);
      return { summary, userProgress, badgeStats: user.badgeStats };
    } catch (error) {
      console.error('Error getting user badge summary:', error);
      throw error;
    }
  }

  static async awardBadge(userId, badgeId) {
    try {
      const badge = await Badge.findById(badgeId);
      if (!badge) throw new Error('Badge not found');

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
        { upsert: true, new: true }
      );

      const user = await User.findById(userId);
      await user.updateBadgeStats();

      console.log(`✅ Badge ${badge.name} awarded to user ${userId}`);
      return userBadge;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }
}

module.exports = BadgeService;
