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
      <div className="auth-container" style={{ maxWidth: '500px', minHeight: 'auto', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 30px', 
            boxShadow: '0 12px 24px rgba(124, 58, 237, 0.3)',
            transform: 'rotate(-5deg)'
          }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"></path></svg>
          </div>
          
          {!submitted ? (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>Forgot Password?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>No worries! Enter your email address below and we'll send you a secure link to reset your password.</p>
              
              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", fontWeight: "600" }}>
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler}>
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e5e7eb', width: '100%', fontSize: '16px', transition: 'all 0.3s' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="auth-btn" 
                  disabled={loading}
                  style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    boxShadow: '0 8px 16px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '20px 0' }}>
               <div style={{ 
                 width: '80px', 
                 height: '80px', 
                 background: '#ecfdf5', 
                 borderRadius: '50%', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 margin: '0 auto 24px' 
               }}>
                 <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
               </div>
               <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>Check your email</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>We've sent a password reset link to <br/><strong style={{ color: 'var(--text-primary)' }}>{email}</strong></p>
               <button 
                 onClick={() => setSubmitted(false)} 
                 className="auth-btn" 
                 style={{ 
                   marginTop: '32px', 
                   background: 'transparent', 
                   color: '#7c3aed', 
                   border: '2px solid #7c3aed',
                   padding: '14px',
                   fontWeight: '700'
                 }}
               >
                 Try another email
               </button>
            </div>
          )}
          
          <p style={{ marginTop: '40px', fontSize: '15px', color: 'var(--text-secondary)' }}>
            Remember your password? <Link to="/login" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
