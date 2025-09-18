import React from 'react';
import './BadgeDisplay.css';

const BadgeDisplay = ({ badge, progress, isUnlocked = false, showProgress = true, size = 'medium' }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'badge-common';
      case 'uncommon': return 'badge-uncommon';
      case 'rare': return 'badge-rare';
      case 'epic': return 'badge-epic';
      case 'legendary': return 'badge-legendary';
      default: return 'badge-common';
    }
  };

  const getSizeClass = (size) => {
    switch (size) {
      case 'small': return 'badge-small';
      case 'medium': return 'badge-medium';
      case 'large': return 'badge-large';
      default: return 'badge-medium';
    }
  };

  const progressPercentage = progress ? Math.min(progress.percentage, 100) : 0;

  return (
    <div className={`badge-display ${getSizeClass(size)} ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}>
      <div className={`badge-icon ${getRarityColor(badge.rarity)}`}>
        <span className="badge-emoji">{badge.icon}</span>
        {isUnlocked && (
          <div className="badge-unlock-indicator">
            <span>✓</span>
          </div>
        )}
      </div>
      
      <div className="badge-info">
        <h4 className="badge-name">{badge.name}</h4>
        <p className="badge-description">{badge.description}</p>
        
        {showProgress && progress && (
          <div className="badge-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {progress.current}/{progress.target} ({progressPercentage}%)
            </span>
          </div>
        )}
        
        <div className="badge-meta">
          <span className={`badge-rarity ${getRarityColor(badge.rarity)}`}>
            {badge.rarity}
          </span>
          <span className="badge-points">
            {badge.points} pts
          </span>
        </div>
      </div>
    </div>
  );
};

export default BadgeDisplay;
