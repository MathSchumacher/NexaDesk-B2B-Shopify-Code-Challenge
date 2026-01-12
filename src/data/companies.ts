// B2B Companies Mock Data
// Developer: Matheus Schumacher | 2026

export interface ApiUsage {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  monthlyLimit: number;
  currentMonthCalls: number;
  lastMonthCalls: number;
  overageFees: number;
  avgResponseTime: number; // ms
}

export interface Subscription {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  monthlyFee: number;
  startedAt: string;
  totalPaid: number; // Lifetime subscription payments
}

export interface CustomFeature {
  id: string;
  name: string;
  description: string;
  deliveredAt: string;
  devCost: number; // One-time development cost
  isActive: boolean;
}

export const companies = [
  {
    id: 'company-1',
    name: 'TechCorp Distribuidora LTDA',
    cnpj: '12.345.678/0001-90',
    tier: 'enterprise' as const,
    paymentTerms: 'net_60' as const,
    creditLimit: 500000,
    creditUsed: 125000,
    status: 'active' as const,
    loyaltyScore: 5,
    yearsSinceJoined: 4,
    primaryContact: {
      name: 'Carlos Eduardo Silva',
      email: 'carlos@techcorp.com.br',
      phone: '+55 11 99999-1234'
    },
    users: [
      { id: 'user-tc-1', name: 'Carlos Eduardo Silva', email: 'carlos@techcorp.com.br', role: 'admin' as const, isActive: true },
      { id: 'user-tc-2', name: 'Marina Costa', email: 'marina@techcorp.com.br', role: 'buyer' as const, isActive: true },
      { id: 'user-tc-3', name: 'Roberto Financeiro', email: 'roberto@techcorp.com.br', role: 'finance' as const, isActive: true }
    ],
    createdAt: '2022-03-15T10:00:00Z',
    lastOrderAt: '2026-01-08T14:30:00Z',
    lifetimeValue: 2450000,
    totalOrders: 187,
    // NEW: API Usage Data
    apiUsage: {
      plan: 'enterprise' as const,
      monthlyLimit: 500000,
      currentMonthCalls: 387420,
      lastMonthCalls: 412890,
      overageFees: 0,
      avgResponseTime: 45
    },
    // NEW: Subscription Data
    subscription: {
      plan: 'enterprise' as const,
      monthlyFee: 2999,
      startedAt: '2022-03-15T10:00:00Z',
      totalPaid: 143952 // ~48 months
    },
    // NEW: Custom Features
    customFeatures: [
      { id: 'cf-1', name: 'SAP ERP Integration', description: 'Sincronização bidirecional com SAP S/4HANA', deliveredAt: '2023-06-01', devCost: 45000, isActive: true },
      { id: 'cf-2', name: 'Custom SSO (Azure AD)', description: 'Login corporativo via Azure Active Directory', deliveredAt: '2023-09-15', devCost: 12000, isActive: true },
      { id: 'cf-3', name: 'White-Label Portal', description: 'Portal com marca própria TechCorp', deliveredAt: '2024-02-20', devCost: 28000, isActive: true }
    ],
    // NEW: Total Investment (calculated)
    totalInvested: 228952, // subscription.totalPaid + sum(customFeatures.devCost)
    // NEW: Discount Applied
    discountPercent: 25,
    discountReason: 'Enterprise Tier - 4+ years tenure'
  },
  {
    id: 'company-2',
    name: 'Mega Electronics S.A.',
    cnpj: '98.765.432/0001-10',
    tier: 'gold' as const,
    paymentTerms: 'net_30' as const,
    creditLimit: 200000,
    creditUsed: 89000,
    status: 'active' as const,
    loyaltyScore: 4,
    yearsSinceJoined: 2,
    primaryContact: {
      name: 'Ana Paula Mendes',
      email: 'ana.paula@megaelectronics.com.br',
      phone: '+55 21 98888-5678'
    },
    users: [
      { id: 'user-me-1', name: 'Ana Paula Mendes', email: 'ana.paula@megaelectronics.com.br', role: 'admin' as const, isActive: true },
      { id: 'user-me-2', name: 'João Pedro', email: 'joao@megaelectronics.com.br', role: 'buyer' as const, isActive: true }
    ],
    createdAt: '2024-01-20T09:00:00Z',
    lastOrderAt: '2026-01-09T11:15:00Z',
    lifetimeValue: 890000,
    totalOrders: 67,
    apiUsage: {
      plan: 'professional' as const,
      monthlyLimit: 100000,
      currentMonthCalls: 67890,
      lastMonthCalls: 72340,
      overageFees: 0,
      avgResponseTime: 52
    },
    subscription: {
      plan: 'professional' as const,
      monthlyFee: 999,
      startedAt: '2024-01-20T09:00:00Z',
      totalPaid: 23976 // ~24 months
    },
    customFeatures: [
      { id: 'cf-4', name: 'Webhook Notifications', description: 'Notificações em tempo real para sistema interno', deliveredAt: '2024-08-10', devCost: 8000, isActive: true }
    ],
    totalInvested: 31976,
    discountPercent: 15,
    discountReason: 'Gold Tier - High volume customer'
  },
  {
    id: 'company-3',
    name: 'InfoStore Comércio',
    cnpj: '11.222.333/0001-44',
    tier: 'silver' as const,
    paymentTerms: 'net_30' as const,
    creditLimit: 50000,
    creditUsed: 48000,
    status: 'active' as const,
    loyaltyScore: 3,
    yearsSinceJoined: 1,
    primaryContact: {
      name: 'Fernanda Lima',
      email: 'fernanda@infostore.com.br',
      phone: '+55 31 97777-9012'
    },
    users: [
      { id: 'user-is-1', name: 'Fernanda Lima', email: 'fernanda@infostore.com.br', role: 'admin' as const, isActive: true }
    ],
    createdAt: '2025-02-10T14:00:00Z',
    lastOrderAt: '2026-01-07T16:45:00Z',
    lifetimeValue: 156000,
    totalOrders: 23,
    apiUsage: {
      plan: 'starter' as const,
      monthlyLimit: 10000,
      currentMonthCalls: 8450,
      lastMonthCalls: 7120,
      overageFees: 0,
      avgResponseTime: 68
    },
    subscription: {
      plan: 'starter' as const,
      monthlyFee: 299,
      startedAt: '2025-02-10T14:00:00Z',
      totalPaid: 3289 // ~11 months
    },
    customFeatures: [],
    totalInvested: 3289,
    discountPercent: 5,
    discountReason: 'Silver Tier - Standard discount'
  },
  {
    id: 'company-4',
    name: 'Byte Solutions EIRELI',
    cnpj: '55.666.777/0001-88',
    tier: 'bronze' as const,
    paymentTerms: 'prepaid' as const,
    creditLimit: 10000,
    creditUsed: 0,
    status: 'pending' as const,
    loyaltyScore: 2,
    yearsSinceJoined: 0,
    primaryContact: {
      name: 'Lucas Oliveira',
      email: 'lucas@bytesolutions.com.br',
      phone: '+55 41 96666-3456'
    },
    users: [
      { id: 'user-bs-1', name: 'Lucas Oliveira', email: 'lucas@bytesolutions.com.br', role: 'admin' as const, isActive: true }
    ],
    createdAt: '2026-01-05T08:00:00Z',
    lifetimeValue: 5600,
    totalOrders: 2,
    apiUsage: {
      plan: 'free' as const,
      monthlyLimit: 1000,
      currentMonthCalls: 234,
      lastMonthCalls: 0,
      overageFees: 0,
      avgResponseTime: 120
    },
    subscription: {
      plan: 'free' as const,
      monthlyFee: 0,
      startedAt: '2026-01-05T08:00:00Z',
      totalPaid: 0
    },
    customFeatures: [],
    totalInvested: 0,
    discountPercent: 0,
    discountReason: null
  },
  {
    id: 'company-5',
    name: 'DataMax Importadora',
    cnpj: '33.444.555/0001-99',
    tier: 'gold' as const,
    paymentTerms: 'net_60' as const,
    creditLimit: 150000,
    creditUsed: 175000,
    status: 'blocked' as const,
    blockedReason: 'credit_exceeded',
    loyaltyScore: 3,
    yearsSinceJoined: 3,
    primaryContact: {
      name: 'Ricardo Santos',
      email: 'ricardo@datamax.com.br',
      phone: '+55 51 95555-7890'
    },
    users: [
      { id: 'user-dm-1', name: 'Ricardo Santos', email: 'ricardo@datamax.com.br', role: 'admin' as const, isActive: true },
      { id: 'user-dm-2', name: 'Patrícia Melo', email: 'patricia@datamax.com.br', role: 'finance' as const, isActive: true }
    ],
    createdAt: '2023-06-01T11:00:00Z',
    lastOrderAt: '2025-12-20T09:30:00Z',
    lifetimeValue: 678000,
    totalOrders: 89,
    apiUsage: {
      plan: 'professional' as const,
      monthlyLimit: 100000,
      currentMonthCalls: 45670,
      lastMonthCalls: 89340,
      overageFees: 1250,
      avgResponseTime: 58
    },
    subscription: {
      plan: 'professional' as const,
      monthlyFee: 999,
      startedAt: '2023-06-01T11:00:00Z',
      totalPaid: 30969 // ~31 months
    },
    customFeatures: [
      { id: 'cf-5', name: 'Legacy XML Import', description: 'Importação de catálogos em formato XML legado', deliveredAt: '2024-03-01', devCost: 15000, isActive: true },
      { id: 'cf-6', name: 'Custom Reports', description: 'Relatórios personalizados de vendas', deliveredAt: '2024-07-15', devCost: 6500, isActive: false }
    ],
    totalInvested: 52469,
    discountPercent: 15,
    discountReason: 'Gold Tier - Long-term customer'
  }
];

