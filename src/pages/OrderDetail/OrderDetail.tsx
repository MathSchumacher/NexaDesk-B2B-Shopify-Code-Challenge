import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Mail, 
  Calendar,
  DollarSign 
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { RefundModal } from '../../components/RefundModal';
import { orders, emails } from '../../data/mockData';
import './OrderDetail.css';

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRefundModal, setShowRefundModal] = useState(false);

  const order = orders.find(o => o.id === id);
  const relatedEmails = emails.filter(e => e.orderId === id);

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="not-found">
          <h2>Pedido não encontrado</h2>
          <Button onClick={() => navigate('/orders')}>Voltar aos pedidos</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
      pending: 'warning',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      refunded: 'error',
      cancelled: 'default'
    };
    const labels: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      refunded: 'Reembolsado',
      cancelled: 'Cancelado'
    };
    return <Badge variant={variants[status] || 'default'} size="md">{labels[status] || status}</Badge>;
  };

  return (
    <div className="order-detail-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/orders')}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <div className="header-content">
          <div className="header-title">
            <h1>Pedido {order.orderNumber}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p>Criado em {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="detail-grid">
        {/* Order Summary */}
        <Card className="order-summary">
          <div className="summary-header">
            <Package size={20} />
            <h3>Resumo do Pedido</h3>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <Package size={24} />
                </div>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">Qtd: {item.quantity}</span>
                </div>
                <span className="item-price">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
            <div className="total-row">
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div className="total-row total-final">
              <span>Total</span>
              <span>{formatCurrency(order.amount)}</span>
            </div>
          </div>
        </Card>

        {/* Customer Info */}
        <div className="side-cards">
          <Card className="info-card">
            <div className="info-header">
              <User size={18} />
              <h4>Cliente</h4>
            </div>
            <div className="info-content">
              <p className="info-name">{order.customer.name}</p>
              <p className="info-email">{order.customer.email}</p>
            </div>
          </Card>

          {order.shippingAddress && (
            <Card className="info-card">
              <div className="info-header">
                <MapPin size={18} />
                <h4>Endereço de Entrega</h4>
              </div>
              <div className="info-content">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </Card>
          )}

          <Card className="info-card">
            <div className="info-header">
              <DollarSign size={18} />
              <h4>Ações</h4>
            </div>
            <Button 
              variant="danger" 
              fullWidth 
              onClick={() => setShowRefundModal(true)}
              disabled={order.status === 'refunded' || order.status === 'cancelled'}
            >
              Solicitar Refund
            </Button>
          </Card>
        </div>

        {/* Email History */}
        <Card className="email-history">
          <div className="history-header">
            <div className="history-title">
              <Mail size={20} />
              <h3>Histórico de E-mails</h3>
            </div>
            <span className="email-count">{relatedEmails.length} e-mails</span>
          </div>

          {relatedEmails.length > 0 ? (
            <div className="email-timeline">
              {relatedEmails.map((email) => (
                <div 
                  key={email.id} 
                  className="timeline-item"
                  onClick={() => navigate('/inbox')}
                >
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-sender">{email.from.name}</span>
                      <span className="timeline-date">
                        <Calendar size={12} />
                        {formatDate(email.createdAt)}
                      </span>
                    </div>
                    <p className="timeline-subject">{email.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-emails">
              <Mail size={32} />
              <p>Nenhum e-mail relacionado a este pedido</p>
            </div>
          )}
        </Card>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        orderId={order.id}
        orderNumber={order.orderNumber}
        amount={order.amount}
      />
    </div>
  );
};
