import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

export default function ResumeReviewer() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');
    try {
      const { data } = await api.post('/ai/resume-review', { resumeText });
      setResult(data.result);
    } catch {
      setError('Could not reach the AI service. Check that the backend is running and GEMINI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar eyebrow="AI Tool" title="Resume Reviewer" />
      <div className="page-content">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 6 }}>Paste resume text</h3>
            <p style={{ fontSize: 12.5, marginBottom: 14 }}>
              Copy the text content of the resume (or a summary of experience/skills/education) below.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <textarea
                  rows={16}
                  required
                  placeholder="Paste resume content here…"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Reviewing…' : 'Review Resume'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>AI feedback</h3>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            {result ? (
              <div className="result-box">{result}</div>
            ) : (
              !error && <p className="text-muted" style={{ fontSize: 13 }}>Submit a resume to see the score, ATS check, and suggestions here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
