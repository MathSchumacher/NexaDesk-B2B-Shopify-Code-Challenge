import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { orders, emails } from '../../data/mockData';
import './Orders.css';

export const Orders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getEmailCount = (orderId: string) => {
    return emails.filter(email => email.orderId === orderId).length;
  };

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
    return <Badge variant={variants[status] || 'default'}>{labels[status] || status}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Gerencie todos os pedidos da sua loja</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="filters-bar" padding="sm">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select">
            <Filter size={16} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="processing">Processando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregue</option>
              <option value="refunded">Reembolsado</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="orders-table-card" padding="none">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
                <th>E-mails</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const emailCount = getEmailCount(order.id);
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td className="order-number">{order.orderNumber}</td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customer.name}</span>
                        <span className="customer-email">{order.customer.email}</span>
                      </div>
                    </td>
                    <td className="order-date">{formatDate(order.createdAt)}</td>
                    <td className="order-amount">{formatCurrency(order.amount)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      {emailCount > 0 ? (
                        <span className="email-count">{emailCount}</span>
                      ) : (
                        <span className="no-emails">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <p>Nenhum pedido encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
};
