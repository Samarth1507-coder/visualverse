import React, { useEffect, useState } from 'react';
import DoodleGallery from '../components/DoodleGallery';
import axios from 'axios';

function DrawingsPage() {
  const [doodles, setDoodles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch community doodles from backend
  useEffect(() => {
    const fetchDoodles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/drawings`);
        setDoodles(response.data.data.doodles || []);
      } catch (error) {
        console.error('Error fetching doodles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoodles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Community Doodles</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <DoodleGallery doodles={doodles} />
      )}
    </div>
  );
}

export default DrawingsPage;
