import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import "./TestDetails.css";

const TestDetails = () => {
  const { testId } = useParams();
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      const testDocRef = doc(db, "tests", testId);
      const testDoc = await getDoc(testDocRef);
      if (testDoc.exists()) {
        setTestTitle(testDoc.data().title);

        const questionsCollectionRef = collection(testDocRef, "questions");
        const questionsSnapshot = await getDocs(questionsCollectionRef);
        const questionsList = questionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuestions(questionsList);
      } else {
        console.error("Test not found");
      }
    };
    fetchTestDetails();
  }, [testId]);

  const handleDeleteTest = async () => {
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

      // Navigate back to the dashboard or tests list
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting test: ", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteDoc(doc(db, `tests/${testId}/questions`, questionId));
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
    } catch (error) {
      console.error("Error deleting question: ", error);
    }
  };

  return (
    <div className="test-details-container">
      <div className="header">
        <h2 className="test-title">{testTitle}</h2>
        <div className="header-buttons">
          <Link
            to={`/create-question/${testId}`}
            className="btn btn-success mb-3"
          >
            Add Question
          </Link>
          <button onClick={handleDeleteTest} className="btn btn-danger mb-3">
            Delete Test
          </button>
        </div>
      </div>
      <ul className="list-group">
        {questions.map((question) => (
          <li key={question.id} className="list-group-item">
            <div className="question-content">
              <p>{question.question}</p>
              <ul className="options-list">
                {question.options.map((option, index) => (
                  <li key={index} className="option-item">
                    {option}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteQuestion(question.id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestDetails;
