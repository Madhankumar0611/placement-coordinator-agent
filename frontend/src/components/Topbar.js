import React from 'react';

export default function Topbar({ eyebrow, title, action }) {
  return (
    <div className="topbar">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 style={{ marginTop: 4 }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
