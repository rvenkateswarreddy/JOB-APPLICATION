// src/components/UploadResume.js

import React, { useState } from "react";
import { storage, db, auth } from "./firebase"; // Adjust the import path according to your project structure
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import axios from "axios"; // Import axios for making HTTP requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFileUpload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const UploadResume = () => {
  const [company, setCompany] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = auth?.currentUser;
  console.log(user);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) return;

    setLoading(true); // Set loading state to true

    try {
      const user = auth.currentUser;
      const storageRef = ref(storage, `resumes/${user.uid}/${resume.name}`);
      await uploadBytes(storageRef, resume);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "applications"), {
        userId: user.uid,
        email: user.email,
        company,
        resumeURL: downloadURL,
        timestamp: new Date(),
      });

      // Fetch all users' email addresses
      const emailsCollection = await getDocs(collection(db, "emails"));
      const friendsEmails = emailsCollection.docs.map(
        (doc) => doc.data().email
      );

      // Send email notification to all friends
      await axios.post(
        "https://jobapplication-backend-bp7o.onrender.com/send-email",
        {
          to: friendsEmails,
          subject: "New Job Application",
          text: `${user.email} has applied for a job at ${company}. View the resume here: ${downloadURL}`,
        }
      );

      alert("Resume uploaded and email sent successfully!");
      setCompany("");
      setResume(null);
    } catch (error) {
      alert(error.message);
      console.error("Error uploading resume: ", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleUpload}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 text-center">
          <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
          Upload Resume
        </h2>
        <div className="mb-4">
          <label className="block text-gray-400">
            <FontAwesomeIcon icon={faBuilding} className="mr-2" />
            Company:
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="mt-1 p-2 border rounded w-full bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">Resume:</label>
          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            required
            className="mt-1 p-2 border rounded w-full bg-gray-700 text-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
          ) : (
            <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
          )}
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadResume;
