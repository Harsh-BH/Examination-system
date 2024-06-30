import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaDollarSign, FaShoppingCart } from "react-icons/fa";
import "./Dashboard.css";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleColumnClick = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => handleColumnClick("add-paper")}>Add Paper</li>
            <li onClick={() => handleColumnClick("add-questions")}>
              Add Questions
            </li>
            <li onClick={() => handleColumnClick("start-paper")}>
              Start Paper
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="main-container">
          <section className="content">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
