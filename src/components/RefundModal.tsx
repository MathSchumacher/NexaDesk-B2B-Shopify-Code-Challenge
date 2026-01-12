import { useState } from 'react';
import { Modal, ModalFooter, Button } from './ui';
import { refundReasons, refundIssues } from '../data/mockData';
import './RefundModal.css';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
}

export const RefundModal = ({ 
  isOpen, 
  onClose, 
  orderNumber, 
  amount 
}: RefundModalProps) => {
  const [reason, setReason] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setReason('');
      setSelectedIssues([]);
      setNotes('');
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setReason('');
    setSelectedIssues([]);
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Solicitar Refund"
      size="md"
    >
      <div className="refund-modal-content">
        {/* Order Info */}
        <div className="refund-order-info">
          <div className="info-row">
            <span className="info-label">Pedido</span>
            <span className="info-value">{orderNumber}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Valor do Refund</span>
            <span className="info-value amount">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Reason Select */}
        <div className="form-group">
          <label htmlFor="refund-reason">Motivo do Refund</label>
          <select
            id="refund-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="refund-select"
          >
            <option value="">Selecione um motivo</option>
            {refundReasons.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        {/* Issues Checkboxes */}
        <div className="form-group">
          <label>Problemas Identificados</label>
          <div className="checkbox-group">
            {refundIssues.map((issue) => (
              <label key={issue.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedIssues.includes(issue.id)}
                  onChange={() => handleIssueToggle(issue.id)}
                />
                <span className="checkbox-box" />
                <span className="checkbox-label">{issue.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="refund-notes">Observações</label>
          <textarea
            id="refund-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione informações adicionais sobre o refund..."
            rows={4}
            className="refund-textarea"
          />
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!reason}
        >
          Confirmar Refund
        </Button>
      </ModalFooter>
    </Modal>
  );
};
