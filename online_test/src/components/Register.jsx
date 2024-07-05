// src/components/Register.jsx
import React, { useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePhotoUpload = async (uid) => {
    if (photo) {
      const photoRef = ref(storage, `photos/${uid}`);
      await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(photoRef);
      return photoURL;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const photoURL = await handlePhotoUpload(userCredential.user.uid);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        name,
        photoURL,
        role,
      });
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else {
        setError("An error occurred during registration.");
      }
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="form-control"
        />
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
          placeholder="Upload Photo"
          className="form-control"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-control"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
