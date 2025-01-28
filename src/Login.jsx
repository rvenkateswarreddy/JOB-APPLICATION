// src/components/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Adjust the import path according to your project structure
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
      console.error("Error logging in: ", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
            disabled={loading} // Disable input while loading
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
            disabled={loading} // Disable input while loading
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full flex items-center justify-center"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          ) : (
            "Login"
          )}
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Don't have an account? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
            disabled={loading} // Disable button while loading
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
