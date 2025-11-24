import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const highlights = [
  { label: 'Tracked Assets', value: '1,200+' },
  { label: 'AI Signals / day', value: '8.4M' },
  { label: 'Alert Latency', value: '<180ms' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),_transparent_55%)]" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-accent-orange">
            AI Crypto Radar
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
            COINTRA – AI Based Crypto Market Analytics Platform
          </h1>
          <p className="text-base text-muted md:text-lg">
            Monitor every tick, decode sentiment, and predict risk in milliseconds.
            Our neural models synthesize order flow, macro news, and on-chain momentum to deliver
            actionable calls before the market reacts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent-orange to-accent-red px-8 py-3 text-base font-semibold text-bg-900 shadow-orange transition-transform duration-200 hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3 text-base font-semibold text-white transition-colors duration-200 hover:border-accent-orange hover:text-accent-orange"
            >
              Launch App
            </Link>
          </div>
          <div className="grid gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-wider text-muted">{item.label}</p>
                <p className="text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-bg-800 to-bg-900 p-6 text-sm text-muted shadow-neon"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-white">Live Pulse</p>
            <span className="rounded-full bg-accent-orange/20 px-3 py-1 text-xs text-accent-orange">Streaming</span>
          </div>
          <div className="space-y-4">
            {['BTC/USDT', 'ETH/USDT', 'SOL/USDT'].map((pair, idx) => (
              <div key={pair} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base text-white">{pair}</p>
                  <p className="text-sm text-accent-green">{idx % 2 === 0 ? '+2.14%' : '-0.42%'}</p>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {idx === 0 ? '$61,842' : idx === 1 ? '$3,198' : '$142'}
                </p>
                <p className="text-xs text-muted">AI Risk: {idx === 0 ? 'Low' : idx === 1 ? 'Moderate' : 'High'}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-accent-orange/20 bg-accent-orange/10 p-4 text-left">
            <p className="text-xs uppercase tracking-wide text-accent-orange">AI Sentiment</p>
            <p className="text-xl font-semibold text-white">68% Upside probability next 4H</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

