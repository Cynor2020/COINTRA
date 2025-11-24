import React from 'react';
import { Brain, Bell, Shield, Star, Crown, Flag } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Up/Down Prediction",
      description: "68% chance BTC goes up in next 24h",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Bell,
      title: "Smart Real-time Alerts",
      description: "Get notified before big moves",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Risk Scoring Engine",
      description: "Low/Medium/High risk per coin",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Personal Watchlist",
      description: "Track your favorite coins",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Crown,
      title: "Zero Ads Premium",
      description: "Clean experience with Yearly plan",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Flag,
      title: "Made in India",
      description: "Built by Sarthak Gadakh",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to make smarter crypto trading decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="glass-card rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-orange-500/50"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;