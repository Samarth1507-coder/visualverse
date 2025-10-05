import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X } from "lucide-react"; // icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="flex justify-between items-center px-4 py-3 md:px-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          VisualVerse
        </Link>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden block"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link to="/dashboard" className="hover:text-yellow-300">Dashboard</Link>
          <Link to="/community" className="hover:text-yellow-300">Community</Link>
          <Link to="/challenges" className="hover:text-yellow-300">Challenges</Link>
          <Link to="/profile" className="hover:text-yellow-300">Profile</Link>
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700 flex flex-col space-y-3 px-4 py-3">
          <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/community" onClick={() => setIsOpen(false)}>Community</Link>
          <Link to="/challenges" onClick={() => setIsOpen(false)}>Challenges</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
          {user && (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
