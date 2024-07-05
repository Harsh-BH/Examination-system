import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
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

  const handleDeleteTest = async (testId) => {
    try {
      // Delete all questions in the test
      const questionsCollectionRef = collection(
        db,
        `tests/${testId}/questions`
      );
      const questionsSnapshot = await getDocs(questionsCollectionRef);
      const deletePromises = questionsSnapshot.docs.map((questionDoc) =>
        deleteDoc(doc(db, `tests/${testId}/questions`, questionDoc.id))
      );
      await Promise.all(deletePromises);

      // Delete the test document itself
      await deleteDoc(doc(db, "tests", testId));

      // Update the state to remove the deleted test
      setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Test</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      <ul className="test-list">
        {tests.length === 0 ? (
          <li className="test-item">No tests available</li>
        ) : (
          tests.map((test) => (
            <li key={test.id} className="test-item">
              <Link to={`/test-details/${test.id}`} className="test-link">
                {test.title}
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDeleteTest(test.id)}
              >
                X
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TeacherDashboard;
