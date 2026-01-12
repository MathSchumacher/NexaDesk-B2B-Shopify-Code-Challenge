import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Terms = () => {
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
          display: 'none', // Hidden by default, shown via CSS media query
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
          Termos de Serviço
        </h1>

        <div style={{
          background: 'rgba(18, 18, 26, 0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '32px'
        }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>1. Aceitação dos Termos</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Ao acessar e utilizar a plataforma NexaDesk, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>2. Uso da Licença</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              É concedida permissão para baixar temporariamente uma cópia dos materiais no site NexaDesk, apenas para visualização transitória pessoal e não comercial.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>3. Isenção de Responsabilidade</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Os materiais no site da NexaDesk são fornecidos 'como estão'. NexaDesk não oferece garantias, expressas ou implícitas.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '12px', color: 'white' }}>4. Limitações</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>
              Em nenhum caso o NexaDesk ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais em NexaDesk.
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
