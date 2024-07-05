// src/App.jsx
import React from "react";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div>
      <h1>Welcome to the Online Test System</h1>
      <nav>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </nav>
    </div>
  );
};

export default App;
