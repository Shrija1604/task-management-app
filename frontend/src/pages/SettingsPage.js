import React, { useState, useRef } from "react";
import API from "../services/api";
import { updateProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const fileInputRef = useRef(null);
  
  const initialUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [userData, setUserData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    profileImage: initialUser.profileImage || ""
  });
  
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    tasks: true
  });
  
  const [deleting, setDeleting] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUploading(true);
    setSaveSuccess(false);
    try {
      const data = await updateProfile(userData);
      localStorage.setItem("user", JSON.stringify({
        ...initialUser,
        name: data.name,
        email: data.email,
        profileImage: data.profileImage
      }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteAccountHandler = async () => {
    if (window.confirm("CRITICAL: Are you sure you want to delete your account? This action is permanent and all your tasks will be lost forever.")) {
      try {
        setDeleting(true);
        // Assuming there's a delete profile endpoint, if not I'd need to add it
        await API.delete("/auth/profile"); 
        localStorage.clear();
        navigate("/register");
      } catch (err) {
        alert("Failed to delete account. Please try again later.");
        setDeleting(false);
      }
    }
  };

  return (
    <div className="main-content">
      <div className="topbar">
        <h1>Settings</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
          Customize your experience and manage account security.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Profile Section */}
        <div className="stat-card" style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Your Profile</h2>
          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '4px solid var(--border-color)',
                background: 'var(--card-bg)'
              }}>
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', color: 'var(--text-secondary)' }}>
                    {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{ 
                  position: 'absolute', 
                  bottom: '0', 
                  right: '0', 
                  background: 'var(--accent-primary)', 
                  border: 'none', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={userData.name} 
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={userData.email} 
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                disabled={uploading}
                className="photo-upload-btn"
                style={{ 
                  background: saveSuccess ? '#10b981' : 'var(--accent-primary)',
                  transition: 'all 0.3s'
                }}
              >
                {uploading ? "Saving..." : saveSuccess ? "✓ Saved" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Appearance & Notifications Section */}
        <div className="stat-card">
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Appearance</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{theme === 'dark' ? 'Dark' : 'Light'} Mode</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Toggle between light and dark themes.</div>
            </div>
            <button onClick={toggleTheme} className="photo-upload-btn">
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
          
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '30px 0 20px' }}>Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { id: 'email', label: 'Email Notifications', desc: 'Receive daily task summaries via email.' },
              { id: 'push', label: 'Push Notifications', desc: 'Get instant alerts on your desktop.' },
              { id: 'tasks', label: 'Task Reminders', desc: 'Notify me when a task is nearing its due date.' }
            ].map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.desc}</div>
                </div>
                <div 
                  onClick={() => toggleNotification(item.id)}
                  style={{ 
                    width: '50px', 
                    height: '26px', 
                    background: notifications[item.id] ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', 
                    borderRadius: '20px', 
                    position: 'relative', 
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    background: '#fff', 
                    borderRadius: '50%', 
                    position: 'absolute', 
                    top: '3px', 
                    left: notifications[item.id] ? '27px' : '3px',
                    transition: '0.3s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Security Section */}
        <div className="stat-card">
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Account & Privacy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Two-Factor Authentication</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 15px' }}>Add an extra layer of security to your account.</p>
              <button className="photo-upload-btn">Enable 2FA</button>
            </div>
            
            <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#f87171' }}>Danger Zone</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '5px 0 15px' }}>Deleting your account is permanent and cannot be undone.</p>
              <button 
                onClick={deleteAccountHandler}
                disabled={deleting}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
