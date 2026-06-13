import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token. Please request a new link.");
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
            <img src="/login-side.png" alt="Security Illustration" className="auth-sidebar-img" />
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>Reset Password</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto" }}>
              Secure your account with a new password.
            </p>
          </div>
        </div>

        <div className="auth-form-side">
          <div style={{ textAlign: "center", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            {!success ? (
              <>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "10px", textAlign: "left" }}>Set New Password</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "30px", lineHeight: "1.6", textAlign: "left" }}>Choose a strong password to protect your account.</p>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "24px", fontWeight: "600", fontSize: "14px", textAlign: "left" }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={submitHandler}>
                  <div className="input-group" style={{ textAlign: "left" }}>
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group" style={{ textAlign: "left" }}>
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "10px" }}>
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: "20px 0" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(16,185,129,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>Success!</h2>
                <p style={{ color: "var(--text-secondary)", marginTop: "12px", lineHeight: "1.6" }}>Your password has been updated. You can now sign in with your new credentials.</p>
                <div style={{ marginTop: "32px" }}>
                  <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: "700", textDecoration: "none" }}>Go to Login now</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
