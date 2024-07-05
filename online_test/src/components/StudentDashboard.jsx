// src/components/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tests"));
        const testsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTests(testsList);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };
    fetchTests();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Test Paper</h2>
      <button onClick={handleLogout} className="btn btn-danger mb-3">
        Logout
      </button>
      <ul className="list-group">
        {tests.length === 0 ? (
          <li className="list-group-item">No tests available</li>
        ) : (
          tests.map((test) => (
            <li key={test.id} className="list-group-item">
              <Link to={`/attempt-test/${test.id}`}>{test.title}</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudentDashboard;
