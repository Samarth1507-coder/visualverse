import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import DoodleGallery from "../components/DoodleGallery";
import BadgeUnlockNotification from "../components/BadgeUnlockNotification";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ArrayModule from "../modules/ArrayModule/ArrayModule";

function DashboardPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [recentDoodles, setRecentDoodles] = useState([]);
  const [recentBadges, setRecentBadges] = useState([]);

  // Fetch user stats, recent doodles and badges
  useEffect(() => {
    if (!user || !user._id || !token) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${user._id}/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching user stats:", err);
      }
    };

    const fetchDoodles = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/drawings/user/${user._id}?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentDoodles(res.data.data || []);
      } catch (err) {
        console.error("Error fetching recent doodles:", err);
      }
    };

    const fetchBadges = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/badges/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentBadges(res.data.userProgress || []);
      } catch (err) {
        console.error("Error fetching badges:", err);
      }
    };

    fetchStats();
    fetchDoodles();
    fetchBadges();
  }, [user, token]);

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "canvas", name: "Canvas", icon: "🎨" },
    { id: "challenges", name: "Challenges", icon: "🏆" },
    { id: "community", name: "Community", icon: "🤝" },
    { id: "profile", name: "Profile", icon: "👤" },
    { id: "arrays", name: "Array Module", icon: "🧮" }, // Added Array module tab
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-6 text-center bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Doodles</h2>
                <p className="text-3xl font-bold">{stats.totalDoodles || 0}</p>
              </div>
              <div className="card p-6 text-center bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Challenges</h2>
                <p className="text-3xl font-bold">{stats.totalChallenges || 0}</p>
              </div>
              <div className="card p-6 text-center bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Badges</h2>
                <p className="text-3xl font-bold">{stats.totalBadges || 0}</p>
              </div>
              <div className="card p-6 text-center bg-white shadow rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Streak Days</h2>
                <p className="text-3xl font-bold">{stats.streakDays || 0}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to="/drawing"
                className="card p-6 bg-white shadow rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition"
              >
                <div className="text-4xl mb-2">🎨</div>
                <p className="font-semibold text-lg">Draw a Doodle</p>
              </Link>
              <Link
                to="/challenges"
                className="card p-6 bg-white shadow rounded-lg flex flex-col items-center justify-center hover:bg-green-50 transition"
              >
                <div className="text-4xl mb-2">🏆</div>
                <p className="font-semibold text-lg">Challenges</p>
              </Link>
              <Link
                to="/badges"
                className="card p-6 bg-white shadow rounded-lg flex flex-col items-center justify-center hover:bg-yellow-50 transition"
              >
                <div className="text-4xl mb-2">🎖️</div>
                <p className="font-semibold text-lg">Badges</p>
              </Link>
            </div>

            {/* Recent Doodles */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Doodles</h2>
              {recentDoodles.length > 0 ? (
                <DoodleGallery doodles={recentDoodles} />
              ) : (
                <p>No recent doodles.</p>
              )}
            </div>

            {/* Recent Badges */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Badge Unlocks</h2>
              {recentBadges.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                  {recentBadges.map((badge) => (
                    <BadgeUnlockNotification key={badge.badgeId} badge={badge} />
                  ))}
                </div>
              ) : (
                <p>No badges unlocked yet.</p>
              )}
            </div>
          </div>
        );


      case "canvas":
        return (
          <div className="card p-8 text-center bg-white shadow rounded-lg">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-4">Interactive Drawing Canvas</h2>
            <p className="text-gray-600 mb-6">
              Create beautiful DSA visualizations with our powerful drawing tools.
            </p>
            <Link to="/drawings" className="btn-primary">
              Launch Canvas
            </Link>
          </div>
        );

      case "challenges":
        return (
          <div className="card p-8 text-center bg-white shadow rounded-lg">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">DSA Challenges</h2>
            <p className="text-gray-600 mb-6">
              Test your knowledge with interactive challenges and earn points.
            </p>
            <Link to="/challenges" className="btn-secondary">
              View Challenges
            </Link>
          </div>
        );

      case "community":
        return (
          <div className="card p-8 text-center bg-white shadow rounded-lg">
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-2xl font-bold mb-4">Community Gallery</h2>
            <p className="text-gray-600 mb-6">
              Share your doodles and explore amazing creations from the community.
            </p>
            <button className="btn-outline">Explore Community</button>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div className="card p-6 bg-white shadow rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <p>
                    <strong>Full Name:</strong> {user?.fullName}
                  </p>
                  <p>
                    <strong>Username:</strong> @{user?.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Skill Level:</strong> {user?.skillLevel}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Profile Completion</h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Complete</span>
                      <span>{user?.profileCompletion || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${user?.profileCompletion || 0}%` }}
                      />
                    </div>
                  </div>
                  <p>
                    <strong>Bio:</strong> {user?.bio || "No bio yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "arrays":
      return <ArrayModule />;
    // fallback
    default:
      return null;
   }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            Hello, {user?.firstName || "Learner"}!
          </h1>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))
            }
          </div>

          {/* Tab Content */}
          <div className="fade-in">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
