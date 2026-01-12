// User Roles
export type UserRole = 'client' | 'support' | 'admin';

// Mock Users
export const users = [
  {
    id: 'user-client',
    name: 'Matheus',
    email: 'matheus@techstore.com.br',
    avatar: '/avatar_matheus_1768093896282.png',
    storeName: 'TechStore Brasil',
    role: 'client' as UserRole
  },
  {
    id: 'user-support',
    name: 'Maria Santos',
    email: 'maria@nexadesk.com',
    avatar: '/avatar_support_1768020066194.png',
    storeName: 'NexaDesk Support',
    role: 'support' as UserRole
  },
  {
    id: 'user-admin',
    name: 'John Anderson',
    email: 'john@nexadesk.com',
    avatar: '/avatar_john_1768020092430.png',
    storeName: 'NexaDesk HQ',
    role: 'admin' as UserRole
  }
];

// Default current user (will be set on login)
export const currentUser = users[0];

// Dashboard Statistics
export const dashboardStats = {
  pendingEmails: 12,
  pendingEmailsTrend: 8,
  monthlyRefunds: 5,
  monthlyRefundsAmount: 1847.50,
  recentOrders: 47,
  recentOrdersTrend: 15
};

// Mock Emails
// Client Inbox (Messages FROM Vendor TO Client)
export const clientInbox = [
  {
    id: 'email-client-1',
    from: { name: 'NexaDesk Alerts', email: 'no-reply@nexadesk.com' },
    to: { name: 'TechStore Brasil', email: 'matheus@techstore.com.br' },
    subject: 'Novo catálogo de produtos disponível',
    preview: 'Olá, confira as novidades do mês de Janeiro com preços especiais...',
    status: 'new',
    isRead: false,
    createdAt: '2024-01-10T09:00:00Z',
    thread: [
      {
        id: 'msg-c1-1',
        from: { name: 'NexaDesk Alerts', email: 'no-reply@nexadesk.com', isCustomer: false },
        content: 'Olá Matheus,\n\nO novo catálogo de produtos de Janeiro já está disponível.\n\nDestaques:\n- Novos Smartphones 5G\n- Acessórios Gamers\n\nAcesse "Cotações" para ver os preços atualizados.\n\nAtenciosamente,\nEquipe NexaDesk',
        createdAt: '2024-01-10T09:00:00Z'
      }
    ]
  },
  {
    id: 'email-client-2',
    from: { name: 'Maria Santos', email: 'maria@nexadesk.com' },
    to: { name: 'TechStore Brasil', email: 'matheus@techstore.com.br' },
    subject: 'Re: Sua solicitação de aumento de limite',
    preview: 'Olá Matheus, tenho boas notícias sobre seu limite de crédito...',
    status: 'replied',
    isRead: true,
    createdAt: '2024-01-09T14:00:00Z',
    thread: [
      {
        id: 'msg-c2-1',
        from: { name: 'Matheus Schumacher', email: 'matheus@techstore.com.br', isCustomer: true },
        content: 'Olá Maria, gostaria de solicitar um aumento de limite para R$ 200.000.',
        createdAt: '2024-01-08T10:00:00Z'
      },
      {
        id: 'msg-c2-2',
        from: { name: 'Maria Santos', email: 'maria@nexadesk.com', isCustomer: false },
        content: 'Olá Matheus,\n\nTenho boas notícias! Seu limite foi aprovado para R$ 200.000 com base no seu histórico de pagamentos.\n\nJá está disponível para novos pedidos.\n\nAbraços,\nMaria',
        createdAt: '2024-01-09T14:00:00Z'
      }
    ]
  }
];

