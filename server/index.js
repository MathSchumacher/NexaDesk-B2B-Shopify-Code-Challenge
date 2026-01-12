// Simple Backend Server for B2B SaaS Demo
// Enables cross-browser chat synchronization via WebSocket
// Developer: Matheus Schumacher | 2026

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS for local development
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage for demo (replace with database in production)
const chatMessages = new Map(); // code -> messages[]
const activeInvites = new Map(); // code -> { createdBy, createdAt }

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get messages for a specific invite code
app.get('/api/chat/:code', (req, res) => {
  const { code } = req.params;
  const messages = chatMessages.get(code) || [];
  res.json({ code, messages });
});

// Create a new invite
app.post('/api/invite', (req, res) => {
  const { code, createdBy } = req.body;
  activeInvites.set(code, { createdBy, createdAt: new Date().toISOString() });
  res.json({ success: true, code });
});

// Check if invite exists and who created it
app.get('/api/invite/:code', (req, res) => {
  const { code } = req.params;
  const invite = activeInvites.get(code);
  if (invite) {
    res.json({ exists: true, ...invite });
  } else {
    res.json({ exists: false });
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Join a chat room based on invite code
  socket.on('join-chat', (code) => {
    socket.join(code);
    console.log(`[Socket] ${socket.id} joined room: ${code}`);
    
    // Send existing messages to the new participant
    const existingMessages = chatMessages.get(code) || [];
    socket.emit('chat-history', existingMessages);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    const { code, message } = data;
    console.log(`[Socket] New message in ${code}:`, message);

    // Store message
    if (!chatMessages.has(code)) {
      chatMessages.set(code, []);
    }
    chatMessages.get(code).push(message);

    // Broadcast to all clients in this room (including sender for confirmation)
    io.to(code).emit('new-message', message);

    // Also notify the inbox channel
    io.emit('inbox-update', {
      code,
      from: message.from,
      preview: message.content.substring(0, 50),
      timestamp: message.createdAt
    });
  });

  // --- Ticket System & AI Logic ---
  
  // Join support room (for agents)
  socket.on('join-support', () => {
    socket.join('support-room');
    console.log(`[Socket] ${socket.id} joined support-room`);
    // Send current tickets
    socket.emit('initial-tickets', Array.from(tickets.values()));
  });

  socket.on('create-ticket', (ticketData) => {
    console.log('[Socket] New ticket received:', ticketData);
    
    // 1. AI Analysis Logic
    let priority = 'baixa';
    const textToCheck = (ticketData.subject + ' ' + ticketData.description).toLowerCase();
    
    if (textToCheck.includes('urgente') || textToCheck.includes('erro') || textToCheck.includes('crítico') || textToCheck.includes('parou')) {
      priority = 'alta';
    } else if (textToCheck.includes('bug') || textToCheck.includes('problema') || textToCheck.includes('falha')) {
      priority = 'media';
    }

    // 2. Create Ticket Object
    const newTicket = {
      id: `ticket-${Date.now()}`,
      ...ticketData,
      priority,
      status: 'aberto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: `msg-${Date.now()}`,
        from: 'ai-agent',
        content: `Olá! Sou o Agente Virtual da NexaDesk. Analisei sua solicitação e classifiquei como prioridade ${priority.toUpperCase()}. Um especialista humano irá assumir seu caso em breve.`,
        createdAt: new Date().toISOString()
      }]
    };

    // Store in memory
    tickets.set(newTicket.id, newTicket);

    // 3. Response to Client
    socket.emit('ticket-created', {
      success: true,
      ticket: newTicket,
      aiResponse: newTicket.messages[0].content
    });

    // 4. Notify Support Team
    io.to('support-room').emit('new-ticket', newTicket);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// In-memory tickets storage
const tickets = new Map();  // id -> ticket object

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🚀 B2B Demo Backend running on http://localhost:${PORT}`);
  console.log(`   WebSocket ready for connections\n`);
});
