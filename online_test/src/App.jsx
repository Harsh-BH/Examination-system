import React from "react";
import { Link } from "react-router-dom";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Online Test System</h1>
      <nav className={styles.nav}>
        <Link to="/register" className={styles.navLink}>
          Register
        </Link>
        <Link to="/login" className={styles.navLink}>
          Login
        </Link>
      </nav>
    </div>
  );
};

export default App;
