const express = require('express');
const { query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   GET /api/badges
 * @desc    Get all active badges with optional filtering
 * @access  Public
 */
router.get('/', [
  query('category').optional().isIn(['achievement', 'participation', 'social', 'skill', 'milestone']),
  query('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  query('criteriaType').optional().isIn(['doodles_completed', 'challenges_participated', 'likes_received', 'days_streak', 'perfect_ratings', 'community_contributor'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { category, rarity, criteriaType } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (rarity) filter.rarity = rarity;
    if (criteriaType) filter['criteria.type'] = criteriaType;

    const badges = await Badge.find(filter).sort({ points: -1, name: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        badges,
        count: badges.length
      }
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badges'
    });
  }
});

/**
 * @route   GET /api/badges/:id
 * @desc    Get specific badge details
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    
    if (!badge) {
      return res.status(404).json({
        status: 'error',
        message: 'Badge not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { badge }
    });
  } catch (error) {
    console.error('Error fetching badge:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badge'
    });
  }
});

/**
 * @route   GET /api/badges/user/progress
 * @desc    Get current user's badge progress
 * @access  Private
 */
router.get('/user/progress', protect, async (req, res) => {
  try {
    const userProgress = await UserBadge.getUserProgress(req.user.id);
    const summary = await req.user.getBadgeProgressSummary();

    res.status(200).json({
      status: 'success',
      data: {
        userProgress,
        summary
      }
    });
  } catch (error) {
    console.error('Error fetching user badge progress:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badge progress'
    });
  }
});

/**
 * @route   GET /api/badges/user/unlocked
 * @desc    Get current user's unlocked badges
 * @access  Private
 */
router.get('/user/unlocked', protect, async (req, res) => {
  try {
    const unlockedBadges = await UserBadge.getUnlockedBadges(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        unlockedBadges,
        count: unlockedBadges.length
      }
    });
  } catch (error) {
    console.error('Error fetching unlocked badges:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching unlocked badges'
    });
  }
});

/**
 * @route   GET /api/badges/user/:badgeId/progress
 * @desc    Get current user's progress for a specific badge
 * @access  Private
 */
router.get('/user/:badgeId/progress', protect, async (req, res) => {
  try {
    const userBadgeProgress = await UserBadge.getUserBadgeProgress(req.user.id, req.params.badgeId);
    
    if (!userBadgeProgress) {
      return res.status(404).json({
        status: 'error',
        message: 'Badge progress not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { userBadgeProgress }
    });
  } catch (error) {
    console.error('Error fetching badge progress:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badge progress'
    });
  }
});

/**
 * @route   GET /api/badges/categories
 * @desc    Get all badge categories with counts
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await Badge.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching badge categories:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badge categories'
    });
  }
});

/**
 * @route   GET /api/badges/rarities
 * @desc    Get all badge rarities with counts
 * @access  Public
 */
router.get('/rarities', async (req, res) => {
  try {
    const rarities = await Badge.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$rarity',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      data: { rarities }
    });
  } catch (error) {
    console.error('Error fetching badge rarities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching badge rarities'
    });
  }
});

/**
 * @route   GET /api/badges/leaderboard
 * @desc    Get leaderboard of users with most badges
 * @access  Public
 */
router.get('/leaderboard', [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: 'userbadges',
          localField: '_id',
          foreignField: 'userId',
          as: 'userBadges'
        }
      },
      {
        $addFields: {
          unlockedBadges: {
            $size: {
              $filter: {
                input: '$userBadges',
                cond: { $eq: ['$$this.isUnlocked', true] }
              }
            }
          },
          totalBadgePoints: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$userBadges',
                    cond: { $eq: ['$$this.isUnlocked', true] }
                  }
                },
                as: 'badge',
                in: '$$badge.points'
              }
            }
          }
        }
      },
      {
        $match: {
          unlockedBadges: { $gt: 0 }
        }
      },
      {
        $sort: {
          unlockedBadges: -1,
          totalBadgePoints: -1,
          'badgeStats.lastBadgeUnlocked': -1
        }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          unlockedBadges: 1,
          totalBadgePoints: 1,
          'badgeStats.lastBadgeUnlocked': 1
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { leaderboard }
    });
  } catch (error) {
    console.error('Error fetching badge leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard'
    });
  }
});

module.exports = router;
