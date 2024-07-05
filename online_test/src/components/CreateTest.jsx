// src/components/CreateTest.jsx
import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./CreateTest.css";

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [paperTitle, setPaperTitle] = useState("");
  const [rules, setRules] = useState("");
  const [markingScheme, setMarkingScheme] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "tests"), {
        title,
        paperTitle,
        rules,
        markingScheme,
        description,
        createdAt: new Date(),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-test-container">
      <h2>Create Test</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Test Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter test title"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="paperTitle">Title of Paper</label>
          <input
            type="text"
            id="paperTitle"
            value={paperTitle}
            onChange={(e) => setPaperTitle(e.target.value)}
            placeholder="Enter title of paper"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rules">Add Rules</label>
          <textarea
            id="rules"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Enter rules"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="markingScheme">Add Marking Scheme</label>
          <textarea
            id="markingScheme"
            value={markingScheme}
            onChange={(e) => setMarkingScheme(e.target.value)}
            placeholder="Enter marking scheme"
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Test Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter test description"
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Test
        </button>
      </form>
    </div>
  );
};

export default CreateTest;
