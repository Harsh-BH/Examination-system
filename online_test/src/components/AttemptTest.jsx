import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
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
      // Assuming `answers` state holds the answers

      // Navigate to the student dashboard after submission
      navigate("/student-dashboard");
    } catch (error) {
      console.error("Error submitting answers: ", error);
    }
  };

  return (
    <div className="attempt-test-container">
      <h2>Attempt Test</h2>
      <p>Time left: {timeLeft} seconds</p>
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id} className="question-container">
            <p className="question-text">{question.questionText}</p>
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
        ))}
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AttemptTest;
