import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'canvas', name: 'Canvas', icon: '🎨' },
    { id: 'challenges', name: 'Challenges', icon: '🏆' },
    { id: 'community', name: 'Community', icon: '🤝' },
    { id: 'profile', name: 'Profile', icon: '👤' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} />;
      case 'canvas':
        return <CanvasTab />;
      case 'challenges':
        return <ChallengesTab />;
      case 'community':
        return <CommunityTab />;
      case 'profile':
        return <ProfileTab user={user} />;
      default:
        return <OverviewTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-creative-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-creative-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold gradient-text">Visualverse</h1>
            </div>
            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-creative-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {(user?.firstName?.charAt(0) || 'G')}{user?.lastName?.charAt(0) || ''}
                </div>
                <span className="text-gray-700 font-medium">{user?.fullName || user?.username || 'Guest'}</span>
              </div>
              <button onClick={handleLogout} className="btn-outline text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-creative-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};


// Overview Tab Component
const OverviewTab = ({ user }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-2">
        Welcome back, {user?.firstName || user?.username || 'Guest'}! 👋
      </h2>
      <p className="text-gray-600">
        Ready to continue your DSA learning journey? Let's create something amazing today!
      </p>
    </div>
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="card p-6 text-center"><div className="text-3xl font-bold text-primary-600 mb-2">{user?.progress?.totalPoints || 0}</div><div className="text-gray-600">Total Points</div></div>
      <div className="card p-6 text-center"><div className="text-3xl font-bold text-success-600 mb-2">{user?.progress?.streakDays || 0}</div><div className="text-gray-600">Day Streak</div></div>
      <div className="card p-6 text-center"><div className="text-3xl font-bold text-creative-600 mb-2">{user?.progress?.completedChallenges?.length || 0}</div><div className="text-gray-600">Challenges Completed</div></div>
      <div className="card p-6 text-center"><div className="text-3xl font-bold text-accent-600 mb-2">{user?.achievements?.length || 0}</div><div className="text-gray-600">Achievements</div></div>
    </div>
    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Link to="/drawing" className="w-full btn-primary text-left block">
            🎨 Start New Drawing
          </Link>
          <Link to="/challenges" className="w-full btn-secondary text-left block">
            🏆 Take a Challenge
          </Link>
          <Link to="/badges" className="w-full btn-outline text-left block">
            🏅 View Badges
          </Link>
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Achievements</h3>
        {user?.achievements?.length > 0 ? (
          <div className="space-y-2">
            {user.achievements.slice(0, 3).map((achievement, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-success-50 to-success-100 rounded-lg">
                <span className="text-2xl">🏅</span>
                <div>
                  <div className="font-medium text-success-800">{achievement.description}</div>
                  <div className="text-sm text-success-600">{new Date(achievement.earnedAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (<p className="text-gray-500">No achievements yet. Start learning to earn your first badge!</p>)}
      </div>
    </div>
  </div>
);

// Canvas Tab
const CanvasTab = () => (
  <div className="card p-8 text-center">
    <div className="text-6xl mb-4">🎨</div>
    <h2 className="text-2xl font-bold gradient-text mb-4">Interactive Drawing Canvas</h2>
    <p className="text-gray-600 mb-6">
      Create beautiful DSA visualizations with our powerful drawing tools. Now available!
    </p>
    <Link to="/drawing" className="btn-primary">
      Launch Canvas
    </Link>
  </div>
);

// Challenges Tab
const ChallengesTab = () => (
  <div className="card p-8 text-center">
    <div className="text-6xl mb-4">🏆</div>
    <h2 className="text-2xl font-bold gradient-text mb-4">DSA Challenges</h2>
    <p className="text-gray-600 mb-6">
      Test your knowledge with interactive challenges and earn points. Now available!
    </p>
    <Link to="/challenges" className="btn-secondary">
      View Challenges
    </Link>
  </div>
);

// Community Tab
const CommunityTab = () => (
  <div className="card p-8 text-center">
    <div className="text-6xl mb-4">🤝</div>
    <h2 className="text-2xl font-bold gradient-text mb-4">Community Gallery</h2>
    <p className="text-gray-600 mb-6">
      Share your doodles and discover amazing creations from the community. Coming soon!
    </p>
    <button className="btn-outline" disabled>
      Explore Community (Coming Soon)
    </button>
  </div>
);

// Profile Tab
const ProfileTab = ({ user }) => (
  <div className="space-y-6">
    <div className="card p-6">
      <h2 className="text-2xl font-bold gradient-text mb-6">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="text-gray-900">{user?.fullName || user?.username || 'Guest'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="text-gray-900">@{user?.username || 'guest_user'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Skill Level</label>
              <span className="badge badge-primary capitalize">{user?.skillLevel || 'beginner'}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Complete</span>
                <span>{user?.profileCompletion || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-creative-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${user?.profileCompletion || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <p className="text-gray-900">{user?.bio || 'No bio yet'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
