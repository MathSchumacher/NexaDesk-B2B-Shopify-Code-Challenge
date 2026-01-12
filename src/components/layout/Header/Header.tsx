import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, ChevronDown, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIStatusIndicator } from '../../ai';
import { useApp } from '../../../context/AppContext';
import './Header.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const stores = [
  { id: 'store-1', name: 'TechStore Brasil', isActive: true },
  { id: 'store-2', name: 'TechStore USA', isActive: false },
  { id: 'store-3', name: 'TechStore EU', isActive: false },
];

export const Header = ({ onMenuClick }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showStoreSwitcher, setShowStoreSwitcher] = useState(false);
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Novo pedido #1234', time: '2 min atrás', unread: true },
    { id: 2, title: 'Reembolso aprovado', time: '1h atrás', unread: true },
    { id: 3, title: 'AI: Resposta sugerida', time: '3h atrás', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const storeRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (storeRef.current && !storeRef.current.contains(event.target as Node)) {
        setShowStoreSwitcher(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isAuthPage) return null;

  const handleStoreSwitch = (store: typeof stores[0]) => {
    setActiveStore(store);
    setShowStoreSwitcher(false);
  };

  const { state: { user }, actions: { logout } } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} aria-label="Menu">
          <Menu size={20} />
        </button>
        
        <div className="header-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Pesquisar pedidos, clientes..." 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Store Switcher */}
        {/* Store Switcher - Only for Clients */}
        {user.role === 'client' && (
          <div className="store-switcher" ref={storeRef}>
            <button 
              className="store-switcher-btn"
              onClick={() => setShowStoreSwitcher(!showStoreSwitcher)}
            >
              <Store size={16} />
              <span className="store-name">{activeStore.name}</span>
              <ChevronDown size={14} className={showStoreSwitcher ? 'rotated' : ''} />
            </button>

            <AnimatePresence>
              {showStoreSwitcher && (
                <motion.div 
                  className="store-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      className={`store-option ${store.id === activeStore.id ? 'active' : ''}`}
                      onClick={() => handleStoreSwitch(store)}
                    >
                      <Store size={14} />
                      <span>{store.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* AI Status */}
        <AIStatusIndicator isOnline={true} agentCount={3} />

        {/* Notifications */}
        <div className="notification-wrapper" ref={notificationRef}>
          <button 
            className="header-notification" 
            aria-label="Notificações"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img 
              src="/notification.png" 
              alt="Notificações" 
              className="notification-icon-img"
            />
            {unreadCount > 0 && <span className="notification-dot" />}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                className="notification-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="notification-header">
                  <h3>Notificações</h3>
                  {unreadCount > 0 && <span className="badge">{unreadCount} novas</span>}
                </div>
                <div className="notification-list">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                      <p className="notification-title">{notif.title}</p>
                      <span className="notification-time">{notif.time}</span>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button>Marcar todas como lidas</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        <div className="user-menu-wrapper" style={{ position: 'relative' }} ref={userMenuRef}>
          <button 
            className="header-user" 
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name.charAt(0)}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role === 'admin' ? 'Administrador' : user.role === 'support' ? 'Suporte' : 'Cliente'}</span>
            </div>
            <ChevronDown size={14} className={`user-chevron ${showUserMenu ? 'rotated' : ''}`} style={{ marginLeft: '8px', color: 'var(--text-tertiary)', transition: 'transform 0.2s' }} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                className="user-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="user-dropdown-header">
                  <p className="user-dropdown-name">{user.name}</p>
                  <p className="user-dropdown-email">{user.email}</p>
                </div>
                <div className="user-dropdown-divider" />
                <button className="user-dropdown-item" onClick={() => navigate('/settings')}>
                  Configurações
                </button>
                {user.role === 'client' && (
                  <>
                    <button className="user-dropdown-item" onClick={() => navigate('/upgrade')}>
                      Planos e Faturamento
                    </button>
                    <button className="user-dropdown-item" onClick={() => navigate('/api-dashboard')}>
                      Minhas APIs
                    </button>
                  </>
                )}
                <div className="user-dropdown-divider" />
                <button className="user-dropdown-item danger" onClick={handleLogout}>
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
