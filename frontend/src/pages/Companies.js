import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FALLBACK = [
  { _id: '1', companyName: 'Zoho', role: 'SDE Intern', packageLPA: 6.5, cgpaCriteria: 7.5, requiredSkills: ['Java', 'DBMS'], interviewDate: '2026-07-08', driveStatus: 'Upcoming' },
  { _id: '2', companyName: 'TCS Digital', role: 'Software Engineer', packageLPA: 7, cgpaCriteria: 7.0, requiredSkills: ['Java', 'React'], interviewDate: '2026-07-12', driveStatus: 'Upcoming' },
  { _id: '3', companyName: 'Infosys', role: 'Systems Engineer', packageLPA: 4.5, cgpaCriteria: 6.5, requiredSkills: ['Any'], interviewDate: '2026-07-02', driveStatus: 'Completed' },
];

export default function Companies() {
  const { isCoordinator } = useAuth();
  const [companies, setCompanies] = useState(FALLBACK);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    companyName: '', role: '', packageLPA: '', cgpaCriteria: '',
    requiredSkills: '', interviewDate: '',
  });

  useEffect(() => {
    api.get('/companies').then((res) => {
      if (res.data?.length) setCompanies(res.data);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      const { data } = await api.post('/companies', payload);
      setCompanies([data, ...companies]);
      setShowForm(false);
    } catch {
      setCompanies([{ ...payload, _id: Date.now().toString(), driveStatus: 'Upcoming' }, ...companies]);
      setShowForm(false);
    }
  };

  return (
    <>
      <Topbar
        eyebrow="Drives"
        title="Company Drives"
        action={isCoordinator && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : '+ Add Company'}
          </button>
        )}
      />
      <div className="page-content">
        {!isCoordinator && (
          <p className="text-muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
            You're viewing drives as a student. Adding or editing drives is limited to placement coordinators.
          </p>
        )}
        {showForm && isCoordinator && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>New drive</h3>
            <form onSubmit={handleAdd}>
              <div className="grid grid-3">
                <div className="field"><label>Company name</label>
                  <input name="companyName" required value={form.companyName} onChange={handleChange} /></div>
                <div className="field"><label>Role</label>
                  <input name="role" value={form.role} onChange={handleChange} /></div>
                <div className="field"><label>Package (LPA)</label>
                  <input type="number" step="0.1" name="packageLPA" required value={form.packageLPA} onChange={handleChange} /></div>
                <div className="field"><label>Min CGPA</label>
                  <input type="number" step="0.1" name="cgpaCriteria" required value={form.cgpaCriteria} onChange={handleChange} /></div>
                <div className="field"><label>Interview date</label>
                  <input type="date" name="interviewDate" value={form.interviewDate} onChange={handleChange} /></div>
                <div className="field"><label>Required skills (comma separated)</label>
                  <input name="requiredSkills" placeholder="Java, React" value={form.requiredSkills} onChange={handleChange} /></div>
              </div>
              <button className="btn btn-primary" type="submit">Save drive</button>
            </form>
          </div>
        )}

        <div className="grid grid-3">
          {companies.map((c) => (
            <div className="card" key={c._id}>
              <div className="flex-between">
                <h3 style={{ fontSize: 16 }}>{c.companyName}</h3>
                <span className={`pill ${c.driveStatus === 'Completed' ? 'pill-placed' : 'pill-pending'}`}>
                  {c.driveStatus}
                </span>
              </div>
              <p style={{ fontSize: 13 }}>{c.role}</p>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span className="text-muted" style={{ fontSize: 12 }}>Package</span>
                <span className="mono">{c.packageLPA} LPA</span>
              </div>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <span className="text-muted" style={{ fontSize: 12 }}>Min CGPA</span>
                <span className="mono">{c.cgpaCriteria}</span>
              </div>
              <div className="flex-between" style={{ marginBottom: 12 }}>
                <span className="text-muted" style={{ fontSize: 12 }}>Interview date</span>
                <span className="mono">{c.interviewDate ? new Date(c.interviewDate).toLocaleDateString('en-GB') : 'TBD'}</span>
              </div>
              <div className="flex-wrap gap-8">
                {(c.requiredSkills || []).map((sk) => (
                  <span className="pill pill-skill" key={sk}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
