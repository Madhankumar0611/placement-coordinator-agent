import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COORDINATOR_ONLY = new Set(['/students', '/companies', '/email-generator']);

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/companies', label: 'Company Drives' },
  { to: '/eligibility', label: 'Eligibility Checker' },
  { to: '/resume-review', label: 'Resume Reviewer' },
  { to: '/interview-questions', label: 'Interview Questions' },
  { to: '/email-generator', label: 'Email Generator' },
  { to: '/chatbot', label: 'Student Chatbot' },
];

export default function Sidebar() {
  const { user, isCoordinator, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = links.filter((l) => isCoordinator || !COORDINATOR_ONLY.has(l.to));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark">DH</div>
        <div>
          <div className="name">Drivehouse</div>
          <div className="tag">Placement Cell</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            <span className="dot" />
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="flex-between" style={{ marginBottom: 10 }}>
          <div>
            Signed in as{' '}
            <strong style={{ color: '#fff' }}>{user?.name || 'Guest'}</strong>
            <div style={{ textTransform: 'capitalize' }}>{user?.role || ''}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-block"
          style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)', fontSize: 12.5 }}
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
