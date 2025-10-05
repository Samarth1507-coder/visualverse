import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Welcome Back
        </h1>

        {/* Login Form Component */}
        <LoginForm />

        <p className="mt-4 text-center text-gray-600 text-sm">
          Dont have an account?{" "}
          <a href="./signup" className="text-green-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
