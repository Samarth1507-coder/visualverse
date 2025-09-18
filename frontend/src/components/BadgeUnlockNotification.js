import React, { useState, useEffect } from 'react';
import './BadgeUnlockNotification.css';

const BadgeUnlockNotification = ({ badge, unlockMessage, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#94a3b8';
      case 'uncommon': return '#3b82f6';
      case 'rare': return '#8b5cf6';
      case 'epic': return '#ec4899';
      case 'legendary': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`badge-notification ${isAnimating ? 'badge-notification-exit' : 'badge-notification-enter'}`}>
      <div className="badge-notification-content">
        <div className="badge-notification-header">
          <div className="badge-notification-icon" style={{ borderColor: getRarityColor(badge.rarity) }}>
            <span className="badge-notification-emoji">{badge.icon}</span>
            <div className="badge-notification-sparkle">
              <span>✨</span>
            </div>
          </div>
          <button className="badge-notification-close" onClick={handleClose}>
            ×
          </button>
        </div>
        
        <div className="badge-notification-body">
          <h3 className="badge-notification-title">Badge Unlocked!</h3>
          <h4 className="badge-notification-badge-name">{badge.name}</h4>
          <p className="badge-notification-message">{unlockMessage}</p>
          
          <div className="badge-notification-meta">
            <span className={`badge-notification-rarity badge-${badge.rarity}`}>
              {badge.rarity}
            </span>
            <span className="badge-notification-points">
              +{badge.points} points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockNotification;
