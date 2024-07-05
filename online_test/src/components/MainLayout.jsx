// src/components/MainLayout.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="d-flex">
      <nav className="sidebar bg-dark text-white p-3">
        <h2>Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link text-white">
              Teacher Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/student-dashboard" className="nav-link text-white">
              Student Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      <div className="content p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
