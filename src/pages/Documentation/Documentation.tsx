import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Book, Layers, HelpCircle, DollarSign, Package, LayoutDashboard } from 'lucide-react';
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

  return (
    <div className="docs-page">
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
            <Button variant="secondary" onClick={() => window.open('https://github.com/nexadesk/sdk', '_blank')}>
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