// Support Inbox (Personal/Direct messages to Support Agent, not Tickets)
export const supportInbox = [
  {
    id: 'email-support-1',
    from: { name: 'John Anderson', email: 'john@nexadesk.com' },
    to: { name: 'Maria Santos', email: 'maria@nexadesk.com' },
    subject: 'Reunião mensal de resultados',
    preview: 'Maria, a reunião foi remarcada para sexta-feira às 14h...',
    status: 'new',
    isRead: false,
    createdAt: '2024-01-10T08:30:00Z',
    thread: [
      {
        id: 'msg-s1-1',
        from: { name: 'John Anderson', email: 'john@nexadesk.com', isCustomer: false },
        content: 'Oi Maria,\n\nA reunião mensal de resultados foi remarcada para sexta-feira às 14h.\n\nPor favor, traga os números de SLA da semana.\n\nAtt,\nJohn',
        createdAt: '2024-01-10T08:30:00Z'
      }
    ]
  },
  {
    id: 'email-support-2',
    from: { name: 'Sistema', email: 'system@nexadesk.com' },
    to: { name: 'Maria Santos', email: 'maria@nexadesk.com' },
    subject: 'Novo cliente Enterprise cadastrado',
    preview: 'O cliente "Mega Corp" acabou de se cadastrar. Verifique a documentação...',
    status: 'new',
    isRead: true,
    createdAt: '2024-01-09T16:20:00Z',
    thread: [
      {
        id: 'msg-s2-1',
        from: { name: 'Sistema', email: 'system@nexadesk.com', isCustomer: false },
        content: 'Alerta de Novo Cliente:\n\nEmpresa: Mega Corp\nTier: Enterprise\n\nAção necessária: Verificar documentação fiscal em até 24h.',
        createdAt: '2024-01-09T16:20:00Z'
      }
    ]
  }
];

