import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import all pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import Community from "./pages/CommunityPage";
import Challenges from "./pages/ChallengesPage";
import ChallengeDetails from "./pages/ChallengeDetailPage";
import DrawingCanvas from "./pages/DrawingCanvasPage";
import DrawingPage from "./pages/DrawingPage";
import NotFoundPage from "./pages/NotFoundPage";

// Import modules
import BadgesPage from "./pages/BadgesPage";
import ArrayModule from "./modules/ArrayModule/ArrayModule";
import ArrayFlashcards from "./modules/ArrayModule/ArrayFlashcards";

import { AuthProvider } from "./contexts/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout (with Navbar + Sidebar)
    children: [
      { path: "home", element: <HomePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "community", element: <Community /> },
      { path: "challenges", element: <Challenges /> },
      { path: "challenges/:id", element: <ChallengeDetails /> },
      { path: "drawing", element: <DrawingPage /> },
      { path: "canvas", element: <DrawingCanvas /> },
      { path: "badges", element: <BadgesPage /> },
      { path: "arrays", element: <ArrayModule /> },
      { path: "arrays/flashcards", element: <ArrayFlashcards /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </AuthProvider>
  </React.StrictMode>
);
