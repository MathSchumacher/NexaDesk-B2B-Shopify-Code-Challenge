import { useState, useEffect } from 'react';
import { 
  Search, 
  Reply, 
  Trash2, 
  Forward, 
  Languages, 
  Send, 
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Paperclip,
  Star,
  Link2
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, Badge, Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { InternalNotes } from '../../components/InternalNotes';
import { AgentAssignment } from '../../components/AgentAssignment';
import { CustomTags } from '../../components/CustomTags';
import { supportInbox, storeCustomerEmails } from '../../data/mockData';
import { generateCustomerResponse, getTypingDelay, getResponseDelay } from '../../services/aiCustomerService';
import { 
  connectSocket, 
  onInboxUpdate, 
  type InboxUpdateData 
} from '../../services/socketService';
import { translateText } from '../../services/translateService';
import './Inbox.css';

// Debounce hook helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Local type definitions
type EmailStatus = 'new' | 'replied' | 'pending';

interface EmailMessage {
  id: string;
  from: { name: string; email: string; isCustomer: boolean; avatar?: string };
  content: string;
  createdAt: string;
}

// Extended email type with mutable thread
interface Email {
  id: string;
  from: { name: string; email: string; avatar?: string };
  to: { name: string; email: string };
  subject: string;
  preview: string;
  orderId?: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  thread: EmailMessage[];
}

export const Inbox = () => {
  const { state: { user } } = useApp();
  
  // Select initial data based on role
  // Select initial data based on role
  const getInitialEmails = () => {
    let baseData = [];
    if (user.role === 'support') {
      baseData = supportInbox;
    } else {
      baseData = storeCustomerEmails;
    }

    // Role-specific storage key
    const storageKey = `b2b_inbox_${user.role === 'support' ? 'support' : 'client'}`;

    // Merge with LocalStorage Demo Data
    try {
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      // Deduplicate by ID favoring local (which holds read status)
      const localMap = new Map();
      localData.forEach((e: any) => localMap.set(e.id, e));
      
      // Use baseData only if not in localMap
      const merged = baseData.map((e: any) => localMap.get(e.id) || e);
      
      // If there are extra local items (e.g. new external emails), append them?
      // For now, let's just stick to updating the known list to avoid duplication recursion
      // Actually, we should probably allow new items for guest chat demo
      const baseIds = new Set(baseData.map((e: any) => e.id));
      const extraLocal = localData.filter((e: any) => !baseIds.has(e.id));
      
      return [...merged, ...extraLocal];
    } catch (e) {
      console.error('Error loading local inbox', e);
      return baseData;
    }
  };

  // Clone initial emails to make them mutable
  const [emails, setEmails] = useState<Email[]>(() => 
    (getInitialEmails() as any[]).map((e: any) => ({ ...e, thread: [...e.thread] }))
  );

  // Update emails when user/role changes or storage updates
  useEffect(() => {
    let previousCount = 0;
    
    const loadEmails = () => {
      const data = getInitialEmails() as any[];
      const mappedEmails = data.map((e: any) => ({ ...e, thread: [...e.thread] }));
      setEmails(mappedEmails);
      
      // Check if we have new messages from localStorage
      const storageKey = `b2b_inbox_${user.role === 'support' ? 'support' : 'client'}`;
      const localData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      if (localData.length > 0 && localData.length !== previousCount) {
        
        if (previousCount > 0) {
          toast.info(`Nova mensagem de ${localData[0]?.from?.name || 'Convidado'}`, {
            description: localData[0]?.preview?.substring(0, 50) + '...'
          });
        }
        previousCount = localData.length;
      }

    };

    loadEmails();

    // Listen for storage events (updates from other tabs)
    const handleStorageChange = () => loadEmails();
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event (updates from same tab, e.g., InviteChat modal)
    const handleInboxUpdate = () => {

      loadEmails();
    };
    window.addEventListener('inbox-update', handleInboxUpdate);

    // Listen for WebSocket updates (cross-browser/cross-tab)
    try {
      connectSocket();
      onInboxUpdate((data: InboxUpdateData) => {


        // Create an email entry from the WebSocket data and save to localStorage
        const newEmail: Email = {
          id: data.emailId || `ws-${Date.now()}`,
          from: data.from || { name: 'Convidado', email: 'guest@chat.com' },
          to: { name: user.name || 'Você', email: user.email || 'you@store.com' },
          subject: `Mensagem via Link de Convite (${data.code})`,
          preview: data.preview || 'Nova mensagem recebida',
          status: 'new',
          isRead: false,
          createdAt: data.timestamp || new Date().toISOString(),
          thread: [{
            id: `msg-${Date.now()}`,
            from: { ...data.from, isCustomer: true },
            content: data.preview || 'Nova mensagem',
            createdAt: data.timestamp || new Date().toISOString()
          }]
        };
        
        // Save to localStorage so loadEmails() picks it up
        const storedInbox = JSON.parse(localStorage.getItem('b2b_demo_inbox') || '[]');
        // Avoid duplicates by code+timestamp
        const exists = storedInbox.some((e: any) => e.id === newEmail.id);
        if (!exists) {
          storedInbox.unshift(newEmail);
          localStorage.setItem('b2b_demo_inbox', JSON.stringify(storedInbox));
        }
        
        toast.info(`Nova mensagem de ${data.from?.name || 'Convidado'}`, {
          description: data.preview
        });
        loadEmails();
      });
    } catch (e) {
      console.warn('[Inbox] WebSocket not available, using localStorage only');
    }
    
    // Fallback: Poll every 2 seconds to ensure data is synced
    const pollInterval = setInterval(loadEmails, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('inbox-update', handleInboxUpdate);
      clearInterval(pollInterval);
    };
  }, [user.role]);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails[0]);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [showTranslation, setShowTranslation] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showTranslatedReply, setShowTranslatedReply] = useState(false);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Translation Cache State: { [text_hash]: translated_text }
  const [translations, setTranslations] = useState<Record<string, string>>({});
  
  // Debounce reply text for translation
  const debouncedReplyText = useDebounce(replyText, 800);

  // Effect to translate visible messages when showTranslation is ON
  useEffect(() => {
    if (showTranslation && selectedEmail) {
      selectedEmail.thread.forEach(async (msg) => {
        if (!translations[msg.id]) {
            // Translate everything to Portuguese
            const res = await translateText(msg.content, 'pt');
            if (res.translatedText) {
                setTranslations(prev => ({ ...prev, [msg.id]: res.translatedText }));
            }
        }
      });
    }
  }, [showTranslation, selectedEmail, translations]);

  // Effect to translate Reply Preview (PT -> EN)
  useEffect(() => {
    const translateReply = async () => {
      if (showTranslatedReply && debouncedReplyText.trim()) {
        const res = await translateText(debouncedReplyText, 'en');
        if (res.translatedText) {
          setTranslations(prev => ({ ...prev, 'reply_preview': res.translatedText }));
        }
      }
    };
    translateReply();
  }, [debouncedReplyText, showTranslatedReply]);
  
  // B2B Collaboration State
  const [emailMeta, setEmailMeta] = useState<Record<string, {
    tags: string[];
    assignedTo: { id: string; name: string } | null;
    internalNotes: { id: string; authorName: string; content: string; createdAt: string }[];
  }>>({});

  // Avatar mapping for customers and support
  const avatarMap: Record<string, string> = {
    'emily.j@gmail.com': '/avatar_emily_1768020080350.png',
    'john.smith@email.com': '/avatar_john_1768020092430.png',
    'mbrown@outlook.com': '/avatar_michael_1768020104647.png',
    'swilson@company.com': '/avatar_sarah_1768020116305.png',
    'dlee@techmail.com': '/avatar_david_1768020129352.png',
    'support@techstore.com.br': '/avatar_support_1768020066194.png'
  };

  const getAvatar = (email: string): string | null => {
    return avatarMap[email] || null;
  };

  const getEmailMeta = (emailId: string) => {
    return emailMeta[emailId] || { tags: [], assignedTo: null, internalNotes: [] };
  };

  const handleAddTag = (emailId: string, tag: string) => {
    setEmailMeta(prev => ({
      ...prev,
      [emailId]: {
        ...getEmailMeta(emailId),
        tags: [...getEmailMeta(emailId).tags, tag]
      }
    }));
  };

  const handleRemoveTag = (emailId: string, tag: string) => {
    setEmailMeta(prev => ({
      ...prev,
      [emailId]: {
        ...getEmailMeta(emailId),
        tags: getEmailMeta(emailId).tags.filter(t => t !== tag)
      }
    }));
  };

  const handleAssign = (emailId: string, agentId: string, agentName: string) => {
    setEmailMeta(prev => ({
      ...prev,
      [emailId]: {
        ...getEmailMeta(emailId),
        assignedTo: { id: agentId, name: agentName }
      }
    }));
  };

  const handleAddNote = (emailId: string, content: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      authorName: 'Maria Santos',
      content,
      createdAt: new Date().toISOString()
    };
    setEmailMeta(prev => ({
      ...prev,
      [emailId]: {
        ...getEmailMeta(emailId),
        internalNotes: [...getEmailMeta(emailId).internalNotes, newNote]
      }
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatFullDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const toggleMessage = (messageId: string) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessages(newExpanded);
  };

  const getStatusBadge = (status: EmailStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="new" dot>Novo</Badge>;
      case 'replied':
        return <Badge variant="replied">Respondido</Badge>;
      case 'pending':
        return <Badge variant="pending">Pendente</Badge>;
    }
  };


  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedEmail || isSending) return;
    
    setIsSending(true);
    
    // Determine content: Use translation if "Auto-traduzir EN" is active
    let messageContent = replyText;
    if (showTranslatedReply) {
       // Prefer cached preview, otherwise translate now
       const cachedTranslation = translations['reply_preview'];
       if (cachedTranslation && !cachedTranslation.startsWith('[')) {
          messageContent = cachedTranslation;
       } else {
          // Fallback: synchronous wait for translation if cache missing/error
          const res = await translateText(replyText, 'en');
          messageContent = res.translatedText;
       }
    }
    
    // Add support message to thread
    const supportMessage: EmailMessage = {
      id: `msg-${Date.now()}`,
      from: { name: 'Suporte TechStore', email: 'support@techstore.com.br', isCustomer: false },
      content: messageContent,
      createdAt: new Date().toISOString()
    };

    // Update the email thread
    setEmails(prev => prev.map(email => 
      email.id === selectedEmail.id
        ? { ...email, thread: [...email.thread, supportMessage], status: 'replied' }
        : email
    ));

    // Update selected email reference
    setSelectedEmail(prev => prev 
      ? { ...prev, thread: [...prev.thread, supportMessage], status: 'replied' }
      : prev
    );

    setReplyText('');
    setShowTranslatedReply(false);
    toast.success('Mensagem enviada!');
    setIsSending(false);

    // Wait before customer starts "typing"
    const responseDelay = getResponseDelay();
    await new Promise(r => setTimeout(r, responseDelay));

    // Show typing indicator
    setIsCustomerTyping(true);

    // Get original issue from first customer message
    const firstCustomerMessage = selectedEmail.thread.find(m => m.from.isCustomer);
    const issue = firstCustomerMessage?.content || selectedEmail.subject;

    // Build conversation history
    const previousMessages = selectedEmail.thread.map(m => ({
      role: m.from.isCustomer ? 'customer' as const : 'support' as const,
      content: m.content
    }));
    previousMessages.push({ role: 'support', content: messageContent });

    // Determine customer mood based on email
    const moodMap: Record<string, 'frustrated' | 'angry' | 'neutral' | 'demanding' | 'impatient'> = {
      'emily.j@gmail.com': 'frustrated',
      'john.smith@email.com': 'impatient',
      'mbrown@outlook.com': 'neutral',
      'swilson@company.com': 'demanding',
      'dlee@techmail.com': 'angry'
    };

    // Simulate typing delay
    await new Promise(r => setTimeout(r, getTypingDelay()));

    try {
      // Generate AI customer response
      const customerResponse = await generateCustomerResponse({
        customerName: selectedEmail.from.name,
        customerEmail: selectedEmail.from.email,
        orderId: selectedEmail.orderId,
        issue,
        previousMessages,
        mood: moodMap[selectedEmail.from.email] || 'neutral',
        isAutoTranslateOn: showTranslatedReply
      }, messageContent);

      // Add customer response to thread
      const customerMessage: EmailMessage = {
        id: `msg-${Date.now()}`,
        from: { 
          name: selectedEmail.from.name, 
          email: selectedEmail.from.email, 
          isCustomer: true 
        },
        content: customerResponse,
        createdAt: new Date().toISOString()
      };

      setEmails(prev => prev.map(email => 
        email.id === selectedEmail.id
          ? { ...email, thread: [...email.thread, customerMessage] }
          : email
      ));

      setSelectedEmail(prev => prev 
        ? { ...prev, thread: [...prev.thread, customerMessage] }
        : prev
      );

      toast(`${selectedEmail.from.name} respondeu`, {
        description: customerResponse.substring(0, 50) + '...'
      });

    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error('Erro ao gerar resposta do cliente');
    } finally {
      setIsCustomerTyping(false);
    }

  };

  const handleSelectEmail = (email: Email) => {
    // If already read and selected, just select it (noop)
    if (email.isRead && selectedEmail?.id === email.id) {
       setSelectedEmail(email);
       return;
    }

    // 1. Update State
    const updatedEmail = { ...email, isRead: true };
    setSelectedEmail(updatedEmail);
    
    setEmails(prev => {
      const updatedList = prev.map(e => e.id === email.id ? updatedEmail : e);
      
      // 2. Persist to LocalStorage (Forking mock data to local)
      try {
        const storageKey = `b2b_inbox_${user.role === 'support' ? 'support' : 'client'}`;
        // We save the entire list to ensure read status is preserved over mock data
        localStorage.setItem(storageKey, JSON.stringify(updatedList));
        window.dispatchEvent(new Event('storage')); // Trigger Sidebar update
      } catch (e) {
        console.error('Error saving read status:', e);
      }
      return updatedList;
    });
  };

  return (
    <div className="inbox-page">
      <div className="page-header">
        <div>
          <h1>Inbox</h1>
          <p>Gerencie as mensagens dos seus clientes</p>
        </div>
        {user.role === 'client' && (
          <Button 
            variant="secondary" 
            leftIcon={<Link2 size={16} />}
            onClick={() => {
              const code = Math.random().toString(36).substring(2, 10).toUpperCase();
              const link = `${window.location.origin}/invite/${code}`;
              
              // Save to localStorage so we can detect self-chat attempts
              const myInvites = JSON.parse(localStorage.getItem('b2b_my_invites') || '[]');
              myInvites.push(code);
              localStorage.setItem('b2b_my_invites', JSON.stringify(myInvites));
              
              navigator.clipboard.writeText(link);
              toast.success('Link de Convite Copiado!', { description: link });
            }}
          >
            Gerar Link de Convite
          </Button>
        )}
      </div>

      <div className="inbox-container">
        {/* Email List */}
        <Card className="email-list-panel" padding="none">
          <div className="list-header">
            <div className="list-search">
              <Search size={16} />
              <input type="text" placeholder="Buscar e-mails..." />
            </div>
          </div>

          <div className="email-list">
            {emails.map((email) => (
              <div
                key={email.id}
                className={`email-list-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${!email.isRead ? 'unread' : ''}`}
                onClick={() => handleSelectEmail(email)}
              >
                <div className="email-list-avatar">
                  {email.from.avatar ? (
                    <img src={email.from.avatar} alt={email.from.name} />
                  ) : getAvatar(email.from.email) ? (
                    <img src={getAvatar(email.from.email)!} alt={email.from.name} />
                  ) : (
                    email.from.name.charAt(0)
                  )}
                </div>
                <div className="email-list-content">
                  <div className="email-list-header">
                    <span className="email-list-sender">{email.from.name}</span>
                    <span className="email-list-time">{formatDate(email.createdAt)}</span>
                  </div>
                  <p className="email-list-subject">{email.subject}</p>
                  <div className="email-list-footer">
                    {email.orderId && (
                      <span className="email-list-order">#{email.orderId}</span>
                    )}
                    {getStatusBadge(email.status as EmailStatus)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Email Detail */}
        {selectedEmail && (
          <Card className="email-detail-panel" padding="none">
            {/* Email Header */}
            <div className="detail-header">
              <div className="detail-title">
                <h2>{selectedEmail.subject}</h2>
                {selectedEmail.orderId && (
                  <span className="detail-order">Pedido #{selectedEmail.orderId}</span>
                )}
              </div>
              <div className="detail-actions">
                <button className="action-btn" title="Favoritar" onClick={() => toast.success('Adicionado aos favoritos')}>
                  <Star size={18} />
                </button>
                <button className="action-btn" title="Responder" onClick={() => toast.info('Abrindo resposta...')}>
                  <Reply size={18} />
                </button>
                <button className="action-btn" title="Encaminhar" onClick={() => toast.info('Encaminhando e-mail...')}>
                  <Forward size={18} />
                </button>
                <button className="action-btn danger" title="Excluir" onClick={() => toast.error('E-mail excluído')}>
                  <Trash2 size={18} />
                </button>
                <button className="action-btn" onClick={() => toast('Mais opções')}>
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* B2B Collaboration Toolbar */}
            <div className="b2b-toolbar">
              <CustomTags 
                tags={getEmailMeta(selectedEmail.id).tags}
                onAddTag={(tag) => handleAddTag(selectedEmail.id, tag)}
                onRemoveTag={(tag) => handleRemoveTag(selectedEmail.id, tag)}
              />
              <div className="toolbar-divider" />
              <AgentAssignment 
                currentAgent={getEmailMeta(selectedEmail.id).assignedTo}
                onAssign={(agentId, agentName) => handleAssign(selectedEmail.id, agentId, agentName)}
              />
              <InternalNotes 
                emailId={selectedEmail.id}
                notes={getEmailMeta(selectedEmail.id).internalNotes}
                onAddNote={(content) => handleAddNote(selectedEmail.id, content)}
              />
            </div>

            {/* Translation Toggle */}
            <div className="translation-bar">
              <button 
                className={`translation-toggle ${showTranslation ? 'active' : ''}`}
                onClick={() => setShowTranslation(!showTranslation)}
              >
                <Languages size={16} />
                {showTranslation ? 'Ver Original (EN)' : 'Traduzir para PT'}
              </button>
            </div>

            {/* Email Thread */}
            <div className="email-thread">
              {selectedEmail.thread.map((message, index) => (
                <ThreadMessage
                  key={message.id}
                  message={message}
                  isExpanded={index === selectedEmail.thread.length - 1 || expandedMessages.has(message.id)}
                  onToggle={() => toggleMessage(message.id)}
                  showTranslation={showTranslation}
                  formatDate={formatFullDate}
                  translation={translations[message.id]}
                  getAvatar={getAvatar}
                />
              ))}
              
              {/* Typing Indicator */}
              {isCustomerTyping && (
                <div className="typing-indicator">
                  <div className="typing-avatar">
                    {getAvatar(selectedEmail.from.email) ? (
                      <img src={getAvatar(selectedEmail.from.email)!} alt={selectedEmail.from.name} />
                    ) : (
                      selectedEmail.from.name.charAt(0)
                    )}
                  </div>
                  <div className="typing-bubble">
                    <span className="typing-text">{selectedEmail.from.name} está digitando</span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Box */}
            <div className="reply-box">
              <div className="reply-header">
                <span>Responder para {selectedEmail.from.name}</span>
                <button 
                  className={`translate-reply-btn ${showTranslatedReply ? 'active' : ''}`}
                  onClick={() => setShowTranslatedReply(!showTranslatedReply)}
                >
                  <Languages size={14} />
                  {showTranslatedReply ? 'Editando PT' : 'Auto-traduzir EN'}
                </button>
              </div>
              
              <div className="reply-content">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva sua resposta em português..."
                  rows={4}
                />
                
                {showTranslatedReply && replyText && (
                  <div className="translated-preview">
                    <div className="translated-label">
                      <Languages size={12} />
                      Prévia em Inglês:
                    </div>
                    <p>{translations['reply_preview'] || 'Traduzindo...'}</p>
                  </div>
                )}
              </div>

              <div className="reply-actions">
                <button className="attach-btn">
                  <Paperclip size={18} />
                </button>
                <Button 
                  onClick={handleSendReply}
                  rightIcon={<Send size={16} />}
                  disabled={!replyText.trim()}
                >
                  Enviar
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

// Thread Message Component
interface ThreadMessageProps {
  message: EmailMessage;
  isExpanded: boolean;
  onToggle: () => void;
  showTranslation: boolean;
  formatDate: (date: string) => string;
  translation?: string;
  getAvatar: (email: string) => string | null;
}

const ThreadMessage = ({ 
  message, 
  isExpanded, 
  onToggle, 
  showTranslation,
  formatDate,
  translation,
  getAvatar
}: ThreadMessageProps) => {
  const displayContent = showTranslation && translation ? translation : message.content;

  // Determine avatar source: Priorities: message.from.avatar -> static map -> initials
  const avatarSrc = message.from.avatar || getAvatar(message.from.email);

  return (
    <div className={`thread-message ${message.from.isCustomer ? 'customer' : 'support'} ${isExpanded ? 'expanded' : ''}`}>
      <div className="message-header" onClick={onToggle}>
        <div className="message-avatar">
          {avatarSrc ? (
            <img src={avatarSrc} alt={message.from.name} />
          ) : (
            message.from.name.charAt(0)
          )}
        </div>
        <div className="message-meta">
          <span className="message-sender">{message.from.name}</span>
          <span className="message-email">&lt;{message.from.email}&gt;</span>
        </div>
        <span className="message-date">{formatDate(message.createdAt)}</span>
        <button className="message-toggle">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="message-body">
          <pre>{displayContent}</pre>
          {showTranslation && (
            <div className="translation-note">
              <Languages size={12} />
              Traduzido automaticamente
            </div>
          )}
        </div>
      )}
    </div>
  );
};
