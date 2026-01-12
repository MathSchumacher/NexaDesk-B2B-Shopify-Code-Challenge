// Live Activity Pulse Component
// Developer: Matheus Schumacher | 2026

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './LiveActivityPulse.css';

export const LiveActivityPulse = () => {
  const { state } = useApp();

  return (
    <motion.div 
      className="live-activity-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <motion.span 
        className="pulse-dot"
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <Activity size={14} />
      <span className="pulse-text">
        Live: <strong>{state.syncCount.toLocaleString()}</strong> orders synced today
      </span>
    </motion.div>
  );
};