// Discount Automation Rules
export interface DiscountRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    field: 'yearsSinceJoined' | 'totalInvested' | 'totalOrders' | 'apiUsage.plan';
    operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
    value: number | string;
  }[];
  resultTier: 'bronze' | 'silver' | 'gold' | 'enterprise';
  resultDiscount: number;
  isActive: boolean;
}

export const discountRules: DiscountRule[] = [
  {
    id: 'rule-1',
    name: 'Enterprise Loyalty',
    description: 'Clientes com mais de 3 anos e investimento acima de R$100k',
    conditions: [
      { field: 'yearsSinceJoined', operator: '>=', value: 3 },
      { field: 'totalInvested', operator: '>=', value: 100000 }
    ],
    resultTier: 'enterprise',
    resultDiscount: 25,
    isActive: true
  },
  {
    id: 'rule-2',
    name: 'Gold Growth',
    description: 'Clientes com mais de 50 pedidos ou investimento acima de R$25k',
    conditions: [
      { field: 'totalOrders', operator: '>=', value: 50 }
    ],
    resultTier: 'gold',
    resultDiscount: 15,
    isActive: true
  },
  {
    id: 'rule-3',
    name: 'Silver Starter',
    description: 'Clientes com mais de 1 ano na plataforma',
    conditions: [
      { field: 'yearsSinceJoined', operator: '>=', value: 1 }
    ],
    resultTier: 'silver',
    resultDiscount: 5,
    isActive: true
  }
];


