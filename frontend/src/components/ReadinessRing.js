import React from 'react';

// A small radial progress ring used to show a student's eligibility /
// readiness percentage at a glance. Color shifts with the score band.
export default function ReadinessRing({ percent = 0, size = 74 }) {
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  let color = 'var(--danger)';
  if (percent >= 80) color = 'var(--accent-2)';
  else if (percent >= 50) color = 'var(--warning)';

  return (
    <div className="readiness-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="ring-value">{percent}%</div>
    </div>
  );
}
