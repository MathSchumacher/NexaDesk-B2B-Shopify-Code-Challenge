import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar, Header } from './components/layout';
import { Login, Dashboard, Inbox, Orders, OrderDetail, Settings, Refunds, Upgrade, Register, Landing, Documentation, DocsIntro, DocsPlatform, DocsPricingApi, DocsStockApi, DocsSupport, ApiSubscription, ApiDashboard, InviteChat, Tickets, Clients, ClientDetail, PriceLists, KnowledgeBase, Quotes, Terms, Privacy, Status, Contact } from './pages';
import { AppProvider } from './context/AppContext';
import { CommandPalette } from './components/CommandPalette';
import { LiveActivityPulse } from './components/LiveActivityPulse';
import './index.css';
import './App.css';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/landing' || location.pathname.startsWith('/docs') || location.pathname === '/api-subscribe' || location.pathname.startsWith('/invite') || location.pathname === '/terms' || location.pathname === '/privacy' || location.pathname === '/status' || location.pathname === '/contact';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <main className="main-content">
        {children}
      </main>
      <LiveActivityPulse />
      <CommandPalette />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(18, 18, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }
          }}
        />
        <AppLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/docs" element={<Documentation />}>
              <Route index element={<Navigate to="intro" replace />} />
              <Route path="intro" element={<DocsIntro />} />
              <Route path="platform" element={<DocsPlatform />} />
              <Route path="pricing-api" element={<DocsPricingApi />} />
              <Route path="stock-api" element={<DocsStockApi />} />
              <Route path="support" element={<DocsSupport />} />
            </Route>
            <Route path="/invite/:code" element={<InviteChat />} />
            <Route path="/api-subscribe" element={<ApiSubscription />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/api-dashboard" element={<ApiDashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/price-lists" element={<PriceLists />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/status" element={<Status />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}


export default App;
