import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Sidebar */}
        <div className="auth-sidebar">
          <div className="auth-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
            <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-primary)' }}>Smart Task Hub</span>
          </div>
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <img
              src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop"
              alt="Register illustration"
              style={{ width: "100%", maxWidth: "300px", marginBottom: '30px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Create Account</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: '10px' }}>
              Start organizing your tasks and boost your productivity today.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-form-side">
          <h2>Create your account</h2>
          <p>Fill in the details to get started</p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginTop: "20px", fontWeight: "600", fontSize: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ marginTop: "30px" }}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                required
                autoComplete="name"
                placeholder=""
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                required
                autoComplete="email"
                placeholder=""
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  required
                  autoComplete="new-password"
                  placeholder=""
                />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={changeHandler}
                  required
                  autoComplete="new-password"
                  placeholder=""
                />
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p style={{ marginTop: "28px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: "700" }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;