const mongoose = require('mongoose');

const doodleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: [true, 'Challenge ID is required']
  },
  title: {
    type: String,
    required: [true, 'Doodle title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageData: {
    type: String, // Base64 encoded image data
    required: [true, 'Image data is required']
  },
  imageUrl: {
    type: String, // Optional: URL if image is stored externally
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  completionTime: {
    type: Number, // in seconds
    min: [0, 'Completion time cannot be negative']
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

// Virtual for user info
doodleSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for challenge info
doodleSchema.virtual('challenge', {
  ref: 'Challenge',
  localField: 'challengeId',
  foreignField: '_id',
  justOne: true
});

// Indexes for efficient queries
doodleSchema.index({ userId: 1, createdAt: -1 });
doodleSchema.index({ challengeId: 1, createdAt: -1 });
doodleSchema.index({ isPublic: 1, isFeatured: 1, createdAt: -1 });
doodleSchema.index({ tags: 1 });
doodleSchema.index({ likes: -1, createdAt: -1 });

// Pre-save middleware to update the updatedAt field
doodleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to update rating from ratings array
doodleSchema.pre('save', function(next) {
  if (this.ratings && this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.rating = totalRating / this.ratings.length;
  }
  next();
});

// Static method to get doodles with filters
doodleSchema.statics.getDoodles = function(filters = {}) {
  const {
    challengeId,
    userId,
    tags,
    search,
    isPublic = true,
    isFeatured,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = filters;

  const query = {};

  if (challengeId) query.challengeId = challengeId;
  if (userId) query.userId = userId;
  if (isPublic !== undefined) query.isPublic = isPublic;
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
  if (tags && tags.length > 0) query.tags = { $in: tags };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  return this.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('user', 'firstName lastName username avatar')
    .populate('challenge', 'title prompt category difficulty');
};

// Instance method to like/unlike a doodle
doodleSchema.methods.toggleLike = async function(userId) {
  const userIndex = this.likedBy.indexOf(userId);
  
  if (userIndex === -1) {
    // Like the doodle
    this.likedBy.push(userId);
    this.likes += 1;
  } else {
    // Unlike the doodle
    this.likedBy.splice(userIndex, 1);
    this.likes = Math.max(0, this.likes - 1);
  }
  
  return this.save();
};

// Instance method to add a rating
doodleSchema.methods.addRating = async function(userId, rating) {
  // Remove existing rating from this user
  this.ratings = this.ratings.filter(r => r.userId.toString() !== userId.toString());
  
  // Add new rating
  this.ratings.push({ userId, rating });
  
  // Update average rating
  const totalRating = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.rating = totalRating / this.ratings.length;
  
  return this.save();
};

// Instance method to add a comment
doodleSchema.methods.addComment = async function(userId, text) {
  this.comments.push({ userId, text });
  return this.save();
};

// Static method to get featured doodles
doodleSchema.statics.getFeaturedDoodles = function(limit = 10) {
  return this.find({ isPublic: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName username avatar')
    .populate('challenge', 'title prompt category difficulty');
};

// Static method to get trending doodles (most liked in recent time)
doodleSchema.statics.getTrendingDoodles = function(days = 7, limit = 10) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - days);
  
  return this.find({
    isPublic: true,
    createdAt: { $gte: dateThreshold }
  })
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName username avatar')
    .populate('challenge', 'title prompt category difficulty');
};

module.exports = mongoose.model('Doodle', doodleSchema);

