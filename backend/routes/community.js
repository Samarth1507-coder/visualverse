const express = require('express');
const { query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Doodle = require('../models/Doodle');

const router = express.Router();

/**
 * @route   GET /api/community/gallery
 * @desc    Get community gallery (public doodles)
 * @access  Private
 */
router.get('/gallery', protect, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('sortBy').optional().isIn(['latest', 'likes', 'rating']),
  query('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });

    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const sortBy = req.query.sortBy || 'latest';
    const tags = req.query.tags || [];

    const query = { isPublic: true };
    if (tags.length > 0) query.tags = { $in: tags };

    let sortOption = { createdAt: -1 };
    if (sortBy === 'likes') sortOption = { likes: -1, createdAt: -1 };
    if (sortBy === 'rating') sortOption = { rating: -1, createdAt: -1 };

    const doodles = await Doodle.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'firstName lastName username avatar')
      .populate('challenge', 'title prompt category difficulty');

    const total = await Doodle.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        doodles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch gallery' });
  }
});

/**
 * @route   GET /api/community/feed
 * @desc    Get community feed (recent public doodles)
 * @access  Private
 */
router.get('/feed', protect, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('sortBy').optional().isIn(['latest', 'likes', 'rating']),
  query('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', errors: errors.array() });

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sortBy = req.query.sortBy || 'latest';
    const tags = req.query.tags || [];

    const query = { isPublic: true };
    if (tags.length > 0) query.tags = { $in: tags };

    let sortOption = { createdAt: -1 };
    if (sortBy === 'likes') sortOption = { likes: -1, createdAt: -1 };
    if (sortBy === 'rating') sortOption = { rating: -1, createdAt: -1 };

    const feed = await Doodle.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'firstName lastName username avatar')
      .populate('challenge', 'title prompt category difficulty');

    const total = await Doodle.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        feed,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch feed' });
  }
});

module.exports = router;
