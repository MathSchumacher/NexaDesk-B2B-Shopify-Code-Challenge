import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ShieldAlert, RefreshCw, Copy, BookOpen, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import './ApiDashboard.css';

// Mock active subscription data
// In a real app, this would come from the API/Context based on the user's account
const initialSubscription = {
  status: 'active', // active, none
  plan: 'Auto-Pricing API', // or 'Stock API'
  key: 'nx_pricing_live_839281902839012',
  nextBilling: '15/02/2026',
  requestsThisMonth: 14502
};

export const ApiDashboard = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(initialSubscription);
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(subscription.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotateKey = () => {
    if (confirm('Tem certeza? A chave antiga deixará de funcionar imediatamente.')) {
      setIsRotating(true);
      setTimeout(() => {
        setSubscription(prev => ({
          ...prev,
          key: 'nx_pricing_live_' + Math.random().toString(36).substring(2, 15)
        }));
        setIsRotating(false);
        alert('Nova chave gerada com sucesso!');
      }, 1500);
    }
  };

  const handleCancelScription = () => {
    if (confirm('Deseja realmente cancelar? O acesso à API será revogado no final do ciclo de faturamento.')) {
      setSubscription(prev => ({ ...prev, status: 'canceled' }));
    }
  };

  if (subscription.status === 'none' || subscription.status === 'canceled') {
    return (
      <div className="api-dashboard-empty">
        <div className="empty-state-card">
          <Key size={48} className="empty-icon" />
          <h2>Nenhuma API Ativa</h2>
          <p>Você não possui assinaturas de API ativas no momento.</p>
          <div className="empty-actions">
            <Button onClick={() => navigate('/docs/pricing-api')}>
              Conhecer API de Precificação
            </Button>
            <Button variant="secondary" onClick={() => navigate('/docs/stock-api')}>
              Conhecer API de Estoque
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="api-dashboard-page">
      <div className="api-dashboard-header">
        <h1>Minhas APIs</h1>
        <p>Gerencie suas chaves de acesso e assinaturas de desenvolvedor.</p>
      </div>

      <div className="api-active-card">
        <div className="api-card-header">
          <div className="api-info">
            <div className="api-icon-wrapper">
              <Key size={24} />
            </div>
            <div>
              <h3>{subscription.plan}</h3>
              <span className="status-badge active">
                <span className="dot"></span> Ativo
              </span>
            </div>
          </div>
          <div className="api-billing-info">
            <span>Próxima cobrança: <strong>{subscription.nextBilling}</strong></span>
          </div>
        </div>

        <div className="api-key-section">
          <label>Chave de Produção</label>
          <div className="key-display-row">
            <code className="key-value">{subscription.key}</code>
            <button className="icon-btn" onClick={handleCopy} title="Copiar Chave">
              {copied ? <CheckCircle size={18} className="text-success" /> : <Copy size={18} />}
            </button>
            <button className="icon-btn warning" onClick={handleRotateKey} title="Rotacionar Chave" disabled={isRotating}>
              <RefreshCw size={18} className={isRotating ? 'spin' : ''} />
            </button>
          </div>
          <p className="security-note">
            <ShieldAlert size={14} /> 
            Nunca compartilhe sua chave em repositórios públicos ou client-side code.
          </p>
        </div>

        <div className="api-usage-stats">
          <div className="stat-item">
            <span className="stat-label">Requests (Mês)</span>
            <span className="stat-value">{subscription.requestsThisMonth.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quota Mensal</span>
            <span className="stat-value">1.000.000</span>
          </div>
          <div className="stat-progress">
            <div className="progress-bar" style={{ width: '1.5%' }}></div>
          </div>
        </div>

        <div className="api-actions-footer">
          <Button variant="ghost" onClick={() => navigate('/docs')} leftIcon={<BookOpen size={16} />}>
            Ver Documentação
          </Button>
          <Button variant="danger" onClick={handleCancelScription} leftIcon={<Trash2 size={16} />}>
            Cancelar Assinatura
          </Button>
        </div>
      </div>
    </div>
  );
};
