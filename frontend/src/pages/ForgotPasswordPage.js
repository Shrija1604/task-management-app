import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
            <img src="/login-side.png" alt="Recovery Illustration" className="auth-sidebar-img" />
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "12px" }}>Recover Access</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", maxWidth: "340px", margin: "0 auto" }}>
              Don't worry, we'll help you get back into your account in no time.
            </p>
          </div>
        </div>

        <div className="auth-form-side">
          <div style={{ textAlign: "center", width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            {!submitted ? (
              <>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "10px", textAlign: "left" }}>Forgot Password?</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "30px", lineHeight: "1.6", textAlign: "left" }}>Enter your email address below and we'll send you a secure link to reset your password.</p>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "24px", fontWeight: "600", fontSize: "14px", textAlign: "left" }}>
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={submitHandler}>
                  <div className="input-group" style={{ textAlign: "left" }}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter Your Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: "10px" }}>
                    {loading ? "Sending link..." : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ padding: "20px 0" }}>
                <div style={{ width: "80px", height: "80px", background: "rgba(16,185,129,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>Check your email</h2>
                <p style={{ color: "var(--text-secondary)", marginTop: "12px", lineHeight: "1.6" }}>We've sent a password reset link to <br /><strong style={{ color: "var(--text-primary)" }}>{email}</strong></p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="auth-btn"
                  style={{ marginTop: "32px", background: "transparent", color: "var(--accent-light)", border: "2px solid var(--accent-light)", fontWeight: "700" }}
                >
                  Try another email
                </button>
              </div>
            )}

            <p style={{ marginTop: "40px", fontSize: "15px", color: "var(--text-secondary)" }}>
              Remember your password? <Link to="/login" style={{ color: "var(--accent-light)", fontWeight: "700" }}>Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
