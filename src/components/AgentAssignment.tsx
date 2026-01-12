// Agent Assignment Component
// Developer: Matheus Schumacher | 2026

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { teamMembers } from '../data/companies';
import './AgentAssignment.css';

interface AgentAssignmentProps {
  currentAgent?: { id: string; name: string } | null;
  onAssign: (agentId: string, agentName: string) => void;
}

export const AgentAssignment = ({ currentAgent, onAssign }: AgentAssignmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAssign = (agent: typeof teamMembers[0]) => {
    onAssign(agent.id, agent.name);
    setIsOpen(false);
    toast.success(`Atribuído para ${agent.name}`, {
      description: agent.role
    });
  };

  return (
    <div className="agent-assignment" ref={dropdownRef}>
      <button 
        className={`assignment-trigger ${currentAgent ? 'assigned' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentAgent ? (
          <>
            <div className="assigned-avatar">
              {currentAgent.name.charAt(0)}
            </div>
            <span>{currentAgent.name}</span>
          </>
        ) : (
          <>
            <UserPlus size={14} />
            <span>Atribuir</span>
          </>
        )}
        <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="assignment-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="dropdown-header">Atribuir para:</div>
            {teamMembers.map((agent) => (
              <button
                key={agent.id}
                className={`agent-option ${currentAgent?.id === agent.id ? 'selected' : ''}`}
                onClick={() => handleAssign(agent)}
              >
                <div className="agent-avatar">
                  {agent.name.charAt(0)}
                </div>
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-role">{agent.role}</span>
                </div>
                {currentAgent?.id === agent.id && (
                  <Check size={14} className="check-icon" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
