// src/components/Navbar.js

import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logoutHandler = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>SmartTask Hub</h2>

      <div>
        {/* ALWAYS */}
        <Link to="/">Home</Link>

        {/* LOGGED IN */}
        {token && (
          <>
            <Link to="/tasks">
              Tasks
            </Link>

            <button
              onClick={logoutHandler}
            >
              Logout
            </button>
          </>
        )}

        {/* NOT LOGGED IN */}
        {!token && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;