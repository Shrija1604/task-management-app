import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '0 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: '#111' }}>Create Account</h2>
      {error && (
        <p style={{ color: '#dc2626', background: '#fef2f2',
          padding: '10px', borderRadius: '6px', fontSize: '14px' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          name="name" placeholder="Full Name" value={form.name}
          onChange={handleChange} required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '14px' }}
        />
        <input
          type="email" name="email" placeholder="Email" value={form.email}
          onChange={handleChange} required
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '14px' }}
        />
        <input
          type="password" name="password" placeholder="Password (min 6 characters)"
          value={form.password} onChange={handleChange} required minLength={6}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '14px' }}
        />
        <button type="submit" disabled={loading} style={{
          padding: '10px', borderRadius: '6px', border: 'none',
          background: '#4f46e5', color: '#fff', fontSize: '15px',
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', fontSize: '14px', color: '#6b7280' }}>
        Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;