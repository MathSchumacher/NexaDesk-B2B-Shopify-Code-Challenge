import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  Package,
  RotateCcw,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Bot,
  Ticket,
  Building2,
  BookOpen,
  FileText
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { type UserRole, supportTickets, supportInbox, storeCustomerEmails } from '../../../data/mockData';
import './Sidebar.css';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
  roles?: UserRole[]; // If undefined, visible to all
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  // Client items
  { path: '/inbox', label: 'Inbox', icon: Inbox, badge: 5, roles: ['client'] },
  { path: '/quotes', label: 'Cotações', icon: FileText, roles: ['client'] },
  { path: '/orders', label: 'Pedidos', icon: Package, roles: ['client'] },
  { path: '/refunds', label: 'Refunds', icon: RotateCcw, roles: ['client'] },
  // Support items
  { path: '/tickets', label: 'Tickets', icon: Ticket, badge: 3, roles: ['support'] },
  { path: '/orders', label: 'Consulta Pedidos', icon: Package, roles: ['support'] },
  { path: '/refunds', label: 'Revisão Refunds', icon: RotateCcw, roles: ['support'] },
  { path: '/clients', label: 'Clientes B2B', icon: Building2, roles: ['support'] },
  { path: '/knowledge-base', label: 'Base de Conhecimento', icon: BookOpen, roles: ['support'] },
  // Admin items
  { path: '/clients', label: 'Empresas', icon: Building2, roles: ['admin'] },
  { path: '/price-lists', label: 'Listas de Preço', icon: Ticket, roles: ['admin', 'support'] },
  // Common
  { path: '/settings', label: 'Configurações', icon: Settings },
];

const aiLogs = [
  { id: 1, message: 'Triaging email from John Smith', time: '2s ago' },
  { id: 2, message: 'Translated reply to English', time: '15s ago' },
  { id: 3, message: 'Risk assessment completed', time: '1m ago' },
];

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: { user, emails } } = useApp();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login';
  const [ticketCount, setTicketCount] = useState(0);
  const [inboxCount, setInboxCount] = useState(0);

  // Calculate Inbox Count (Unread) - Role Based - Sync with LocalStorage
  useEffect(() => {
    const updateInboxCount = () => {
      // Determine which inbox the user sees
      let baseEmails = user.role === 'support' ? supportInbox : storeCustomerEmails;
      
      // Merge with local storage (prioritizing local updates)
      const storageKey = `b2b_inbox_${user.role === 'support' ? 'support' : 'client'}`;
      const localInbox = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Create a map to deduplicate by ID, letting local versions overwrite mock ones
      const emailMap = new Map();
      
      // First add base emails
      baseEmails.forEach((e: any) => emailMap.set(e.id, e));
      
      // Then add/overwrite with local emails (which hold the updated isRead status)
      if (Array.isArray(localInbox)) {
         localInbox.forEach((e: any) => emailMap.set(e.id, e));
      }
      
      const allEmails = Array.from(emailMap.values());
      const unreadCount = allEmails.filter((e: any) => !e.isRead).length;
      
      // Count unread
      setInboxCount(unreadCount);
    };

    updateInboxCount();
    window.addEventListener('storage', updateInboxCount);
    const interval = setInterval(updateInboxCount, 2000);

    return () => {
      window.removeEventListener('storage', updateInboxCount);
      clearInterval(interval);
    };
  }, [user.role, emails]);

  // Calculate Ticket Count (Unread) - Sync with LocalStorage + Mock Data
  useEffect(() => {
    const updateTicketCount = () => {
      const storageKey = `b2b_tickets_${user.role === 'support' ? 'support' : 'client'}`;
      const stored = localStorage.getItem(storageKey);
      let combinedTickets = [...supportTickets]; // Start with mock data

      if (stored) {
        try {
          const localTickets = JSON.parse(stored);
          if (Array.isArray(localTickets)) {
             combinedTickets = [...localTickets, ...supportTickets];
          }
        } catch (e) {
          console.error('Error parsing tickets for sidebar:', e);
        }
      }

      // Dedupe by ID
      const seen = new Set();
      const uniqueTickets = combinedTickets.filter((t: any) => {
        if (seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });

      // Filter for UNREAD tickets (regardless of open status, similar to inbox)
      // Default behavior: If isRead is missing (mock data), assume UNREAD unless resolved
      const unread = uniqueTickets.filter((t: any) => {
        if (t.isRead !== undefined) return !t.isRead;
        // Fallback for mocks/legacy data: Resolved = Read, Others = Unread
        return t.status !== 'resolvido';
      }).length;
      
      setTicketCount(unread);
    };

    updateTicketCount();
    window.addEventListener('storage', updateTicketCount);
    // Polling to catch same-tab updates
    const interval = setInterval(updateTicketCount, 2000);

    return () => {
      window.removeEventListener('storage', updateTicketCount);
      clearInterval(interval);
    };
  }, [user.role]);

  // Filter nav items and inject dynamic badges (Hide if 0)
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user.role as UserRole)
  ).map(item => {
    if (item.label === 'Inbox') return { ...item, badge: inboxCount > 0 ? inboxCount : undefined };
    if (item.label === 'Tickets') return { ...item, badge: ticketCount > 0 ? ticketCount : undefined };
    return item;
  });

  if (isAuthPage) return null;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/dashboard')} role="button" tabIndex={0}>
        <div className="logo-icon">
          {isOpen ? (
            <img src="/brand-logo.png" alt="NexaDesk - Go to Dashboard" />
          ) : (
            <img src="/icon.png" alt="NexaDesk - Go to Dashboard" style={{ width: '32px', height: '32px' }} />
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="nav-section">
          <span className="nav-section-title">Menu Principal</span>
          <ul className="nav-list">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* AI Logs */}
      <div className="ai-logs-section">
        <div className="ai-logs-header">
          <Bot size={14} />
          <span>AI Activity</span>
          <motion.span 
            className="live-dot"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <div className="ai-logs-list">
          {aiLogs.map((log) => (
            <div key={log.id} className="ai-log-item">
              <p className="log-message">{log.message}</p>
              <span className="log-time">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="sidebar-footer">
        <div className="upgrade-card" onClick={() => navigate('/upgrade')}>
          <div className="upgrade-icon">
            <ShoppingBag size={20} />
          </div>
          <div className="upgrade-content">
            <h4>Assinaturas</h4>
            <p>Gerencie seu plano</p>
          </div>
          <button className="upgrade-btn">Ver</button>
        </div>
      </div>
    </aside>
  );
};
