// Socket Service - LocalStorage-based fallback for demo purposes
// Developer: Matheus Schumacher | 2026
// Note: For true cross-browser sync, run the backend server and install socket.io-client

const SOCKET_URL = 'http://localhost:3001';

let socket: any = null;
let socketAvailable = false;

// Try to connect to WebSocket server (optional)
export const connectSocket = (): any => {
  if (socket) return socket;
  
  // Check if window.io is available (from CDN or local script)
  const globalIo = (window as any).io;
  
  if (globalIo) {
    try {
      socket = globalIo(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 5000
      });
      
      socket.on('connect', () => {
        console.log('[Socket] Connected:', socket?.id);
        socketAvailable = true;
      });
      
      socket.on('disconnect', () => {
        console.log('[Socket] Disconnected');
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

export const getSocket = (): any => socket;

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

export const sendChatMessage = (code: string, message: any): void => {
  const sock = connectSocket();
  if (sock && socketAvailable) sock.emit('send-message', { code, message });
};

export const onNewMessage = (callback: (message: any) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('new-message');
    sock.on('new-message', callback);
  }
};

export const onInboxUpdate = (callback: (data: any) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('inbox-update');
    sock.on('inbox-update', callback);
  }
};

export const onChatHistory = (callback: (messages: any[]) => void): void => {
  const sock = connectSocket();
  if (sock) {
    sock.off('chat-history');
    sock.on('chat-history', callback);
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
