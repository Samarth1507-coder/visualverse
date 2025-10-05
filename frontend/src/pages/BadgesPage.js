import React, { useEffect, useState } from 'react';
import BadgeCollection from '../components/BadgeCollection';
import BadgeDisplay from '../components/BadgeDisplay';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function BadgesPage() {
  const { user, token } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/badges/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBadges(response.data.badges || []);
      } catch (error) {
        console.error('Error fetching badges:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchBadges();
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        My Badges
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading badges...</div>
      ) : badges.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't unlocked any badges yet. Start completing challenges!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <BadgeDisplay
              key={badge._id}
              name={badge.name}
              description={badge.description}
              icon={badge.icon}
              progress={badge.progress}
              unlocked={badge.isUnlocked}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgesPage;
