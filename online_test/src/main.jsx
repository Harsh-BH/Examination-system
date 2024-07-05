// src/main.jsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CreateTest from "./components/CreateTest";
import CreateQuestion from "./components/CreateQuestion";
import AttemptTest from "./components/AttemptTest";
import TestDetails from "./components/TestDetails";
import TeacherLayout from "./components/TeacherLayout";
import StudentLayout from "./components/StudentLayout";
import Profile from "./components/Profile";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Teacher Layout */}
        <Route element={<TeacherLayout />}>
          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/create-test" element={<CreateTest />} />
          <Route path="/create-question/:testId" element={<CreateQuestion />} />
          <Route path="/test-details/:testId" element={<TestDetails />} />
          <Route path="/teacher-profile" element={<Profile />} />
        </Route>

        {/* Student Layout */}
        <Route element={<StudentLayout />}>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/attempt-test/:testId" element={<AttemptTest />} />
          <Route path="/student-profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
