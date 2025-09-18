import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BadgeUnlockNotification from './BadgeUnlockNotification';

const DoodleGallery = ({ challengeId, onDoodleSelect }) => {
  const [doodles, setDoodles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [challenge, setChallenge] = useState(null);
  const [badgeNotifications, setBadgeNotifications] = useState([]);

  // Fetch doodles
  const fetchDoodles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/challenges/${challengeId}/doodles?${params}`);
      setDoodles(response.data.data.doodles);
      setPagination(response.data.data.pagination);
      setChallenge(response.data.data.challenge);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch doodles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoodles();
  }, [challengeId, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleLike = async (doodleId) => {
    try {
      const response = await axios.put(`/api/drawings/${doodleId}/like`);
      setDoodles(prev => prev.map(doodle => 
        doodle._id === doodleId 
          ? { ...doodle, likes: response.data.data.likes, isLiked: response.data.data.isLiked }
          : doodle
      ));

      const unlocked = response.data?.data?.newlyUnlockedBadges || [];
      if (unlocked.length > 0) {
        setBadgeNotifications(prev => [...prev, ...unlocked]);
      }
    } catch (err) {
      console.error('Failed to like doodle:', err);
    }
  };

  const handleRate = async (doodleId, rating) => {
    try {
      const response = await axios.post(`/api/drawings/${doodleId}/rate`, { rating });
      setDoodles(prev => prev.map(doodle => 
        doodle._id === doodleId 
          ? { ...doodle, rating: response.data.data.rating }
          : doodle
      ));

      const unlocked = response.data?.data?.newlyUnlockedBadges || [];
      if (unlocked.length > 0) {
        setBadgeNotifications(prev => [...prev, ...unlocked]);
      }
    } catch (err) {
      console.error('Failed to rate doodle:', err);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && doodles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">❌ {error}</div>
        <button 
          onClick={fetchDoodles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {challenge && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Gallery: {challenge.title}
          </h1>
          <p className="text-gray-600 mb-4">{challenge.prompt}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>📊 {challenge.category}</span>
            <span>🎯 {challenge.difficulty}</span>
            <span>📝 {pagination.total} submissions</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filter & Sort</h2>
          <div className="flex items-center space-x-4">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="likes-desc">Most Liked</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {doodles.length} of {pagination.total} doodles
        </p>
        {loading && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Loading...
          </div>
        )}
      </div>

      {/* Doodles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doodles.map((doodle) => (
          <div
            key={doodle._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onDoodleSelect && onDoodleSelect(doodle)}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={doodle.imageData}
                alt={doodle.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {formatTime(doodle.completionTime)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Title and User */}
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {doodle.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {doodle.user?.firstName?.charAt(0)}{doodle.user?.lastName?.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {doodle.user?.firstName} {doodle.user?.lastName}
                  </span>
                </div>
              </div>

              {/* Description */}
              {doodle.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {doodle.description}
                </p>
              )}

              {/* Tags */}
              {doodle.tags && doodle.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {doodle.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {doodle.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-full">
                      +{doodle.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(doodle._id);
                    }}
                    className={`flex items-center space-x-1 ${
                      doodle.isLiked ? 'text-red-500' : 'hover:text-red-500'
                    }`}
                  >
                    <span>{doodle.isLiked ? '❤️' : '🤍'}</span>
                    <span>{doodle.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <span>⭐</span>
                    <span>{doodle.rating.toFixed(1)}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(doodle.createdAt)}
                </span>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center justify-center mt-3">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate(doodle._id, star);
                      }}
                      className="text-lg hover:scale-110 transition-transform"
                    >
                      {star <= doodle.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badge Unlock Notifications */}
      {badgeNotifications.map((item, index) => (
        <BadgeUnlockNotification
          key={`${item.badge?._id || item.badge?.name || 'badge'}-${index}`}
          badge={item.badge}
          unlockMessage={item.unlockMessage}
          onClose={() => setBadgeNotifications(prev => prev.filter((_, i) => i !== index))}
        />
      ))}

      {/* Empty State */}
      {doodles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No doodles yet</h3>
          <p className="text-gray-600 mb-4">
            Be the first to submit a doodle for this challenge!
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    page === pagination.page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DoodleGallery;
