import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import BadgeCollection from '../components/BadgeCollection';
import DoodleGallery from '../components/DoodleGallery';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
  const { user, token } = useAuth();
  const [doodles, setDoodles] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loadingDoodles, setLoadingDoodles] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    const fetchUserDoodles = async () => {
      try {
        setLoadingDoodles(true);
        const response = await axios.get(`/api/drawings?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoodles(response.data.data.doodles || []);
      } catch (error) {
        console.error('Error fetching user doodles:', error);
      } finally {
        setLoadingDoodles(false);
      }
    };

    const fetchUserBadges = async () => {
      try {
        setLoadingBadges(true);
        const response = await axios.get('/api/badges/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBadges(response.data.badges || []);
      } catch (error) {
        console.error('Error fetching user badges:', error);
      } finally {
        setLoadingBadges(false);
      }
    };

    if (user && token) {
      fetchUserDoodles();
      fetchUserBadges();
    }
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* User Info */}
      <Dashboard user={user} />

      {/* User Doodles */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          My Doodles
        </h2>
        {loadingDoodles ? (
          <p className="text-gray-500 text-center">Loading your doodles...</p>
        ) : doodles.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven't created any doodles yet.
          </p>
        ) : (
          <DoodleGallery doodles={doodles} />
        )}
      </section>

      {/* User Badges */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">
          My Badges
        </h2>
        {loadingBadges ? (
          <p className="text-gray-500 text-center">Loading your badges...</p>
        ) : badges.length === 0 ? (
          <p className="text-gray-500 text-center">
            You haven't unlocked any badges yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <BadgeCollection badges={badges} />
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
