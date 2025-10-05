const mongoose = require('mongoose');

// Sub-schema for progress within a badge
const progressSchema = new mongoose.Schema({
  current: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative'],
  },
  target: {
    type: Number,
    required: [true, 'Target progress is required'],
    min: [1, 'Target must be at least 1'],
  },
  percentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
}, { _id: false });

const userBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true,
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: [true, 'Badge ID is required'],
    index: true,
  },
  isUnlocked: {
    type: Boolean,
    default: false,
    index: true,
  },
  unlockedAt: {
    type: Date,
    default: null,
    index: true,
  },
  progress: {
    type: progressSchema,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Compound unique index to avoid duplicates
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

// Virtuals for badge and user details
userBadgeSchema.virtual('badge', {
  ref: 'Badge',
  localField: 'badgeId',
  foreignField: '_id',
  justOne: true,
});

userBadgeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Methods for progress updates and unlock
userBadgeSchema.methods.updateProgress = async function (currentValue) {
  this.progress.current = Math.min(currentValue, this.progress.target);
  this.progress.percentage = Math.round((this.progress.current / this.progress.target) * 100);
  this.lastUpdated = new Date();

  const unlockedNow = !this.isUnlocked && this.progress.current >= this.progress.target;

  if (unlockedNow) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
  }

  await this.save();
  return { doc: this, unlockedNow };
};

userBadgeSchema.methods.unlock = async function () {
  if (!this.isUnlocked) {
    this.isUnlocked = true;
    this.unlockedAt = new Date();
    this.progress.current = this.progress.target;
    this.progress.percentage = 100;
    this.lastUpdated = new Date();
    await this.save();
  }
  return this;
};

// Static query helpers
userBadgeSchema.statics.getUnlockedBadges = function (userId) {
  return this.find({ userId, isUnlocked: true })
    .populate('badgeId')
    .sort({ unlockedAt: -1 });
};

userBadgeSchema.statics.getUserProgress = function (userId) {
  return this.find({ userId })
    .populate('badgeId')
    .sort({ 'progress.percentage': -1, 'badgeId.points': -1 });
};

userBadgeSchema.statics.getUserBadgeProgress = function (userId, badgeId) {
  return this.findOne({ userId, badgeId }).populate('badgeId');
};

userBadgeSchema.statics.createOrUpdateProgress = function (userId, badgeId, currentValue, targetValue) {
  return this.findOneAndUpdate(
    { userId, badgeId },
    {
      $set: {
        progress: {
          current: Math.min(currentValue, targetValue),
          target: targetValue,
          percentage: Math.round((Math.min(currentValue, targetValue) / targetValue) * 100),
        },
        lastUpdated: new Date(),
      },
      $setOnInsert: {
        isUnlocked: false,
        unlockedAt: null,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

module.exports = mongoose.model('UserBadge', userBadgeSchema);
