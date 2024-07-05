// src/components/AttemptTest.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import "./AttemptTest.css";

const AttemptTest = () => {
  const { testId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // Example: 10 minutes for the test
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const questionsSnapshot = await getDocs(
        collection(db, `tests/${testId}/questions`)
      );
      setQuestions(
        questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchQuestions();
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(timer);
          handleSubmit(); // Automatically submit when time is up
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (questionId, answer) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      // Save the answers to Firestore (or any other logic)
      await setDoc(doc(db, "testResults", testId), { answers });

      // Navigate to the result page after submission
      navigate(`/result/${testId}`);
    } catch (error) {
      console.error("Error submitting answers: ", error);
    }
  };

  return (
    <div className="attempt-test-container">
      <h2>Attempt Test</h2>
      <p>
        Time left: {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")} minutes
      </p>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} className="question-container">
            <p className="question-text">{question.question}</p>
            <div className="options-container">
              {question.options.map((option, index) => (
                <div key={index} className="option-container">
                  <input
                    type="radio"
                    id={`${question.id}-${index}`}
                    name={question.id}
                    value={option}
                    onChange={() => handleChange(question.id, option)}
                  />
                  <label htmlFor={`${question.id}-${index}`}>{option}</label>
                </div>
              ))}
            </div>
            <p className="question-type">Type: {question.questionType}</p>
          </div>
        ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AttemptTest;
