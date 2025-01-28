// src/components/Dashboard.js

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faThList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <button
        onClick={() => navigate("/upload")}
        className="bg-blue-500 text-white p-3 rounded mb-4 w-full max-w-xs flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faUpload} className="mr-2" />
        Upload Resume
      </button>
      <button
        onClick={() => navigate("/feed")}
        className="bg-blue-500 text-white p-3 rounded mb-4 w-full max-w-xs flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faThList} className="mr-2" />
        View Feed
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-3 rounded w-full max-w-xs flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
