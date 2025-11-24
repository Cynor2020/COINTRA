import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05071a]">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <Link to="/" className="inline-flex items-center text-orange-500 hover:text-orange-400 mb-8 transition-colors duration-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing or using COINTRA ("the Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300">
                COINTRA is an AI-powered cryptocurrency market analytics platform that provides real-time data, 
                advanced AI predictions, smart alerts, and comprehensive market insights for informed trading decisions. 
                The Service is provided "as is" and is subject to change without notice.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
              <p className="text-gray-300 mb-4">
                To access certain features of the Service, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Payments</h2>
              <p className="text-gray-300 mb-4">
                Our Service offers different subscription plans:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Free Plan: Limited access to basic features</li>
                <li>Monthly Plan: $299/month for full access</li>
                <li>Yearly Plan: $1999/year for full access with savings</li>
              </ul>
              <p className="text-gray-300 mt-4">
                All payments are processed through Razorpay. You agree to pay all fees associated with your 
                subscription plan. All fees are non-refundable except as required by law.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Use of Service</h2>
              <p className="text-gray-300 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the Service for any illegal purposes</li>
                <li>Reverse engineer or attempt to extract the source code</li>
                <li>Use the Service to transmit viruses or other harmful code</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Attempt to gain unauthorized access to the Service</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300">
                The Service and its original content, features, and functionality are and will remain the 
                exclusive property of COINTRA and its licensors. The Service is protected by copyright, 
                trademark, and other laws of both India and foreign countries.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-300">
                The Service is provided on an "as is" and "as available" basis. COINTRA expressly disclaims 
                all warranties of any kind, whether express or implied, including, but not limited to, the 
                implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-300">
                In no event shall COINTRA, nor its directors, employees, partners, agents, suppliers, or 
                affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including without limitation, loss of profits, data, use, goodwill, or other 
                intangible losses, resulting from your access to or use of, or inability to access or use 
                the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                We will provide notice of any significant changes by updating the "Last updated" date at the 
                top of this page.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about these Terms, please contact us at:{' '}
                <a href="mailto:terms@cointra.com" className="text-orange-500 hover:text-orange-400 transition-colors duration-200">
                  terms@cointra.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}