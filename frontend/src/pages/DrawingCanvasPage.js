import React from 'react';
import DrawingCanvas from '../components/DrawingCanvas';

function DrawingCanvasPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Create Your Doodle
      </h1>
      <p className="text-gray-700 text-center mb-6 max-w-xl">
        Sketch your ideas, visualize DSA concepts, and submit your doodle to the community. Use the canvas below to start creating.
      </p>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6">
        <DrawingCanvas />
      </div>
    </div>
  );
}

export default DrawingCanvasPage;
