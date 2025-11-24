import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/alerts');
      setAlerts(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new alert
  const createAlert = async (alertData) => {
    try {
      const response = await axios.post('/api/alerts/create', alertData);
      setAlerts(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create alert';
      return { success: false, error: errorMessage };
    }
  };

  // Delete an alert
  const deleteAlert = async (alertId) => {
    try {
      const response = await axios.delete(`/api/alerts/delete/${alertId}`);
      setAlerts(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete alert';
      return { success: false, error: errorMessage };
    }
  };

  // Update alert status
  const updateAlertStatus = async (alertId, status) => {
    try {
      const response = await axios.put(`/api/alerts/status/${alertId}`, { status });
      setAlerts(response.data);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update alert';
      return { success: false, error: errorMessage };
    }
  };

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    deleteAlert,
    updateAlertStatus
  };
};