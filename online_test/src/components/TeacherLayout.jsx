// src/components/TeacherLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./TeacherLayout.css";

const TeacherLayout = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="d-flex flex-row">
      <nav className="sidebar bg-dark text-white p-3">
        <h2>Teacher Dashboard</h2>
        {user && (
          <div className="user-details">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="profile-picture"
              />
            )}
            <p className="user-name">{user.name}</p>
            <p className="user-email">{user.email}</p>
          </div>
        )}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/create-test" className="nav-link text-white">
              Create Test
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/teacher-profile" className="nav-link text-white">
              Profile
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="btn btn-danger logout-button">
          Logout
        </button>
      </nav>
      <div className="content p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default TeacherLayout;
