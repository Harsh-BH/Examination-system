// src/pages/Login/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; // Import Firebase Auth and Firestore instances

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true); // State to toggle between sign-up and login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        // Sign-up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User signed up:", user.uid);

        // Add user details to Firestore
        try {
          const userDocRef = await addDoc(collection(db, "users"), {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            // Add more user details as needed
          });
          console.log("User added to Firestore:", userDocRef.id);
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError.message);
          setError(firestoreError.message);
        }
      } else {
        // Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("User logged in:", user.uid);
      }

      // Redirect to dashboard upon successful sign-up or login
      navigate("/dashboard");
    } catch (authError) {
      console.error("Authentication error:", authError.message);
      setError(authError.message);
    }
  };

  return (
    <div className="login-page">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div>
            <label>Display Name:</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <span onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Login" : "Sign Up"}
        </span>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginPage;
