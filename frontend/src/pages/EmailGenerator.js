import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EmailGenerator() {
  const { isCoordinator } = useAuth();
  const [form, setForm] = useState({
    type: 'Interview Invitation', companyName: '', studentName: '',
    date: '', venue: '', tone: 'Professional',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const { data } = await api.post('/ai/generate-email', form);
      setResult(data.result);
    } catch {
      setError('Could not reach the AI service. Check that the backend is running and GEMINI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  if (!isCoordinator) {
    return (
      <>
        <Topbar eyebrow="AI Tool" title="Email Generator" />
        <div className="page-content">
          <div className="card" style={{ maxWidth: 480 }}>
            <h3 style={{ fontSize: 15 }}>Coordinator access only</h3>
            <p style={{ fontSize: 13, marginBottom: 0 }}>
              Drafting outbound emails on behalf of the placement cell is limited to coordinator accounts.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar eyebrow="AI Tool" title="Email Generator" />
      <div className="page-content">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Draft an email</h3>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Email type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option>Interview Invitation</option>
                  <option>Offer Letter</option>
                  <option>Rejection Mail</option>
                  <option>Reminder</option>
                </select></div>
              <div className="field"><label>Company</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} required /></div>
              <div className="field"><label>Student name (optional)</label>
                <input name="studentName" value={form.studentName} onChange={handleChange} /></div>
              <div className="grid grid-2">
                <div className="field"><label>Date</label>
                  <input name="date" placeholder="10 July" value={form.date} onChange={handleChange} /></div>
                <div className="field"><label>Venue</label>
                  <input name="venue" placeholder="College Auditorium" value={form.venue} onChange={handleChange} /></div>
              </div>
              <div className="field"><label>Tone</label>
                <select name="tone" value={form.tone} onChange={handleChange}>
                  <option>Professional</option>
                  <option>Warm</option>
                  <option>Formal</option>
                  <option>Brief</option>
                </select></div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Drafting…' : 'Generate Email'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Draft</h3>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            {result ? (
              <div className="result-box">{result}</div>
            ) : (
              !error && <p className="text-muted" style={{ fontSize: 13 }}>Your generated email will appear here, ready to copy and send.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
