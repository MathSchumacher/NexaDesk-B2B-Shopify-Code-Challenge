// Mock API Service - Simulates backend operations
// Developer: Matheus Schumacher | 2026

const DELAY_MIN = 200;
const DELAY_MAX = 800;

// Simulate network delay
const simulateDelay = () => 
  new Promise(resolve => 
    setTimeout(resolve, DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN))
  );

// LocalStorage keys
const STORAGE_KEYS = {
  EMAILS: 'shopmail_emails',
  ORDERS: 'shopmail_orders',
  COMPANIES: 'shopmail_companies',
  NOTES: 'shopmail_notes',
  USER_SESSION: 'shopmail_session'
};

// Generic CRUD operations
export const mockApi = {
  // GET all items
  getAll: async <T>(key: string, defaultData: T[]): Promise<T[]> => {
    await simulateDelay();
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  },

  // GET single item
  getById: async <T extends { id: string }>(key: string, id: string): Promise<T | null> => {
    await simulateDelay();
    const stored = localStorage.getItem(key);
    if (stored) {
      const items: T[] = JSON.parse(stored);
      return items.find(item => item.id === id) || null;
    }
    return null;
  },

  // CREATE item
  create: async <T extends { id: string }>(key: string, item: T): Promise<T> => {
    await simulateDelay();
    const stored = localStorage.getItem(key);
    const items: T[] = stored ? JSON.parse(stored) : [];
    items.push(item);
    localStorage.setItem(key, JSON.stringify(items));
    return item;
  },

  // UPDATE item
  update: async <T extends { id: string }>(key: string, id: string, updates: Partial<T>): Promise<T | null> => {
    await simulateDelay();
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const items: T[] = JSON.parse(stored);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(key, JSON.stringify(items));
    return items[index];
  },

  // DELETE item
  delete: async <T extends { id: string }>(key: string, id: string): Promise<boolean> => {
    await simulateDelay();
    const stored = localStorage.getItem(key);
    if (!stored) return false;
    
    const items: T[] = JSON.parse(stored);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};

// Email-specific operations
export const emailApi = {
  markAsRead: async (id: string) => 
    mockApi.update(STORAGE_KEYS.EMAILS, id, { isRead: true }),
  
  markAsUnread: async (id: string) => 
    mockApi.update(STORAGE_KEYS.EMAILS, id, { isRead: false }),
  
  updateStatus: async (id: string, status: string) => 
    mockApi.update(STORAGE_KEYS.EMAILS, id, { status }),
  
  assignToAgent: async (id: string, agentId: string, agentName: string) => 
    mockApi.update(STORAGE_KEYS.EMAILS, id, { assignedTo: { id: agentId, name: agentName } }),
  
  addTag: async (id: string, tag: string) => {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!stored) return null;
    const emails = JSON.parse(stored);
    const email = emails.find((e: { id: string }) => e.id === id);
    if (!email) return null;
    const tags = email.tags || [];
    if (!tags.includes(tag)) tags.push(tag);
    return mockApi.update(STORAGE_KEYS.EMAILS, id, { tags });
  },

  removeTag: async (id: string, tag: string) => {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!stored) return null;
    const emails = JSON.parse(stored);
    const email = emails.find((e: { id: string }) => e.id === id);
    if (!email) return null;
    const tags = (email.tags || []).filter((t: string) => t !== tag);
    return mockApi.update(STORAGE_KEYS.EMAILS, id, { tags });
  },

  addInternalNote: async (emailId: string, note: { id: string; authorId: string; authorName: string; content: string; createdAt: string }) => {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (!stored) return null;
    const emails = JSON.parse(stored);
    const email = emails.find((e: { id: string }) => e.id === emailId);
    if (!email) return null;
    const internalNotes = email.internalNotes || [];
    internalNotes.push(note);
    return mockApi.update(STORAGE_KEYS.EMAILS, emailId, { internalNotes });
  }
};

// Order-specific operations
export const orderApi = {
  updateStatus: async (id: string, status: string) => 
    mockApi.update(STORAGE_KEYS.ORDERS, id, { status }),
  
  processRefund: async (id: string, reason: string) => 
    mockApi.update(STORAGE_KEYS.ORDERS, id, { 
      status: 'refunded', 
      refundReason: reason,
      refundedAt: new Date().toISOString()
    }),
  
  approveOrder: async (id: string) => 
    mockApi.update(STORAGE_KEYS.ORDERS, id, { 
      status: 'approved',
      approvedAt: new Date().toISOString()
    })
};

// Company-specific operations
export const companyApi = {
  getAll: () => mockApi.getAll(STORAGE_KEYS.COMPANIES, []),
  
  updateCreditLimit: async (id: string, newLimit: number) => 
    mockApi.update(STORAGE_KEYS.COMPANIES, id, { creditLimit: newLimit }),
  
  updatePaymentTerms: async (id: string, terms: string) => 
    mockApi.update(STORAGE_KEYS.COMPANIES, id, { paymentTerms: terms }),
  
  blockForNonPayment: async (id: string) => 
    mockApi.update(STORAGE_KEYS.COMPANIES, id, { status: 'blocked', blockedReason: 'non_payment' }),
  
  unblock: async (id: string) => 
    mockApi.update(STORAGE_KEYS.COMPANIES, id, { status: 'active', blockedReason: null })
};

export { STORAGE_KEYS };
