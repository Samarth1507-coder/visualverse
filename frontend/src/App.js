import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/Loginpage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DrawingsPage from './pages/DrawingPage';
import DrawingCanvasPage from './pages/DrawingCanvasPage';
import ChallengesPage from './pages/ChallengesPage';
import ChallengeDetailPage from './pages/ChallengeDetailPage';
import CommunityPage from './pages/CommunityPage';
import BadgesPage from './pages/BadgesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Modules
import ArrayModule from './modules/ArrayModule/ArrayModule';
import ArrayFlashcards from "./modules/ArrayModule/ArrayFlashcards";

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Loading Component
const Loading = () => (
  <div className="w-full h-screen flex justify-center items-center text-lg font-semibold text-white">
    Loading...
  </div>
);

// Protected Route Component supporting guest users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loading />;

  // Allow access if logged in or guest user
  if (isAuthenticated || (user && user.isGuest)) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PublicRoute>
                <DashboardPage />
              </PublicRoute>
            }
          />
          <Route
            path="/drawings"
            element={
              <ProtectedRoute>
                <DrawingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drawing/new"
            element={
              <ProtectedRoute>
                <DrawingCanvasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenges"
            element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/challenge/:id"
            element={
              <ProtectedRoute>
                <ChallengeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/badges"
            element={
              <ProtectedRoute>
                <BadgesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Array module routes */}
          <Route
            path="/arrays"
            element={
              <ProtectedRoute>
                <ArrayModule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/arrays/flashcards"
            element={
              <ProtectedRoute>
                <ArrayFlashcards />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
