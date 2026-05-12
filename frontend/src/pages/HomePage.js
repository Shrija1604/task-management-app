import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";

    return (
    <div className="landing-page" style={{ padding: '0 5%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '12px' }} />
          <span style={{ fontWeight: '800', fontSize: '24px', letterSpacing: '-1px' }}>Smart Task Hub</span>
        </div>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {!token ? (
            <>
              <Link to="/login" style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>Login</Link>
              <Link to="/register" className="auth-btn" style={{ padding: '10px 25px', width: 'auto' }}>Get Started</Link>
            </>
          ) : (
            <Link to={dashboardPath} className="auth-btn" style={{ padding: '10px 25px', width: 'auto' }}>Go to Dashboard</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 style={{ fontSize: '64px', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px' }}>
            Manage Your Work <br />
            <span style={{ color: 'var(--accent-primary)' }}>Faster & Smarter.</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '500px' }}>
            Smart Task Hub is the ultimate platform to organize your life, track your progress, and achieve your goals with ease and style.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {!token ? (
              <Link to="/register" className="auth-btn" style={{ padding: '15px 40px', fontSize: '18px', width: 'auto' }}>Start for Free</Link>
            ) : (
              <Link to={dashboardPath} className="auth-btn" style={{ padding: '15px 40px', fontSize: '18px', width: 'auto' }}>Open Dashboard</Link>
            )}
            <a href="#features" className="photo-upload-btn" style={{ padding: '15px 40px', fontSize: '18px' }}>Explore Features</a>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <img 
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop" 
            alt="Productivity" 
            className="hero-image" 
            style={{ borderRadius: '30px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', filter: 'brightness(0.8)' }}
          />
        </div>
      </header>

      {/* Stats / Proof */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '60px', background: 'var(--card-bg)', borderRadius: '30px', margin: '40px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: '900' }}>10k+</div>
          <div style={{ color: 'var(--text-secondary)' }}>Active Users</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: '900' }}>1M+</div>
          <div style={{ color: 'var(--text-secondary)' }}>Tasks Completed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', fontWeight: '900' }}>4.9/5</div>
          <div style={{ color: 'var(--text-secondary)' }}>User Rating</div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 style={{ fontSize: '40px', fontWeight: '900' }}>Powerful Features for Your Success</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Everything you need to stay organized and productive.</p>
        
        <div className="features-grid">
          {[
            { title: 'Smart Kanban', icon: '📋', desc: 'Organize your tasks visually with our intuitive drag-and-drop board.' },
            { title: 'Detailed Analytics', icon: '📊', desc: 'Track your productivity with beautiful charts and performance metrics.' },
            { title: 'Smart Calendar', icon: '📅', desc: 'Never miss a deadline with our integrated task-aware calendar.' },
            { title: 'Admin Control', icon: '🛡️', desc: 'Powerful system management for administrators to monitor all activities.' }
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '10px' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section style={{ display: 'flex', alignItems: 'center', gap: '60px', padding: '100px 0' }}>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
          alt="Goals" 
          style={{ flex: 1, maxWidth: '450px', borderRadius: '30px' }} 
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '40px', fontWeight: '900' }}>Your Productivity, Reimagined.</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginTop: '20px', lineHeight: '1.6' }}>
            We built Smart Task Hub to solve the problem of digital clutter. Our mission is to provide a clean, distraction-free environment where you can focus on what truly matters: getting things done.
          </p>
          <ul style={{ marginTop: '30px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--success)', fontWeight: '900' }}>✓</span> Secure & Private Data
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--success)', fontWeight: '900' }}>✓</span> Real-time Syncing
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--success)', fontWeight: '900' }}>✓</span> Premium Dark Mode Design
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '35px', height: '35px', borderRadius: '10px' }} />
          <span style={{ fontWeight: '800', fontSize: '20px' }}>Smart Task Hub</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Making productivity accessible and enjoyable for everyone. Join the revolution today.
        </p>
        
        <div className="social-links">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://github.com/Shrija1604/task-management-app" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>

        <div className="contact-info">
          <div>Email: contact@smarttaskhub.com</div>
          <div style={{ marginTop: '10px' }}>
            <Link to="/admin-login" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline' }}>Admin Console</Link>
          </div>
          <div style={{ marginTop: '10px' }}>© 2026 Smart Task Hub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
