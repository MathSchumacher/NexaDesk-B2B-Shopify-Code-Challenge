import { useNavigate } from 'react-router-dom';
import { Crown, Star, Zap, ShieldCheck, ArrowLeft } from 'lucide-react';
import './Status.css';

export const Status = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Silver Member",
      time: "6 Meses",
      benefits: ["Acesso prioritário ao suporte", "5% de desconto em renovações"],
      tier: "silver",
      icon: <Star size={28} />,
      color: '#9ca3af'
    },
    {
      name: "Gold Member",
      time: "1 Ano",
      benefits: ["Gerente de conta dedicado", "10% de desconto vitalício", "Acesso a betas exclusivos"],
      tier: "gold",
      icon: <Crown size={28} />,
      color: '#fbbf24'
    },
    {
      name: "VIP Platinum",
      time: "2+ Anos",
      benefits: ["Suporte 24/7 via WhatsApp", "20% de desconto vitalício", "Consultoria de operação B2B mensal"],
      tier: "platinum",
      icon: <Zap size={28} />,
      color: '#a855f7'
    }
  ];

  return (
    <div className="status-page">
      {/* Mobile Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="mobile-back-btn"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="status-container">
        <button 
          onClick={() => navigate('/')}
          className="desktop-back-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            marginBottom: '64px',
            fontSize: '14px'
          }}
        >
          ← Voltar para Home
        </button>

        <div className="status-header">
          <p className="status-subtitle">
            Programa de Fidelidade
          </p>
          <h1 className="status-title" style={{ 
            background: 'linear-gradient(135deg, #fff, #93c5fd, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NexaDesk Status
          </h1>
          <p className="status-description">
            Membros que usam a muito tempo ganham descontos e viram membros Gold VIP com seu próprio status.
          </p>
        </div>

        <div className="tiers-grid">
          {tiers.map((tier) => (
            <div key={tier.name} className="tier-card">
              <div 
                className="tier-icon-wrapper"
                style={{ 
                  width: '56px', height: '56px', borderRadius: '14px', 
                  background: `rgba(${tier.color === '#9ca3af' ? '156,163,175' : tier.color === '#fbbf24' ? '251,191,36' : '168,85,247'}, 0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                  color: tier.color
                }}
              >
                {tier.icon}
              </div>
              
              <h3 className="tier-name" style={{ color: tier.color }}>{tier.name}</h3>
              <div className="tier-price">
                <ShieldCheck size={14} />
                <span>Tempo de casa: {tier.time}</span>
              </div>
              
              <ul className="tier-features">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="tier-feature">
                    <span className="tier-feature-dot" style={{ background: tier.color }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="loyalty-section">
          <h3 className="loyalty-title">Já é um cliente antigo?</h3>
          <p className="loyalty-text">
            Seu status é atualizado automaticamente baseado no tempo da sua assinatura.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="check-status-btn"
            style={{
              background: 'white',
              color: '#0a0a0f',
              padding: '14px 28px',
              borderRadius: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Verificar meu Status
          </button>
        </div>
      </div>
    </div>
  );
};
