// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { updateEmail, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setName(userData.name);
          setEmail(currentUser.email);
          setPhotoURL(userData.photoURL);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handlePhotoUpload = async (uid) => {
    if (photo) {
      const photoRef = ref(storage, `photos/${uid}`);
      await uploadBytes(photoRef, photo);
      const newPhotoURL = await getDownloadURL(photoRef);
      setPhotoURL(newPhotoURL);
      return newPhotoURL;
    }
    return photoURL;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const currentUser = auth.currentUser;
      const newPhotoURL = await handlePhotoUpload(currentUser.uid);

      await updateDoc(doc(db, "users", currentUser.uid), {
        name,
        photoURL: newPhotoURL,
      });

      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile: ", error);
      setMessage("Failed to update profile.");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      setMessage("Failed to send password reset email.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdateProfile} className="profile-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="form-control"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="form-control"
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="form-control"
        />
        {photoURL && (
          <img src={photoURL} alt="Profile" className="profile-picture" />
        )}
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
      <button onClick={handlePasswordReset} className="btn btn-secondary">
        Reset Password
      </button>
    </div>
  );
};

export default Profile;
