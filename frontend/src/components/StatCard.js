import React from 'react';

export default function StatCard({ label, value, delta, deltaType = 'up' }) {
  return (
    <div className="card stat-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={`delta ${deltaType}`}>{delta}</div>}
    </div>
  );
}
