import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './Login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { actions: { loginAs } } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Email-based mock authentication logic
      let userId = 'user-client'; // Default to client for any random email
      
      const normalizedEmail = email.toLowerCase().trim();
      
      if (normalizedEmail === 'maria@nexadesk.com') {
        userId = 'user-support';
      } else if (normalizedEmail === 'john@nexadesk.com') {
        userId = 'user-admin';
      }
      
      loginAs(userId); // Set global auth state with selected user
      
      const redirectUrl = localStorage.getItem('api_subscribe_redirect');
      if (redirectUrl) {
        localStorage.removeItem('api_subscribe_redirect');
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      {/* Left Panel - Branding */}
      <div className="login-branding">
        <div className="branding-content">
          <div className="branding-logo">
            <Link to="/" className="logo-icon-large">
              <img src="/brand-logo.png" alt="NexaDesk" />
            </Link>
          </div>
          
          <p className="branding-tagline">
            A plataforma B2B Enterprise para gestão completa de pedidos, e-mails e refunds com integração Shopify.
          </p>

          <div className="branding-features">
            <div className="feature-item">
              <div className="feature-image-wrapper">
                <img src="/Inbox Centralizado.png" alt="Inbox Centralizado" className="feature-img" />
              </div>
              <div className="feature-text">
                <h4>Inbox Centralizado</h4>
                <p>Todos os e-mails dos clientes em um só lugar</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-image-wrapper">
                <img src="/Gestão de Pedidos.png" alt="Gestão de Pedidos" className="feature-img" />
              </div>
              <div className="feature-text">
                <h4>Gestão de Pedidos</h4>
                <p>Visualize e gerencie pedidos facilmente</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-image-wrapper">
                <img src="/Controle de Refunds.png" alt="Controle de Refunds" className="feature-img" />
              </div>
              <div className="feature-text">
                <h4>Controle de Refunds</h4>
                <p>Processo estruturado de reembolsos</p>
              </div>
            </div>
          </div>

          <div className="branding-integration">
            <span>Integrado com</span>
            <div className="shopify-badge">
              <svg viewBox="0 0 109 124" width="20" height="20">
                <path fill="#95BF47" d="M95.3 28.4c-.1-.8-.6-1.2-1.3-1.3-.6-.1-13.6-.3-13.6-.3s-10.7-10.4-11.9-11.5c-1.1-1.1-3.3-.8-4.2-.5-.1 0-2.3.7-5.9 1.8-3.5-10.1-9.7-19.4-20.6-19.4h-1C34.5-4.2 31.5.2 29.1 5c-4.1 1.2-8.1 2.5-12.2 3.8l-5.2 1.6C5.4 12.6.1 24.5.1 24.5L41.9 112l44.8-9.7s8.7-58.9 8.7-59.3c-.1-14.3-.1-14.3-.1-14.6z"/>
                <path fill="#5E8E3E" d="M82.1 27.1l-5.4 1.6c0-.7-.1-1.5-.2-2.4-.6-8.4-4.5-12.8-9.9-13.8V2.8c5.3.5 9.5 3 12.2 7.6 2 3.3 3.1 7.5 3.3 11.5-.1 1.7 0 3.5 0 5.2z"/>
              </svg>
              <span>Shopify</span>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 NexaDesk • Desenvolvido por Matheus Schumacher</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Bem-vindo de volta</h2>
            <p>Entre com suas credenciais para acessar o painel</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Lembrar de mim</span>
              </label>
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              Entrar
            </Button>
          </form>

          <div className="login-divider">
            <span>ou continue com</span>
          </div>

          <div className="social-login">
            <button className="social-btn google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="social-btn shopify">
              <svg viewBox="0 0 109 124" width="20" height="20">
                <path fill="#95BF47" d="M95.3 28.4c-.1-.8-.6-1.2-1.3-1.3-.6-.1-13.6-.3-13.6-.3s-10.7-10.4-11.9-11.5c-1.1-1.1-3.3-.8-4.2-.5-.1 0-2.3.7-5.9 1.8-3.5-10.1-9.7-19.4-20.6-19.4h-1C34.5-4.2 31.5.2 29.1 5c-4.1 1.2-8.1 2.5-12.2 3.8l-5.2 1.6C5.4 12.6.1 24.5.1 24.5L41.9 112l44.8-9.7s8.7-58.9 8.7-59.3c-.1-14.3-.1-14.3-.1-14.6z"/>
              </svg>
              Shopify
            </button>
          </div>

          <p className="signup-link">
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
