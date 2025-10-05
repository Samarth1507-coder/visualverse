import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard'); // Redirect to dashboard
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-blue-600 mb-4 animate-pulse">
        404
      </h1>
      <p className="text-2xl text-gray-700 mb-6 text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
}

export default NotFoundPage;
