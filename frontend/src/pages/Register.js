import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(1200px 500px at 15% -10%, rgba(91,95,239,0.25), transparent), var(--ink)',
      }}
    >
      <div className="card" style={{ width: 400 }}>
        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Drivehouse</div>
          <h2 className="mb-0">Create an account</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input name="name" required value={form.name} onChange={handleChange} placeholder="Your name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@college.edu" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          </div>
          <div className="field">
            <label>I am a</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="coordinator">Placement Coordinator</option>
            </select>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{error}</p>
          )}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
