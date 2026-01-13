// Socket Service - LocalStorage-based fallback for demo purposes
// Developer: Matheus Schumacher | 2026

const SOCKET_URL = 'http://localhost:3001';

// Basic Type Definitions to replace 'any'
export interface SocketMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
}

export interface InboxUpdateData {
  type: 'new_email' | 'update_status';
  emailId?: string;
  payload?: unknown;
  // Expanded fields to match Inbox.tsx usage
  from?: { name: string; email: string; avatar?: string };
  code?: string;
  preview?: string;
  timestamp?: string;
}

// Mimic the Socket.io client structure partially
interface ClientSocket {
  id?: string;
  connected: boolean;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback?: (...args: unknown[]) => void) => void;
  emit: (event: string, data?: unknown) => void;
  disconnect: () => void;
}

let socket: ClientSocket | null = null;
let socketAvailable = false;

// Try to connect to WebSocket server (optional)
export const connectSocket = (): ClientSocket | null => {
  if (socket) return socket;
  
  // Check if window.io is available (from CDN or local script)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalIo = (window as any).io;
  
  if (globalIo) {
    try {
      socket = globalIo(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 5000
      }) as ClientSocket;
      
      socket.on('connect', () => {
        socketAvailable = true;
      });
      
      socket.on('disconnect', () => {
        socketAvailable = false;
      });
      
      socket.on('connect_error', () => {
        // Silently fail - localStorage fallback will work
        socketAvailable = false;
      });
      
      return socket;
    } catch (e) {
      console.warn('[Socket] Failed to initialize, using localStorage fallback');
      return null;
    }
  }
  
  // If no socket.io library, just return null - localStorage fallback will work
  console.info('[Socket] socket.io not available. Using localStorage for same-browser sync.');
  return null;
};

export const getSocket = (): ClientSocket | null => socket;

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    socketAvailable = false;
  }
};

export const joinChatRoom = (code: string): void => {
  const sock = connectSocket();
  if (sock && socketAvailable) sock.emit('join-chat', code);
};

export const sendChatMessage = (code: string, message: unknown): void => {
  const sock = connectSocket();
  if (sock && socketAvailable) sock.emit('send-message', { code, message });
};

export const onNewMessage = (callback: (message: SocketMessage) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('new-message');
    sock.on('new-message', (data) => callback(data as SocketMessage));
  }
};

export const onInboxUpdate = (callback: (data: InboxUpdateData) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('inbox-update');
    sock.on('inbox-update', (data) => callback(data as InboxUpdateData));
  }
};

export const onChatHistory = (callback: (messages: SocketMessage[]) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('chat-history');
    sock.on('chat-history', (data) => callback(data as SocketMessage[]));
  }
};

export default {
  connectSocket,
  getSocket,
  disconnectSocket,
  joinChatRoom,
  sendChatMessage,
  onNewMessage,
  onInboxUpdate,
  onChatHistory
};
