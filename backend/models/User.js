const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [30, 'Username cannot be more than 30 characters'],
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters'],
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: '',
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
  },
  // Learning progress
  progress: {
    completedChallenges: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    }],
    totalPoints: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  // Achievements and badges
  achievements: [{
    type: {
      type: String,
      enum: ['first_drawing', 'streak_7', 'streak_30', 'challenge_master', 'community_contributor'],
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    description: String,
  }],
  // Badge statistics for quick access
  badgeStats: {
    totalBadges: {
      type: Number,
      default: 0,
    },
    unlockedBadges: {
      type: Number,
      default: 0,
    },
    totalBadgePoints: {
      type: Number,
      default: 0,
    },
    lastBadgeUnlocked: {
      type: Date,
      default: null,
    },
  },
  // Social features
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  // Account settings
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for profile completion percentage
UserSchema.virtual('profileCompletion').get(function() {
  const fields = ['username', 'email', 'firstName', 'lastName', 'bio', 'avatar'];
  const completed = fields.filter(field => this[field] && this[field].toString().trim() !== '').length;
  return Math.round((completed / fields.length) * 100);
});

// Index for search functionality
UserSchema.index({ username: 'text', firstName: 'text', lastName: 'text', bio: 'text' });

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last active date
UserSchema.methods.updateLastActive = function() {
  this.progress.lastActiveDate = new Date();
  return this.save();
};

// Add points to user
UserSchema.methods.addPoints = function(points) {
  this.progress.totalPoints += points;
  return this.save();
};

// Add achievement
UserSchema.methods.addAchievement = function(achievementType, description) {
  const achievement = {
    type: achievementType,
    description: description || this.getAchievementDescription(achievementType),
  };
  
  // Check if achievement already exists
  const exists = this.achievements.some(a => a.type === achievementType);
  if (!exists) {
    this.achievements.push(achievement);
  }
  
  return this.save();
};

// Get achievement description
UserSchema.methods.getAchievementDescription = function(type) {
  const descriptions = {
    first_drawing: 'Created your first DSA doodle!',
    streak_7: 'Maintained a 7-day learning streak!',
    streak_30: 'Maintained a 30-day learning streak!',
    challenge_master: 'Completed 50 challenges!',
    community_contributor: 'Received 100 likes on your doodles!',
  };
  return descriptions[type] || 'Achievement unlocked!';
};

// Update streak
UserSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActive = new Date(this.progress.lastActiveDate);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    this.progress.streakDays += 1;
  } else if (diffDays > 1) {
    this.progress.streakDays = 1;
  }
  
  this.progress.lastActiveDate = today;
  return this.save();
};

// Update badge statistics
UserSchema.methods.updateBadgeStats = async function() {
  const UserBadge = require('./UserBadge');
  const Badge = require('./Badge');
  
  const unlockedBadges = await UserBadge.find({ userId: this._id, isUnlocked: true });
  const totalBadges = await Badge.countDocuments({ isActive: true });
  
  this.badgeStats.unlockedBadges = unlockedBadges.length;
  this.badgeStats.totalBadges = totalBadges;
  this.badgeStats.totalBadgePoints = unlockedBadges.reduce((sum, userBadge) => {
    return sum + (userBadge.badgeId?.points || 0);
  }, 0);
  
  if (unlockedBadges.length > 0) {
    this.badgeStats.lastBadgeUnlocked = unlockedBadges[0].unlockedAt;
  }
  
  return this.save();
};

// Get user's badge progress summary
UserSchema.methods.getBadgeProgressSummary = async function() {
  const UserBadge = require('./UserBadge');
  
  const userBadges = await UserBadge.find({ userId: this._id })
    .populate('badgeId')
    .sort({ 'progress.percentage': -1 });
  
  const unlocked = userBadges.filter(ub => ub.isUnlocked);
  const inProgress = userBadges.filter(ub => !ub.isUnlocked && ub.progress.current > 0);
  const notStarted = userBadges.filter(ub => !ub.isUnlocked && ub.progress.current === 0);
  
  return {
    unlocked: unlocked.length,
    inProgress: inProgress.length,
    notStarted: notStarted.length,
    total: userBadges.length,
    recentUnlocks: unlocked.slice(0, 5),
    nextBadges: inProgress.slice(0, 3)
  };
};

module.exports = mongoose.model('User', UserSchema);


