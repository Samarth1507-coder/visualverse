const User = require('../models/User');

async function ensureGuestUser() {
  try {
    const existing = await User.findOne({ username: 'guest_user' });
    if (!existing) {
      await User.create({
        username: 'guest_user',
        email: 'guest@visualverse.com',
        isGuest: true,
      });
      console.log('Guest user created');
    } else {
      console.log('Guest user already exists');
    }
  } catch (error) {
    console.error('Error ensuring guest user presence:', error);
    throw error; // Rethrow so caller knows of failure
  }
}

module.exports = ensureGuestUser;
