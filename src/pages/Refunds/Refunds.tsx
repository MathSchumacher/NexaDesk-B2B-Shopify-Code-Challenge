import { RotateCcw, Calendar, DollarSign } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { orders } from '../../data/mockData';
import './Refunds.css';

export const Refunds = () => {
  // Filter only refunded orders
  const refundedOrders = orders.filter(o => o.status === 'refunded');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const totalRefunds = refundedOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="refunds-page">
      <div className="page-header">
        <div>
          <h1>Refunds</h1>
          <p>Histórico de reembolsos processados</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="refunds-summary">
        <Card className="summary-card">
          <div className="summary-icon">
            <RotateCcw size={24} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Total de Refunds</p>
            <h3 className="summary-value">{refundedOrders.length}</h3>
          </div>
        </Card>

        <Card className="summary-card">
          <div className="summary-icon amount">
            <DollarSign size={24} />
          </div>
          <div className="summary-content">
            <p className="summary-label">Valor Total</p>
            <h3 className="summary-value">{formatCurrency(totalRefunds)}</h3>
          </div>
        </Card>
      </div>

      {/* Refunds List */}
      <Card className="refunds-list-card" padding="none">
        <div className="list-header">
          <h3>Histórico de Refunds</h3>
        </div>

        {refundedOrders.length > 0 ? (
          <div className="refunds-list">
            {refundedOrders.map((order) => (
              <div key={order.id} className="refund-item">
                <div className="refund-info">
                  <div className="refund-header">
                    <span className="refund-order">{order.orderNumber}</span>
                    <Badge variant="error">Reembolsado</Badge>
                  </div>
                  <p className="refund-customer">{order.customer.name}</p>
                </div>
                <div className="refund-meta">
                  <div className="refund-date">
                    <Calendar size={14} />
                    {formatDate(order.createdAt)}
                  </div>
                  <span className="refund-amount">{formatCurrency(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <RotateCcw size={48} />
            <h4>Nenhum refund</h4>
            <p>Não há reembolsos processados ainda</p>
          </div>
        )}
      </Card>
    </div>
  );
};
