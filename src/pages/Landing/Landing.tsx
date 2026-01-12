import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, ShieldCheck, Phone, TrendingUp, Package, LayoutDashboard } from 'lucide-react';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './Landing.css';

export const Landing = () => {
  const navigate = useNavigate();
  const {  state: { user }, isAuthenticated } = useApp();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/brand-logo.png" alt="NexaDesk" />
          </div>
          <div className="nav-links">
            <a href="#modules">Soluções</a>
            <a href="#about">Sobre</a>
            <a href="#partners">Parceiros</a>
            <a href="/docs" onClick={(e) => { e.preventDefault(); navigate('/docs'); }}>Documentação</a>
          </div>
          <div className="nav-actions">
            {isAuthenticated ? (
              <Button variant="ghost" onClick={() => navigate('/dashboard')} leftIcon={<LayoutDashboard size={16} />}>
                Bem vindo, {user.name.split(' ')[0]}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate('/login')} rightIcon={<ArrowRight size={16} />}>
                Entrar
              </Button>
            )}
            
            {isAuthenticated ? (
               <Button onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight size={16} />}>
                 Acessar Plataforma
               </Button>
            ) : (
              <Button onClick={() => navigate('/register')} rightIcon={<ArrowRight size={16} />}>
                Começar Grátis
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-eyebrow">Commerce Operations Desk</p>
            <h1 className="hero-title">
              A Plataforma de Operações <span className="text-gradient">B2B para Shopify</span>
            </h1>
            <p className="hero-subtitle">
              Centralize pedidos, e-mails e financeiro em um único lugar. 
              Sua operação Enterprise organizada, escalar e potencializada por assistentes de IA.
            </p>
            <div className="hero-cta">
              {isAuthenticated ? (
                 <Button size="lg" onClick={() => navigate('/dashboard')} rightIcon={<ArrowRight size={20} />}>
                   Acessar a Plataforma
                 </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight size={20} />}>
                  Começar Agora
                </Button>
              )}
              <Button size="lg" variant="secondary" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
                Ver Módulos
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-wrapper glow-effect">
              <img src="/office.png" alt="NexaDesk Dashboard" />
            </div>
          </div>
        </div>
      </header>

      {/* Partners Section */}
      <section id="partners" className="partners-section">
        <div className="section-header">
          <h2>Confiado por líderes de mercado</h2>
          <p>Empresas que escolheram o NexaDesk para transformar suas operações B2B.</p>
        </div>
        <div className="partners-carousel-wrapper">
          <div className="partners-carousel-mask">
            <div className="partners-carousel-track">
              {/* First set */}
              <a href="https://www.shopify.com/plus" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/shopifyplus.png" alt="Shopify Plus" /></a>
              <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/AWS.png" alt="AWS" /></a>
              <a href="https://www.adobe.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/adobe.png" alt="Adobe" /></a>
              <a href="https://www.bigcommerce.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/bigcommerce.png" alt="BigCommerce" /></a>
              <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/semrush.png" alt="Semrush" /></a>
              <a href="https://business.trustpilot.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Trustpilot.png" alt="Trustpilot" /></a>
              <a href="https://www.contentful.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/contentful.png" alt="Contentful" /></a>
              <a href="https://www.avalara.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/avalara.png" alt="Avalara" /></a>
              <a href="https://www.klevu.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/klevu.png" alt="Klevu" /></a>
              <a href="https://www.signifyd.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/signifyd.png" alt="Signifyd" /></a>
              <a href="https://netalico.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/netalico.png" alt="Netalico" /></a>
              <a href="https://eastsideco.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Eastsideco.png" alt="Eastsideco" /></a>
              <div className="partner-logo-item"><img src="/partner-logos/b2bglobal.png" alt="B2B Global" /></div>
              <a href="https://www.alcerocks.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/alcerocks.png" alt="Alce Rocks" /></a>
              
              {/* Duplicate set for infinite scroll */}
              <a href="https://www.shopify.com/plus" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/shopifyplus.png" alt="Shopify Plus" /></a>
              <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/AWS.png" alt="AWS" /></a>
              <a href="https://www.adobe.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/adobe.png" alt="Adobe" /></a>
              <a href="https://www.bigcommerce.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/bigcommerce.png" alt="BigCommerce" /></a>
              <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/semrush.png" alt="Semrush" /></a>
              <a href="https://business.trustpilot.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Trustpilot.png" alt="Trustpilot" /></a>
              <a href="https://www.contentful.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/contentful.png" alt="Contentful" /></a>
              <a href="https://www.avalara.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/avalara.png" alt="Avalara" /></a>
              <a href="https://www.klevu.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/klevu.png" alt="Klevu" /></a>
              <a href="https://www.signifyd.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/signifyd.png" alt="Signifyd" /></a>
              <a href="https://netalico.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/netalico.png" alt="Netalico" /></a>
              <a href="https://eastsideco.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Eastsideco.png" alt="Eastsideco" /></a>
              <div className="partner-logo-item"><img src="/partner-logos/b2bglobal.png" alt="B2B Global" /></div>
              <a href="https://www.alcerocks.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/alcerocks.png" alt="Alce Rocks" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules Section (Core B2B) */}
      <section id="modules" className="features-section">
        <div className="section-header">
          <h2>O Core da sua Operação</h2>
          <p>Tudo o que você precisa para gerenciar o B2B do Shopify em um só lugar.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-image">
              <img src="/Inbox Centralizado.png" alt="Inbox" />
            </div>
            <h3>Inbox Unificado</h3>
            <p>E-mails, Tickets e Chat integrados com histórico completo do cliente e do pedido.</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-image">
              <img src="/Gestão de Pedidos.png" alt="Pedidos" />
            </div>
            <h3>Gestão de Pedidos</h3>
            <p>Controle de aprovações, edições de pedidos complexos e regras de pagamento B2B (Net Terms).</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-image">
              <img src="/Controle de Refunds.png" alt="Refunds" />
            </div>
            <h3>Refunds & Disputas</h3>
            <p>Workflow claro para devoluções, trocas e reembolsos parciais ou totais.</p>
          </div>
        </div>
      </section>



      {/* AI Operators Section (Auxiliary/Boost) */}
      <section id="ai-operators" className="ai-operators-section" style={{ background: 'var(--bg-primary)' }}>
        <div className="section-header">
          <p className="section-eyebrow">Automação Assistida</p>
          <h2>Potencialize com <span className="text-gradient">Assistentes de IA</span></h2>
          <p>Delegue tarefas repetitivas para nossos agentes autônomos e foque na estratégia.</p>
        </div>
        
        <div className="operators-grid">
          <div className="operator-card">
            <div className="operator-icon" style={{ background: 'rgba(91, 191, 103, 0.15)', color: '#95BF47' }}>
              <Phone size={32} />
            </div>
            <h3>Assistente de Voz</h3>
            <p className="operator-role">Triagem & FAQ</p>
            <ul className="operator-capabilities">
              <li><CheckCircle2 size={16} /> Atendimento telefônico 24/7</li>
              <li><CheckCircle2 size={16} /> Resolve dúvidas simples</li>
              <li><CheckCircle2 size={16} /> Transfere para humanos com contexto</li>
            </ul>
          </div>
          
          <div className="operator-card">
            <div className="operator-icon" style={{ background: 'rgba(91, 191, 103, 0.15)', color: '#95BF47' }}>
              <Package size={32} />
            </div>
            <h3>Monitor de Estoque</h3>
            <p className="operator-role">Supply Chain Alerts</p>
            <ul className="operator-capabilities">
              <li><CheckCircle2 size={16} /> Avisa sobre níveis críticos</li>
              <li><CheckCircle2 size={16} /> Sugere reposição automática</li>
              <li><CheckCircle2 size={16} /> Integração com ERP do cliente</li>
            </ul>
          </div>
          
          <div className="operator-card">
            <div className="operator-icon" style={{ background: 'rgba(91, 191, 103, 0.15)', color: '#95BF47' }}>
              <TrendingUp size={32} />
            </div>
            <h3>Pricing Intelligence</h3>
            <p className="operator-role">Mercado & Competitividade</p>
            <ul className="operator-capabilities">
              <li><CheckCircle2 size={16} /> Monitora preços da concorrência</li>
              <li><CheckCircle2 size={16} /> Sugere ajustes de tabela</li>
              <li><CheckCircle2 size={16} /> Protege sua margem mínima</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Showcase / About Section */}
      <section id="about" className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-image">
            <img src="/building.jpg" alt="NexaDesk Headquarters" />
          </div>
          <div className="showcase-text">
            <h2>Tecnologia Enterprise para o Futuro do B2B</h2>
            <p>
              Nossa sede tecnológica desenvolve soluções que processam milhões em transações
              diariamente. O NexaDesk não é apenas um software, é a espinha dorsal da sua operação.
            </p>
            <ul className="showcase-list">
              <li>
                <CheckCircle2 size={20} className="text-primary" />
                <span>Integração nativa com Shopify Plus</span>
              </li>
              <li>
                <Globe size={20} className="text-primary" />
                <span>Multi-moeda e Multi-idioma</span>
              </li>
              <li>
                <ShieldCheck size={20} className="text-primary" />
                <span>Segurança de nível bancário (SOC2)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/brand-logo.png" alt="NexaDesk" style={{ height: 32 }} />
            <p>© 2026 NexaDesk Inc.</p>
          </div>
          <div className="footer-links">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Status</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Sticky Footer Menu */}
      <nav className="mobile-bottom-nav">
        <button className="mobile-nav-item" onClick={() => navigate('/docs')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Documentação</span>
        </button>
        <button className="mobile-nav-item" onClick={() => navigate('/login')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          <span>Login</span>
        </button>
      </nav>
    </div>
  );
};

