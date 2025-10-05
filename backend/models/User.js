const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
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
      required: function() { return !this.isGuest; }, // not required for guests
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    firstName: {
      type: String,
      required: function() { return !this.isGuest; }, // not required for guests
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters'],
    },
    lastName: {
      type: String,
      required: function() { return !this.isGuest; }, // not required for guests
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters'],
    },
    isGuest: { type: Boolean, default: false }, // NEW: identify guest accounts easily
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
    progress: {
      completedChallenges: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Challenge',
        },
      ],
      totalPoints: { type: Number, default: 0 },
      streakDays: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: Date.now },
    },
    achievements: [
      {
        type: {
          type: String,
          enum: [
            'first_drawing',
            'streak_7',
            'streak_30',
            'challenge_master',
            'community_contributor',
          ],
        },
        earnedAt: { type: Date, default: Date.now },
        description: String,
      },
    ],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------- Virtuals ----------
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

UserSchema.virtual('profileCompletion').get(function () {
  const fields = ['username', 'email', 'firstName', 'lastName', 'bio', 'avatar'];
  const completed = fields.filter(
    (field) => this[field] && this[field].toString().trim() !== ''
  ).length;
  return Math.round((completed / fields.length) * 100);
});

// ---------- Index for search ----------
UserSchema.index({
  username: 'text',
  firstName: 'text',
  lastName: 'text',
  bio: 'text',
});

// ---------- Middleware ----------
// Hash password before save (skip for guests)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isGuest) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------- Methods ----------
// Generate JWT (useful only for registered/logged-in users)
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Match password (skip for guests)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.isGuest) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.updateLastActive = function () {
  this.progress.lastActiveDate = new Date();
  return this.save();
};

UserSchema.methods.addPoints = function (points) {
  this.progress.totalPoints += points;
  return this.save();
};

UserSchema.methods.addAchievement = function (achievementType, description) {
  const exists = this.achievements.some((a) => a.type === achievementType);
  if (!exists) {
    this.achievements.push({
      type: achievementType,
      description: description || this.getAchievementDescription(achievementType),
    });
  }
  return this.save();
};

UserSchema.methods.getAchievementDescription = function (type) {
  const descriptions = {
    first_drawing: 'Created your first DSA doodle!',
    streak_7: 'Maintained a 7-day learning streak!',
    streak_30: 'Maintained a 30-day learning streak!',
    challenge_master: 'Completed 50 challenges!',
    community_contributor: 'Received 100 likes on your doodles!',
  };
  return descriptions[type] || 'Achievement unlocked!';
};

UserSchema.methods.updateStreak = function () {
  const today = new Date();
  const lastActive = new Date(this.progress.lastActiveDate);
  const diffTime = Math.abs(today - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) this.progress.streakDays += 1;
  else if (diffDays > 1) this.progress.streakDays = 1;
  this.progress.lastActiveDate = today;
  return this.save();
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

UserSchema.methods.getEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

module.exports = mongoose.model('User', UserSchema);
