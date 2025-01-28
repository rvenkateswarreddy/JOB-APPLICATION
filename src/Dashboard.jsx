// src/components/Dashboard.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Adjust the import path according to your project structure
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faThList,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [resumeCounts, setResumeCounts] = useState({});
  const [userUploads, setUserUploads] = useState([]);
  const [showUserUploads, setShowUserUploads] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumeCounts = async () => {
      const querySnapshot = await getDocs(collection(db, "applications"));
      const counts = {};
      querySnapshot.forEach((doc) => {
        const email = doc.data().email;
        if (counts[email]) {
          counts[email]++;
        } else {
          counts[email] = 1;
        }
      });
      setResumeCounts(counts);
    };

    fetchResumeCounts();
  }, []);

  const fetchUserUploads = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "applications"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const uploads = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserUploads(uploads);
    setShowUserUploads(true);
  };

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
      <div className="bg-gray-800 p-4 rounded mb-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Resume Uploads</h2>
        {Object.entries(resumeCounts).map(([email, count]) => (
          <div key={email} className="mb-2">
            <span className="text-white">{email}: </span>
            <span className="text-blue-400">{count} resumes</span>
          </div>
        ))}
      </div>
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
        onClick={fetchUserUploads}
        className="bg-green-500 text-white p-3 rounded mb-4 w-full max-w-xs flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        My Uploads
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-3 rounded w-full max-w-xs flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
        Logout
      </button>
      {showUserUploads && (
        <div className="bg-gray-800 p-4 rounded mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">My Uploads</h2>
          {userUploads.length > 0 ? (
            userUploads.map((upload) => (
              <div key={upload.id} className="mb-4">
                <p className="text-white">Email: {upload.email}</p>
                <p className="text-white">Company: {upload.company}</p>
                <p className="text-white">
                  Timestamp:{" "}
                  {new Date(upload.timestamp.seconds * 1000).toLocaleString()}
                </p>
                <a
                  href={upload.resumeURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Resume
                </a>
              </div>
            ))
          ) : (
            <p className="text-white">No uploads found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
