import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const plans = [
  {
    title: 'Free Trial',
    price: '$0',
    cadence: '7 days',
    badge: 'Start here',
    features: ['Limited watchlist', 'Basic alerts', 'AI sentiment snapshots'],
  },
  {
    title: 'Monthly',
    price: '$299',
    cadence: '/mo',
    featured: true,
    features: [
      'Unlimited assets',
      'AI probability engine',
      'Real-time alerts',
      'Price charts',
    ],
  },
  {
    title: 'Yearly',
    price: '$1,999',
    cadence: '/yr',
    features: ['Save 45%', 'All Monthly features', 'Priority support', 'Advanced analytics'],
  },
  {
    title: 'PRO',
    price: '$3,499',
    cadence: '/yr',
    badge: 'Most Advanced',
    features: [
      'All Yearly features',
      'Custom model tuning',
      'API access',
      'Dedicated support',
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gradient-to-b from-bg-900 to-black py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-accent-orange">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Pick your edge</h2>
          <p className="mt-3 text-muted md:text-lg">
            Flexible plans for individuals, quant funds, and trading desks.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`rounded-3xl border border-white/10 p-6 text-left shadow-soft-glow ${
                plan.featured ? 'bg-white/10 backdrop-blur-lg shadow-orange' : 'bg-bg-900/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-muted">{plan.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">
                    {plan.price}
                    <span className="text-base font-normal text-muted">{plan.cadence}</span>
                  </p>
                </div>
                {plan.badge && (
                  <span className="rounded-full border border-accent-orange/40 bg-accent-orange/10 px-3 py-1 text-xs text-accent-orange">
                    {plan.badge}
                  </span>
                )}
              </div>
              <ul className="mt-6 space-y-3 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-orange" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.price === '$0' ? (
                <Link
                  to="/signup"
                  className={`mt-8 block w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-white text-bg-900 shadow-orange hover:bg-accent-orange hover:text-white'
                      : 'border border-white/10 text-white hover:border-accent-orange hover:text-accent-orange'
                  }`}
                >
                  Get Started
                </Link>
              ) : (
                <button
                  className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-white text-bg-900 shadow-orange hover:bg-accent-orange hover:text-white'
                      : 'border border-white/10 text-white hover:border-accent-orange hover:text-accent-orange'
                  }`}
                >
                  Choose Plan
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

