import React from 'react';
import { NavLink } from 'react-router-dom';

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  );
}

export default function Sidebar() {
  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-neutral-weak text-primary-text' : 'text-muted hover:bg-white/2'}`;

  return (
    <aside className="w-20 md:w-64 bg-bg-800 border-r border-neutral-weak p-3 flex flex-col">
      <div className="hidden md:block mb-4">
        <div className="text-accent-blue font-semibold text-xl">COINTRA</div>
        <div className="text-xs text-muted mt-1">AI Crypto Analytics</div>
      </div>

      <nav className="flex-1 space-y-1">
        <NavLink to="/dashboard" className={navItemClass}>
          <IconDashboard />
          <span className="hidden md:inline">Dashboard</span>
        </NavLink>

        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="currentColor" strokeWidth="1.2"/></svg>
          <span className="hidden md:inline">Watchlist</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:bg-white/2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.2"/></svg>
          <span className="hidden md:inline">Alerts</span>
        </a>
      </nav>

      <div className="mt-4">
        <button className="w-full text-left px-4 py-2 rounded-md bg-bg-900 border border-neutral-weak text-sm">Settings</button>
      </div>
    </aside>
  );
}