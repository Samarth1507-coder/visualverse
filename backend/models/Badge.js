const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Badge name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Badge name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Badge description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Badge icon is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Badge category is required'],
    enum: ['achievement', 'participation', 'social', 'skill', 'milestone'],
    default: 'achievement'
  },
  criteria: {
    type: {
      type: String,
      required: [true, 'Criteria type is required'],
      enum: ['doodles_completed', 'challenges_participated', 'likes_received', 'days_streak', 'perfect_ratings', 'community_contributor'],
      default: 'doodles_completed'
    },
    threshold: {
      type: Number,
      required: [true, 'Criteria threshold is required'],
      min: [1, 'Threshold must be at least 1']
    },
    timeframe: {
      type: String,
      enum: ['lifetime', 'weekly', 'monthly'],
      default: 'lifetime'
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  unlockMessage: {
    type: String,
    trim: true,
    maxlength: [100, 'Unlock message cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
badgeSchema.index({ category: 1, isActive: 1 });
badgeSchema.index({ 'criteria.type': 1, isActive: 1 });

// Virtual for display name
badgeSchema.virtual('displayName').get(function() {
  return this.name;
});

// Static method to get badges by category
badgeSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ points: -1, name: 1 });
};

// Static method to get badges by criteria type
badgeSchema.statics.getByCriteriaType = function(criteriaType) {
  return this.find({ 'criteria.type': criteriaType, isActive: true }).sort({ 'criteria.threshold': 1 });
};

// Static method to get all active badges
badgeSchema.statics.getActiveBadges = function() {
  return this.find({ isActive: true }).sort({ category: 1, points: -1 });
};

module.exports = mongoose.model('Badge', badgeSchema);
