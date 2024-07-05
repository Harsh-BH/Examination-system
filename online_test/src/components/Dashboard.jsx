// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      const querySnapshot = await getDocs(collection(db, "tests"));
      setTests(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
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
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/create-test">Create Test</Link>
      <ul>
        {tests.map((test) => (
          <li key={test.id}>
            {test.title}
            <Link to={`/create-question/${test.id}`}>Add Questions</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
