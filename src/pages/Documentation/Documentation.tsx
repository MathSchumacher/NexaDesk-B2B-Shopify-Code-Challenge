import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Book, Layers, HelpCircle, DollarSign, Package, LayoutDashboard, Github } from 'lucide-react';
import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import './Documentation.css';

export const Documentation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useApp();

  // If path is exactly /docs, redirect to /docs/intro
  if (location.pathname === '/docs') {
    // This side-effect should theoretically be in useEffect, but for simplicity in this turn we handle via routing or conditional rendering. 
    // Ideally App.tsx handles the redirect, but let's keep it robust.
  }

  // eBook-style Swipe Navigation Logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Define route order for loop navigation
  const docRoutes = [
    '/docs/intro',
    '/docs/platform',
    '/docs/pricing-api',
    '/docs/stock-api',
    '/docs/support'
  ];

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = docRoutes.findIndex(route => location.pathname.includes(route));
      if (currentIndex === -1) return;

      let nextIndex;
      if (isLeftSwipe) {
        // Next Page (Loop: last -> first)
        nextIndex = currentIndex === docRoutes.length - 1 ? 0 : currentIndex + 1;
      } else {
        // Prev Page (Loop: first -> last)
        nextIndex = currentIndex === 0 ? docRoutes.length - 1 : currentIndex - 1;
      }
      
      // Add slide animation class? Logic handled by CSS or just route change
      navigate(docRoutes[nextIndex]);
    }
  };

  return (
    <div 
      className="docs-page"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Mobile Back Button */}
      <button onClick={() => navigate('/')} className="mobile-back-btn-global">
        <ArrowLeft size={20} />
      </button>
      <nav className="docs-nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/brand-logo.png" alt="NexaDesk" />
            <span className="docs-badge">Developer Hub</span>
          </div>
          <div className="nav-actions">
            {isAuthenticated ? (
              <Button variant="primary" leftIcon={<LayoutDashboard size={16} />} onClick={() => navigate('/dashboard')}>
                Voltar para Plataforma
              </Button>
            ) : (
              <Button variant="ghost" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/')}>
                Voltar para Nível Usuário
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Github size={16} />} onClick={() => window.open('https://github.com/nexadesk/sdk', '_blank')}>
              SDK Node.js
            </Button>
          </div>
        </div>
      </nav>

      <div className="docs-container">
        <aside className="docs-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-group">
              <h3>Start</h3>
              <NavLink to="/docs/intro" className={({ isActive }) => isActive ? 'active' : ''}>
                <Book size={16} className="sidebar-icon" /> Visão Geral (Usuário)
              </NavLink>
              <NavLink to="/docs/platform" className={({ isActive }) => isActive ? 'active' : ''}>
                <Layers size={16} className="sidebar-icon" /> Arquitetura SaaS
              </NavLink>
            </div>
            
            <div className="sidebar-group">
              <h3>APIs & Integração</h3>
              <NavLink to="/docs/pricing-api" className={({ isActive }) => isActive ? 'active' : ''}>
                <DollarSign size={16} className="sidebar-icon" /> API Auto-Precificação
              </NavLink>
              <NavLink to="/docs/stock-api" className={({ isActive }) => isActive ? 'active' : ''}>
                <Package size={16} className="sidebar-icon" /> API Reposição & ERP
              </NavLink>
            </div>
            
            <div className="sidebar-group">
              <h3>Suporte</h3>
              <NavLink to="/docs/support" className={({ isActive }) => isActive ? 'active' : ''}>
                <HelpCircle size={16} className="sidebar-icon" /> FAQ & Troubleshooting
              </NavLink>
            </div>
          </div>
        </aside>

        <main className="docs-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
