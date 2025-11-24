// src/hooks/useWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

export default function useWebSocket({ url, onMessage, protocols = [] }) {
  const wsRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const reconnectRef = useRef({ attempts: 0, timeoutId: null });

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    setStatus('connecting');
    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('open');
        reconnectRef.current.attempts = 0;
      };
      ws.onmessage = (ev) => {
        if (onMessage) onMessage(ev.data);
      };
      ws.onclose = () => {
        setStatus('closed');
        // reconnect with exponential backoff
        const attempts = ++reconnectRef.current.attempts;
        const delay = Math.min(30000, 1000 * 2 ** attempts);
        reconnectRef.current.timeoutId = setTimeout(connect, delay);
      };
      ws.onerror = () => {
        setStatus('error');
        ws.close();
      };
    } catch (err) {
      setStatus('error');
    }
  }, [url, onMessage, protocols]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current.timeoutId) clearTimeout(reconnectRef.current.timeoutId);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const send = useCallback((msg) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
      return true;
    }
    return false;
  }, []);

  return { status, send };
}