import { useNavigate } from 'react-router-dom';
import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Globe, ShieldCheck, Phone, TrendingUp, Package, LayoutDashboard, Plus } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { HeroBackground } from '../../components/3d/HeroBackground';
import { Interactive3DImage } from '../../components/3d/Interactive3DImage';
import { SplitTextReveal } from '../../components/animations/SplitTextReveal';
import { ScrollReveal } from '../../components/animations/ScrollReveal';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import './Landing.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const Landing = () => {
  const navigate = useNavigate();
  const { state: { user }, isAuthenticated } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Main container ref for GSAP context
  const heroRef = useRef<HTMLElement>(null);

  // Initialize smooth scrolling
  useSmoothScroll({ lerp: 0.08, duration: 1.4 });

  // Handle click outside dropdown (both desktop and mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Also close mobile menu if clicking outside
      const mobileDropdown = document.querySelector('.mobile-plus-dropdown');
      const mobileButton = document.querySelector('.mobile-nav-item-container');
      if (mobileDropdown && mobileButton && !mobileButton.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // GSAP Animation Timeline
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation - using 'to' for reliability
      const heroElements = ['.hero-eyebrow', '.hero-title', '.hero-subtitle', '.hero-cta', '.hero-image'];
      
      // Set initial states
      gsap.set(heroElements, { opacity: 0, y: 30 });
      gsap.set('.hero-image', { scale: 0.95 });
      
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      heroTl
        .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6 })
        .to('.hero-title', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .to('.hero-image', { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.6');

      // Feature cards scroll animation
      const featureCards = gsap.utils.toArray('.feature-card');
      featureCards.forEach((card, i) => {
        gsap.fromTo(card as Element, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card as Element,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // AI Operator cards scroll animation
      const operatorCards = gsap.utils.toArray('.operator-card');
      operatorCards.forEach((card, i) => {
        gsap.fromTo(card as Element, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card as Element,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Note: Partner carousel animation removed - using pure CSS animation instead

      // Showcase section image animation (building.jpg)
      gsap.fromTo('.showcase-image', 
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.showcase-section',
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="landing-page" ref={heroRef as React.RefObject<HTMLDivElement>}>
      {/* Full-Page WebGL Background (below navbar) */}
      <HeroBackground className="page-webgl-bg" />
      
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
            <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contato</a>
            
            <div className="nav-dropdown-container" ref={dropdownRef}>
                <button 
                    className={`nav-dropdown-trigger ${showDropdown ? 'active' : ''}`}
                    onClick={() => setShowDropdown(!showDropdown)}
                    aria-label="Mais opções"
                >
                    <Plus size={16} />
                </button>
                
                {showDropdown && (
                    <div className="nav-dropdown-menu">
                        <button onClick={() => navigate('/terms')}>Termos</button>
                        <button onClick={() => navigate('/privacy')}>Privacidade</button>
                        <button onClick={() => navigate('/status')}>Status</button>
                    </div>
                )}
            </div>
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
            <p className="hero-subtitle" style={{ color: 'white' }}>
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
            <Interactive3DImage 
              src="/office.png" 
              alt="NexaDesk Dashboard" 
              className="glow-effect"
              intensity={25}
            />
          </div>
        </div>
      </header>

      {/* Partners Section */}
      <section id="partners" className="partners-section">
        <div className="section-header">
          <h1>Confiado por líderes de mercado</h1>
          <p style={{ color: 'white' }}>Empresas que escolheram o NexaDesk para transformar suas operações B2B.</p>
        </div>
        <div className="partners-carousel-wrapper">
          <div className="partners-carousel-mask">
            <div className="partners-carousel-track">
              <a href="https://www.shopify.com/plus" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-shopify"><img src="/partner-logos/shopifyplus.png" alt="Shopify Plus" /></a>
              <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/AWS.png" alt="AWS" /></a>
              <a href="https://www.adobe.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-adobe"><img src="/partner-logos/adobe.png" alt="Adobe" /></a>
              <a href="https://www.bigcommerce.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-bigcommerce"><img src="/partner-logos/bigcommerce.png" alt="BigCommerce" /></a>
              <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/semrush.png" alt="Semrush" /></a>
              <a href="https://business.trustpilot.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Trustpilot.png" alt="Trustpilot" /></a>
              <a href="https://www.contentful.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/contentful.png" alt="Contentful" /></a>
              <a href="https://www.avalara.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/avalara.png" alt="Avalara" /></a>
              <a href="https://www.klevu.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/klevu.png" alt="Klevu" /></a>
              <a href="https://www.signifyd.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/signifyd.png" alt="Signifyd" /></a>
              <a href="https://netalico.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/netalico.png" alt="Netalico" /></a>
              <a href="https://eastsideco.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-eastsideco"><img src="/partner-logos/Eastsideco.png" alt="Eastsideco" /></a>
              <div className="partner-logo-item partner-b2bglobal"><img src="/partner-logos/b2bglobal.png" alt="B2B Global" /></div>
              <a href="https://www.alcerocks.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-alcerocks"><img src="/partner-logos/alcerocks.png" alt="Alce Rocks" /></a>
              
              {/* Duplicate set for infinite scroll */}
              <a href="https://www.shopify.com/plus" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-shopify"><img src="/partner-logos/shopifyplus.png" alt="Shopify Plus" /></a>
              <a href="https://aws.amazon.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/AWS.png" alt="AWS" /></a>
              <a href="https://www.adobe.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-adobe"><img src="/partner-logos/adobe.png" alt="Adobe" /></a>
              <a href="https://www.bigcommerce.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-bigcommerce"><img src="/partner-logos/bigcommerce.png" alt="BigCommerce" /></a>
              <a href="https://www.semrush.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/semrush.png" alt="Semrush" /></a>
              <a href="https://business.trustpilot.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/Trustpilot.png" alt="Trustpilot" /></a>
              <a href="https://www.contentful.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/contentful.png" alt="Contentful" /></a>
              <a href="https://www.avalara.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/avalara.png" alt="Avalara" /></a>
              <a href="https://www.klevu.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/klevu.png" alt="Klevu" /></a>
              <a href="https://www.signifyd.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/signifyd.png" alt="Signifyd" /></a>
              <a href="https://netalico.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item"><img src="/partner-logos/netalico.png" alt="Netalico" /></a>
              <a href="https://eastsideco.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-eastsideco"><img src="/partner-logos/Eastsideco.png" alt="Eastsideco" /></a>
              <div className="partner-logo-item partner-b2bglobal"><img src="/partner-logos/b2bglobal.png" alt="B2B Global" /></div>
              <a href="https://www.alcerocks.com" target="_blank" rel="noopener noreferrer" className="partner-logo-item partner-alcerocks"><img src="/partner-logos/alcerocks.png" alt="Alce Rocks" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Modules Section (Core B2B) */}
      <section id="modules" className="features-section">
        <div className="section-header">
          <SplitTextReveal as="h1" splitBy="words" staggerAmount={0.05} duration={0.6}>
            O Core da sua Operação
          </SplitTextReveal>
          <SplitTextReveal as="p" splitBy="words" staggerAmount={0.02} delay={0.2} style={{ color: 'white' }}>
            Tudo o que você precisa para gerenciar o B2B do Shopify em um só lugar.
          </SplitTextReveal>
        </div>
        
        <ScrollReveal className="features-grid" animation="fadeUp" stagger={0.15} duration={0.8}>
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
        </ScrollReveal>
      </section>



      {/* AI Operators Section (Auxiliary/Boost) */}
      <section id="ai-operators" className="ai-operators-section">
        <div className="section-header">
          <SplitTextReveal as="p" className="section-eyebrow" splitBy="words" staggerAmount={0.02} style={{ whiteSpace: 'nowrap' }}>
            Automação Assistida
          </SplitTextReveal>
          <h2>
            <SplitTextReveal as="span" splitBy="words" staggerAmount={0.03}>
              Potencialize com
            </SplitTextReveal>{' '}
            <ScrollReveal as="span" className="text-gradient" animation="fadeUp" delay={0.1} duration={0.8} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
              Assistentes de IA
            </ScrollReveal>
          </h2>
          <SplitTextReveal as="p" splitBy="words" staggerAmount={0.01} delay={0.2} style={{ color: 'white' }}>
            Delegue tarefas repetitivas para nossos agentes autônomos e foque na estratégia.
          </SplitTextReveal>
        </div>
        
        <ScrollReveal className="operators-grid" animation="fadeUp" stagger={0.15} duration={0.8} delay={0.4}>
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
        </ScrollReveal>
      </section>

      {/* Showcase / About Section */}
      <section id="about" className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-image">
            <Interactive3DImage 
              src="/building.jpg" 
              alt="NexaDesk Headquarters" 
              intensity={20}
            />
          </div>
          <div className="showcase-text">
            <h2>Tecnologia Enterprise para o Futuro do B2B</h2>
            <p style={{ color: 'white' }}>
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
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Termos</button>
            <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacidade</button>
            <button onClick={() => navigate('/status')} className="hover:text-white transition-colors">Status</button>
            <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contato</button>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation - Sticky Footer Menu */}
      {/* Mobile Bottom Navigation - Sticky Footer Menu */}
      <nav className="mobile-bottom-nav">
        
        {/* Plus Menu Trigger */}
        <div className="mobile-nav-item-container" style={{ position: 'relative' }}>
            {showMobileMenu && (
                <div className="mobile-plus-dropdown">
                    <button onClick={() => navigate('/terms')}>Termos</button>
                    <button onClick={() => navigate('/privacy')}>Privacidade</button>
                    <button onClick={() => navigate('/status')}>Status</button>
                </div>
            )}
            <button 
                className={`mobile-nav-item ${showMobileMenu ? 'active' : ''}`} 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="mobile-nav-icon-wrapper">
                <Plus size={24} className="mobile-nav-icon" style={{ color: 'white' }} />
              </div>
              <span>Mais</span>
            </button>
        </div>

        {/* Contact Button */}
        <button className="mobile-nav-item" onClick={() => navigate('/contact')}>
          <div className="mobile-nav-icon-wrapper">
            <img src="/contato.png" alt="Contato" className="mobile-nav-icon" />
          </div>
          <span>Contato</span>
        </button>

        {/* Docs Button */}
        <button className="mobile-nav-item" onClick={() => navigate('/docs')}>
          <div className="mobile-nav-icon-wrapper">
            <img src="/documentation.png" alt="Docs" className="mobile-nav-icon" />
          </div>
          <span>Documentação</span>
        </button>

        {/* Login Button */}
        <button className="mobile-nav-item" onClick={() => navigate('/login')}>
          <div className="mobile-nav-icon-wrapper">
            <img src="/login.png" alt="Login" className="mobile-nav-icon" />
          </div>
          <span>Login</span>
        </button>
      </nav>
    </div>
  );
};

