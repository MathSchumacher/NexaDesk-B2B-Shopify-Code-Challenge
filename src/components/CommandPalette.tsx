// Command Palette (Cmd+K) - Global Search
// Developer: Matheus Schumacher | 2026

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { 
  LayoutDashboard, 
  Inbox, 
  Package, 
  RotateCcw, 
  Settings,
  Search,
  Mail,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CommandPalette.css';

export const CommandPalette = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const isOpen = state.isCommandPaletteOpen;

  const setOpen = (open: boolean) => {
    dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: open });
  };

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
      // Power user shortcuts
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        if (e.key === 'r') {
          navigate('/inbox');
        } else if (e.key === 'e') {
          navigate('/orders');
        } else if (e.key === 'd') {
          navigate('/dashboard');
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, navigate]);

  const handleSelect = (value: string) => {
    setOpen(false);
    
    if (value.startsWith('/')) {
      navigate(value);
    } else if (value.startsWith('email:')) {
      navigate('/inbox');
    } else if (value.startsWith('order:')) {
      const orderId = value.replace('order:', '');
      navigate(`/orders/${orderId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={() => setOpen(false)}>
      <Command className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-input-wrapper">
          <Search size={18} />
          <Command.Input 
            placeholder="Buscar páginas, pedidos, e-mails..." 
            autoFocus
          />
          <kbd>ESC</kbd>
        </div>
        
        <Command.List>
          <Command.Empty>Nenhum resultado encontrado.</Command.Empty>
          
          <Command.Group heading="Navegação">
            <Command.Item onSelect={() => handleSelect('/dashboard')}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
              <kbd>D</kbd>
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/inbox')}>
              <Inbox size={16} />
              <span>Inbox</span>
              <kbd>R</kbd>
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/orders')}>
              <Package size={16} />
              <span>Pedidos</span>
              <kbd>E</kbd>
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/refunds')}>
              <RotateCcw size={16} />
              <span>Refunds</span>
            </Command.Item>
            <Command.Item onSelect={() => handleSelect('/settings')}>
              <Settings size={16} />
              <span>Configurações</span>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="E-mails Recentes">
            {state.emails.slice(0, 3).map(email => (
              <Command.Item 
                key={email.id}
                onSelect={() => handleSelect(`email:${email.id}`)}
              >
                <Mail size={16} />
                <span>{email.from.name} - {email.subject}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Pedidos Recentes">
            {state.orders.slice(0, 3).map(order => (
              <Command.Item 
                key={order.id}
                onSelect={() => handleSelect(`order:${order.id}`)}
              >
                <Package size={16} />
                <span>{order.orderNumber} - {order.customer.name}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Empresas">
            {state.companies.slice(0, 3).map(company => (
              <Command.Item 
                key={company.id}
                onSelect={() => handleSelect('/orders')}
              >
                <Building2 size={16} />
                <span>{company.name}</span>
                <span className="command-tag">{company.tier}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
};
