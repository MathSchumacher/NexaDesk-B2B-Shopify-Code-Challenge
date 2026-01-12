import { Mail, RotateCcw, Package, TrendingUp, ArrowRight, Bot, Sparkles, CreditCard, Building2, DollarSign, Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Card } from '../../components/ui';
import { dashboardStats, orders, emails, supportStats, supportTickets } from '../../data/mockData';
import { companies } from '../../data/companies';
import { useApp } from '../../context/AppContext';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { state: { user } } = useApp();
  const isSupport = user.role === 'support';
  
  const recentOrders = orders.slice(0, 5);
  const recentEmails = emails.filter(e => !e.isRead).slice(0, 4);
  const recentTickets = supportTickets.filter(t => t.status !== 'resolvido').slice(0, 4);

  // B2B KPIs calculations
  const totalReceivables = companies.reduce((sum, c) => sum + c.creditUsed, 0);
  const totalCreditLimit = companies.reduce((sum, c) => sum + c.creditLimit, 0);
  const creditUtilization = Math.round((totalReceivables / totalCreditLimit) * 100);
  const blockedCompanies = companies.filter(c => c.status === 'blocked').length;
  const enterpriseClients = companies.filter(c => c.tier === 'enterprise' || c.tier === 'gold').length;

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
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleCardClick = (route: string, message: string) => {
    toast.success(message, { description: 'Navegando...' });
    navigate(route);
  };

  // Support Dashboard
  if (isSupport) {
    return (
      <motion.div 
        className="dashboard-page"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="page-header">
          <div>
            <h1>Dashboard de Suporte</h1>
            <p>Métricas e atividade da equipe de suporte • 2026</p>
          </div>
        </div>

        {/* Support Stats */}
        <motion.div className="stats-grid" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="stat-card" hoverable onClick={() => handleCardClick('/tickets', 'Abrindo Tickets')}>
              <div className="stat-icon email">
                <Ticket size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Tickets Abertos</p>
                <h3 className="stat-value">{supportStats.openTickets}</h3>
                <div className="stat-trend warning">
                  <AlertCircle size={14} />
                  <span>{supportStats.inProgressTickets} em andamento</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card" hoverable onClick={() => handleCardClick('/refunds', 'Abrindo Refunds')}>
              <div className="stat-icon refund">
                <RotateCcw size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Refunds Pendentes</p>
                <h3 className="stat-value">{supportStats.pendingRefunds}</h3>
                <p className="stat-amount">Aguardando revisão</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card">
              <div className="stat-icon orders">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Tempo Médio Resposta</p>
                <h3 className="stat-value">{supportStats.avgResponseTime}</h3>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  <span>Dentro da meta</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card ai-card">
              <div className="stat-icon ai">
                <CheckCircle2 size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">SLA Compliance</p>
                <h3 className="stat-value">{supportStats.slaCompliance}%</h3>
                <div className="stat-trend ai">
                  <Sparkles size={14} />
                  <span>{supportStats.resolvedToday} resolvidos hoje</span>
                </div>
              </div>
              <div className="ai-pulse" />
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Tickets */}
        <div className="content-grid">
          <motion.div variants={itemVariants}>
            <Card className="recent-section" padding="none">
              <div className="section-header">
                <h3>Tickets Recentes</h3>
                <button className="section-link" onClick={() => navigate('/tickets')}>
                  Ver todos <ArrowRight size={14} />
                </button>
              </div>
              <div className="email-list">
                {recentTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="email-item"
                    onClick={() => {
                      toast.info(`Abrindo ticket: ${ticket.subject}`);
                      navigate('/tickets');
                    }}
                  >
                    <div className="email-avatar">
                      {ticket.client.name.charAt(0)}
                    </div>
                    <div className="email-info">
                      <div className="email-header">
                        <span className="email-sender">{ticket.client.name}</span>
                        <span className="email-time">{formatDate(ticket.createdAt)}</span>
                      </div>
                      <p className="email-subject">{ticket.subject}</p>
                      <div className="email-tags">
                        <span className={`priority-tag ${ticket.priority}`}>
                          {ticket.priority === 'alta' ? '🔴' : ticket.priority === 'media' ? '🟡' : '🟢'} {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="recent-section" padding="none">
              <div className="section-header">
                <h3>Clientes B2B</h3>
                <button className="section-link" onClick={() => navigate('/clients')}>
                  Ver todos <ArrowRight size={14} />
                </button>
              </div>
              <div className="email-list">
                {companies.slice(0, 4).map((company) => (
                  <div 
                    key={company.id} 
                    className="email-item"
                    onClick={() => {
                      toast.info(`Abrindo cliente: ${company.name}`);
                      navigate('/clients');
                    }}
                  >
                    <div className="email-avatar">
                      <Building2 size={16} />
                    </div>
                    <div className="email-info">
                      <div className="email-header">
                        <span className="email-sender">{company.name}</span>
                        <span className={`tier-badge ${company.tier}`}>{company.tier}</span>
                      </div>
                      <p className="email-subject">{company.primaryContact.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Developer Credit */}
        <motion.footer className="dashboard-footer" variants={itemVariants}>
          <p>Desenvolvido por <strong>Matheus Schumacher</strong> • NexaDesk B2B Enterprise • 2026</p>
        </motion.footer>
      </motion.div>
    );
  }

  // Client Dashboard
  if (user.role === 'client') {
    // Client-specific data
    const myOrders = orders.slice(0, 5);
    const myOpenTickets = supportTickets.filter(t => t.status !== 'resolvido').length;
    const myCompany = companies.find(c => c.primaryContact.email === user.email) || companies[0];
    const creditAvailable = myCompany.creditLimit - myCompany.creditUsed;
    const creditPercentUsed = Math.round((myCompany.creditUsed / myCompany.creditLimit) * 100);

    return (
      <motion.div 
        className="dashboard-page"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="page-header">
          <div>
            <h1>Meu Painel</h1>
            <p>Olá, {user.name} • Visão geral da sua conta</p>
          </div>
          <div className="header-actions">
            <span className={`tier-badge ${myCompany.tier}`}>{myCompany.tier.toUpperCase()}</span>
          </div>
        </div>

        {/* Client Stats */}
        <motion.div className="stats-grid" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="stat-card" hoverable onClick={() => handleCardClick('/orders', 'Abrindo Meus Pedidos')}>
              <div className="stat-icon orders">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Meus Pedidos</p>
                <h3 className="stat-value">{myOrders.length}</h3>
                <div className="stat-trend positive">
                  <TrendingUp size={14} />
                  <span>Últimos 30 dias</span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card b2b-card">
              <div className="stat-icon receivables">
                <CreditCard size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Crédito Disponível</p>
                <h3 className="stat-value">{formatCurrency(creditAvailable)}</h3>
                <div className="b2b-bar">
                  <div 
                    className="b2b-bar-fill" 
                    style={{ width: `${creditPercentUsed}%` }}
                  />
                </div>
                <p className="stat-amount">{creditPercentUsed}% utilizado</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card" hoverable onClick={() => handleCardClick('/inbox', 'Abrindo Mensagens')}>
              <div className="stat-icon email">
                <Mail size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Mensagens</p>
                <h3 className="stat-value">{recentEmails.length}</h3>
                <p className="stat-amount">Não lidas</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card" hoverable onClick={() => handleCardClick('/quotes', 'Abrindo Cotações')}>
              <div className="stat-icon ai">
                <Ticket size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Suporte Ativo</p>
                <h3 className="stat-value">{myOpenTickets}</h3>
                <div className="stat-trend warning">
                  <AlertCircle size={14} />
                  <span>Tickets abertos</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h2 className="section-title">Ações Rápidas</h2>
        </motion.div>
        
        <motion.div className="stats-grid secondary" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="stat-card action-card" hoverable onClick={() => handleCardClick('/quotes', 'Solicitar Cotação')}>
              <div className="stat-icon enterprise">
                <Building2 size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Solicitar Cotação</p>
                <p className="stat-amount">Novo orçamento personalizado</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card action-card" hoverable onClick={() => {
              toast.success('Redirecionando para Suporte...');
              navigate('/tickets', { state: { openCreateModal: true } });
            }}>
              <div className="stat-icon email">
                <Mail size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Contatar Suporte</p>
                <p className="stat-amount">Abrir nova solicitação</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="stat-card action-card" hoverable onClick={() => handleCardClick('/settings', 'Minha Conta')}>
              <div className="stat-icon blocked">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Solicitar Aumento de Crédito</p>
                <p className="stat-amount">Limite atual: {formatCurrency(myCompany.creditLimit)}</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Orders */}
        <div className="content-grid">
          <motion.div variants={itemVariants}>
            <Card className="recent-section" padding="none">
              <div className="section-header">
                <h3>Meus Últimos Pedidos</h3>
                <button className="section-link" onClick={() => navigate('/orders')}>
                  Ver todos <ArrowRight size={14} />
                </button>
              </div>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        onClick={() => {
                          toast.info(`Abrindo pedido ${order.orderNumber}`);
                          navigate(`/orders/${order.id}`);
                        }}
                      >
                        <td className="order-id">{order.orderNumber}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="order-amount">{formatCurrency(order.amount)}</td>
                        <td>
                          <span className={`order-status status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="recent-section" padding="none">
              <div className="section-header">
                <h3>Informações da Conta</h3>
              </div>
              <div className="email-list">
                <div className="email-item" style={{ cursor: 'default' }}>
                  <div className="email-avatar">
                    <Building2 size={16} />
                  </div>
                  <div className="email-info">
                    <div className="email-header">
                      <span className="email-sender">Empresa</span>
                    </div>
                    <p className="email-subject">{myCompany.name}</p>
                  </div>
                </div>
                <div className="email-item" style={{ cursor: 'default' }}>
                  <div className="email-avatar">
                    <CreditCard size={16} />
                  </div>
                  <div className="email-info">
                    <div className="email-header">
                      <span className="email-sender">Limite de Crédito</span>
                    </div>
                    <p className="email-subject">{formatCurrency(myCompany.creditLimit)}</p>
                  </div>
                </div>
                <div className="email-item" style={{ cursor: 'default' }}>
                  <div className="email-avatar">
                    <DollarSign size={16} />
                  </div>
                  <div className="email-info">
                    <div className="email-header">
                      <span className="email-sender">Crédito Utilizado</span>
                    </div>
                    <p className="email-subject">{formatCurrency(myCompany.creditUsed)}</p>
                  </div>
                </div>
                <div className="email-item" style={{ cursor: 'default' }}>
                  <div className="email-avatar" style={{ background: myCompany.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: myCompany.status === 'active' ? '#22c55e' : '#ef4444' }}>
                    {myCompany.status === 'active' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  </div>
                  <div className="email-info">
                    <div className="email-header">
                      <span className="email-sender">Status da Conta</span>
                    </div>
                    <p className="email-subject" style={{ color: myCompany.status === 'active' ? '#22c55e' : '#ef4444' }}>
                      {myCompany.status === 'active' ? 'Ativa' : 'Bloqueada'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Developer Credit */}
        <motion.footer className="dashboard-footer" variants={itemVariants}>
          <p>Desenvolvido por <strong>Matheus Schumacher</strong> • NexaDesk B2B Enterprise • 2026</p>
        </motion.footer>
      </motion.div>
    );
  }

  // Admin/Merchant Dashboard (original)
  return (
    <motion.div 
      className="dashboard-page"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Visão geral da sua loja • 2026</p>
        </div>
        <div className="header-actions">
          <kbd className="shortcut-hint">⌘K</kbd>
          <span className="shortcut-label">Busca global</span>
        </div>
      </div>

      {/* Primary Stats */}
      <motion.div className="stats-grid" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="stat-card" hoverable onClick={() => handleCardClick('/inbox', 'Abrindo Inbox')}>
            <div className="stat-icon email">
              <Mail size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">E-mails Pendentes</p>
              <h3 className="stat-value">{dashboardStats.pendingEmails}</h3>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                <span>+{dashboardStats.pendingEmailsTrend}% esta semana</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="stat-card" hoverable onClick={() => handleCardClick('/refunds', 'Abrindo Refunds')}>
            <div className="stat-icon refund">
              <RotateCcw size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Refunds do Mês</p>
              <h3 className="stat-value">{dashboardStats.monthlyRefunds}</h3>
              <p className="stat-amount">{formatCurrency(dashboardStats.monthlyRefundsAmount)}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="stat-card" hoverable onClick={() => handleCardClick('/orders', 'Abrindo Pedidos')}>
            <div className="stat-icon orders">
              <Package size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pedidos Recentes</p>
              <h3 className="stat-value">{dashboardStats.recentOrders}</h3>
              <div className="stat-trend positive">
                <TrendingUp size={14} />
                <span>+{dashboardStats.recentOrdersTrend}% este mês</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="stat-card ai-card" hoverable>
            <div className="stat-icon ai">
              <Sparkles size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">AI Automation Rate</p>
              <h3 className="stat-value">85%</h3>
              <div className="stat-trend ai">
                <Bot size={14} />
                <span>E-mails triados por AI</span>
              </div>
            </div>
            <div className="ai-pulse" />
          </Card>
        </motion.div>
      </motion.div>

      {/* B2B KPIs Section */}
      <motion.div variants={itemVariants}>
        <h2 className="section-title">B2B Enterprise Metrics</h2>
      </motion.div>
      
      <motion.div className="stats-grid secondary" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <Card className="stat-card b2b-card">
            <div className="stat-icon receivables">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Net Receivables</p>
              <h3 className="stat-value">{formatCurrency(totalReceivables)}</h3>
              <div className="b2b-bar">
                <div 
                  className="b2b-bar-fill" 
                  style={{ width: `${creditUtilization}%` }}
                />
              </div>
              <p className="stat-amount">{creditUtilization}% do limite utilizado</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="stat-card b2b-card">
            <div className="stat-icon enterprise">
              <Building2 size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Enterprise Clients</p>
              <h3 className="stat-value">{enterpriseClients}</h3>
              <p className="stat-amount">Gold + Enterprise tier</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={`stat-card b2b-card ${blockedCompanies > 0 ? 'warning' : ''}`}>
            <div className="stat-icon blocked">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">Contas Bloqueadas</p>
              <h3 className="stat-value">{blockedCompanies}</h3>
              <p className="stat-amount">Crédito excedido</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Emails */}
        <motion.div variants={itemVariants}>
          <Card className="recent-section" padding="none">
            <div className="section-header">
              <h3>E-mails Não Lidos</h3>
              <button className="section-link" onClick={() => navigate('/inbox')}>
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div className="email-list">
              {recentEmails.map((email) => (
                <div 
                  key={email.id} 
                  className="email-item"
                  onClick={() => {
                    toast.info(`Abrindo e-mail de ${email.from.name}`);
                    navigate('/inbox');
                  }}
                >
                  <div className="email-avatar">
                    {email.from.name.charAt(0)}
                  </div>
                  <div className="email-info">
                    <div className="email-header">
                      <span className="email-sender">{email.from.name}</span>
                      <span className="email-time">{formatDate(email.createdAt)}</span>
                    </div>
                    <p className="email-subject">{email.subject}</p>
                    <div className="email-tags">
                      {email.orderId && (
                        <span className="email-order">#{email.orderId}</span>
                      )}
                      {email.status === 'new' && (
                        <span className="ai-tag-small">
                          <Bot size={10} />
                          AI Triaged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants}>
          <Card className="recent-section" padding="none">
            <div className="section-header">
              <h3>Últimos Pedidos</h3>
              <button className="section-link" onClick={() => navigate('/orders')}>
                Ver todos <ArrowRight size={14} />
              </button>
            </div>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => {
                        toast.info(`Abrindo pedido ${order.orderNumber}`);
                        navigate(`/orders/${order.id}`);
                      }}
                    >
                      <td className="order-id">{order.orderNumber}</td>
                      <td>{order.customer.name}</td>
                      <td className="order-amount">{formatCurrency(order.amount)}</td>
                      <td>
                        <span className={`order-status status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Developer Credit */}
      <motion.footer className="dashboard-footer" variants={itemVariants}>
        <p>Desenvolvido por <strong>Matheus Schumacher</strong> • NexaDesk B2B Enterprise • 2026</p>
      </motion.footer>
    </motion.div>
  );
};
