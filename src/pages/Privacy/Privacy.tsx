import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Privacy = () => {
  const navigate = useNavigate();

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

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/')}
          className="desktop-back-btn"
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer',
            marginBottom: '40px',
            fontSize: '14px'
          }}
        >
          ← Voltar para Home
        </button>

        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)', 
          marginBottom: '48px',
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Política de Privacidade
        </h1>

        <div style={{
          background: 'rgba(18, 18, 26, 0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>1. Coleta de Informações</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Sua privacidade é importante para nós. Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>2. Uso de Dados</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>3. Compartilhamento</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>4. Cookies</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Nós usamos cookies para entender como você usa nosso site e melhorar sua experiência.
            </p>
          </section>
        </div>

        <p style={{ marginTop: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
          Última atualização: 12 de Janeiro de 2026
        </p>
      </div>
    </div>
  );
};
