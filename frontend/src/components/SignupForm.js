import React, { useState } from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 👉 Here we just simulate success, backend call will be added later
    if (formData.username && formData.email && formData.password) {
      setSuccess("Signup successful! You can now log in.");
    } else {
      setError("Please fill all fields correctly.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Sign Up
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
