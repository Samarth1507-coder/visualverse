const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/community/gallery
 * @desc    Get community gallery (placeholder)
 * @access  Private
 */
router.get('/gallery', protect, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Community Gallery - Coming soon!',
    data: {
      gallery: [],
    },
  });
});

/**
 * @route   GET /api/community/feed
 * @desc    Get community feed (placeholder)
 * @access  Private
 */
router.get('/feed', protect, async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Community Feed - Coming soon!',
    data: {
      feed: [],
    },
  });
});

module.exports = router;



