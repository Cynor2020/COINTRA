import React from 'react';
import { Link } from 'react-router-dom';
import { createRazorpayOrder, openRazorpayCheckout } from '../services/razorpay';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const Pricing = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      description: 'Perfect for getting started',
      features: [
        'Basic market data',
        'Limited AI predictions',
        'Basic alerts',
        'Ad-supported experience'
      ],
      popular: false,
      buttonText: 'Start Free',
      buttonStyle: 'bg-gradient-to-r from-gray-600 to-gray-700'
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: 299,
      description: 'Full access for 30 days',
      features: [
        'Full market data access',
        'Advanced AI predictions',
        'Smart alerts',
        'No advertisements',
        'Priority support'
      ],
      popular: false,
      buttonText: 'Get Started',
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 1999,
      description: 'Best value - Save 40%',
      features: [
        'Everything in Monthly',
        'Premium AI predictions',
        'Custom alerts',
        'Early access to new features',
        '24/7 dedicated support'
      ],
      popular: true,
      buttonText: 'Get Started',
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-orange-600'
    }
  ];

  const handleSubscribe = async (plan) => {
    if (plan.id === 'free') {
      // Redirect to signup for free plan
      window.location.href = '/signup';
      return;
    }

    try {
      const orderDetails = await createRazorpayOrder(plan.price, plan.name);
      openRazorpayCheckout(
        orderDetails,
        plan.name,
        (response, planName) => {
          toast.success(`Successfully subscribed to ${planName}!`);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#ef4444', '#34c65e'],
          });
        },
        (error) => {
          toast.error(error || 'Payment failed');
        }
      );
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  return (
    <section id="pricing" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your crypto trading journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`glass-card rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.02] hover:border-orange-500/50 relative ${
                plan.popular ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  {plan.price === 0 ? (
                    <p className="text-5xl font-bold text-white">Free</p>
                  ) : (
                    <>
                      <p className="text-5xl font-bold text-white">${plan.price}</p>
                      <p className="text-gray-400 mt-1">
                        {plan.id === 'monthly' ? '/month' : '/year'}
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-3 font-semibold rounded-lg transition-all hover:scale-105 ${plan.buttonStyle} text-white`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;