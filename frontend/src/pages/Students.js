import React, { useEffect, useState } from 'react';
import Topbar from '../components/Topbar';
import ReadinessRing from '../components/ReadinessRing';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FALLBACK = [
  { _id: '1', name: 'Aarav Sharma', rollNo: 'CSE21001', department: 'CSE', cgpa: 8.7, skills: ['Java', 'React', 'MongoDB'], placementStatus: 'Placed' },
  { _id: '2', name: 'Diya Nair', rollNo: 'ECE21014', department: 'ECE', cgpa: 7.9, skills: ['Python', 'ML'], placementStatus: 'Pending' },
  { _id: '3', name: 'Karthik Iyer', rollNo: 'CSE21032', department: 'CSE', cgpa: 6.8, skills: ['C++'], placementStatus: 'Not Placed' },
  { _id: '4', name: 'Sneha Reddy', rollNo: 'IT21008', department: 'IT', cgpa: 9.1, skills: ['Java', 'AWS', 'React'], placementStatus: 'Placed' },
];

const pillClass = (status) =>
  status === 'Placed' ? 'pill pill-placed' : status === 'Pending' ? 'pill pill-pending' : 'pill pill-notplaced';

const readiness = (s) => {
  // simple demo heuristic: cgpa weight + skill count weight
  const cgpaScore = Math.min((s.cgpa / 10) * 70, 70);
  const skillScore = Math.min((s.skills?.length || 0) * 10, 30);
  return Math.round(cgpaScore + skillScore);
};

export default function Students() {
  const { isCoordinator } = useAuth();
  const [students, setStudents] = useState(FALLBACK);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', rollNo: '', email: '', password: '', department: 'CSE',
    graduationYear: 2026, cgpa: '', skills: '',
  });

  useEffect(() => {
    api.get('/students').then((res) => {
      if (res.data?.length) setStudents(res.data);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) };
    try {
      const { data } = await api.post('/students', payload);
      setStudents([data, ...students]);
      setShowForm(false);
    } catch {
      // demo fallback if backend isn't running
      setStudents([{ ...payload, _id: Date.now().toString(), placementStatus: 'Not Placed' }, ...students]);
      setShowForm(false);
    }
  };

  return (
    <>
      <Topbar
        eyebrow="Directory"
        title="Students"
        action={isCoordinator && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : '+ Add Student'}
          </button>
        )}
      />
      <div className="page-content">
        {!isCoordinator && (
          <p className="text-muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
            You're viewing this directory as a student. Adding, editing, or deleting records is limited to placement coordinators.
          </p>
        )}
        {showForm && isCoordinator && (
          <div className="card mb-0" style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>New student record</h3>
            <form onSubmit={handleAdd}>
              <div className="grid grid-3">
                <div className="field"><label>Full name</label>
                  <input name="name" required value={form.name} onChange={handleChange} /></div>
                <div className="field"><label>Roll number</label>
                  <input name="rollNo" required value={form.rollNo} onChange={handleChange} /></div>
                <div className="field"><label>Department</label>
                  <select name="department" value={form.department} onChange={handleChange}>
                    <option>CSE</option><option>ECE</option><option>IT</option>
                    <option>MECH</option><option>EEE</option><option>CIVIL</option>
                  </select></div>
                <div className="field"><label>Email</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} /></div>
                <div className="field"><label>Password</label>
                  <input type="password" name="password" required value={form.password} onChange={handleChange} /></div>
                <div className="field"><label>Graduation year</label>
                  <input type="number" name="graduationYear" value={form.graduationYear} onChange={handleChange} /></div>
                <div className="field"><label>CGPA</label>
                  <input type="number" step="0.01" name="cgpa" required value={form.cgpa} onChange={handleChange} /></div>
                <div className="field" style={{ gridColumn: 'span 2' }}><label>Skills (comma separated)</label>
                  <input name="skills" placeholder="Java, React, MongoDB" value={form.skills} onChange={handleChange} /></div>
              </div>
              <button className="btn btn-primary" type="submit">Save student</button>
            </form>
          </div>
        )}

        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Readiness</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{s.rollNo}</div>
                  </td>
                  <td>{s.department}</td>
                  <td className="mono">{s.cgpa}</td>
                  <td>
                    <div className="flex-wrap gap-8">
                      {(s.skills || []).map((sk) => (
                        <span className="pill pill-skill" key={sk}>{sk}</span>
                      ))}
                    </div>
                  </td>
                  <td><span className={pillClass(s.placementStatus)}>{s.placementStatus}</span></td>
                  <td>
                    <ReadinessRing percent={readiness(s)} size={48} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
