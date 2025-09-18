import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DrawingCanvas from './DrawingCanvas';
import BadgeUnlockNotification from './BadgeUnlockNotification';

const ChallengeDetail = ({ challengeId, onBack, onComplete }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    title: '',
    description: '',
    tags: [],
    imageData: null
  });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [badgeNotifications, setBadgeNotifications] = useState([]);

  // Fetch challenge details
  const fetchChallenge = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/challenges/${challengeId}`);
      setChallenge(response.data.data.challenge);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch challenge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [challengeId]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isDrawing && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDrawing, startTime]);

  const handleStartChallenge = () => {
    setIsDrawing(true);
    setStartTime(Date.now());
  };

  const handleSaveDrawing = (imageData) => {
    setSubmissionData(prev => ({
      ...prev,
      imageData
    }));
  };

  const handleSubmit = async () => {
    if (!submissionData.title.trim() || !submissionData.imageData) {
      alert('Please provide a title and complete your drawing');
      return;
    }

    try {
      setSubmitting(true);
      
      const submission = {
        challengeId: challenge._id,
        title: submissionData.title,
        description: submissionData.description,
        imageData: submissionData.imageData,
        tags: submissionData.tags,
        completionTime: elapsedTime
      };

      const response = await axios.post(`/api/challenges/${challengeId}/submit`, submission);

      const unlocked = response.data?.data?.newlyUnlockedBadges || [];
      if (unlocked.length > 0) {
        setBadgeNotifications(prev => [...prev, ...unlocked]);
      }
      
      // Call completion callback
      if (onComplete) {
        onComplete(response.data.data.doodle);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit doodle';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotificationClose = (index) => {
    setBadgeNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
          onClick={fetchChallenge}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
        >
          Try Again
        </button>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-4">Challenge not found</div>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isDrawing) {
    return (
      <div className="space-y-6">
        {/* Challenge Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDrawing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                ⏱️ {formatTime(elapsedTime)}
              </div>
              {challenge.timeLimit > 0 && (
                <div className="text-sm text-gray-600">
                  Time Limit: {challenge.timeLimit}m
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Challenge Prompt:</h3>
            <p className="text-blue-800">{challenge.prompt}</p>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <DrawingCanvas
            width={800}
            height={600}
            onSave={handleSaveDrawing}
            className="h-[600px] lg:h-[700px]"
          />
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Doodle</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                placeholder="Give your doodle a title..."
                value={submissionData.title}
                onChange={(e) => setSubmissionData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your approach or any notes..."
                value={submissionData.description}
                onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="Enter tags separated by commas..."
                value={submissionData.tags.join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                  setSubmissionData(prev => ({ ...prev, tags }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                Completion Time: {formatTime(elapsedTime)}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !submissionData.title.trim() || !submissionData.imageData}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Doodle'}
              </button>
            </div>
          </div>
        </div>

        {/* Badge Unlock Notifications */}
        {badgeNotifications.map((item, index) => (
          <BadgeUnlockNotification
            key={`${item.badge?._id || item.badge?.name || 'badge'}-${index}`}
            badge={item.badge}
            unlockMessage={item.unlockMessage}
            onClose={() => handleNotificationClose(index)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{challenge.title}</h1>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>

        {/* Challenge Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{challenge.points}</div>
            <div className="text-sm text-blue-800">Points</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {challenge.timeLimit > 0 ? `${challenge.timeLimit}m` : '∞'}
            </div>
            <div className="text-sm text-green-800">Time Limit</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {challenge.stats?.totalSubmissions || 0}
            </div>
            <div className="text-sm text-purple-800">Submissions</div>
          </div>
        </div>

        {/* Challenge Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Challenge Prompt</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-lg">{challenge.prompt}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Description</h3>
            <p className="text-gray-700 leading-relaxed">{challenge.description}</p>
          </div>

          {challenge.tags && challenge.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🏷️ Tags</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center pt-6">
          <button
            onClick={handleStartChallenge}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold transition-colors"
          >
            🎨 Start Drawing Challenge
          </button>
        </div>
      </div>

      {/* Badge Unlock Notifications */}
      {badgeNotifications.map((item, index) => (
        <BadgeUnlockNotification
          key={`${item.badge?._id || item.badge?.name || 'badge'}-${index}`}
          badge={item.badge}
          unlockMessage={item.unlockMessage}
          onClose={() => handleNotificationClose(index)}
        />
      ))}
    </div>
  );
};

export default ChallengeDetail;
