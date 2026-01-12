import { useNavigate } from 'react-router-dom';
import { Crown, Star, Zap, ShieldCheck, ArrowLeft } from 'lucide-react';

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
    <div style={{ 
      minHeight: '100vh', 
      padding: '60px 24px', 
      background: '#0a0a0f',
      color: 'white',
      position: 'relative'
    }}>
      {/* Mobile Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="mobile-back-btn"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          color: 'white'
        }}
      >
        <ArrowLeft size={20} />
      </button>

      <style>{`
        @media (max-width: 768px) {
          .mobile-back-btn { display: flex !important; }
          .desktop-back-btn { display: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <p style={{ color: '#3b82f6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px', fontSize: '13px' }}>
            Programa de Fidelidade
          </p>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 6vw, 4rem)', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff, #93c5fd, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NexaDesk Status
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6, fontSize: '15px' }}>
            Membros que usam a muito tempo ganham descontos e viram membros Gold VIP com seu próprio status.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {tiers.map((tier) => (
            <div key={tier.name} style={{
              background: 'rgba(18, 18, 26, 0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '32px'
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '14px', 
                background: `rgba(${tier.color === '#9ca3af' ? '156,163,175' : tier.color === '#fbbf24' ? '251,191,36' : '168,85,247'}, 0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                color: tier.color
              }}>
                {tier.icon}
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: tier.color }}>{tier.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '20px' }}>
                <ShieldCheck size={14} />
                <span>Tempo de casa: {tier.time}</span>
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '12px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '48px 32px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Já é um cliente antigo?</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6, fontSize: '15px' }}>
            Seu status é atualizado automaticamente baseado no tempo da sua assinatura.
          </p>
          <button 
            onClick={() => navigate('/login')}
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
