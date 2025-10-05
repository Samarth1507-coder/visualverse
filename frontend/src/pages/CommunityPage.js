import React, { useState, useEffect } from 'react';
import DoodleGallery from '../components/DoodleGallery';

function CommunityPage() {
  const [view, setView] = useState('gallery'); // 'gallery' or 'feed'
  
  const handleToggleView = (type) => {
    setView(type);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Community
      </h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleToggleView('gallery')}
          className={`px-4 py-2 rounded-l-xl font-medium transition-colors ${
            view === 'gallery' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Gallery
        </button>
        <button
          onClick={() => handleToggleView('feed')}
          className={`px-4 py-2 rounded-r-xl font-medium transition-colors ${
            view === 'feed' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
          }`}
        >
          Feed
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {view === 'gallery' ? (
          <DoodleGallery type="community-gallery" />
        ) : (
          <DoodleGallery type="community-feed" />
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
