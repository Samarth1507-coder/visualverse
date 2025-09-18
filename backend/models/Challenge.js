const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  prompt: {
    type: String,
    required: [true, 'Challenge prompt is required'],
    trim: true,
    maxlength: [500, 'Prompt cannot exceed 500 characters']
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Challenge category is required'],
    enum: {
      values: ['data-structures', 'algorithms', 'graphs', 'trees', 'arrays', 'strings', 'dynamic-programming', 'sorting', 'searching'],
      message: 'Invalid category'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Challenge difficulty is required'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Invalid difficulty level'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  points: {
    type: Number,
    required: [true, 'Challenge points are required'],
    min: [1, 'Points must be at least 1'],
    max: [100, 'Points cannot exceed 100']
  },
  timeLimit: {
    type: Number, // in minutes, 0 means no time limit
    default: 0,
    min: [0, 'Time limit cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for challenge statistics
challengeSchema.virtual('submissionCount', {
  ref: 'Doodle',
  localField: '_id',
  foreignField: 'challengeId',
  count: true
});

// Virtual for average rating
challengeSchema.virtual('averageRating', {
  ref: 'Doodle',
  localField: '_id',
  foreignField: 'challengeId',
  pipeline: [
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]
});

// Index for efficient queries
challengeSchema.index({ category: 1, difficulty: 1, isActive: 1 });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ createdAt: -1 });

// Pre-save middleware to update the updatedAt field
challengeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get challenges with filters
challengeSchema.statics.getChallenges = function(filters = {}) {
  const {
    category,
    difficulty,
    tags,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

  const query = { isActive: true };

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (tags && tags.length > 0) query.tags = { $in: tags };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { prompt: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('submissionCount')
    .populate('averageRating');
};

// Instance method to get challenge statistics
challengeSchema.methods.getStats = async function() {
  const Doodle = mongoose.model('Doodle');
  
  const stats = await Doodle.aggregate([
    { $match: { challengeId: this._id } },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        totalLikes: { $sum: '$likes' }
      }
    }
  ]);

  return stats[0] || { totalSubmissions: 0, averageRating: 0, totalLikes: 0 };
};

module.exports = mongoose.model('Challenge', challengeSchema);

