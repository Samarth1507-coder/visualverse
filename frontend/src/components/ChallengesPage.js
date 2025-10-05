import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChallengeList from './ChallengeList';
import ChallengeDetail from './ChallengeDetail';
import DoodleGallery from './DoodleGallery';

const ChallengesPage = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'gallery'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedDoodle, setCompletedDoodle] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch challenges from backend
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/challenges')
      .then(res => {
        setChallenges(res.data.data.challenges || []);
        setError('');
      })
      .catch(() => setError('Failed to load challenges!'))
      .finally(() => setLoading(false));
  }, []);

  // Handlers
  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedChallenge(null);
    setCompletedDoodle(null);
  };

  const handleBackToDetail = () => {
    setCurrentView('detail');
    setCompletedDoodle(null);
  };

  const handleViewGallery = () => {
    setCurrentView('gallery');
  };

  const handleChallengeComplete = (doodle) => {
    setCompletedDoodle(doodle);
    setTimeout(() => {
      alert('🎉 Challenge completed successfully! Your doodle has been submitted.');
    }, 100);
  };

  const handleDoodleSelect = (doodle) => {
    console.log('Selected doodle:', doodle);
  };

  // Render logic for main content based on currentView
  const renderView = () => {
    if (loading) {
      return <div className="text-center text-lg py-8">Loading challenges...</div>;
    }
    if (error) {
      return (
        <div className="text-center text-red-500 font-medium py-8">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }
    switch (currentView) {
      case 'detail':
        return (
          <ChallengeDetail
            challengeId={selectedChallenge._id}
            challenge={selectedChallenge}
            onBack={handleBackToList}
            onComplete={handleChallengeComplete}
          />
        );
      case 'gallery':
        return (
          <DoodleGallery
            challengeId={selectedChallenge._id}
            challenge={selectedChallenge}
            onDoodleSelect={handleDoodleSelect}
          />
        );
      default:
        return (
          <ChallengeList
            challenges={challenges}
            onChallengeSelect={handleChallengeSelect}
          />
        );
    }
  };

  // Header logic (unchanged from your original for aesthetics)
  const renderHeader = () => {
    switch (currentView) {
      case 'detail':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Challenge Details</h1>
            </div>
            <button
              onClick={handleViewGallery}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Gallery
            </button>
          </div>
        );
      case 'gallery':
        return (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Doodle Gallery</h1>
            </div>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Challenges
            </button>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">DSA Challenges</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">🎯</span>
              <span className="text-sm text-gray-600">Visual Learning</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {renderHeader()}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </div>
      {/* Success Modal */}
      {completedDoodle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Challenge Completed!
              </h2>
              <p className="text-gray-600 mb-6">
                Your doodle has been submitted successfully. Great job!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCompletedDoodle(null);
                    handleViewGallery();
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Gallery
                </button>
                <button
                  onClick={() => {
                    setCompletedDoodle(null);
                    handleBackToList();
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Try Another Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
