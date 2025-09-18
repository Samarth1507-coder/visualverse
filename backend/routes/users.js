const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination and search)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || '';

    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const users = await User.find(query)
      .select('username firstName lastName avatar bio skillLevel progress.achievements')
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users',
    });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username firstName lastName avatar')
      .populate('following', 'username firstName lastName avatar');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user',
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot be more than 50 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot be more than 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  body('skillLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid skill level'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, bio, skillLevel, preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (skillLevel) user.skillLevel = skillLevel;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          avatar: user.avatar,
          bio: user.bio,
          skillLevel: user.skillLevel,
          role: user.role,
          progress: user.progress,
          achievements: user.achievements,
          profileCompletion: user.profileCompletion,
          preferences: user.preferences,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating profile',
    });
  }
});

/**
 * @route   POST /api/users/follow/:id
 * @desc    Follow a user
 * @access  Private
 */
router.post('/follow/:id', protect, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot follow yourself',
      });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'You are already following this user',
      });
    }

    // Add to following
    currentUser.following.push(req.params.id);
    await currentUser.save();

    // Add to followers
    userToFollow.followers.push(req.user.id);
    await userToFollow.save();

    res.status(200).json({
      status: 'success',
      message: 'User followed successfully',
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while following user',
    });
  }
});

/**
 * @route   DELETE /api/users/follow/:id
 * @desc    Unfollow a user
 * @access  Private
 */
router.delete('/follow/:id', protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.id
    );
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== req.user.id
    );
    await userToUnfollow.save();

    res.status(200).json({
      status: 'success',
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while unfollowing user',
    });
  }
});

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get leaderboard
 * @access  Private
 */
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const leaderboard = await User.find({ isActive: true })
      .select('username firstName lastName avatar progress.totalPoints progress.streakDays')
      .sort({ 'progress.totalPoints': -1, 'progress.streakDays': -1 })
      .limit(limit);

    res.status(200).json({
      status: 'success',
      data: { leaderboard },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard',
    });
  }
});

module.exports = router;