// Original Client Emails (Emails received BY the Client's B2C Store from THEIR customers)
export const storeCustomerEmails = [
  {
    id: 'email-1',
    from: { name: 'John Smith', email: 'john.smith@email.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Question about my order delivery',
    preview: 'Hi, I placed an order last week and I haven\'t received any tracking information...',
    orderId: 'ORD-2024-1847',
    status: 'new',
    isRead: false,
    createdAt: '2024-01-09T14:30:00Z',
    thread: [
      {
        id: 'msg-1-1',
        from: { name: 'John Smith', email: 'john.smith@email.com', isCustomer: true },
        content: 'Hi,\n\nI placed an order last week (Order #ORD-2024-1847) and I haven\'t received any tracking information yet. Could you please provide an update on the shipping status?\n\nThe order was supposed to arrive within 3-5 business days, but it\'s been 7 days now.\n\nThank you,\nJohn',
        createdAt: '2024-01-09T14:30:00Z'
      }
    ]
  },
   {
    id: 'email-2',
    from: { name: 'Emily Johnson', email: 'emily.j@gmail.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Product arrived damaged - Need refund',
    preview: 'The laptop I ordered arrived with a cracked screen. I need to request a refund...',
    orderId: 'ORD-2024-1823',
    status: 'new',
    isRead: false,
    createdAt: '2024-01-09T11:15:00Z',
    thread: [
      {
        id: 'msg-2-1',
        from: { name: 'Emily Johnson', email: 'emily.j@gmail.com', isCustomer: true },
        content: 'Hello,\n\nI received my order #ORD-2024-1823 today, but unfortunately the laptop arrived with a cracked screen. The packaging was also damaged.\n\nI would like to request a full refund for this order.\n\nThank you,\nEmily',
        createdAt: '2024-01-09T11:15:00Z'
      }
    ]
  },
  {
    id: 'email-3',
    from: { name: 'Michael Brown', email: 'mbrown@outlook.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Re: Your order has been shipped',
    preview: 'Thank you for the quick response! I appreciate the excellent customer service...',
    orderId: 'ORD-2024-1856',
    status: 'replied',
    isRead: true,
    createdAt: '2024-01-08T16:45:00Z',
    thread: [
      {
         id: 'msg-3-1',
        from: { name: 'TechStore Brasil', email: 'support@techstore.com.br', isCustomer: false },
        content: 'Dear Michael,\n\nGreat news! Your order #ORD-2024-1856 has been shipped.\n\nTracking Number: BR1234567890\nEstimated Delivery: January 12, 2024\n\nBest regards,\nTechStore Brasil Team',
        createdAt: '2024-01-08T14:20:00Z'
      },
      {
        id: 'msg-3-2',
        from: { name: 'Michael Brown', email: 'mbrown@outlook.com', isCustomer: true },
        content: 'Thank you for the quick response! I appreciate the excellent customer service. Can\'t wait to receive it.',
        createdAt: '2024-01-08T16:45:00Z'
      }
    ]
  },
  {
    id: 'email-4',
    from: { name: 'Sarah Wilson', email: 'swilson@company.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Bulk order inquiry for office equipment',
    preview: 'We are interested in placing a bulk order for 50 monitors for our new office...',
    orderId: undefined,
    status: 'pending',
    isRead: true,
    createdAt: '2024-01-08T09:00:00Z',
    thread: [
      {
        id: 'msg-4-1',
        from: { name: 'Sarah Wilson', email: 'swilson@company.com', isCustomer: true },
        content: 'Hello,\n\nWe are interested in placing a bulk order for 50 monitors for our new office.\n\nCould you please provide bulk pricing?\n\nThank you,\nSarah Wilson',
        createdAt: '2024-01-08T09:00:00Z'
      }
    ]
  },
  {
    id: 'email-5',
    from: { name: 'David Lee', email: 'dlee@techmail.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Wrong item received',
    preview: 'I ordered a wireless keyboard but received a wired one instead...',
    orderId: 'ORD-2024-1801',
    status: 'new',
    isRead: false,
    createdAt: '2024-01-07T18:30:00Z',
    thread: [
      {
        id: 'msg-5-1',
        from: { name: 'David Lee', email: 'dlee@techmail.com', isCustomer: true },
        content: 'Hi there,\n\nI received my order #ORD-2024-1801 today, but there seems to be a mix-up. I ordered a Wireless Mechanical Keyboard but received a Wired USB Keyboard instead.\n\nCan you please arrange for an exchange?\n\nThanks,\nDavid',
        createdAt: '2024-01-07T18:30:00Z'
      }
    ]
  },
  {
    id: 'email-6',
    from: { name: 'Anna Martinez', email: 'anna.m@email.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Refund request for Smart Watch',
    preview: 'I would like to return the Smart Watch I bought...',
    orderId: 'ORD-2024-1756',
    status: 'replied',
    isRead: true,
    createdAt: '2023-12-21T09:00:00Z',
    thread: [
      {
        id: 'msg-6-1',
        from: { name: 'Anna Martinez', email: 'anna.m@email.com', isCustomer: true },
        content: 'Hi, I received the Smart Watch yesterday but it is too big for my wrist. I would like to return it.',
        createdAt: '2023-12-21T09:00:00Z'
      },
      {
        id: 'msg-6-2',
        from: { name: 'TechStore Brasil', email: 'support@techstore.com.br', isCustomer: false },
        content: 'Hello Anna, sorry to hear that. We have processed your refund request. Please send the item back to us.',
        createdAt: '2023-12-21T10:30:00Z'
      }
    ]
  },
  {
    id: 'email-7',
    from: { name: 'Anna Martinez', email: 'anna.m@email.com' },
    to: { name: 'TechStore Brasil', email: 'support@techstore.com.br' },
    subject: 'Re: Refund processed',
    preview: 'Thank you for the quick help!',
    orderId: 'ORD-2024-1756',
    status: 'replied',
    isRead: true,
    createdAt: '2023-12-22T14:00:00Z',
    thread: [
      {
        id: 'msg-7-1',
        from: { name: 'Anna Martinez', email: 'anna.m@email.com', isCustomer: true },
        content: 'Thank you for the quick help! I have mailed the package today.',
        createdAt: '2023-12-22T14:00:00Z'
      }
    ]
  }
];

// Export generic 'emails' for compatibility, defaulting to storeCustomerEmails for now
export const emails = storeCustomerEmails;

// Mock Orders
export const orders = [
  {
    id: 'ORD-2024-1847',
    orderNumber: '#1847',
    customer: { name: 'John Smith', email: 'john.smith@email.com' },
    amount: 2599.90,
    currency: 'BRL',
    status: 'processing',
    createdAt: '2024-01-02T10:30:00Z',
    items: [
      { id: 'item-1', name: 'Wireless Bluetooth Earbuds Pro', quantity: 1, price: 399.90 },
      { id: 'item-2', name: 'USB-C Hub 7-in-1', quantity: 2, price: 299.90 },
      { id: 'item-3', name: 'Mechanical Gaming Keyboard RGB', quantity: 1, price: 899.90 }
    ],
    shippingAddress: {
      street: '123 Main Street, Apt 4B',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil'
    },
    emailCount: 1
  },
  {
    id: 'ORD-2024-1823',
    orderNumber: '#1823',
    customer: { name: 'Emily Johnson', email: 'emily.j@gmail.com' },
    amount: 5299.00,
    currency: 'BRL',
    status: 'delivered',
    createdAt: '2023-12-28T14:15:00Z',
    items: [
      { id: 'item-5', name: 'Laptop UltraBook Pro 15"', quantity: 1, price: 5299.00 }
    ],
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22041-080',
      country: 'Brasil'
    },
    emailCount: 1
  },
  {
    id: 'ORD-2024-1856',
    orderNumber: '#1856',
    customer: { name: 'Michael Brown', email: 'mbrown@outlook.com' },
    amount: 1849.90,
    currency: 'BRL',
    status: 'shipped',
    createdAt: '2024-01-05T09:00:00Z',
    items: [
      { id: 'item-6', name: '4K Monitor 27"', quantity: 1, price: 1849.90 }
    ],
    shippingAddress: {
      street: '789 Pine Road',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-000',
      country: 'Brasil'
    },
    emailCount: 2
  },
  {
    id: 'ORD-2024-1801',
    orderNumber: '#1801',
    customer: { name: 'David Lee', email: 'dlee@techmail.com' },
    amount: 599.90,
    currency: 'BRL',
    status: 'pending',
    createdAt: '2024-01-03T16:45:00Z',
    items: [
      { id: 'item-7', name: 'Wireless Mechanical Keyboard', quantity: 1, price: 599.90 }
    ],
    shippingAddress: {
      street: '321 Cedar Lane',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80020-000',
      country: 'Brasil'
    },
    emailCount: 1
  },
  {
    id: 'ORD-2024-1756',
    orderNumber: '#1756',
    customer: { name: 'Anna Martinez', email: 'anna.m@email.com' },
    amount: 459.90,
    currency: 'BRL',
    status: 'refunded',
    createdAt: '2023-12-20T11:30:00Z',
    items: [
      { id: 'item-8', name: 'Smart Watch Fitness Pro', quantity: 1, price: 459.90 }
    ],
    shippingAddress: {
      street: '555 Maple Drive',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90010-000',
      country: 'Brasil'
    },
    emailCount: 3
  },
  {
    id: 'ORD-2024-1890',
    orderNumber: '#1890',
    customer: { name: 'Carlos Oliveira', email: 'carlos.o@email.com' },
    amount: 3299.00,
    currency: 'BRL',
    status: 'processing',
    createdAt: '2024-01-08T13:20:00Z',
    items: [
      { id: 'item-10', name: 'Gaming Console XS', quantity: 1, price: 2799.00 },
      { id: 'item-11', name: 'Extra Controller', quantity: 1, price: 500.00 }
    ],
    shippingAddress: {
      street: '777 Elm Road',
      city: 'Brasília',
      state: 'DF',
      zipCode: '70040-000',
      country: 'Brasil'
    },
    emailCount: 0
  }
];

// Refund Reasons
export const refundReasons = [
  { value: 'product_damaged', label: 'Produto Danificado' },
  { value: 'wrong_item', label: 'Produto Errado' },
  { value: 'not_as_described', label: 'Não Confere com Descrição' },
  { value: 'customer_changed_mind', label: 'Desistência do Cliente' },
  { value: 'late_delivery', label: 'Atraso na Entrega' },
  { value: 'other', label: 'Outro Motivo' }
];

// Refund Issues
export const refundIssues = [
  { id: 'delay', label: 'Atraso' },
  { id: 'defect', label: 'Defeito' },
  { id: 'withdrawal', label: 'Desistência' },
  { id: 'wrong_product', label: 'Produto Trocado' },
  { id: 'quality', label: 'Qualidade Inferior' }
];

// Support Tickets
export type TicketPriority = 'alta' | 'media' | 'baixa';
export type TicketStatus = 'aberto' | 'em_andamento' | 'resolvido';

export const supportTickets = [
  {
    displayId: 1001,
    id: 'ticket-1',
    subject: 'Problema com integração Shopify',
    description: 'A sincronização de pedidos parou de funcionar desde ontem. Preciso urgente de ajuda.',
    client: { id: 'company-1', name: 'TechStore Brasil', email: 'contato@techstore.com.br' },
    priority: 'alta' as TicketPriority,
    status: 'aberto' as TicketStatus,
    isRead: false,
    createdAt: '2024-01-09T10:00:00Z',
    updatedAt: '2024-01-09T10:00:00Z',
    messages: [
      { id: 'msg-1', from: 'client', content: 'A sincronização de pedidos parou de funcionar desde ontem.', createdAt: '2024-01-09T10:00:00Z' }
    ]
  },
  {
    displayId: 1002,
    id: 'ticket-2',
    subject: 'Dúvida sobre limite de crédito',
    description: 'Gostaria de entender como funciona o aumento de limite.',
    client: { id: 'company-2', name: 'Moda Express LTDA', email: 'financeiro@modaexpress.com.br' },
    priority: 'media' as TicketPriority,
    status: 'em_andamento' as TicketStatus,
    isRead: false,
    assignedTo: 'Maria Santos',
    createdAt: '2024-01-08T14:30:00Z',
    updatedAt: '2024-01-09T09:15:00Z',
    messages: [
      { id: 'msg-2', from: 'client', content: 'Gostaria de entender como funciona o aumento de limite.', createdAt: '2024-01-08T14:30:00Z' },
      { id: 'msg-3', from: 'support', content: 'Olá! O limite é baseado no histórico de pagamentos. Vou analisar sua conta.', createdAt: '2024-01-09T09:15:00Z' }
    ]
  },
  {
    displayId: 1003,
    id: 'ticket-3',
    subject: 'Pedido não chegou no prazo',
    description: 'O pedido #1756 estava previsto para ontem e ainda não chegou.',
    client: { id: 'company-3', name: 'Casa & Decoração', email: 'suporte@casadecoracao.com.br' },
    priority: 'alta' as TicketPriority,
    status: 'aberto' as TicketStatus,
    isRead: false,
    createdAt: '2024-01-09T08:45:00Z',
    updatedAt: '2024-01-09T08:45:00Z',
    messages: [
      { id: 'msg-4', from: 'client', content: 'O pedido #1756 estava previsto para ontem e ainda não chegou.', createdAt: '2024-01-09T08:45:00Z' }
    ]
  },
  {
    displayId: 1004,
    id: 'ticket-4',
    subject: 'Como exportar relatórios?',
    description: 'Preciso exportar os relatórios de vendas do mês passado.',
    client: { id: 'company-4', name: 'Eletrônicos Plus', email: 'admin@eletronicosplus.com.br' },
    priority: 'baixa' as TicketPriority,
    status: 'resolvido' as TicketStatus,
    isRead: true,
    assignedTo: 'Maria Santos',
    createdAt: '2024-01-07T16:00:00Z',
    updatedAt: '2024-01-08T10:30:00Z',
    messages: [
      { id: 'msg-5', from: 'client', content: 'Preciso exportar os relatórios de vendas do mês passado.', createdAt: '2024-01-07T16:00:00Z' },
      { id: 'msg-6', from: 'support', content: 'Você pode ir em Dashboard > Relatórios > Exportar CSV.', createdAt: '2024-01-08T10:30:00Z' },
      { id: 'msg-7', from: 'client', content: 'Funcionou! Obrigado!', createdAt: '2024-01-08T11:00:00Z' }
    ]
  },
  {
    displayId: 1005,
    id: 'ticket-5',
    subject: 'Erro ao processar pagamento',
    description: 'Cliente final recebendo erro 500 no checkout.',
    client: { id: 'company-1', name: 'TechStore Brasil', email: 'contato@techstore.com.br' },
    priority: 'alta' as TicketPriority,
    status: 'em_andamento' as TicketStatus,
    isRead: false,
    assignedTo: 'Maria Santos',
    createdAt: '2024-01-09T11:20:00Z',
    updatedAt: '2024-01-09T12:00:00Z',
    messages: [
      { id: 'msg-8', from: 'client', content: 'Clientes estão recebendo erro 500 no checkout. Urgente!', createdAt: '2024-01-09T11:20:00Z' },
      { id: 'msg-9', from: 'support', content: 'Estamos investigando. Parece ser um problema com o gateway de pagamento.', createdAt: '2024-01-09T12:00:00Z' }
    ]
  }
];

// Knowledge Base
export const knowledgeBase = [
  {
    id: 'kb-1',
    category: 'Integração',
    title: 'Como configurar a integração com Shopify',
    content: 'Para configurar a integração:\n1. Acesse Configurações > Integrações\n2. Clique em "Conectar Shopify"\n3. Autorize o acesso à sua loja\n4. Aguarde a sincronização inicial (pode levar até 30 minutos)',
    tags: ['shopify', 'integração', 'configuração']
  },
  {
    id: 'kb-2',
    category: 'Crédito',
    title: 'Política de limite de crédito B2B',
    content: 'Limites são baseados em:\n- Histórico de pagamentos\n- Volume de compras\n- Tempo como cliente\n\nPara solicitar aumento, o cliente deve ter 6+ meses e 0 atrasos.',
    tags: ['crédito', 'limite', 'b2b']
  },
  {
    id: 'kb-3',
    category: 'Refunds',
    title: 'Processo de aprovação de refunds',
    content: 'Refunds até R$500 podem ser aprovados diretamente.\nRefunds acima de R$500 precisam de aprovação do gerente.\nPrazo máximo para solicitação: 30 dias após entrega.',
    tags: ['refund', 'reembolso', 'política']
  },
  {
    id: 'kb-4',
    category: 'Pedidos',
    title: 'Rastreamento de pedidos',
    content: 'Para rastrear:\n1. Acesse Pedidos > Buscar por ID\n2. Clique no pedido\n3. Veja o código de rastreio\n\nCódigo BR = Correios\nCódigo LP = Loggi',
    tags: ['pedido', 'rastreio', 'entrega']
  }
];

// Canned Responses for Support
export const cannedResponses = [
  {
    id: 'canned-1',
    title: 'Saudação inicial',
    content: 'Olá! Obrigado por entrar em contato. Meu nome é [NOME] e estou aqui para ajudar. Como posso auxiliá-lo hoje?'
  },
  {
    id: 'canned-2',
    title: 'Pedido em trânsito',
    content: 'Seu pedido está em trânsito! O código de rastreio é [CODIGO]. Você pode acompanhar em [LINK]. Previsão de entrega: [DATA].'
  },
  {
    id: 'canned-3',
    title: 'Refund aprovado',
    content: 'Seu pedido de reembolso foi aprovado! O valor de [VALOR] será creditado em até 7 dias úteis na forma de pagamento original.'
  },
  {
    id: 'canned-4',
    title: 'Encerramento',
    content: 'Fico feliz em ter ajudado! Se precisar de mais alguma coisa, não hesite em entrar em contato. Tenha um ótimo dia!'
  }
];

// Support Dashboard Stats
export const supportStats = {
  openTickets: 3,
  inProgressTickets: 2,
  resolvedToday: 5,
  avgResponseTime: '2h 15min',
  slaCompliance: 94,
  pendingRefunds: 4
};

