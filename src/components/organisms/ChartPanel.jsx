// src/components/organisms/ChartPanel.jsx
import React from 'react';

export default function ChartPanel({ title, children }) {
  return (
    <section className="bg-bg-900 rounded-2xl p-4 border border-neutral-weak shadow-neon">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-primary-text">{title}</h3>
        <div className="text-xs text-muted">1H • 4H • 1D • 1W</div>
      </div>
      <div className="h-72">{children}</div>
    </section>
  );
}