import { useState } from 'react';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Rocket, 
  Building2, 
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import './Upgrade.css';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  icon: any;
  color: string;
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
}

export const Upgrade = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Ideal para solopreneurs iniciando a operação.',
      price: 0,
      period: 'mês',
      icon: Zap,
      color: '#fbbf24', // amber-400
      cta: 'Plano Atual',
      features: [
        { text: 'Inbox Unificado', included: true },
        { text: 'Tradução Manual', included: true },
        { text: '1 Usuário', included: true },
        { text: '50 E-mails/mês', included: true },
        { text: 'Colaboração B2B', included: false },
        { text: 'Auto-tradução IA', included: false },
        { text: 'Copiloto de IA', included: false },
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'Para times em crescimento que precisam de agilidade.',
      price: 49,
      period: 'mês',
      icon: Rocket,
      color: '#34d399', // emerald-400
      cta: 'Fazer Upgrade',
      features: [
        { text: 'Inbox Unificado', included: true },
        { text: 'Auto-tradução IA', included: true },
        { text: 'Até 5 Usuários', included: true },
        { text: 'E-mails Ilimitados', included: true },
        { text: 'Colaboração B2B', included: true },
        { text: 'Analytics Básico', included: true },
        { text: 'Copiloto de IA', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Automação total e inteligência para escalar.',
      price: 149,
      period: 'mês',
      icon: Crown,
      color: '#a78bfa', // violet-400
      popular: true,
      cta: 'Fazer Upgrade',
      features: [
        { text: 'Tudo do Growth', included: true },
        { text: 'Triagem Inteligente IA', included: true },
        { text: 'Respostas Sugeridas', included: true },
        { text: 'Usuários Ilimitados', included: true },
        { text: 'Analytics Avançado', included: true },
        { text: 'Score de Relacionamento', included: true },
        { text: 'Prioridade no Suporte', included: true },
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Segurança, controle e customização total.',
      price: 0, 
      period: 'mês',
      icon: Building2,
      color: '#60a5fa', // blue-400
      cta: 'Falar com Vendas',
      features: [
        { text: 'Tudo do Pro', included: true },
        { text: 'Gestor Dedicado', included: true },
        { text: 'API & Integrações Custom', included: true },
        { text: 'SLA 99.9%', included: true },
        { text: 'Whitelabel', included: true },
        { text: 'Auditoria de Logs', included: true },
        { text: 'Treinamento Personalizado', included: true },
      ]
    }
  ];

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === 'starter') return;
    
    if (plan.id === 'enterprise') {
      window.open('mailto:sales@nexadesk.com?subject=Enterprise%20Plan%20Inquiry', '_blank');
      return;
    }

    setLoadingPlan(plan.id);
    
    // Simulate API call
    setTimeout(() => {
      setLoadingPlan(null);
      toast.success(`Upgrade para ${plan.name} iniciado!`, {
        description: 'Redirecionando para o checkout...'
      });
    }, 1500);
  };

  return (
    <div className="upgrade-page">
      <div className="upgrade-header">
        <h1>Escolha seu Plano</h1>
        <p>Comece grátis, faça upgrade conforme você cresce.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`pricing-card ${plan.popular ? 'popular' : ''}`}
          >
            {plan.popular && (
              <div className="popular-ribbon">Recomendado</div>
            )}
            
            <div className="plan-icon" style={{ background: `${plan.color}20` }}>
              <plan.icon size={28} style={{ color: plan.color }} />
            </div>
            
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-description">{plan.description}</p>
            
            <div className="plan-price">
              {plan.id === 'enterprise' ? (
                <span className="price-amount" style={{ fontSize: '2rem' }}>Personalizado</span>
              ) : plan.price === 0 ? (
                <span className="price-free">Grátis</span>
              ) : (
                <>
                  <span className="price-currency">R$</span>
                  <span className="price-amount">{plan.price}</span>
                  <span className="price-period">/{plan.period}</span>
                </>
              )}
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i} className={!feature.included ? 'disabled' : ''}>
                  {feature.included ? <Check size={18} /> : <X size={18} />}
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`plan-cta ${plan.popular ? 'primary' : ''}`}
              onClick={() => handleSelectPlan(plan)}
              disabled={plan.id === 'starter' || loadingPlan !== null}
            >
              {loadingPlan === plan.id ? 'Processando...' : plan.cta}
              {plan.id !== 'starter' && <ArrowRight size={16} />}
            </button>
          </div>
        ))}
      </div>

      <div className="upgrade-faq">
        <h3>Perguntas Frequentes</h3>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Como funciona a colaboração em time?</h4>
            <p>A Inbox Unificada permite que múltiplos agentes trabalhem juntos. Você pode atribuir tickets, deixar notas internas ocultas para o cliente e evitar colisões de resposta em tempo real.</p>
          </div>
          <div className="faq-item">
            <h4>A integração com Shopify é nativa?</h4>
            <p>Sim! Conectamos diretamente à sua loja para puxar pedidos, status de entrega e perfil do cliente. No plano Enterprise, suportamos também VTEX, Magalu e integração via API personalizada.</p>
          </div>
          <div className="faq-item">
            <h4>O que é a auto-tradução?</h4>
            <p>No plano Growth e superiores, o sistema detecta o idioma do cliente e traduz automaticamente as mensagens, permitindo que sua equipe atenda clientes globais sem barreira linguística.</p>
          </div>
          <div className="faq-item">
            <h4>Como funciona o SLA garantido?</h4>
            <p>Para planos Enterprise, garantimos 99.9% de uptime e atendimento prioritário com gerente de conta dedicado para assegurar que sua operação nunca pare.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
