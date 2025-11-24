import React from 'react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section id="alerts" className="bg-gradient-to-r from-black via-bg-900 to-black py-20">
      <div className="mx-auto max-w-5xl rounded-[40px] border border-accent-orange/30 bg-white/5 p-10 text-center shadow-orange">
        <p className="text-xs uppercase tracking-[0.6em] text-accent-orange">Deploy in minutes</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          Experience AI-native crypto intelligence today
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-muted">
          Plug COINTRA into your trading desk, set adaptive watchlists, and stream smart alerts
          across every messaging stack you rely on.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-full bg-gradient-to-r from-accent-orange to-accent-red px-8 py-3 text-base font-semibold text-bg-900 shadow-orange transition-transform duration-200 hover:scale-105"
          >
            Start Free Trial
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-accent-orange hover:text-accent-orange"
          >
            Explore Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

