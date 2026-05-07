import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={submitHandler} className="form-box">
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={changeHandler}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={changeHandler}
          required
          />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={changeHandler}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;