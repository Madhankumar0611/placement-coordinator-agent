import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    n: '01',
    title: 'Eligibility, explained',
    body: 'Checks CGPA, arrears, department and skills against every drive, and tells students exactly what to fix if they fall short.',
  },
  {
    n: '02',
    title: 'Resume review in seconds',
    body: 'Scores resumes for ATS compatibility, flags missing skills, and suggests concrete rewrites — before recruiters ever see them.',
  },
  {
    n: '03',
    title: 'Interview prep on demand',
    body: 'Generates company-specific question sets across easy, medium and hard difficulty, so no student walks in unprepared.',
  },
  {
    n: '04',
    title: 'A chatbot that knows the drive calendar',
    body: 'Students ask about eligibility, packages, or the next drive, and get answers pulled from live placement data.',
  },
];

export default function Landing() {
  return (
    <div>
      <section className="hero">
        <div className="hero-eyebrow">AI Placement Coordinator</div>
        <h1>Every drive, every student, one steady rail.</h1>
        <p className="lead">
          Drivehouse tracks eligibility, reviews resumes, drafts interview questions and
          answers student questions — so your placement cell spends less time on
          spreadsheets and more time closing offers.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn btn-primary">Open Dashboard</Link>
          <Link to="/login" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
            Sign in
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>Built around the drive, not the spreadsheet</h2>
        <p style={{ maxWidth: 560, marginBottom: 30 }}>
          Placements move in a sequence — a company opens a drive, students clear rounds,
          offers land. The whole product is organized around that rhythm.
        </p>
        <div className="grid grid-2">
          {features.map((f) => (
            <div className="feature-card" key={f.n}>
              <div className="num">{f.n}</div>
              <h3 style={{ fontSize: 16 }}>{f.title}</h3>
              <p style={{ marginBottom: 0, fontSize: 13.5 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
