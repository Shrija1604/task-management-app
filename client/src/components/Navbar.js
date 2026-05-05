import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '0 1.5rem',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #eee',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
    }}>
      <Link to="/dashboard" style={{
        fontWeight: 600,
        fontSize: '1.1rem',
        textDecoration: 'none',
        color: '#4f46e5'
      }}>
        SmartTask Hub
      </Link>
      <button onClick={logout} style={{
        padding: '6px 16px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        background: '#fff',
        cursor: 'pointer',
        fontSize: '14px'
      }}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;