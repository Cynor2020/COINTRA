import React from 'react';
import { motion } from 'framer-motion';

const predictions = [
  { asset: 'BTC', up: 68, down: 32, risk: 'Low', window: '4H' },
  { asset: 'ETH', up: 54, down: 46, risk: 'Medium', window: '1H' },
  { asset: 'SOL', up: 32, down: 68, risk: 'High', window: '30m' },
];

const alerts = [
  { title: 'Whale accumulation detected', detail: '42M USDT inflow on Binance', time: '2m ago' },
  { title: 'Funding squeeze', detail: 'Perp funding > 0.08%', time: '7m ago' },
  { title: 'DeFi spillover', detail: 'LST collateral risk rising', time: '15m ago' },
];

export default function Insights() {
  return (
    <section id="predictions" className="border-t border-white/5 bg-bg-900/80 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-bg-900 to-black p-6 shadow-soft-glow"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">AI Probability Matrix</h3>
            <span className="text-xs uppercase tracking-widest text-accent-orange">Live</span>
          </div>
          <div className="space-y-4">
            {predictions.map((row) => (
              <div key={row.asset} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-muted">
                  <p>{row.asset} • Window {row.window}</p>
                  <p className="text-white">Risk: {row.risk}</p>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xl font-semibold text-white">
                  <span className="text-accent-green">{row.up}% up</span>
                  <span className="text-xs uppercase tracking-[0.4em] text-muted">vs</span>
                  <span className="text-accent-red">{row.down}% down</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-red"
                    style={{ width: `${row.up}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-accent-orange/20 bg-gradient-to-br from-accent-orange/15 to-bg-900 p-6 shadow-orange"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Alert Stack</h3>
            <p className="text-xs uppercase tracking-[0.5em] text-white/70">#alerts</p>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.title} className="rounded-2xl border border-white/10 bg-bg-900/60 p-4">
                <p className="text-sm font-semibold text-white">{alert.title}</p>
                <p className="text-xs text-muted">{alert.detail}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-accent-orange">{alert.time}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.5em] text-white/70">
            Alerts route to Slack • Telegram • Webhooks
          </p>
        </motion.div>
      </div>
    </section>
  );
}

