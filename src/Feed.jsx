// src/components/Feed.js

import React, { useEffect, useState } from "react";
import { db } from "./firebase"; // Adjust the import path according to your project structure
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faEnvelope,
  faCalendarAlt,
  faFileAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const Feed = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(apps);
      setLoading(false); // set loading to false after data is fetched
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Job Application Feed</h1>
      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="3x"
              className="text-blue-500"
            />
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              className="border-b border-gray-700 p-4 last:border-b-0"
            >
              <h2 className="text-2xl font-semibold flex items-center mb-2">
                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                {app.company}
              </h2>
              <p className="text-gray-400 flex items-center mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {new Date(app.timestamp.toDate()).toLocaleString()}
              </p>
              <p className="text-gray-400 flex items-center mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Posted by: {app.email}
              </p>
              <a
                href={app.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center"
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                View Resume
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
