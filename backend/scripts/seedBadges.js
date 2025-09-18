const mongoose = require('mongoose');
const Badge = require('../models/Badge');
require('dotenv').config();

const sampleBadges = [
  // Doodles Completed Badges
  {
    name: 'First Steps',
    description: 'Complete your first DSA doodle',
    icon: '🎨',
    category: 'achievement',
    criteria: {
      type: 'doodles_completed',
      threshold: 1,
      timeframe: 'lifetime'
    },
    rarity: 'common',
    points: 10,
    unlockMessage: 'Welcome to the world of DSA doodling!'
  },
  {
    name: 'Doodle Enthusiast',
    description: 'Complete 5 DSA doodles',
    icon: '🖌️',
    category: 'achievement',
    criteria: {
      type: 'doodles_completed',
      threshold: 5,
      timeframe: 'lifetime'
    },
    rarity: 'common',
    points: 25,
    unlockMessage: 'You\'re getting the hang of this!'
  },
  {
    name: 'Doodle Master',
    description: 'Complete 25 DSA doodles',
    icon: '🎭',
    category: 'achievement',
    criteria: {
      type: 'doodles_completed',
      threshold: 25,
      timeframe: 'lifetime'
    },
    rarity: 'uncommon',
    points: 100,
    unlockMessage: 'A true master of visual learning!'
  },
  {
    name: 'Doodle Legend',
    description: 'Complete 100 DSA doodles',
    icon: '👑',
    category: 'milestone',
    criteria: {
      type: 'doodles_completed',
      threshold: 100,
      timeframe: 'lifetime'
    },
    rarity: 'legendary',
    points: 500,
    unlockMessage: 'You are a legend in the DSA community!'
  },

  // Challenges Participated Badges
  {
    name: 'Challenge Explorer',
    description: 'Participate in 3 different challenges',
    icon: '🗺️',
    category: 'participation',
    criteria: {
      type: 'challenges_participated',
      threshold: 3,
      timeframe: 'lifetime'
    },
    rarity: 'common',
    points: 15,
    unlockMessage: 'Exploring the world of DSA challenges!'
  },
  {
    name: 'Challenge Conqueror',
    description: 'Participate in 10 different challenges',
    icon: '⚔️',
    category: 'participation',
    criteria: {
      type: 'challenges_participated',
      threshold: 10,
      timeframe: 'lifetime'
    },
    rarity: 'uncommon',
    points: 50,
    unlockMessage: 'You\'ve conquered many challenges!'
  },
  {
    name: 'Challenge Champion',
    description: 'Participate in 25 different challenges',
    icon: '🏆',
    category: 'participation',
    criteria: {
      type: 'challenges_participated',
      threshold: 25,
      timeframe: 'lifetime'
    },
    rarity: 'rare',
    points: 150,
    unlockMessage: 'A true champion of challenges!'
  },

  // Likes Received Badges
  {
    name: 'Community Favorite',
    description: 'Receive 10 likes on your doodles',
    icon: '❤️',
    category: 'social',
    criteria: {
      type: 'likes_received',
      threshold: 10,
      timeframe: 'lifetime'
    },
    rarity: 'common',
    points: 20,
    unlockMessage: 'The community loves your work!'
  },
  {
    name: 'Viral Sensation',
    description: 'Receive 50 likes on your doodles',
    icon: '🔥',
    category: 'social',
    criteria: {
      type: 'likes_received',
      threshold: 50,
      timeframe: 'lifetime'
    },
    rarity: 'uncommon',
    points: 75,
    unlockMessage: 'Your doodles are going viral!'
  },
  {
    name: 'Internet Star',
    description: 'Receive 200 likes on your doodles',
    icon: '⭐',
    category: 'social',
    criteria: {
      type: 'likes_received',
      threshold: 200,
      timeframe: 'lifetime'
    },
    rarity: 'epic',
    points: 300,
    unlockMessage: 'You\'re an internet sensation!'
  },

  // Days Streak Badges
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '📅',
    category: 'milestone',
    criteria: {
      type: 'days_streak',
      threshold: 7,
      timeframe: 'lifetime'
    },
    rarity: 'common',
    points: 30,
    unlockMessage: 'Consistency is key to success!'
  },
  {
    name: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    icon: '📆',
    category: 'milestone',
    criteria: {
      type: 'days_streak',
      threshold: 30,
      timeframe: 'lifetime'
    },
    rarity: 'rare',
    points: 200,
    unlockMessage: 'A full month of dedication!'
  },
  {
    name: 'Streak Legend',
    description: 'Maintain a 100-day learning streak',
    icon: '💎',
    category: 'milestone',
    criteria: {
      type: 'days_streak',
      threshold: 100,
      timeframe: 'lifetime'
    },
    rarity: 'legendary',
    points: 1000,
    unlockMessage: 'Unstoppable dedication!'
  },

  // Perfect Ratings Badges
  {
    name: 'Quality Artist',
    description: 'Receive 5 perfect ratings (4.5+)',
    icon: '✨',
    category: 'skill',
    criteria: {
      type: 'perfect_ratings',
      threshold: 5,
      timeframe: 'lifetime'
    },
    rarity: 'uncommon',
    points: 60,
    unlockMessage: 'Your quality is recognized!'
  },
  {
    name: 'Perfectionist',
    description: 'Receive 20 perfect ratings (4.5+)',
    icon: '🌟',
    category: 'skill',
    criteria: {
      type: 'perfect_ratings',
      threshold: 20,
      timeframe: 'lifetime'
    },
    rarity: 'epic',
    points: 250,
    unlockMessage: 'Perfection is your standard!'
  },

  // Community Contributor Badges
  {
    name: 'Community Helper',
    description: 'Become an active community contributor',
    icon: '🤝',
    category: 'social',
    criteria: {
      type: 'community_contributor',
      threshold: 50,
      timeframe: 'lifetime'
    },
    rarity: 'uncommon',
    points: 80,
    unlockMessage: 'You\'re helping build the community!'
  },
  {
    name: 'Community Leader',
    description: 'Become a community leader',
    icon: '👑',
    category: 'social',
    criteria: {
      type: 'community_contributor',
      threshold: 200,
      timeframe: 'lifetime'
    },
    rarity: 'epic',
    points: 400,
    unlockMessage: 'You\'re leading the community!'
  }
];

const seedBadges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing badges
    await Badge.deleteMany({});
    console.log('🗑️  Cleared existing badges');

    // Insert new badges
    const badges = await Badge.insertMany(sampleBadges);
    console.log(`✅ Inserted ${badges.length} badges`);

    // Log summary by category
    const categories = await Badge.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Badge Summary by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} badges (${cat.totalPoints} total points)`);
    });

    // Log summary by rarity
    const rarities = await Badge.aggregate([
      {
        $group: {
          _id: '$rarity',
          count: { $sum: 1 },
          totalPoints: { $sum: '$points' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🏆 Badge Summary by Rarity:');
    rarities.forEach(rarity => {
      console.log(`  ${rarity._id}: ${rarity.count} badges (${rarity.totalPoints} total points)`);
    });

    console.log('\n🎉 Badge seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    process.exit(1);
  }
};

seedBadges();
