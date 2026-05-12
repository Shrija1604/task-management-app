import React, { useState } from "react";
import { updateProfile } from "../services/authService";

const ProfilePage = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    confirmPassword: "",
    profileImage: user.profileImage || "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = React.useRef(null);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
    };
    if (formData.password) payload.password = formData.password;

    try {
      setLoading(true);
      const data = await updateProfile(payload);
      const updatedUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", data.token);
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setSuccessMsg("Profile updated successfully!");
      
      // Force reload navbar/app state if needed, or just let React handle it via state
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="topbar">
        <div>
          <h1>My Profile</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
            Update your personal information and profile picture.
          </p>
        </div>
      </div>

      <div className="stat-card" style={{ maxWidth: "700px", margin: '0 auto' }}>
        <div className="profile-photo-container" style={{ position: 'relative', width: '120px', margin: '0 auto 30px' }}>
          {formData.profileImage ? (
            <img src={formData.profileImage} alt="Profile" className="profile-photo-preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', border: '4px solid var(--border-color)' }} />
          ) : (
            <div className="profile-photo-preview" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-primary)', color: '#fff', fontSize: '40px', fontWeight: '800', borderRadius: '50%', border: '4px solid var(--border-color)' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{ 
              position: 'absolute', 
              bottom: '5px', 
              right: '5px', 
              background: 'var(--accent-primary)', 
              border: 'none', 
              width: '35px', 
              height: '35px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              zIndex: 10
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*"
          />
        </div>

        <form onSubmit={submitHandler} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
          {successMsg && (
            <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#10b981", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontWeight: "600", fontSize: "14px" }}>
              ✅ {successMsg}
            </div>
          )}
          {errorMsg && (
            <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", marginBottom: "20px", fontWeight: "600", fontSize: "14px" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '15px' }}>Change Password</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={changeHandler}
                  placeholder="Enter new password"
                />
              </div>
              <div className="input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={changeHandler}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn"
            style={{ marginTop: "30px" }}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