// Team members for agent assignment
export const teamMembers = [
  { id: 'agent-1', name: 'Maria Santos', role: 'Support Lead', avatar: undefined },
  { id: 'agent-2', name: 'Nara Silva', role: 'B2B Specialist', avatar: undefined },
  { id: 'agent-3', name: 'Pedro Costa', role: 'Technical Support', avatar: undefined },
  { id: 'agent-4', name: 'Julia Ferreira', role: 'Account Manager', avatar: undefined }
];

// Custom tags for tickets
export const customTags = [
  { id: 'vip', label: 'VIP', color: '#fbbf24' },
  { id: 'wholesale', label: 'Wholesale', color: '#8b5cf6' },
  { id: 'urgent', label: 'Urgent', color: '#ef4444' },
  { id: 'net30', label: 'Net 30', color: '#3b82f6' },
  { id: 'net60', label: 'Net 60', color: '#6366f1' },
  { id: 'enterprise', label: 'Enterprise', color: '#22c55e' },
  { id: 'first-order', label: 'First Order', color: '#f97316' }
];

// B2B Order States
export const b2bOrderStates = [
  { value: 'pending_analysis', label: 'Em Análise', color: '#f59e0b' },
  { value: 'approved', label: 'Aprovado', color: '#22c55e' },
  { value: 'in_production', label: 'Em Produção', color: '#3b82f6' },
  { value: 'invoiced', label: 'Faturado', color: '#8b5cf6' },
  { value: 'shipped', label: 'Enviado', color: '#6366f1' },
  { value: 'delivered', label: 'Entregue', color: '#22c55e' },
  { value: 'refunded', label: 'Reembolsado', color: '#ef4444' },
  { value: 'cancelled', label: 'Cancelado', color: '#6b7280' }
];

// Payment terms
export const paymentTermsOptions = [
  { value: 'prepaid', label: 'Pré-pago', daysToPayment: 0 },
  { value: 'net_30', label: 'Net 30', daysToPayment: 30 },
  { value: 'net_60', label: 'Net 60', daysToPayment: 60 },
  { value: 'net_90', label: 'Net 90', daysToPayment: 90 }
];
