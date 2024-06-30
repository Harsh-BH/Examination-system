// src/Pages/StartPaper.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StartPaper = () => {
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load papers from local storage on component mount
    const savedPapers = JSON.parse(localStorage.getItem("papers")) || [];
    setPapers(savedPapers);
  }, []);

  const handleStartPaper = (paper) => {
    navigate("/examination-portal", { state: { paper } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Start Paper Page</h2>
      <div style={styles.paperList}>
        {papers.length === 0 ? (
          <div style={styles.noPapersMessage}>
            No papers available. Please add some papers.
          </div>
        ) : (
          papers.map((paper, index) => (
            <div key={index} style={styles.paperItem}>
              <span style={styles.paperName}>{paper.name}</span>
              <button
                style={styles.startButton}
                onClick={() => handleStartPaper(paper)}
              >
                Start
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    padding: "20px",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    border: "1px solid #000",
    borderRadius: "10px",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  paperList: {
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paperItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #000",
    borderRadius: "5px",
    fontSize: "18px",
    width: "90%",
  },
  paperName: {
    flexGrow: 1,
    textAlign: "center",
  },
  startButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #000",
    backgroundColor: "#fff",
  },
  noPapersMessage: {
    fontSize: "18px",
    color: "#777",
    marginTop: "20px",
  },
};

export default StartPaper;
