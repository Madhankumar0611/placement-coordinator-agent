import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

export default function InterviewQuestions() {
  const [form, setForm] = useState({ companyName: '', topic: 'Java', count: 15 });
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
      const { data } = await api.post('/ai/interview-questions', form);
      setResult(data.result);
    } catch {
      setError('Could not reach the AI service. Check that the backend is running and GEMINI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar eyebrow="AI Tool" title="Interview Question Generator" />
      <div className="page-content">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Generate a question set</h3>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Company</label>
                <input name="companyName" placeholder="TCS, Infosys, Zoho…" value={form.companyName} onChange={handleChange} required /></div>
              <div className="field"><label>Topic</label>
                <input name="topic" placeholder="Java, DBMS, React, Aptitude…" value={form.topic} onChange={handleChange} /></div>
              <div className="field"><label>Number of questions</label>
                <input type="number" name="count" value={form.count} onChange={handleChange} /></div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Generating…' : 'Generate Questions'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Question set</h3>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            {result ? (
              <div className="result-box">{result}</div>
            ) : (
              !error && <p className="text-muted" style={{ fontSize: 13 }}>Generated questions, grouped by difficulty, will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
