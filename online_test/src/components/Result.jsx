// src/components/Result.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./Result.css";

const Result = () => {
  const { testId } = useParams();
  const [results, setResults] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const resultsDoc = await getDoc(doc(db, "testResults", testId));
      if (resultsDoc.exists()) {
        setResults(resultsDoc.data());
      }

      const questionsSnapshot = await getDocs(
        collection(db, `tests/${testId}/questions`)
      );
      setQuestions(
        questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchResults();
  }, [testId]);

  const calculatePerformance = () => {
    if (!results || !questions.length)
      return { correct: 0, incorrect: 0, total: 0 };

    let correct = 0;
    let incorrect = 0;

    questions.forEach((question) => {
      if (results.answers[question.id] === question.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return {
      correct,
      incorrect,
      total: questions.length,
    };
  };

  const performance = calculatePerformance();

  const dataBar = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        label: "# of Questions",
        data: [performance.correct, performance.incorrect],
        backgroundColor: ["#36a2eb", "#ff6384"],
      },
    ],
  };

  const dataPie = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [performance.correct, performance.incorrect],
        backgroundColor: ["#36a2eb", "#ff6384"],
      },
    ],
  };

  return (
    <div className="result-container">
      <h2>Test Results</h2>
      <div className="charts-container">
        <div className="chart">
          <h3>Performance Bar Chart</h3>
          <Bar data={dataBar} />
        </div>
        <div className="chart">
          <h3>Performance Pie Chart</h3>
          <Pie data={dataPie} />
        </div>
      </div>
      <div className="summary">
        <p>Total Questions: {performance.total}</p>
        <p>Correct Answers: {performance.correct}</p>
        <p>Incorrect Answers: {performance.incorrect}</p>
        <p>
          Accuracy:{" "}
          {((performance.correct / performance.total) * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default Result;
