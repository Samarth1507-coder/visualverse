import React from "react";
import SignupForm from "../components/SignupForm";

function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Create Your Account
        </h1>

        {/* Signup Form Component */}
        <SignupForm />

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a href="./login" className="text-green-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
