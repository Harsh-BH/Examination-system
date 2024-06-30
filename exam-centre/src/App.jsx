// src/App.js

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./Pages/Dashboard/DashboardLayout";
import AddPaper from "./Pages/AddPaper";
import AddQuestions from "./Pages/AddQuestions";
import StartPaper from "./Pages/StartPaper";
import ExaminationPortal from "./Pages/ExaminationPortal";
import LoginPage from "./Pages/Login/LoginPage";
import PrivateRoute from "../src/components/PrivateRoute";
import { AuthProvider } from "../src/context/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<StartPaper />} />
            <Route path="add-paper" element={<AddPaper />} />
            <Route path="add-questions" element={<AddQuestions />} />
            <Route path="start-paper" element={<StartPaper />} />
            <Route path="examination-portal" element={<ExaminationPortal />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
