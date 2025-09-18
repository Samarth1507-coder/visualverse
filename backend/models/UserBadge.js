const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: [true, 'Badge ID is required']
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  progress: {
    current: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative']
    },
    target: {
      type: Number,
      required: [true, 'Target progress is required'],
      min: [1, 'Target must be at least 1']
    },
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient queries
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
userBadgeSchema.index({ userId: 1, isUnlocked: 1 });
userBadgeSchema.index({ userId: 1, 'progress.percentage': -1 });

// Virtual for badge info
userBadgeSchema.virtual('badge', {
  ref: 'Badge',
  localField: 'badgeId',
  foreignField: '_id',
  justOne: true
});

// Virtual for user info
userBadgeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Method to update progress
userBadgeSchema.methods.updateProgress = function(currentValue) {
  this.progress.current = Math.min(currentValue, this.progress.target);
  this.progress.percentage = Math.round((this.progress.current / this.progress.target) * 100);
  this.lastUpdated = new Date();
  
  // Check if badge should be unlocked
  if (this.progress.current >= this.progress.target && !this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
  }
  
  return this.save();
};

// Method to unlock badge
userBadgeSchema.methods.unlock = function() {
  if (!this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
    this.progress.current = this.progress.target;
    this.progress.percentage = 100;
    this.lastUpdated = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get user's unlocked badges
userBadgeSchema.statics.getUnlockedBadges = function(userId) {
  return this.find({ userId, isUnlocked: true })
    .populate('badgeId')
    .sort({ unlockedAt: -1 });
};

// Static method to get user's badge progress
userBadgeSchema.statics.getUserProgress = function(userId) {
  return this.find({ userId })
    .populate('badgeId')
    .sort({ 'progress.percentage': -1, 'badgeId.points': -1 });
};

// Static method to get user's progress for specific badge
userBadgeSchema.statics.getUserBadgeProgress = function(userId, badgeId) {
  return this.findOne({ userId, badgeId }).populate('badgeId');
};

// Static method to create or update user badge progress
userBadgeSchema.statics.createOrUpdateProgress = function(userId, badgeId, currentValue, targetValue) {
  return this.findOneAndUpdate(
    { userId, badgeId },
    {
      $set: {
        progress: {
          current: Math.min(currentValue, targetValue),
          target: targetValue,
          percentage: Math.round((Math.min(currentValue, targetValue) / targetValue) * 100)
        },
        lastUpdated: new Date()
      },
      $setOnInsert: {
        isUnlocked: false,
        unlockedAt: null
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
};

module.exports = mongoose.model('UserBadge', userBadgeSchema);
