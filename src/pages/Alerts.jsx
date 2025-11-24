import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Star, Bell, Sparkles, LogOut, ArrowUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAlerts } from '../hooks/useAlerts';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Alerts = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { alerts, loading, error, fetchAlerts, deleteAlert } = useAlerts();

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleLogout = () => {
    logout();
    // Don't navigate here, let ProtectedRoute handle it
  };

  const clearAllAlerts = async () => {
    // In a real implementation, you would delete all alerts from the backend
    // For now, we'll just refresh the alerts
    fetchAlerts();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#05071a]">
      {/* Background Glows */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#0a0e17] to-[#0f172a]/90 pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      
      {/* Content Container - This will scroll */}
      <div className="relative z-10">
        {/* Use shared Header component */}
        <Header />
      
        <div className="relative z-10 max-w-none mx-0 px-0">
          <div className="flex items-center justify-between mb-6 px-4 md:px-6">
            <h1 className="text-2xl font-bold text-white">My Alerts</h1>
            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-12 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl text-center mx-4 md:mx-6">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-gray-400 h-16 w-16 mb-4"></div>
                <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-400 rounded w-1/2"></div>
              </div>
            </div>
          ) : error ? (
            <div className="glass-card rounded-2xl p-12 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl text-center mx-4 md:mx-6">
              <div className="text-red-500 mb-4">Error: {error}</div>
              <button
                onClick={fetchAlerts}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Retry
              </button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl text-center mx-4 md:mx-6">
              <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Alerts Yet</h2>
              <p className="text-gray-400 mb-6">Set price alerts on coin detail pages to track your favorite cryptocurrencies.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Browse Coins
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 border border-white/10 backdrop-blur-xl bg-white/5 shadow-xl mx-4 md:mx-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coin</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Target Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {alerts.map((alert) => (
                      <tr key={alert._id} className="hover:bg-white/5">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{alert.coinName}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            ${alert.targetPrice?.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            alert.status === 'triggered' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(alert.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Alerts;