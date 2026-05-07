import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="home-container">
        <h1>Welcome to SmartTask Hub</h1>

        <p>
          Manage your tasks efficiently with our Website.
        </p>

        <div className="home-buttons">
          <Link to="/login">
            <button>Login</button>
          </Link>

          <Link to="/register">
            <button>Create Account</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;

