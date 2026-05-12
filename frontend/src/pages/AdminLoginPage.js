import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const data = await loginUser(formData);
      
      if (data.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        })
      );
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Sidebar */}
        <div className="auth-sidebar" style={{ background: 'linear-gradient(160deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.9) 100%)' }}>
          <div className="auth-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
            <span style={{ fontWeight: '800', fontSize: '20px', color: '#fff' }}>Smart Task Hub</span>
          </div>
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <img
              src="https://storyset.com/about/security-amico.svg"
              alt="Admin login illustration"
              style={{ width: "100%", maxWidth: "300px", marginBottom: '30px' }}
            />
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>Admin Console</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", marginTop: '10px' }}>
              Secure access for system administrators only.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="auth-form-side">
          <h2>Admin Login</h2>
          <p>Please enter your administrative credentials</p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginTop: "20px", fontWeight: "600", fontSize: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ marginTop: "30px" }}>
            <div className="input-group">
              <label>Admin Email</label>
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
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                required
                autoComplete="current-password"
                placeholder=""
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "8px", background: 'linear-gradient(135deg, #374151, #111827)' }}>
              {loading ? "Authenticating..." : "Login to Console"}
            </button>
          </form>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Link to="/login" style={{ fontSize: '14px', color: 'var(--accent-light)', fontWeight: '600' }}>Back to Regular Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
