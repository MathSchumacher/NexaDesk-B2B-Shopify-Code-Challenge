// Global App Context - State Management
// Developer: Matheus Schumacher | 2026

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { emails as initialEmails, orders as initialOrders, currentUser, users } from '../data/mockData';
import { companies as initialCompanies, teamMembers } from '../data/companies';

// Action Types
type ActionType =
  | { type: 'SET_EMAILS'; payload: typeof initialEmails }
  | { type: 'UPDATE_EMAIL'; payload: { id: string; updates: Record<string, unknown> } }
  | { type: 'SET_ORDERS'; payload: typeof initialOrders }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Record<string, unknown> } }
  | { type: 'SET_COMPANIES'; payload: typeof initialCompanies }
  | { type: 'UPDATE_COMPANY'; payload: { id: string; updates: Record<string, unknown> } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_EMAIL'; payload: string | null }
  | { type: 'SET_SELECTED_ORDER'; payload: string | null }
  | { type: 'INCREMENT_SYNC_COUNT' }
  | { type: 'SET_COMMAND_PALETTE_OPEN'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: typeof currentUser };

// State Type
interface AppState {
  emails: typeof initialEmails;
  orders: typeof initialOrders;
  companies: typeof initialCompanies;
  user: typeof currentUser;
  teamMembers: typeof teamMembers;
  isLoading: boolean;
  selectedEmailId: string | null;
  selectedOrderId: string | null;
  syncCount: number;
  isCommandPaletteOpen: boolean;
  isAuthenticated: boolean;
}

// Initial State
const initialState: AppState = {
  emails: initialEmails,
  orders: initialOrders,
  companies: initialCompanies,
  user: currentUser,
  teamMembers: teamMembers,
  isLoading: false,
  selectedEmailId: null,
  selectedOrderId: null,
  syncCount: 1240,
  isCommandPaletteOpen: false,
  isAuthenticated: false
};

// Reducer
const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_EMAILS':
      return { ...state, emails: action.payload };
    
    case 'UPDATE_EMAIL':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload.id
            ? { ...email, ...action.payload.updates }
            : email
        ) as typeof initialEmails
      };
    
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        ) as typeof initialOrders
      };
    
    case 'SET_COMPANIES':
      return { ...state, companies: action.payload };
    
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id
            ? { ...company, ...action.payload.updates }
            : company
        ) as typeof initialCompanies
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SELECTED_EMAIL':
      return { ...state, selectedEmailId: action.payload };
    
    case 'SET_SELECTED_ORDER':
      return { ...state, selectedOrderId: action.payload };
    
    case 'INCREMENT_SYNC_COUNT':
      return { ...state, syncCount: state.syncCount + 1 };
    
    case 'SET_COMMAND_PALETTE_OPEN':
      return { ...state, isCommandPaletteOpen: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
  actions: {
    markEmailAsRead: (id: string) => Promise<void>;
    updateEmailStatus: (id: string, status: string) => Promise<void>;
    assignEmail: (id: string, agentId: string, agentName: string) => Promise<void>;
    addEmailTag: (id: string, tag: string) => Promise<void>;
    removeEmailTag: (id: string, tag: string) => Promise<void>;
    updateOrderStatus: (id: string, status: string) => Promise<void>;
    processRefund: (id: string, reason: string) => Promise<void>;
    toggleCommandPalette: () => void;
    login: () => void;
    logout: () => void;
    loginAs: (userId: string) => void;
  };
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate sync count incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'INCREMENT_SYNC_COUNT' });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Actions with simulated delays
  const actions = {
    markEmailAsRead: async (id: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'UPDATE_EMAIL', payload: { id, updates: { isRead: true } } });
      dispatch({ type: 'SET_LOADING', payload: false });
    },

    updateEmailStatus: async (id: string, status: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 400));
      dispatch({ type: 'UPDATE_EMAIL', payload: { id, updates: { status } } });
      dispatch({ type: 'SET_LOADING', payload: false });
    },

    assignEmail: async (id: string, agentId: string, agentName: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 400));
      dispatch({ 
        type: 'UPDATE_EMAIL', 
        payload: { id, updates: { assignedTo: { id: agentId, name: agentName } } } 
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    },

    addEmailTag: async (id: string, tag: string) => {
      const email = state.emails.find(e => e.id === id) as Record<string, unknown> | undefined;
      if (!email) return;
      const currentTags = (email.tags as string[]) || [];
      if (!currentTags.includes(tag)) {
        dispatch({ 
          type: 'UPDATE_EMAIL', 
          payload: { id, updates: { tags: [...currentTags, tag] } } 
        });
      }
    },

    removeEmailTag: async (id: string, tag: string) => {
      const email = state.emails.find(e => e.id === id) as Record<string, unknown> | undefined;
      if (!email) return;
      const currentTags = (email.tags as string[]) || [];
      dispatch({ 
        type: 'UPDATE_EMAIL', 
        payload: { id, updates: { tags: currentTags.filter((t: string) => t !== tag) } } 
      });
    },

    updateOrderStatus: async (id: string, status: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_ORDER', payload: { id, updates: { status } } });
      dispatch({ type: 'SET_LOADING', payload: false });
    },

    processRefund: async (id: string, _reason: string) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'UPDATE_ORDER', payload: { id, updates: { status: 'processing_refund' } } });
      await new Promise(resolve => setTimeout(resolve, 1500));
      dispatch({ type: 'UPDATE_ORDER', payload: { id, updates: { status: 'refunded' } } });
      dispatch({ type: 'SET_LOADING', payload: false });
    },

    toggleCommandPalette: () => {
      dispatch({ type: 'SET_COMMAND_PALETTE_OPEN', payload: !state.isCommandPaletteOpen });
    },

    login: () => {
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      localStorage.setItem('b2b_session', 'active');
    },

    logout: () => {
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      localStorage.removeItem('b2b_session');
    },

    loginAs: (userId: string) => {
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser) {
        dispatch({ type: 'SET_USER', payload: selectedUser });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        localStorage.setItem('b2b_session', 'active');
      }
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions, isAuthenticated: state.isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppContext;
