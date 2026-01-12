import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  CreditCard,
  MapPin, 
  Users, 
  Edit2, 
  Save, 
  X,
  Plus,
  Trash2,
  Mail,
  Phone,
  Shield,
  Calendar,
  DollarSign,
  AlertCircle,
  Activity,
  Zap,
  TrendingUp,
  Award,
  Clock,
  Percent,
  Code,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { companies, paymentTermsOptions, discountRules } from '../../data/companies';
import { mockPriceLists } from '../../data/priceLists';
import { toast } from 'sonner';
import './ClientDetail.css';

type TabType = 'overview' | 'analytics' | 'features' | 'locations' | 'contacts' | 'discount';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  type: 'shipping' | 'billing' | 'both';
}

export const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  // Find company from data
  const company = companies.find(c => c.id === id);

  // Local state for editable fields
  const [editedCompany, setEditedCompany] = useState<any>(company);
  const [locations, setLocations] = useState<Location[]>([
    { id: 'loc-1', name: 'Sede Principal', address: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zip: '01310-100', country: 'Brasil', isDefault: true, type: 'both' },
    { id: 'loc-2', name: 'Centro de Distribuição', address: 'Rodovia BR-101, Km 50', city: 'Curitiba', state: 'PR', zip: '80000-000', country: 'Brasil', isDefault: false, type: 'shipping' }
  ]);

  const [newLocation, setNewLocation] = useState<Partial<Location>>({ type: 'both', isDefault: false });
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', role: 'buyer' as const });

  // Discount Editing State
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [discountForm, setDiscountForm] = useState({
    priceListId: '',
    overrideAutomation: false,
    manualDiscount: 0,
    manualReason: ''
  });

  useEffect(() => {
    if (company) {
      setEditedCompany(company);
      setDiscountForm({
        priceListId: 'pl-1', // Defaulting to Enterprise Tier for demo
        overrideAutomation: false,
        manualDiscount: company.discountPercent || 0,
        manualReason: company.discountReason || ''
      });
    }
  }, [company]);

  if (!company || !editedCompany) {
    return (
      <div className="client-detail-page">
        <div className="empty-state">
          <AlertCircle size={48} />
          <h3>Cliente não encontrado</h3>
          <p>O cliente solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/clients')}>Voltar para Clientes</Button>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'enterprise': return <Badge variant="new">Enterprise</Badge>;
      case 'gold': return <Badge variant="warning">Gold</Badge>;
      case 'silver': return <Badge variant="default">Silver</Badge>;
      case 'bronze': return <Badge variant="default">Bronze</Badge>;
      default: return <Badge variant="default">{tier}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="replied">Ativo</Badge>;
      case 'blocked': return <Badge variant="error">Bloqueado</Badge>;
      case 'pending': return <Badge variant="pending">Pendente</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSave = () => {
    toast.success('Alterações salvas com sucesso!');
    setIsEditing(false);
  };

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    const loc: Location = {
      id: `loc-${Date.now()}`,
      name: newLocation.name || '',
      address: newLocation.address || '',
      city: newLocation.city || '',
      state: newLocation.state || '',
      zip: newLocation.zip || '',
      country: newLocation.country || 'Brasil',
      isDefault: newLocation.isDefault || false,
      type: newLocation.type || 'both'
    };
    setLocations([...locations, loc]);
    setNewLocation({ type: 'both', isDefault: false });
    setShowAddLocation(false);
    toast.success('Localização adicionada!');
  };

  const handleDeleteLocation = (locId: string) => {
    setLocations(locations.filter(l => l.id !== locId));
    toast.success('Localização removida');
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email) {
      toast.error('Preencha nome e email');
      return;
    }
    // In real app, would add to company.users
    toast.success('Contato adicionado!');
    setNewContact({ name: '', email: '', phone: '', role: 'buyer' });
    setShowAddContact(false);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral', icon: Building2 },
    { id: 'analytics' as const, label: 'Analytics', icon: Activity },
    { id: 'features' as const, label: 'Features', icon: Code },
    { id: 'locations' as const, label: 'Localizações', icon: MapPin },
    { id: 'contacts' as const, label: 'Contatos', icon: Users },
    { id: 'discount' as const, label: 'Desconto', icon: Percent }
  ];

  const handleSaveDiscount = () => {
    const selectedList = mockPriceLists.find(l => l.id === discountForm.priceListId);
    
    let updates = {};
    if (discountForm.overrideAutomation) {
      updates = {
        discountPercent: discountForm.manualDiscount,
        discountReason: discountForm.manualReason || 'Definido manualmente',
      };
    } else if (selectedList) {
      updates = {
        discountPercent: selectedList.discount,
        discountReason: `Lista: ${selectedList.name}`,
      };
    }

    // Update local state
    setEditedCompany({ ...editedCompany, ...updates });

    // Update "Backend" (Mock Data)
    if (company) {
      Object.assign(company, updates);
    }
    
    toast.success('Configurações de desconto atualizadas!');
    setIsEditingDiscount(false);
  };

  // Helper: Check if company matches a discount rule
  const checkRuleMatch = (rule: typeof discountRules[0]) => {
    return rule.conditions.every(cond => {
      let companyValue: number | string = 0;
      if (cond.field === 'yearsSinceJoined') companyValue = company.yearsSinceJoined;
      else if (cond.field === 'totalInvested') companyValue = company.totalInvested || 0;
      else if (cond.field === 'totalOrders') companyValue = company.totalOrders;
      else if (cond.field === 'apiUsage.plan') companyValue = company.apiUsage?.plan || 'free';

      if (typeof cond.value === 'number' && typeof companyValue === 'number') {
        switch (cond.operator) {
          case '>': return companyValue > cond.value;
          case '>=': return companyValue >= cond.value;
          case '<': return companyValue < cond.value;
          case '<=': return companyValue <= cond.value;
          case '==': return companyValue === cond.value;
          case '!=': return companyValue !== cond.value;
        }
      }
      return companyValue === cond.value;
    });
  };

  return (
    <div className="client-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/clients')}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <div className="header-content">
          <div className="company-avatar">
            <Building2 size={32} />
          </div>
          <div className="company-info">
            <h1>{company.name}</h1>
            <div className="company-meta">
              <span className="cnpj">{company.cnpj}</span>
              <div className="badges">
                {getTierBadge(company.tier)}
                {getStatusBadge(company.status)}
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                <X size={16} /> Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save size={16} /> Salvar
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Edit2 size={16} /> Editar
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="detail-content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            {/* Company Info Card */}
            <Card className="info-card">
              <h3><Building2 size={18} /> Informações da Empresa</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">CNPJ</span>
                  <span className="value">{company.cnpj}</span>
                </div>
                <div className="info-row">
                  <span className="label">Tier</span>
                  <span className="value">{getTierBadge(company.tier)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status</span>
                  <span className="value">{getStatusBadge(company.status)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Cliente desde</span>
                  <span className="value">
                    <Calendar size={14} />
                    {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </Card>

            {/* Credit Card */}
            <Card className="credit-card-detail">
              <h3><CreditCard size={18} /> Crédito</h3>
              <div className="credit-visual">
                <div className="credit-bar-container">
                  <div 
                    className="credit-bar-fill" 
                    style={{ width: `${Math.min((company.creditUsed / company.creditLimit) * 100, 100)}%` }}
                  />
                </div>
                <div className="credit-amounts">
                  <div className="amount">
                    <span className="label">Utilizado</span>
                    <span className="value">{formatCurrency(company.creditUsed)}</span>
                  </div>
                  <div className="amount">
                    <span className="label">Limite</span>
                    <span className="value">{formatCurrency(company.creditLimit)}</span>
                  </div>
                  <div className="amount available">
                    <span className="label">Disponível</span>
                    <span className="value">{formatCurrency(company.creditLimit - company.creditUsed)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Terms Card */}
            <Card className="terms-card">
              <h3><DollarSign size={18} /> Condições de Pagamento</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">Prazo</span>
                  <span className="value">
                    {paymentTermsOptions.find(p => p.value === company.paymentTerms)?.label || company.paymentTerms}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Valor Lifetime</span>
                  <span className="value highlight">{formatCurrency(company.lifetimeValue)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total de Pedidos</span>
                  <span className="value">{company.totalOrders}</span>
                </div>
              </div>
            </Card>

            {/* Primary Contact Card */}
            <Card className="contact-card">
              <h3><Users size={18} /> Contato Principal</h3>
              <div className="contact-info">
                <div className="contact-avatar">
                  {company.primaryContact.name.charAt(0)}
                </div>
                <div className="contact-details">
                  <span className="name">{company.primaryContact.name}</span>
                  <span className="email">
                    <Mail size={14} /> {company.primaryContact.email}
                  </span>
                  <span className="phone">
                    <Phone size={14} /> {company.primaryContact.phone}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Client Analytics</h2>
            </div>

            {/* Investment & Tenure Stats */}
            <div className="analytics-stats-row">
              <Card className="analytics-stat-card">
                <div className="stat-icon green"><TrendingUp size={24} /></div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(company.totalInvested || 0)}</span>
                  <span className="stat-label">Total Investido</span>
                </div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-icon blue"><Clock size={24} /></div>
                <div className="stat-content">
                  <span className="stat-value">{company.yearsSinceJoined} anos</span>
                  <span className="stat-label">Tempo na Plataforma</span>
                </div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-icon purple"><Award size={24} /></div>
                <div className="stat-content">
                  <span className="stat-value">{company.subscription?.plan.toUpperCase() || 'FREE'}</span>
                  <span className="stat-label">Plano Atual</span>
                </div>
              </Card>
              <Card className="analytics-stat-card">
                <div className="stat-icon yellow"><Zap size={24} /></div>
                <div className="stat-content">
                  <span className="stat-value">{formatCurrency(company.subscription?.monthlyFee || 0)}/mês</span>
                  <span className="stat-label">Mensalidade</span>
                </div>
              </Card>
            </div>

            {/* API Usage Card */}
            <Card className="api-usage-card">
              <h3><Activity size={18} /> Uso de API</h3>
              <div className="api-usage-grid">
                <div className="api-gauge">
                  <div className="gauge-circle">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="gauge-bg" />
                      <circle 
                        cx="50" cy="50" r="45" 
                        className="gauge-fill"
                        style={{ 
                          strokeDasharray: `${((company.apiUsage?.currentMonthCalls || 0) / (company.apiUsage?.monthlyLimit || 1)) * 283} 283`
                        }}
                      />
                    </svg>
                    <div className="gauge-text">
                      <span className="gauge-value">{Math.round(((company.apiUsage?.currentMonthCalls || 0) / (company.apiUsage?.monthlyLimit || 1)) * 100)}%</span>
                      <span className="gauge-label">usado</span>
                    </div>
                  </div>
                </div>
                <div className="api-details">
                  <div className="api-detail-row">
                    <span className="label">Chamadas este mês</span>
                    <span className="value">{(company.apiUsage?.currentMonthCalls || 0).toLocaleString()}</span>
                  </div>
                  <div className="api-detail-row">
                    <span className="label">Limite mensal</span>
                    <span className="value">{(company.apiUsage?.monthlyLimit || 0).toLocaleString()}</span>
                  </div>
                  <div className="api-detail-row">
                    <span className="label">Mês anterior</span>
                    <span className="value">{(company.apiUsage?.lastMonthCalls || 0).toLocaleString()}</span>
                  </div>
                  <div className="api-detail-row">
                    <span className="label">Tempo médio resposta</span>
                    <span className="value">{company.apiUsage?.avgResponseTime || 0}ms</span>
                  </div>
                  {(company.apiUsage?.overageFees || 0) > 0 && (
                    <div className="api-detail-row overage">
                      <span className="label">Taxa de excesso</span>
                      <span className="value">{formatCurrency(company.apiUsage?.overageFees || 0)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="features-section">
            <div className="section-header">
              <h2>Features Exclusivas</h2>
            </div>

            {company.customFeatures && company.customFeatures.length > 0 ? (
              <div className="features-grid">
                {company.customFeatures.map((feature) => (
                  <Card key={feature.id} className={`feature-card ${!feature.isActive ? 'inactive' : ''}`}>
                    <div className="feature-header">
                      <div className="feature-icon">
                        <Code size={20} />
                      </div>
                      <div className="feature-info">
                        <h4>{feature.name}</h4>
                        <p>{feature.description}</p>
                      </div>
                      <Badge variant={feature.isActive ? 'replied' : 'error'}>
                        {feature.isActive ? <><CheckCircle size={12} /> Ativo</> : <><XCircle size={12} /> Inativo</>}
                      </Badge>
                    </div>
                    <div className="feature-meta">
                      <span><Calendar size={14} /> Entregue em {new Date(feature.deliveredAt).toLocaleDateString('pt-BR')}</span>
                      <span><DollarSign size={14} /> Custo: {formatCurrency(feature.devCost)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="empty-features">
                <Code size={48} />
                <h4>Nenhuma feature exclusiva</h4>
                <p>Este cliente não possui desenvolvimentos customizados.</p>
              </Card>
            )}
          </div>
        )}





        {activeTab === 'discount' && (
          <div className="discount-section">
            <div className="section-header">
              <h2>Desconto & Tier</h2>
              {!isEditingDiscount ? (
                <Button variant="secondary" onClick={() => setIsEditingDiscount(true)}>
                  <Edit2 size={16} /> Editar Configuração
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsEditingDiscount(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleSaveDiscount}>
                    <Save size={16} /> Salvar
                  </Button>
                </div>
              )}
            </div>

            {isEditingDiscount ? (
              <Card className="add-form-card">
                <h4>Configuração de Preços</h4>
                <div className="form-group mb-4">
                  <label>Lista de Preço Aplicada</label>
                  <select 
                    className="w-full p-2 border rounded bg-elevated"
                    value={discountForm.priceListId}
                    onChange={e => setDiscountForm({ ...discountForm, priceListId: e.target.value })}
                  >
                    <option value="">Selecione uma lista...</option>
                    {mockPriceLists.map(list => (
                      <option key={list.id} value={list.id}>
                        {list.name} ({list.type === 'percentage' ? `${list.discount}%` : `R$ ${list.discount}`})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={discountForm.overrideAutomation}
                      onChange={e => setDiscountForm({ ...discountForm, overrideAutomation: e.target.checked })}
                    />
                    <span>Sobrescrever automação e definir manualmente</span>
                  </label>
                </div>

                {discountForm.overrideAutomation && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Desconto Manual (%)</label>
                      <input 
                        type="number" 
                        value={discountForm.manualDiscount}
                        onChange={e => setDiscountForm({ ...discountForm, manualDiscount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-group span-2">
                      <label>Motivo / Observação</label>
                      <input 
                        type="text" 
                        value={discountForm.manualReason}
                        onChange={e => setDiscountForm({ ...discountForm, manualReason: e.target.value })}
                        placeholder="Ex: Negociação especial diretoria"
                      />
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              /* Current Discount View */
              <Card className="current-discount-card">
                <div className="discount-visual">
                  <div className="discount-circle">
                    <span className="discount-value">{editedCompany.discountPercent || 0}%</span>
                    <span className="discount-label">desconto</span>
                  </div>
                </div>
                <div className="discount-info">
                  <h3>Desconto Atual: {editedCompany.discountPercent || 0}%</h3>
                  <p>{editedCompany.discountReason || 'Sem desconto aplicado'}</p>
                  <div className="tier-badge-large">
                    {getTierBadge(editedCompany.tier)}
                  </div>
                </div>
              </Card>
            )}

            {/* Automation Rules Check */}
            <h3 className="rules-title mt-6">Regras de Automação</h3>
            <div className="rules-grid">
              {discountRules.map(rule => {
                const matches = checkRuleMatch(rule);
                return (
                  <Card key={rule.id} className={`rule-card ${matches ? 'matches' : ''}`}>
                    <div className="rule-header">
                      <h4>{rule.name}</h4>
                      <Badge variant={matches ? 'replied' : 'default'}>
                        {matches ? 'Elegível' : 'Não elegível'}
                      </Badge>
                    </div>
                    <p className="rule-description">{rule.description}</p>
                    <div className="rule-result">
                      <span>Resultado: <strong>{rule.resultTier.toUpperCase()}</strong> ({rule.resultDiscount}% off)</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="locations-section">
            <div className="section-header">
              <h2>Localizações</h2>
              <Button variant="primary" onClick={() => setShowAddLocation(true)}>
                <Plus size={16} /> Adicionar
              </Button>
            </div>

            {showAddLocation && (
              <Card className="add-form-card">
                <h4>Nova Localização</h4>
                <div className="form-grid">
                  <input 
                    type="text" 
                    placeholder="Nome *" 
                    value={newLocation.name || ''}
                    onChange={e => setNewLocation({ ...newLocation, name: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Endereço *" 
                    value={newLocation.address || ''}
                    onChange={e => setNewLocation({ ...newLocation, address: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Cidade" 
                    value={newLocation.city || ''}
                    onChange={e => setNewLocation({ ...newLocation, city: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Estado" 
                    value={newLocation.state || ''}
                    onChange={e => setNewLocation({ ...newLocation, state: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="CEP" 
                    value={newLocation.zip || ''}
                    onChange={e => setNewLocation({ ...newLocation, zip: e.target.value })}
                  />
                  <select 
                    value={newLocation.type}
                    onChange={e => setNewLocation({ ...newLocation, type: e.target.value as any })}
                  >
                    <option value="both">Entrega e Faturamento</option>
                    <option value="shipping">Apenas Entrega</option>
                    <option value="billing">Apenas Faturamento</option>
                  </select>
                </div>
                <div className="form-actions">
                  <Button variant="ghost" onClick={() => setShowAddLocation(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleAddLocation}>Adicionar</Button>
                </div>
              </Card>
            )}

            <div className="locations-grid">
              {locations.map(loc => (
                <Card key={loc.id} className="location-card">
                  <div className="location-header">
                    <div className="location-icon">
                      <MapPin size={20} />
                    </div>
                    <div className="location-info">
                      <h4>{loc.name}</h4>
                      {loc.isDefault && <Badge variant="new">Padrão</Badge>}
                      <Badge variant={loc.type === 'both' ? 'replied' : 'default'}>
                        {loc.type === 'both' ? 'Entrega & Faturamento' : loc.type === 'shipping' ? 'Entrega' : 'Faturamento'}
                      </Badge>
                    </div>
                    <button className="delete-btn" onClick={() => handleDeleteLocation(loc.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="location-address">
                    <p>{loc.address}</p>
                    <p>{loc.city}, {loc.state} - {loc.zip}</p>
                    <p>{loc.country}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <div className="section-header">
              <h2>Contatos</h2>
              <Button variant="primary" onClick={() => setShowAddContact(true)}>
                <Plus size={16} /> Adicionar
              </Button>
            </div>

            {showAddContact && (
              <Card className="add-form-card">
                <h4>Novo Contato</h4>
                <div className="form-grid">
                  <input 
                    type="text" 
                    placeholder="Nome *" 
                    value={newContact.name}
                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                  />
                  <input 
                    type="email" 
                    placeholder="Email *" 
                    value={newContact.email}
                    onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                  />
                  <input 
                    type="tel" 
                    placeholder="Telefone" 
                    value={newContact.phone}
                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                  />
                  <select 
                    value={newContact.role}
                    onChange={e => setNewContact({ ...newContact, role: e.target.value as any })}
                  >
                    <option value="buyer">Comprador</option>
                    <option value="admin">Administrador</option>
                    <option value="finance">Financeiro</option>
                  </select>
                </div>
                <div className="form-actions">
                  <Button variant="ghost" onClick={() => setShowAddContact(false)}>Cancelar</Button>
                  <Button variant="primary" onClick={handleAddContact}>Adicionar</Button>
                </div>
              </Card>
            )}

            <div className="contacts-grid">
              {company.users.map(user => (
                <Card key={user.id} className="contact-card-item">
                  <div className="contact-avatar-large">
                    {user.name.charAt(0)}
                  </div>
                  <div className="contact-body">
                    <h4>{user.name}</h4>
                    <Badge variant={user.role === 'admin' ? 'new' : user.role === 'finance' ? 'warning' : 'default'}>
                      <Shield size={12} />
                      {user.role === 'admin' ? 'Admin' : user.role === 'finance' ? 'Financeiro' : 'Comprador'}
                    </Badge>
                    <div className="contact-email">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="contact-status">
                    <span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}></span>
                    <span>{user.isActive ? 'Ativo' : 'Inativo'}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
