import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, Building2, TrendingUp } from 'lucide-react';
import { Modal, ModalFooter, Button } from '../ui';
import './RiskScoreModal.css';

interface RiskScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
  customerName: string;
  amount: number;
  isB2B?: boolean;
}

export const RiskScoreModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderId,
  customerName,
  amount,
  isB2B = true
}: RiskScoreModalProps) => {
  // Mock risk assessment
  const riskScore = 15; // Low risk (0-100)
  const riskLevel = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'low': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'high': return 'var(--error)';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel) {
      case 'low': return <CheckCircle size={24} />;
      case 'medium': return <AlertTriangle size={24} />;
      case 'high': return <AlertTriangle size={24} />;
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case 'low': return 'Baixo Risco';
      case 'medium': return 'Risco Moderado';
      case 'high': return 'Alto Risco';
    }
  };

  const getRiskDescription = () => {
    if (isB2B && riskLevel === 'low') {
      return 'Parceiro B2B de longo prazo com histórico positivo. Processamento recomendado.';
    }
    switch (riskLevel) {
      case 'low': return 'Cliente com bom histórico. Baixa probabilidade de fraude.';
      case 'medium': return 'Alguns indicadores requerem atenção. Revisão sugerida.';
      case 'high': return 'Múltiplos indicadores de risco. Revisão manual obrigatória.';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Análise de Risco - AI Agent"
      size="md"
    >
      <div className="risk-modal-content">
        {/* AI Agent Header */}
        <div className="ai-agent-header">
          <div className="agent-icon">
            <Shield size={20} />
          </div>
          <div className="agent-info">
            <span className="agent-name">Risk Agent</span>
            <span className="agent-status">Análise concluída</span>
          </div>
          <div className="agent-badge">
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ● AI Online
            </motion.span>
          </div>
        </div>

        {/* Risk Score Visualization */}
        <div className="risk-score-section">
          <div className="risk-gauge">
            <motion.div 
              className="gauge-fill"
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ backgroundColor: getRiskColor() }}
            />
            <span className="gauge-value" style={{ color: getRiskColor() }}>
              {riskScore}%
            </span>
          </div>
          <div className="risk-label" style={{ color: getRiskColor() }}>
            {getRiskIcon()}
            <span>{getRiskLabel()}</span>
          </div>
          <p className="risk-description">{getRiskDescription()}</p>
        </div>

        {/* Order Details */}
        <div className="risk-details">
          <div className="detail-row">
            <span className="detail-label">Pedido</span>
            <span className="detail-value">{orderId}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Cliente</span>
            <span className="detail-value">{customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Valor do Refund</span>
            <span className="detail-value amount">{formatCurrency(amount)}</span>
          </div>
          {isB2B && (
            <div className="detail-row b2b">
              <span className="detail-label">
                <Building2 size={14} />
                Tipo de Conta
              </span>
              <span className="detail-value b2b-badge">B2B Partner</span>
            </div>
          )}
        </div>

        {/* Risk Factors */}
        <div className="risk-factors">
          <h4>Fatores Analisados</h4>
          <div className="factors-list">
            <div className="factor positive">
              <CheckCircle size={14} />
              <span>Histórico de compras: 12 pedidos</span>
            </div>
            <div className="factor positive">
              <CheckCircle size={14} />
              <span>Tempo como cliente: 2+ anos</span>
            </div>
            <div className="factor positive">
              <TrendingUp size={14} />
              <span>Taxa de refund: Abaixo da média</span>
            </div>
            <div className="factor neutral">
              <Clock size={14} />
              <span>Último refund: 8 meses atrás</span>
            </div>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>
          Aprovar Refund
        </Button>
      </ModalFooter>
    </Modal>
  );
};
