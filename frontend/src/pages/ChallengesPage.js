// src/pages/ChallengesPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// Assuming you have a file challenges.js or seedChallenges.js exporting challenges array
import { challenges } from '../components/Challenges'; // adjust path as needed

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Directly use seed challenges data here for now
    setChallenges(challenges);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => (
          <li
            key={challenge.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <Link to={`/challenge/${challenge.id}`} className="block">
              <h2 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 mb-2">
                {challenge.title}
              </h2>
              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {challenge.difficulty || 'Medium'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default ChallengesPage;
