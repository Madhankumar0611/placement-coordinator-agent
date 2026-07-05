import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import api from '../services/api';

const FALLBACK_STATS = {
  totalStudents: 186,
  eligibleStudents: 142,
  placedStudents: 63,
  pendingStudents: 31,
  notPlaced: 92,
  companyWise: [
    { companyName: 'TCS', count: 18 },
    { companyName: 'Infosys', count: 14 },
    { companyName: 'Zoho', count: 11 },
    { companyName: 'Cognizant', count: 9 },
    { companyName: 'Wipro', count: 7 },
  ],
};

const FALLBACK_DRIVES = [
  { companyName: 'Zoho', date: '08 Jul', role: 'SDE Intern', status: 'upcoming' },
  { companyName: 'TCS Digital', date: '12 Jul', role: 'Software Engineer', status: 'upcoming' },
  { companyName: 'Infosys', date: '02 Jul', role: 'Systems Engineer', status: 'completed' },
  { companyName: 'Cognizant', date: '28 Jun', role: 'GenC', status: 'completed' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [drives, setDrives] = useState(FALLBACK_DRIVES);

  useEffect(() => {
    api
      .get('/placements/stats/summary')
      .then((res) => setStats(res.data))
      .catch(() => setStats(FALLBACK_STATS));

    api
      .get('/companies')
      .then((res) => {
        const mapped = res.data.slice(0, 5).map((c) => ({
          companyName: c.companyName,
          date: c.interviewDate
            ? new Date(c.interviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
            : 'TBD',
          role: c.role || '—',
          status: c.driveStatus === 'Completed' ? 'completed' : 'upcoming',
        }));
        if (mapped.length) setDrives(mapped);
      })
      .catch(() => setDrives(FALLBACK_DRIVES));
  }, []);

  return (
    <>
      <Topbar eyebrow="Overview" title="Placement Dashboard" />
      <div className="page-content">
        <div className="grid grid-4">
          <StatCard label="Total Students" value={stats.totalStudents} />
          <StatCard label="Eligible Students" value={stats.eligibleStudents} delta="Across all drives" deltaType="up" />
          <StatCard label="Placed Students" value={stats.placedStudents} delta="+ this semester" deltaType="up" />
          <StatCard label="Pending Interviews" value={stats.pendingStudents} delta="Awaiting result" deltaType="warn" />
        </div>

        <div className="grid grid-3 mt-24" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 10 }}>
              <h3 style={{ fontSize: 15 }}>Company-wise Placements</h3>
              <span className="text-muted" style={{ fontSize: 12 }}>Selected offers</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.companyWise}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceefa" vertical={false} />
                <XAxis dataKey="companyName" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(91,95,239,0.06)' }} />
                <Bar dataKey="count" fill="#5b5fef" radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ fontSize: 15, marginBottom: 16 }}>Drive Timeline</h3>
            <div className="drive-rail">
              {drives.map((d, i) => (
                <div className={`drive-item ${d.status}`} key={i}>
                  <div className="drive-date">{d.date}</div>
                  <div className="drive-name">{d.companyName}</div>
                  <div className="drive-meta">{d.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
