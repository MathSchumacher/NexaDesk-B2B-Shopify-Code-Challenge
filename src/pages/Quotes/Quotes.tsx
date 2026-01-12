import { useState } from 'react';
import { Search, Plus, FileText, Calendar, DollarSign, ChevronRight, Trash2 } from 'lucide-react';
import { Card, Badge, Button, Modal, ModalFooter, Input } from '../../components/ui';
import { toast } from 'sonner';
import './Quotes.css';

interface Quote {
  id: string;
  title: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  customerName: string;
  totalValue: number;
  itemsCount: number;
  createdAt: string;
  expiresAt: string;
}

const mockQuotesData: Quote[] = [
  {
    id: 'qt-1001',
    title: 'Cotação de Equipamentos 2026',
    status: 'sent',
    customerName: 'TechStore Brasil',
    totalValue: 12500.00,
    itemsCount: 15,
    createdAt: '2026-01-08T10:00:00Z',
    expiresAt: '2026-01-20T00:00:00Z'
  },
  {
    id: 'qt-1002',
    title: 'Pedido de Laptops - Q1',
    status: 'draft',
    customerName: 'TechStore Brasil',
    totalValue: 45000.00,
    itemsCount: 10,
    createdAt: '2026-01-10T09:30:00Z',
    expiresAt: '2026-01-25T00:00:00Z'
  },
  {
    id: 'qt-0988',
    title: 'Periféricos e Acessórios',
    status: 'approved',
    customerName: 'TechStore Brasil',
    totalValue: 3200.00,
    itemsCount: 50,
    createdAt: '2025-12-15T14:00:00Z',
    expiresAt: '2025-12-30T00:00:00Z'
  }
];

