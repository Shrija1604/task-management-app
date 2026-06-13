import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

const AdminLoginPage = () => {
  const navigate = useNavigate();

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
          profileImage: data.profileImage || "",
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

        <div className="auth-sidebar" style={{ background: "linear-gradient(160deg, #1e293b 0%, #0f172a 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "30px" }}>
            <div className="auth-logo-box">
              <img src="/auth-logo.png" alt="Logo" />
            </div>
            <span style={{ fontWeight: "800", fontSize: "22px", color: "#fff" }}>Smart Task Hub</span>
          </div>
          <div style={{ textAlign: "center", margin: "20px 0", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ margin: "0 auto 30px" }}>
              <img
                src="/register-side.png"
                alt="Admin Security"
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  borderRadius: "24px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  filter: "brightness(0.9) contrast(1.1)"
                }}
              />
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>Admin Console</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto" }}>
              Secure access for system administrators.
            </p>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "👥", text: "Manage all users" },
                { icon: "🏷️", text: "Control task categories" },
                { icon: "📊", text: "View system-wide analytics" },
              ].map((item) => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255,255,255,0.06)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <h2>Admin Login</h2>
          <p>Please enter your administrative credentials</p>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginTop: "20px", fontWeight: "600", fontSize: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submitHandler} style={{ marginTop: "60px" }}>
            <div className="input-group">
              <label>Admin Email</label>
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
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  required
                  autoComplete="current-password"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "60%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0", width: "auto", fontSize: "16px" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              style={{ marginTop: "8px", background: "linear-gradient(135deg, #374151, #111827)" }}
            >
              {loading ? "Authenticating..." : "Login to Console"}
            </button>
          </form>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <Link to="/login" style={{ fontSize: "14px", color: "var(--accent-light)", fontWeight: "600" }}>← Back to Regular Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
