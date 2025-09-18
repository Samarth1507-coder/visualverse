import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BadgeDisplay from './BadgeDisplay';
import './BadgeCollection.css';

const BadgeCollection = () => {
  const [badges, setBadges] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    rarity: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchBadgeData();
  }, []);

  const fetchBadgeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [badgesResponse, progressResponse] = await Promise.all([
        axios.get('/api/badges', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/badges/user/progress', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setBadges(badgesResponse.data.data.badges);
      setUserProgress(progressResponse.data.data.userProgress);
      setSummary(progressResponse.data.data.summary);
    } catch (err) {
      console.error('Error fetching badge data:', err);
      setError('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBadges = () => {
    return badges.filter(badge => {
      const userBadge = userProgress.find(up => up.badgeId._id === badge._id);
      const isUnlocked = userBadge?.isUnlocked || false;

      // Category filter
      if (filters.category !== 'all' && badge.category !== filters.category) {
        return false;
      }

      // Rarity filter
      if (filters.rarity !== 'all' && badge.rarity !== filters.rarity) {
        return false;
      }

      // Status filter
      if (filters.status === 'unlocked' && !isUnlocked) {
        return false;
      }
      if (filters.status === 'locked' && isUnlocked) {
        return false;
      }

      return true;
    });
  };

  const getBadgeProgress = (badgeId) => {
    return userProgress.find(up => up.badgeId._id === badgeId);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return (
      <div className="badge-collection-loading">
        <div className="loading-spinner"></div>
        <p>Loading your badge collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="badge-collection-error">
        <p>Error: {error}</p>
        <button onClick={fetchBadgeData} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const filteredBadges = getFilteredBadges();

  return (
    <div className="badge-collection">
      <div className="badge-collection-header">
        <h1>🏆 Badge Collection</h1>
        <div className="badge-summary">
          <div className="summary-item">
            <span className="summary-number">{summary.unlocked || 0}</span>
            <span className="summary-label">Unlocked</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{summary.inProgress || 0}</span>
            <span className="summary-label">In Progress</span>
          </div>
          <div className="summary-item">
            <span className="summary-number">{summary.total || 0}</span>
            <span className="summary-label">Total</span>
          </div>
        </div>
      </div>

      <div className="badge-filters">
        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="achievement">Achievement</option>
            <option value="participation">Participation</option>
            <option value="social">Social</option>
            <option value="skill">Skill</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rarity:</label>
          <select 
            value={filters.rarity} 
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Badges</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      <div className="badge-grid">
        {filteredBadges.length === 0 ? (
          <div className="no-badges">
            <p>No badges found with the current filters.</p>
            <button 
              onClick={() => setFilters({ category: 'all', rarity: 'all', status: 'all' })}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredBadges.map(badge => {
            const progress = getBadgeProgress(badge._id);
            const isUnlocked = progress?.isUnlocked || false;

            return (
              <BadgeDisplay
                key={badge._id}
                badge={badge}
                progress={progress}
                isUnlocked={isUnlocked}
                showProgress={true}
                size="medium"
              />
            );
          })
        )}
      </div>

      {summary.nextBadges && summary.nextBadges.length > 0 && (
        <div className="next-badges">
          <h3>🎯 Next Badges to Unlock</h3>
          <div className="next-badges-grid">
            {summary.nextBadges.map(userBadge => (
              <BadgeDisplay
                key={userBadge.badgeId._id}
                badge={userBadge.badgeId}
                progress={userBadge}
                isUnlocked={false}
                showProgress={true}
                size="small"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeCollection;
