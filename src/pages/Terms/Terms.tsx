import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Terms.css';

export const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      {/* Mobile Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="mobile-back-btn"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="terms-container">
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

        <h1 className="terms-title" style={{ 
          background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.6))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Termos de Serviço
        </h1>

        <div className="terms-content">
          <section className="sub-section">
            <h2 className="section-title">1. Aceitação dos Termos</h2>
            <p className="terms-text">
              Ao acessar e utilizar a plataforma NexaDesk, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
            </p>
          </section>

          <section className="sub-section">
            <h2 className="section-title">2. Uso da Licença</h2>
            <p className="terms-text">
              É concedida permissão para baixar temporariamente uma cópia dos materiais no site NexaDesk, apenas para visualização transitória pessoal e não comercial.
            </p>
          </section>

          <section className="sub-section">
            <h2 className="section-title">3. Isenção de Responsabilidade</h2>
            <p className="terms-text">
              Os materiais no site da NexaDesk são fornecidos 'como estão'. NexaDesk não oferece garantias, expressas ou implícitas.
            </p>
          </section>

          <section className="sub-section">
            <h2 className="section-title">4. Limitações</h2>
            <p className="terms-text">
              Em nenhum caso o NexaDesk ou seus fornecedores serão responsáveis por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais em NexaDesk.
            </p>
          </section>
        </div>

        <p className="terms-footer">
          Última atualização: 12 de Janeiro de 2026
        </p>
      </div>
    </div>
  );
};
