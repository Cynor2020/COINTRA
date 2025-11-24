import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, BellRing, ShieldHalf } from 'lucide-react';

const features = [
  {
    title: 'Real-time Market Radar',
    description: 'Millisecond-level book tracking across top exchanges with volatility clustering.',
    icon: Activity,
  },
  {
    title: 'AI Probability Engine',
    description: 'Transformer ensemble predicts up/down probability and assigns risk tiers.',
    icon: Zap,
  },
  {
    title: 'Smart Alerts',
    description: 'Context-aware alerts that blend technical, on-chain and sentiment cues.',
    icon: BellRing,
  },
  {
    title: 'Institutional Watchlists',
    description: 'Segment portfolios, simulate hedges, and broadcast desk-ready intel.',
    icon: ShieldHalf,
  },
  {
    title: 'Live Price Tracking',
    description: 'Real-time cryptocurrency prices from Binance WebSocket with instant updates.',
    icon: Activity,
  },
  {
    title: 'Advanced Analytics',
    description: 'Comprehensive market analysis with historical data and trend predictions.',
    icon: Zap,
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="border-y border-white/5 bg-bg-900/60 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-orange">Capabilities</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
            Built for desks that can’t afford lag
          </h2>
          <p className="mt-3 text-muted md:text-lg">
            Every surface is modular. Drag, re-order, and automate the metrics that matter.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-bg-800 to-bg-900 p-6 shadow-soft-glow transition hover:border-accent-orange/40 hover:shadow-orange"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-orange/20 text-accent-orange">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

