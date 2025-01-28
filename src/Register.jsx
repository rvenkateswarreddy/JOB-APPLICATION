// src/components/Register.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Adjust the import path according to your project structure
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store the user's email in the "emails" collection
      await addDoc(collection(db, "emails"), {
        email: user.email,
        userId: user.uid,
        timestamp: new Date(),
      });

      alert("Register successful");
      navigate("/");
    } catch (error) {
      alert(error.message);
      console.error("Error registering: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full"
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
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-700">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
