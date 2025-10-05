const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const Doodle = require('../models/Doodle');
const BadgeService = require('../services/badgeService');

const router = express.Router();

/**
 * @route   GET /api/drawings
 * @desc    Get all doodles with filters
 * @access  Public
 */
router.get(
  '/',
  [
    query('challengeId').optional().isMongoId(),
    query('userId').optional().isMongoId(),
    query('tags').optional().isString(),
    query('search').optional().isString().trim(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('sortBy').optional().isIn(['createdAt', 'likes', 'rating']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const filters = {
        challengeId: req.query.challengeId,
        userId: req.query.userId,
        tags: req.query.tags
          ? req.query.tags.split(',').map((tag) => tag.trim())
          : undefined,
        search: req.query.search,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc',
      };

      const doodles = await Doodle.getDoodles(filters);
      const totalDoodles = await Doodle.countDocuments({ isPublic: true });

      res.status(200).json({
        status: 'success',
        message: 'Doodles fetched successfully',
        data: {
          doodles,
          pagination: {
            page: filters.page,
            limit: filters.limit,
            total: totalDoodles,
            pages: Math.ceil(totalDoodles / filters.limit),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching doodles:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch doodles',
        error: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/drawings/featured
 * @desc    Get featured doodles
 * @access  Public
 */
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const doodles = await Doodle.getFeaturedDoodles(limit);

    res.status(200).json({
      status: 'success',
      message: 'Featured doodles fetched successfully',
      data: { doodles },
    });
  } catch (error) {
    console.error('Error fetching featured doodles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch featured doodles',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/drawings/trending
 * @desc    Get trending doodles
 * @access  Public
 */
router.get('/trending', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = parseInt(req.query.limit) || 10;
    const doodles = await Doodle.getTrendingDoodles(days, limit);

    res.status(200).json({
      status: 'success',
      message: 'Trending doodles fetched successfully',
      data: { doodles },
    });
  } catch (error) {
    console.error('Error fetching trending doodles:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch trending doodles',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/drawings/:id
 * @desc    Get a specific doodle by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const doodle = await Doodle.findById(req.params.id)
      .populate('user', 'firstName lastName username avatar')
      .populate('challenge', 'title prompt category difficulty');

    if (!doodle || !doodle.isPublic) {
      return res.status(404).json({
        status: 'error',
        message: 'Doodle not found or not available',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Doodle fetched successfully',
      data: { doodle },
    });
  } catch (error) {
    console.error('Error fetching doodle:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doodle',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/drawings
 * @desc    Create a new doodle
 * @access  Private
 */
router.post(
  '/',
  [
    protect,
    body('challengeId').isMongoId().withMessage('Valid challenge ID is required'),
    body('title')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('description').optional().trim().isLength({ max: 500 }),
    body('imageData').notEmpty().withMessage('Image data is required'),
    body('tags').optional().isArray(),
    body('tags.*').optional().isLength({ max: 20 }),
    body('completionTime').optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const existingDoodle = await Doodle.findOne({
        userId: req.user.id,
        challengeId: req.body.challengeId,
      });

      if (existingDoodle) {
        return res.status(400).json({
          status: 'error',
          message: 'You have already submitted a doodle for this challenge',
        });
      }

      const doodle = new Doodle({
        userId: req.user.id,
        challengeId: req.body.challengeId,
        title: req.body.title,
        description: req.body.description || '',
        imageData: req.body.imageData,
        tags: req.body.tags || [],
        completionTime: req.body.completionTime || 0,
      });

      await doodle.save();
      await doodle.populate('user', 'firstName lastName username avatar');
      await doodle.populate('challenge', 'title prompt category difficulty');

      const newlyUnlockedBadges =
        (await BadgeService.checkDoodlesCompletedBadges(req.user.id)) || [];

      res.status(201).json({
        status: 'success',
        message: 'Doodle created successfully',
        data: {
          doodle,
          newlyUnlockedBadges: newlyUnlockedBadges.map((item) => ({
            badge: item.badge,
            unlockMessage: item.badge.unlockMessage,
          })),
        },
      });
    } catch (error) {
      console.error('Error creating doodle:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create doodle',
        error: error.message,
      });
    }
  }
);

/**
 * @route   PUT /api/drawings/:id/like
 * @desc    Like/unlike a doodle
 * @access  Private
 */
router.put('/:id/like', protect, async (req, res) => {
  try {
    const doodle = await Doodle.findById(req.params.id);

    if (!doodle || !doodle.isPublic) {
      return res.status(404).json({
        status: 'error',
        message: 'Doodle not found or not available',
      });
    }

    await doodle.toggleLike(req.user.id);

    const newlyUnlockedBadges =
      (await BadgeService.checkLikesReceivedBadges(doodle.userId)) || [];

    res.status(200).json({
      status: 'success',
      message: 'Doodle like updated successfully',
      data: {
        likes: doodle.likes,
        isLiked: doodle.likedBy.includes(req.user.id),
        newlyUnlockedBadges: newlyUnlockedBadges.map((item) => ({
          badge: item.badge,
          unlockMessage: item.badge.unlockMessage,
        })),
      },
    });
  } catch (error) {
    console.error('Error updating doodle like:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update doodle like',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/drawings/:id/rate
 * @desc    Rate a doodle
 * @access  Private
 */
router.post(
  '/:id/rate',
  [protect, body('rating').isInt({ min: 1, max: 5 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const doodle = await Doodle.findById(req.params.id);

      if (!doodle || !doodle.isPublic) {
        return res.status(404).json({
          status: 'error',
          message: 'Doodle not found or not available',
        });
      }

      await doodle.addRating(req.user.id, req.body.rating);

      const newlyUnlockedBadges =
        (await BadgeService.checkPerfectRatingsBadges(doodle.userId)) || [];

      res.status(200).json({
        status: 'success',
        message: 'Doodle rated successfully',
        data: {
          rating: doodle.rating,
          newlyUnlockedBadges: newlyUnlockedBadges.map((item) => ({
            badge: item.badge,
            unlockMessage: item.badge.unlockMessage,
          })),
        },
      });
    } catch (error) {
      console.error('Error rating doodle:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to rate doodle',
        error: error.message,
      });
    }
  }
);

module.exports = router;
