import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';
import './AISummary.css';

interface AISummaryProps {
  emailCount: number;
  customerName: string;
  mainTopic?: string;
}

export const AISummary = ({ emailCount, customerName, mainTopic = 'solicitação de suporte' }: AISummaryProps) => {
  return (
    <motion.div 
      className="ai-summary"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ai-summary-header">
        <div className="ai-icon">
          <Sparkles size={14} />
        </div>
        <span className="ai-label">Resumo AI</span>
      </div>
      <p className="ai-summary-text">
        Thread com <strong>{emailCount} mensagens</strong> de <strong>{customerName}</strong> sobre {mainTopic}. 
        O cliente aguarda resposta há 2 dias. Prioridade sugerida: <span className="priority-high">Alta</span>.
      </p>
    </motion.div>
  );
};

// AI Tags for emails
export type AITagType = 'refund' | 'net30' | 'high-value' | 'urgent' | 'question' | 'feedback';

interface AITagProps {
  type: AITagType;
}

const tagConfig: Record<AITagType, { label: string; color: string }> = {
  'refund': { label: 'Refund Inquiry', color: '#ef4444' },
  'net30': { label: 'Net 30 Follow-up', color: '#f59e0b' },
  'high-value': { label: 'High Value Account', color: '#8b5cf6' },
  'urgent': { label: 'Urgent', color: '#ef4444' },
  'question': { label: 'Question', color: '#3b82f6' },
  'feedback': { label: 'Feedback', color: '#22c55e' }
};

export const AITag = ({ type }: AITagProps) => {
  const config = tagConfig[type];
  
  return (
    <span 
      className="ai-tag"
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color,
        borderColor: `${config.color}40`
      }}
    >
      <Bot size={10} />
      {config.label}
    </span>
  );
};

// AI Status Indicator
interface AIStatusProps {
  isOnline?: boolean;
  agentCount?: number;
}

export const AIStatusIndicator = ({ isOnline = true, agentCount = 3 }: AIStatusProps) => {
  return (
    <motion.div 
      className={`ai-status-indicator ${isOnline ? 'online' : 'offline'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span 
        className="status-dot"
        animate={isOnline ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="status-text">
        AI: {isOnline ? `${agentCount} Agents Online` : 'Offline'}
      </span>
    </motion.div>
  );
};
