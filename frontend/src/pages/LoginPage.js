import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.registered === true;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("Please provide both email and password.");
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
          profileImage: data.profileImage || "",
        })
      );
      navigate(data.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">

        <div className="auth-sidebar">
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "30px" }}>
            <div className="auth-logo-box">
              <img src="/auth-logo.png" alt="Logo" />
            </div>
            <span style={{ fontWeight: "800", fontSize: "22px", color: "var(--text-primary)" }}>Smart Task Hub</span>
          </div>
          <div style={{ textAlign: "center", margin: "20px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <img src="/login-side.png" alt="Login Illustration" className="auth-sidebar-img" />
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>Welcome Back</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto" }}>
              Sign in to manage your tasks and boost your productivity.
            </p>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "✅", text: "Track tasks in real-time" },
                { icon: "📊", text: "Visualize your productivity" },
                { icon: "📅", text: "Never miss a deadline" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <h2>Login to your account</h2>
          <p>Please enter your details</p>

          {justRegistered && (
            <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "12px 16px", borderRadius: "12px", marginTop: "20px", fontWeight: "600", fontSize: "14px" }}>
              ✅ Account created successfully! Please log in.
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginTop: "20px", fontWeight: "600", fontSize: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ marginTop: "30px" }}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                required
                autoComplete="email"
                placeholder="Enter your email address"
              />
            </div>
            <div className="input-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "13px", color: "var(--accent-light)", fontWeight: "600" }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0", width: "auto", fontSize: "16px" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={{ marginTop: "30px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--accent-light)", fontWeight: "700" }}>Register here</Link>
          </p>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/admin-login" style={{ fontSize: "13px", color: "var(--text-muted)" }}>Admin Login →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;