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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Full name is required.");
      return;
    }

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

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "#ef4444", pct: 25 };
    if (p.length < 8) return { label: "Weak", color: "#f59e0b", pct: 50 };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "#10b981", pct: 100 };
    return { label: "Medium", color: "#6366f1", pct: 75 };
  };

  const strength = passwordStrength();

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
            <img src="/register-side.png" alt="Register Illustration" className="auth-sidebar-img" />
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>Create Account</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto" }}>
              Start organizing your tasks and boost your productivity today.
            </p>
            <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "🆓", text: "Completely free to use" },
                { icon: "🔒", text: "Your data stays private" },
                { icon: "⚡", text: "Get started in seconds" },
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
                placeholder="Enter your Name"
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
                placeholder="Enter your email address"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="input-group">
                <label>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={changeHandler}
                    required
                    autoComplete="new-password"
                    placeholder="Min 6 char"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0", width: "auto", fontSize: "14px" }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {strength && (
                  <div style={{ marginTop: "6px" }}>
                    <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${strength.pct}%`, height: "100%", background: strength.color, borderRadius: "999px", transition: "width 0.3s" }} />
                    </div>
                    <span style={{ fontSize: "11px", color: strength.color, fontWeight: "700", marginTop: "4px", display: "block" }}>{strength.label}</span>
                  </div>
                )}
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={changeHandler}
                    required
                    autoComplete="new-password"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0", width: "auto", fontSize: "14px" }}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: "700", marginTop: "4px", display: "block" }}>Passwords don't match</span>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "700", marginTop: "4px", display: "block" }}>✓ Passwords match</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? "Creating account..." : "Create Account"}
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