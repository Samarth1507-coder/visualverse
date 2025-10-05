import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BadgeUnlock from '../components/BadgeUnlockNotification';
import DoodleGallery from '../components/DoodleGallery';

function Homepage() {
  const { user, token } = useAuth();
  const [featuredDoodles, setFeaturedDoodles] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);

  useEffect(() => {
    // Fetch featured doodles
    const fetchFeaturedDoodles = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/drawings/featured`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeaturedDoodles(res.data.data.doodles);
      } catch (err) {
        console.error('Error fetching featured doodles:', err);
      }
    };

    // Fetch recent unlocked badges
    const fetchBadges = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/badges/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentBadges(res.data.userProgress || []);
      } catch (err) {
        console.error('Error fetching badges:', err);
      }
    };

    fetchFeaturedDoodles();
    fetchBadges();
  }, [user, token]);

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
          Welcome, {user?.firstName || 'Visualverse Learner'}!
        </h1>
        <p className="mt-3 text-lg md:text-xl text-gray-700">
          Master Data Structures & Algorithms with interactive doodles.
        </p>
      </div>

      {/* Quick Links / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/drawing"
          className="bg-white shadow hover:shadow-lg transition p-6 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-50"
        >
          <div className="text-4xl mb-2">🎨</div>
          <h2 className="font-semibold text-xl mb-1">Draw Doodle</h2>
          <p className="text-gray-500 text-sm">Start your creative learning journey</p>
        </Link>

        <Link
          to="/challenges"
          className="bg-white shadow hover:shadow-lg transition p-6 rounded-lg flex flex-col items-center justify-center text-center hover:bg-green-50"
        >
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="font-semibold text-xl mb-1">Challenges</h2>
          <p className="text-gray-500 text-sm">Participate in coding doodle challenges</p>
        </Link>

        <Link
          to="/badges"
          className="bg-white shadow hover:shadow-lg transition p-6 rounded-lg flex flex-col items-center justify-center text-center hover:bg-yellow-50"
        >
          <div className="text-4xl mb-2">🎖️</div>
          <h2 className="font-semibold text-xl mb-1">Badges</h2>
          <p className="text-gray-500 text-sm">Check your achievements and progress</p>
        </Link>
      </div>

      {/* Featured Doodles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Doodles</h2>
        <DoodleGallery doodles={featuredDoodles} />
      </div>

      {/* Recent Badge Unlocks */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Badge Unlocks</h2>
        {recentBadges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {recentBadges.map((badge) => (
              <BadgeUnlock key={badge.badgeId} badge={badge} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No badges unlocked yet. Keep learning!</p>
        )}
      </div>
    </div>
  );
}

export default Homepage;
