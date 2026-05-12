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
      <div className="auth-container" style={{ maxWidth: '500px', minHeight: 'auto', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 30px', 
            boxShadow: '0 12px 24px rgba(16, 185, 129, 0.3)',
            transform: 'rotate(5deg)'
          }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          
          {!success ? (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>Reset Password</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>Choose a strong new password to protect your account and regain access.</p>
              
              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#b91c1c", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px", fontWeight: "600" }}>
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler}>
                <div className="input-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e5e7eb', width: '100%', fontSize: '16px' }}
                  />
                </div>
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', display: 'block' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    style={{ padding: '14px 18px', borderRadius: '12px', border: '2px solid #e5e7eb', width: '100%', fontSize: '16px' }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="auth-btn" 
                  disabled={loading}
                  style={{ 
                    marginTop: '30px', 
                    padding: '16px', 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  {loading ? "Updating password..." : "Update Password"}
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
               <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>Password Updated!</h2>
               <p style={{ color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>Your password has been successfully reset. Redirecting you to the login page...</p>
               <div style={{ marginTop: '30px' }}>
                 <Link to="/login" style={{ color: '#10b981', fontWeight: '700', textDecoration: 'none' }}>Go to Login now</Link>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
