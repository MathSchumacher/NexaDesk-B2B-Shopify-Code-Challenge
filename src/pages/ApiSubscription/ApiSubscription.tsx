import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Key, CreditCard, CheckCircle, ShieldCheck, ArrowLeft, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './ApiSubscription.css';

export const ApiSubscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useApp();
  
  const [isPaid, setIsPaid] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [copied, setCopied] = useState(false);

  const apiType = searchParams.get('type') || 'pricing'; // 'pricing' or 'stock'
  const apiName = apiType === 'pricing' ? 'Auto-Precificação' : 'Reposição de Estoque';
  const price = apiType === 'pricing' ? 'R$ 497' : 'R$ 697';

  const handleLoginRedirect = () => {
    // Store intent in localStorage and redirect to login
    localStorage.setItem('api_subscribe_redirect', `/api-subscribe?type=${apiType}`);
    navigate('/login');
  };

  const handlePayment = () => {
    // Mock payment processing
    setTimeout(() => {
      setIsPaid(true);
      // Generate a mock API key
      const prefix = apiType === 'pricing' ? 'nx_pricing_live_' : 'nx_stock_live_';
      const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setGeneratedKey(prefix + randomPart);
    }, 1500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="api-subscribe-page">
      <div className="api-subscribe-container">
        <button className="back-link" onClick={() => navigate('/docs')}>
          <ArrowLeft size={16} /> Voltar para Documentação
        </button>

        <div className="api-subscribe-header">
          <div className="api-icon-large">
            <Key size={32} />
          </div>
          <h1>Assinar API de {apiName}</h1>
          <p>Acesso completo à API com suporte técnico prioritário.</p>
        </div>

        {!isAuthenticated ? (
          <div className="login-required-card">
            <AlertTriangle size={24} />
            <h3>Login Necessário</h3>
            <p>Para assinar a API, você precisa estar logado na plataforma NexaDesk.</p>
            <Button onClick={handleLoginRedirect} leftIcon={<ArrowLeft size={16} />}>
              Fazer Login para Continuar
            </Button>
          </div>
        ) : !isPaid ? (
          <div className="payment-card">
            <div className="price-display">
              <span className="price-value">{price}</span>
              <span className="price-period">/mês</span>
            </div>
            
            <ul className="features-list">
              <li><CheckCircle size={16} /> Acesso ilimitado a todos os endpoints</li>
              <li><CheckCircle size={16} /> 10.000 requests/minuto</li>
              <li><CheckCircle size={16} /> Suporte técnico via Slack/Discord</li>
              <li><CheckCircle size={16} /> Webhooks em tempo real</li>
            </ul>

            <div className="refund-policy">
              <ShieldCheck size={16} />
              <span>Garantia de Reembolso: Se não usar a chave, devolvemos 100% a qualquer momento.</span>
            </div>

            <Button onClick={handlePayment} leftIcon={<CreditCard size={18} />} className="pay-button">
              Pagar e Gerar Chave
            </Button>
          </div>
        ) : (
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <h2>Assinatura Ativa!</h2>
            <p>Sua chave de API foi gerada. <strong>Copie agora</strong>, ela não será exibida novamente.</p>
            
            <div className="key-display">
              <code>{generatedKey}</code>
              <button onClick={handleCopyKey} className="copy-btn">
                <Copy size={16} />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="next-steps">
              <p>Próximos passos:</p>
              <Button variant="secondary" onClick={() => navigate(apiType === 'pricing' ? '/docs/pricing-api' : '/docs/stock-api')}>
                Ver Documentação da API
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