export const Quotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotesData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<Quote['status'][]>([]);
  
  // View/Edit Modal State
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // New Quote Form State
  const [newQuote, setNewQuote] = useState({
    title: '',
    itemsCount: 1,
    unitValue: 0
  });

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'draft': return <Badge variant="default">Rascunho</Badge>;
      case 'sent': return <Badge variant="pending">Enviado</Badge>;
      case 'approved': return <Badge variant="success">Aprovado</Badge>;
      case 'rejected': return <Badge variant="error">Rejeitado</Badge>;
      case 'expired': return <Badge variant="default">Expirado</Badge>;
      case 'cancelled': return <Badge variant="error">Cancelado</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCreateQuote = () => {
    if (!newQuote.title || newQuote.unitValue <= 0) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const calculatedTotal = newQuote.itemsCount * newQuote.unitValue;

    const createdQuote: Quote = {
      id: `qt-${Math.floor(Math.random() * 10000)}`,
      title: newQuote.title,
      status: 'draft',
      customerName: 'TechStore Brasil', // Hardcoded for simplified client view logic
      totalValue: calculatedTotal,
      itemsCount: Number(newQuote.itemsCount),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // +15 days
    };

    setQuotes([createdQuote, ...quotes]);
    setIsModalOpen(false);
    setNewQuote({ title: '', itemsCount: 1, unitValue: 0 });
    toast.success('Nova cotação criada com sucesso!');
  };

  const toggleStatusFilter = (status: Quote['status']) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(quote.status);
    return matchesSearch && matchesStatus;
  });

  const handleQuoteClick = (quote: Quote) => {
    setViewingQuote(quote);
  };

  const handleCancelQuote = () => {
    if (!viewingQuote) return;
    
    const updatedQuotes = quotes.map(q => 
      q.id === viewingQuote.id ? { ...q, status: 'cancelled' as const } : q
    );
    
    setQuotes(updatedQuotes);
    setViewingQuote({ ...viewingQuote, status: 'cancelled' });
    setIsCancelConfirmOpen(false);
    toast.success('Cotação cancelada com sucesso.');
  };

  return (
    <div className="quotes-page">
      <div className="page-header">
        <div>
          <h1>Cotações</h1>
          <p>Gerencie orçamentos e negociações B2B</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={18} />}>
          Nova Cotação
        </Button>
      </div>

      <div className="quotes-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar cotações..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filters">
          {['draft', 'sent', 'approved', 'rejected', 'cancelled'].map((status) => (
            <button
              key={status}
              data-status={status}
              onClick={() => toggleStatusFilter(status as Quote['status'])}
              className={`status-filter-btn ${statusFilters.includes(status as Quote['status']) ? 'active' : ''}`}
            >
              {status === 'draft' && 'Rascunho'}
              {status === 'sent' && 'Enviado'}
              {status === 'approved' && 'Aprovado'}
              {status === 'rejected' && 'Rejeitado'}
              {status === 'cancelled' && 'Cancelado'}
            </button>
          ))}
        </div>
      </div>

      <div className="quotes-list">
        {filteredQuotes.map((quote) => (
          <Card key={quote.id} className="quote-card" hoverable onClick={() => handleQuoteClick(quote)}>
            <div className="quote-icon">
              <FileText size={24} />
            </div>
            
            <div className="quote-content">
              <div className="quote-header">
                <h3>{quote.title}</h3>
                <span className="quote-id">#{quote.id}</span>
              </div>
              
              <div className="quote-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Vence em {new Date(quote.expiresAt).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <DollarSign size={14} />
                  <span>{quote.itemsCount} itens</span>
                </div>
              </div>
            </div>

            <div className="quote-values">
              <span className="total-value">{formatCurrency(quote.totalValue)}</span>
              {getStatusBadge(quote.status)}
            </div>

            <ChevronRight size={18} className="quote-arrow" />
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Nova Cotação"
        closeOnOverlayClick={false}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-text-secondary">Título da Cotação</label>
            <Input 
              placeholder="Ex: Pedido de Servidores"
              value={newQuote.title}
              onChange={e => setNewQuote({ ...newQuote, title: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-sm font-medium mb-1 block text-text-secondary">Quantidade</label>
               <Input 
                 type="number"
                 placeholder="0"
                 min="1"
                 value={newQuote.itemsCount}
                 onChange={e => setNewQuote({ ...newQuote, itemsCount: Number(e.target.value) })}
               />
            </div>
            <div>
               <label className="text-sm font-medium mb-1 block text-text-secondary">Valor Unitário (R$)</label>
               <Input 
                 type="number"
                 placeholder="0.00"
                 min="0"
                 step="0.01"
                 value={newQuote.unitValue}
                 onChange={e => setNewQuote({ ...newQuote, unitValue: Number(e.target.value) })}
               />
            </div>
          </div>
          
          <div className="bg-bg-secondary p-3 rounded-lg flex justify-between items-center border border-border-subtle">
            <span className="text-sm text-text-secondary">Total Estimado</span>
            <span className="text-lg font-bold text-primary-500">
              {formatCurrency(newQuote.itemsCount * newQuote.unitValue)}
            </span>
          </div>
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreateQuote}>Criar Cotação</Button>
        </ModalFooter>
      </Modal>

      {/* View/Edit Details Modal */}
      <Modal
        isOpen={!!viewingQuote}
        onClose={() => setViewingQuote(null)}
        title={viewingQuote?.status === 'draft' ? 'Editar Rascunho' : (viewingQuote?.title || 'Detalhes da Cotação')}
      >
        {viewingQuote && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-full">
                {viewingQuote.status === 'draft' ? (
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block text-text-secondary">Título</label>
                    <Input
                      value={viewingQuote.title}
                      onChange={(e) => setViewingQuote({ ...viewingQuote, title: e.target.value })}
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-text-primary">{viewingQuote.id}</h3>
                    <p className="text-text-secondary">{viewingQuote.customerName}</p>
                  </>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                {getStatusBadge(viewingQuote.status)}
                <span className="text-xs text-text-tertiary whitespace-nowrap">
                  Criado em {new Date(viewingQuote.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="bg-bg-elevated p-4 rounded-lg space-y-4">
              {viewingQuote.status === 'draft' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block text-text-secondary">Quantidade</label>
                    <Input
                      type="number"
                      min="1"
                      value={viewingQuote.itemsCount}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        const currentUnitValue = viewingQuote.totalValue / (viewingQuote.itemsCount || 1);
                        setViewingQuote({
                          ...viewingQuote,
                          itemsCount: count,
                          totalValue: currentUnitValue * count
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block text-text-secondary">Valor Unitário</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={viewingQuote.totalValue / (viewingQuote.itemsCount || 1)}
                      onChange={(e) => {
                        const unitVal = Number(e.target.value);
                        setViewingQuote({
                          ...viewingQuote,
                          totalValue: unitVal * viewingQuote.itemsCount
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Quantidade de Itens</span>
                  <span className="text-text-primary font-medium">{viewingQuote.itemsCount}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 border-t border-border-subtle">
                <span className="text-text-secondary">Valor Total</span>
                <span className="text-xl font-bold text-primary-500">{formatCurrency(viewingQuote.totalValue)}</span>
              </div>
            </div>

            {viewingQuote.status === 'draft' && (
              <div className="flex gap-3 pt-4 mt-4 border-t border-border-primary">
                <Button 
                  className="flex-1"
                  variant="secondary"
                  onClick={() => {
                    setQuotes(quotes.map(q => q.id === viewingQuote.id ? viewingQuote : q));
                    toast.success('Rascunho atualizado!');
                    setViewingQuote(null);
                  }}
                >
                  Salvar
                </Button>
                <Button 
                  className="flex-[2]"
                  onClick={() => {
                    setQuotes(quotes.map(q => q.id === viewingQuote.id ? { ...viewingQuote, status: 'sent' } : q));
                    toast.success('Cotação enviada com sucesso!');
                    setViewingQuote(null);
                  }}
                >
                  Enviar Cotação
                </Button>
                <Button 
                  variant="secondary" 
                  className="px-3"
                  style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  title="Excluir Rascunho"
                >
                  <Trash2 size={18} color="var(--error)" />
                </Button>
              </div>
            )}

            {viewingQuote.status === 'sent' && (
              <div className="border-t border-border-primary pt-4 mt-4">
                <Button 
                  variant="ghost" 
                  className="w-full text-error hover:bg-error/10 hover:text-error"
                  onClick={() => setIsCancelConfirmOpen(true)}
                >
                  Cancelar Cotação
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        title="Cancelar Cotação"
        size="sm"
      >
        <p className="text-text-secondary mb-6">
          Tem certeza que deseja cancelar esta cotação? Esta ação não pode ser desfeita.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsCancelConfirmOpen(false)}>Voltar</Button>
          <Button 
            className="bg-error hover:bg-error/90 text-white" 
            onClick={handleCancelQuote}
          >
            Sim, Cancelar
          </Button>
        </ModalFooter>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Excluir Cotação"
        size="sm"
      >
        <p className="text-text-secondary mb-6">
          Tem certeza que deseja excluir essa cotação? Esta ação não pode ser desfeita.
        </p>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Voltar</Button>
          <Button 
            className="bg-error hover:bg-error/90 text-white" 
            onClick={() => {
              if (viewingQuote) {
                setQuotes(quotes.filter(q => q.id !== viewingQuote.id));
                toast.success('Rascunho excluído.');
                setViewingQuote(null);
              }
              setIsDeleteConfirmOpen(false);
            }}
          >
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
