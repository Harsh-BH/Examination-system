// src/Pages/ExaminationPortal.js
import React from "react";
import { useLocation } from "react-router-dom";

const ExaminationPortal = () => {
  const location = useLocation();
  const { paper } = location.state || {};

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>{paper ? paper.name : "Examination Portal"}</h2>
      {paper ? (
        <embed
          src={paper.content}
          width="100%"
          height="800px"
          type="application/pdf"
        />
      ) : (
        <p>No paper content available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    fontSize: "24px",
    marginBottom: "20px",
  },
};

export default ExaminationPortal;
