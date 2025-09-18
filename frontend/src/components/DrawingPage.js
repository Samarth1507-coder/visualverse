import React, { useState } from 'react';
import DrawingCanvas from './DrawingCanvas';

const DrawingPage = () => {
  const [savedImage, setSavedImage] = useState(null);
  const [showSavedImage, setShowSavedImage] = useState(false);

  const handleSave = (imageData) => {
    setSavedImage(imageData);
    setShowSavedImage(true);
    
    // Hide the saved image notification after 3 seconds
    setTimeout(() => {
      setShowSavedImage(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                VisualVerse Drawing Studio
              </h1>
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Beta
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Drawing Instructions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">🎨 Tools</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Pen:</strong> Draw with selected color</li>
                    <li>• <strong>Eraser:</strong> Remove drawn content</li>
                    <li>• <strong>Size:</strong> Adjust brush thickness</li>
                    <li>• <strong>Colors:</strong> Choose from palette or custom</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">💡 Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use different colors for better organization</li>
                    <li>• Try different brush sizes for variety</li>
                    <li>• Save your work frequently</li>
                    <li>• Perfect for DSA visualizations!</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">📱 Mobile</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Touch-friendly interface</li>
                    <li>• Responsive design</li>
                    <li>• Optimized for tablets</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🆕 New Drawing
                </button>
                <button
                  onClick={() => {
                    // This would typically open a gallery or load a saved drawing
                    console.log('Load drawing functionality');
                  }}
                  className="w-full px-4 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  📂 Load Drawing
                </button>
                <button
                  onClick={() => {
                    // This would typically open a gallery
                    console.log('Gallery functionality');
                  }}
                  className="w-full px-4 py-2 text-sm text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  🖼️ View Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <DrawingCanvas
                width={800}
                height={600}
                onSave={handleSave}
                className="h-[600px] lg:h-[700px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Saved Image Notification */}
      {showSavedImage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Drawing saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingPage;

