// Email Types
export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  preview: string;
  orderId?: string;
  status: 'new' | 'replied' | 'pending';
  isRead: boolean;
  createdAt: string;
  thread: EmailMessage[];
}

export interface EmailMessage {
  id: string;
  from: {
    name: string;
    email: string;
    isCustomer: boolean;
  };
  content: string;
  createdAt: string;
  isExpanded?: boolean;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: Address;
  emailCount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Refund Types
export interface RefundRequest {
  orderId: string;
  reason: string;
  issues: string[];
  notes: string;
}

export type RefundReason = 
  | 'product_damaged'
  | 'wrong_item'
  | 'not_as_described'
  | 'customer_changed_mind'
  | 'late_delivery'
  | 'other';

// Dashboard Types
export interface DashboardStats {
  pendingEmails: number;
  pendingEmailsTrend: number;
  monthlyRefunds: number;
  monthlyRefundsAmount: number;
  recentOrders: number;
  recentOrdersTrend: number;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  storeName: string;
}

// Settings Types
export interface EmailSettings {
  appEmail: string;
  appPassword: string;
}
