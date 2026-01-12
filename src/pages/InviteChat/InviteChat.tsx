import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, AlertCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';
import { joinChatRoom, sendChatMessage, onNewMessage, onChatHistory, connectSocket } from '../../services/socketService';
import { AvatarCropper } from '../../components/AvatarCropper';
import './InviteChat.css';

export const InviteChat = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState(`Convidado#${Math.floor(1000 + Math.random() * 9000)}`);
  const [avatar, setAvatar] = useState<string | null>(null); // Base64 avatar
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [tempNick, setTempNick] = useState(nickname);
  
  // Initialize blocked state immediately from localStorage (synchronous check)
  const [isBlocked, setIsBlocked] = useState(() => {
    // Check for standard auth tokens found in user's environment
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token || user);
  });

  // Check if logged-in user is trying to access the invite page
  useEffect(() => {
    // Check context state
    if (isAuthenticated) {
      setIsBlocked(true);
      toast.error('Você já está logado!', {
        description: 'Não é possível acessar o chat de convidado estando logado.'
      });
      return;
    }
    
    // Also check localStorage for real auth keys (backup check)
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token || user) {
      setIsBlocked(true);
      toast.error('Sessão ativa detectada!', {
        description: 'Você já está logado em outra aba. Use outro navegador.'
      });
    }
  }, [isAuthenticated]);

  // Connect to Socket.IO and join the chat room
  useEffect(() => {
    if (!code || isBlocked) return;

    try {
      connectSocket();
      joinChatRoom(code);

      // Listen for chat history
      onChatHistory((history) => {
        console.log('[InviteChat] Received history:', history);
        setMessages(history);
      });

      // Listen for new messages
      onNewMessage((message) => {
        console.log('[InviteChat] New message:', message);
        setMessages(prev => [...prev, message]);
      });
    } catch (e) {
      console.warn('[InviteChat] Socket connection failed, using localStorage fallback');
    }

    // Add welcome message if no messages
    setMessages([{
      id: 'msg-welcome',
      from: { name: 'Sistema', email: 'system', isCustomer: false },
      content: 'Bem-vindo ao chat! Você foi convidado para discutir um assunto. Um representante entrará em contato em breve.',
      createdAt: new Date().toISOString()
    }]);
  }, [code, isBlocked]);

  const handleSend = () => {
    if (!newMessage.trim() || !code) return;
    
    // Include the avatar in the message
    const message = {
      id: `msg-${Date.now()}`,
      from: { 
        name: nickname, 
        email: 'guest@chat.com', 
        isCustomer: true,
        avatar: avatar // Add avatar property
      },
      content: newMessage,
      createdAt: new Date().toISOString()
    };
    
    // Try WebSocket first, fallback to localStorage
    try {
      sendChatMessage(code, message);
    } catch (e) {
      console.warn('[InviteChat] WebSocket failed, using localStorage');
    }

    // Always save to localStorage as backup
    const storedInbox = JSON.parse(localStorage.getItem('b2b_demo_inbox') || '[]');
    const existingThreadIndex = storedInbox.findIndex((t: any) => t.id === `invite-${code}`);
    
    if (existingThreadIndex >= 0) {
      storedInbox[existingThreadIndex].thread.push(message);
      storedInbox[existingThreadIndex].isRead = false;
      storedInbox[existingThreadIndex].status = 'new';
      storedInbox[existingThreadIndex].preview = message.content;
      // Update the thread's "from" info with latest avatar if they are the sender
      if (message.from.isCustomer) {
        storedInbox[existingThreadIndex].from.avatar = avatar;
      }
      const thread = storedInbox.splice(existingThreadIndex, 1)[0];
      storedInbox.unshift(thread);
    } else {
      storedInbox.unshift({
        id: `invite-${code}`,
        from: { name: nickname, email: 'guest@chat.com', avatar: avatar },
        to: { name: 'Support', email: 'support@nexadesk.com' },
        subject: `Nova conversa de ${nickname}`,
        preview: message.content,
        status: 'new',
        isRead: false,
        createdAt: message.createdAt,
        thread: [message]
      });
    }
    
    localStorage.setItem('b2b_demo_inbox', JSON.stringify(storedInbox));
    window.dispatchEvent(new CustomEvent('inbox-update', { detail: { code } }));

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Mensagem enviada!');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNickSave = () => {
    setNickname(tempNick || `Convidado#${Math.floor(1000 + Math.random() * 9000)}`);
    setIsEditingNick(false);
  };
  
  const handleAvatarSave = (base64: string) => {
    setAvatar(base64);
    setShowAvatarModal(false);
    toast.success('Foto atualizada!');
  };

  // Block screen if user is trying to access their own invite
  if (isBlocked) {
    return (
      <div className="invite-chat-page">
        <div className="invite-chat-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <AlertCircle size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
            <h2 style={{ color: '#fff', marginBottom: '10px' }}>Acesso Bloqueado</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Você já está logado como cliente.<br/>
              Não é possível convidar a si mesmo para um chat.<br/>
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'var(--primary-500)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="invite-chat-page">
      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
          <div className="avatar-modal-content" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>Editar Foto</h2>
            <AvatarCropper 
              onSave={handleAvatarSave} 
              onCancel={() => setShowAvatarModal(false)} 
            />
          </div>
        </div>
      )}

      <div className="invite-chat-container">
        <header className="invite-chat-header">
          <div className="invite-header-left">
            <img src="/brand-logo.png" alt="NexaDesk" className="invite-logo" />
            <div className="invite-info">
              <span className="invite-label">Chat de Suporte</span>
              <span className="invite-code">Código: {code}</span>
            </div>
          </div>
          <div className="invite-header-right">
            {isEditingNick ? (
              <div className="nick-editor">
                <input 
                  type="text" 
                  value={tempNick} 
                  onChange={e => setTempNick(e.target.value)}
                  placeholder="Seu nome"
                  autoFocus
                />
                <button onClick={handleNickSave}>Salvar</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  className="avatar-upload-btn" 
                  onClick={() => setShowAvatarModal(true)}
                  title="Alterar foto"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="avatar-preview" style={{ width: '100%', height: '100%', margin: 0, border: 'none' }} />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>
                <button className="nick-display" onClick={() => { setTempNick(nickname); setIsEditingNick(true); }}>
                  <User size={14} />
                  {nickname}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="invite-chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.from?.isCustomer ? 'guest' : 'system'}`}>
              {msg.from?.isCustomer && (
                <span className="message-nick">{msg.from?.name}</span>
              )}
              <p className="message-content">{msg.content}</p>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>

        <div className="invite-chat-input">
          <textarea 
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            rows={1}
          />
          <button onClick={handleSend} disabled={!newMessage.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
