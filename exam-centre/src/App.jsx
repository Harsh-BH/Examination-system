import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import AddPaper from "../src/Pages/AddPaper";
import AddQuestions from "../src/Pages/AddQuestions";
import StartPaper from "../src/Pages/StartPaper";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AddPaper />} />
          <Route path="add-paper" element={<AddPaper />} />
          <Route path="add-questions" element={<AddQuestions />} />
          <Route path="start-paper" element={<StartPaper />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
