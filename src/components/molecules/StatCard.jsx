// src/components/molecules/StatCard.jsx
import React from 'react';

export default function StatCard({ title, value, change, trend, probability }) {
  const trendClass = trend === 'up' ? 'text-accent-green' : 'text-accent-red';
  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft-glow border border-neutral-weak min-w-[220px]">
      <div className="text-sm text-muted">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-semibold text-primary-text">{value}</div>
        <div className={`text-sm font-medium ${trendClass}`}>{change}</div>
      </div>
      <div className="mt-2 text-xs text-muted">
        Probability: <span className="text-primary-text font-medium">{probability ?? '—'}</span>
      </div>
    </div>
  );
}