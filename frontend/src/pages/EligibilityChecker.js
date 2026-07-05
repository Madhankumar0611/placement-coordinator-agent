import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';

export default function EligibilityChecker() {
  const [form, setForm] = useState({
    studentName: '', cgpa: '', department: 'CSE', arrears: 0, skills: '',
    companyName: '', minCgpa: '', maxArrears: 0, requiredSkills: '',
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
      // Direct-prompt variant so this works even without pre-saved student/company IDs.
      const prompt = `You are an experienced Placement Officer.

Student: ${form.studentName}
CGPA: ${form.cgpa}
Department: ${form.department}
Arrears: ${form.arrears}
Skills: ${form.skills}

Company: ${form.companyName}
Minimum CGPA: ${form.minCgpa}
Max Arrears Allowed: ${form.maxArrears}
Required Skills: ${form.requiredSkills}

Check eligibility step by step (CGPA, arrears, skills) and give a final verdict:
Eligible or Not Eligible, with a short explanation. If not eligible, suggest improvements.`;

      const { data } = await api.post('/ai/chat', { user: 'coordinator', question: prompt });
      setResult(data.answer);
    } catch (err) {
      setError('Could not reach the AI service. Check that the backend is running and GEMINI_API_KEY is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topbar eyebrow="AI Tool" title="Eligibility Checker" />
      <div className="page-content">
        <div className="grid grid-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Enter details</h3>
            <form onSubmit={handleSubmit}>
              <div className="field"><label>Student name</label>
                <input name="studentName" value={form.studentName} onChange={handleChange} required /></div>
              <div className="grid grid-2">
                <div className="field"><label>CGPA</label>
                  <input type="number" step="0.01" name="cgpa" value={form.cgpa} onChange={handleChange} required /></div>
                <div className="field"><label>Arrears</label>
                  <input type="number" name="arrears" value={form.arrears} onChange={handleChange} /></div>
              </div>
              <div className="field"><label>Department</label>
                <select name="department" value={form.department} onChange={handleChange}>
                  <option>CSE</option><option>ECE</option><option>IT</option><option>MECH</option><option>EEE</option>
                </select></div>
              <div className="field"><label>Skills (comma separated)</label>
                <input name="skills" placeholder="Java, React, MongoDB" value={form.skills} onChange={handleChange} /></div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '18px 0' }} />

              <div className="field"><label>Company name</label>
                <input name="companyName" value={form.companyName} onChange={handleChange} required /></div>
              <div className="grid grid-2">
                <div className="field"><label>Minimum CGPA required</label>
                  <input type="number" step="0.01" name="minCgpa" value={form.minCgpa} onChange={handleChange} required /></div>
                <div className="field"><label>Max arrears allowed</label>
                  <input type="number" name="maxArrears" value={form.maxArrears} onChange={handleChange} /></div>
              </div>
              <div className="field"><label>Required skills (comma separated)</label>
                <input name="requiredSkills" placeholder="Java, React" value={form.requiredSkills} onChange={handleChange} /></div>

              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? 'Checking…' : 'Check Eligibility'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Result</h3>
            {error && <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>}
            {result ? (
              <div className="result-box">{result}</div>
            ) : (
              !error && <p className="text-muted" style={{ fontSize: 13 }}>Fill the form and run the check to see the AI's verdict here.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
