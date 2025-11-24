import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
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
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information you provide directly to us when you create an account, use our services, 
                or communicate with us. This may include your name, email address, and payment information.
              </p>
              <p className="text-gray-300">
                We also collect information automatically when you use our services, such as your IP address, 
                browser type, operating system, and usage data.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send transaction confirmations</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent. We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Service providers who assist us in operating our platform</li>
                <li>Payment processors to facilitate transactions</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your explicit consent</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-300">
                We implement industry-standard security measures to protect your personal information. 
                However, no method of transmission over the internet or electronic storage is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p className="text-gray-300 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Access and update your personal information</li>
                <li>Delete your personal information</li>
                <li>Object to or restrict the processing of your personal information</li>
                <li>Request a copy of your personal information</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
              <p className="text-gray-300">
                We use cookies and similar tracking technologies to track activity on our services 
                and store certain information. You can instruct your browser to refuse all cookies 
                or to indicate when a cookie is being sent.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
              <p className="text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:privacy@cointra.com" className="text-orange-500 hover:text-orange-400 transition-colors duration-200">
                  privacy@cointra.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}