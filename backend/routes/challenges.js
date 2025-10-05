const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { protect } = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const Doodle = require('../models/Doodle');
const BadgeService = require('../services/badgeService');

const router = express.Router();

// Static routes
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'data-structures', name: 'Data Structures', icon: '📊' },
      { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
      { id: 'graphs', name: 'Graphs', icon: '🕸️' },
      { id: 'trees', name: 'Trees', icon: '🌳' },
      { id: 'arrays', name: 'Arrays', icon: '📋' },
      { id: 'strings', name: 'Strings', icon: '📝' },
      { id: 'dynamic-programming', name: 'Dynamic Programming', icon: '🧩' },
      { id: 'sorting', name: 'Sorting', icon: '🔄' },
      { id: 'searching', name: 'Searching', icon: '🔍' },
    ];

    res.status(200).json({ status: 'success', data: { categories } });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch categories' });
  }
});

router.get('/difficulties', async (req, res) => {
  try {
    const difficulties = [
      { id: 'beginner', name: 'Beginner', color: 'green' },
      { id: 'intermediate', name: 'Intermediate', color: 'yellow' },
      { id: 'advanced', name: 'Advanced', color: 'red' },
    ];

    res.status(200).json({ status: 'success', data: { difficulties } });
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch difficulties' });
  }
});

router.get('/random', [
  query('category').optional().isIn(['data-structures', 'algorithms', 'graphs', 'trees', 'arrays', 'strings', 'dynamic-programming', 'sorting', 'searching']),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });

    const matchQuery = { isActive: true };
    if (req.query.category) matchQuery.category = req.query.category;
    if (req.query.difficulty) matchQuery.difficulty = req.query.difficulty;

    const challenge = await Challenge.aggregate([{ $match: matchQuery }, { $sample: { size: 1 } }]);

    if (!challenge || challenge.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No challenges found with the specified criteria' });
    }

    res.status(200).json({ status: 'success', data: { challenge: challenge[0] } });
  } catch (error) {
    console.error('Error fetching random challenge:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch random challenge' });
  }
});

// Parameterized routes
router.get('/:id/doodles', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sortBy').optional().isIn(['createdAt', 'likes', 'rating']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isActive) return res.status(404).json({ status: 'error', message: 'Challenge not found' });

    const filters = {
      challengeId: req.params.id,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    };

    const doodles = await Doodle.getDoodles(filters);
    const totalDoodles = await Doodle.countDocuments({ challengeId: req.params.id, isPublic: true });

    res.status(200).json({
      status: 'success',
      data: {
        challenge: {
          id: challenge._id,
          title: challenge.title,
          prompt: challenge.prompt,
          category: challenge.category,
          difficulty: challenge.difficulty,
        },
        doodles,
        pagination: { page: filters.page, limit: filters.limit, total: totalDoodles, pages: Math.ceil(totalDoodles / filters.limit) },
      },
    });
  } catch (error) {
    console.error('Error fetching challenge doodles:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch challenge doodles' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isActive) return res.status(404).json({ status: 'error', message: 'Challenge not found or inactive' });

    const stats = await challenge.getStats?.() || {};
    res.status(200).json({ status: 'success', data: { challenge: { ...challenge.toObject(), stats } } });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch challenge' });
  }
});

// Listing and submission routes
router.get('/', [
  query('category').optional().isIn(['data-structures', 'algorithms', 'graphs', 'trees', 'arrays', 'strings', 'dynamic-programming', 'sorting', 'searching']),
  query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('tags').optional().isString(),
  query('search').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('sortBy').optional().isIn(['createdAt', 'title', 'difficulty', 'points']),
  query('sortOrder').optional().isIn(['asc', 'desc']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });

    const filters = {
      category: req.query.category,
      difficulty: req.query.difficulty,
      tags: req.query.tags ? req.query.tags.split(',').map(t => t.trim()) : [],
      search: req.query.search,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    };

    // Build query filter
    const queryFilter = { isActive: true };
    if (filters.category) queryFilter.category = filters.category;
    if (filters.difficulty) queryFilter.difficulty = filters.difficulty;
    if (filters.tags.length) queryFilter.tags = { $all: filters.tags };
    if (filters.search) queryFilter.title = { $regex: filters.search, $options: 'i' };

    const challenges = await Challenge.getChallenges(filters);
    const totalChallenges = await Challenge.countDocuments(queryFilter);

    res.status(200).json({
      status: 'success',
      data: {
        challenges,
        pagination: { page: filters.page, limit: filters.limit, total: totalChallenges, pages: Math.ceil(totalChallenges / filters.limit) },
      },
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch challenges' });
  }
});

router.post('/:id/submit', [
  protect,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('imageData').notEmpty().withMessage('Image data is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isLength({ max: 20 }).withMessage('Each tag cannot exceed 20 characters'),
  body('completionTime').optional().isInt({ min: 0 }).withMessage('Completion time must be a positive integer'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ status: 'error', message: 'Validation failed', errors: errors.array() });

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isActive) return res.status(404).json({ status: 'error', message: 'Challenge not found or inactive' });

    const existingDoodle = await Doodle.findOne({ userId: req.user.id, challengeId: req.params.id });
    if (existingDoodle) return res.status(400).json({ status: 'error', message: 'You have already submitted a doodle for this challenge' });

    const doodle = new Doodle({
      userId: req.user.id,
      challengeId: req.params.id,
      title: req.body.title,
      description: req.body.description || '',
      imageData: req.body.imageData,
      tags: req.body.tags || [],
      completionTime: req.body.completionTime || 0,
    });
    await doodle.save();

    await doodle.populate('user', 'firstName lastName username avatar');
    await doodle.populate('challenge', 'title prompt category difficulty');

    const [doodlesUnlocked, challengesUnlocked] = await Promise.all([
      BadgeService.checkDoodlesCompletedBadges(req.user.id),
      BadgeService.checkChallengesParticipatedBadges(req.user.id),
    ]);

    const allNewlyUnlocked = [...doodlesUnlocked, ...challengesUnlocked];

    res.status(201).json({
      status: 'success',
      message: 'Doodle submitted successfully',
      data: {
        doodle,
        newlyUnlockedBadges: allNewlyUnlocked.map(item => ({
          badge: item.badge,
          unlockMessage: item.badge.unlockMessage,
        })),
      },
    });
  } catch (error) {
    console.error('Error submitting doodle:', error);
    res.status(500).json({ status: 'error', message: 'Failed to submit doodle' });
  }
});

module.exports = router;
