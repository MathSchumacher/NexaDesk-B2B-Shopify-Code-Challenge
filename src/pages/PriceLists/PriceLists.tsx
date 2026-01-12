import { useState } from 'react';
import { 
  Search, 
  Tag, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X,
  DollarSign,
  Percent,
  Building2,
  Package
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { toast } from 'sonner';
import './PriceLists.css';

import { mockPriceLists, PriceList } from '../../data/priceLists';
export const PriceLists = () => {
  const [priceLists, setPriceLists] = useState<PriceList[]>(mockPriceLists);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newList, setNewList] = useState<Partial<PriceList>>({
    name: '',
    description: '',
    type: 'percentage',
    discount: 10,
    isActive: true
  });

  const filteredLists = priceLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddList = () => {
    if (!newList.name) {
      toast.error('Informe o nome da lista');
      return;
    }
    const list: PriceList = {
      id: `pl-${Date.now()}`,
      name: newList.name || '',
      description: newList.description || '',
      type: newList.type || 'percentage',
      discount: newList.discount || 0,
      companiesCount: 0,
      productsCount: 0,
      isActive: newList.isActive ?? true,
      createdAt: new Date().toISOString()
    };
    setPriceLists([list, ...priceLists]);
    setNewList({ name: '', description: '', type: 'percentage', discount: 10, isActive: true });
    setShowAddForm(false);
    toast.success('Lista de preços criada!');
  };

  const handleDeleteList = (id: string) => {
    setPriceLists(priceLists.filter(l => l.id !== id));
    toast.success('Lista removida');
  };

  const handleToggleActive = (id: string) => {
    setPriceLists(priceLists.map(l => 
      l.id === id ? { ...l, isActive: !l.isActive } : l
    ));
    toast.success('Status atualizado');
  };

  return (
    <div className="pricelists-page">
      <div className="page-header">
        <div>
          <h1>Listas de Preço</h1>
          <p>Gerencie preços personalizados para diferentes segmentos de clientes B2B</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(true)}>
          <Plus size={18} /> Nova Lista
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon green">
            <Tag size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{priceLists.filter(l => l.isActive).length}</span>
            <span className="stat-label">Listas Ativas</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{priceLists.reduce((acc, l) => acc + l.companiesCount, 0)}</span>
            <span className="stat-label">Empresas Atribuídas</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon purple">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{Math.round(priceLists.filter(l => l.isActive).reduce((acc, l) => acc + l.discount, 0) / priceLists.filter(l => l.isActive).length || 0)}%</span>
            <span className="stat-label">Desconto Médio</span>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="pricelists-filters">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar listas de preço..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="add-form-card">
          <div className="form-header">
            <h3>Nova Lista de Preço</h3>
            <button className="close-btn" onClick={() => setShowAddForm(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="form-body">
            <div className="form-row">
              <label>Nome da Lista *</label>
              <input 
                type="text" 
                placeholder="Ex: Enterprise Tier"
                value={newList.name || ''}
                onChange={e => setNewList({ ...newList, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Descrição</label>
              <input 
                type="text" 
                placeholder="Descrição opcional..."
                value={newList.description || ''}
                onChange={e => setNewList({ ...newList, description: e.target.value })}
              />
            </div>
            <div className="form-row-group">
              <div className="form-row">
                <label>Tipo de Desconto</label>
                <select 
                  value={newList.type}
                  onChange={e => setNewList({ ...newList, type: e.target.value as 'percentage' | 'fixed' })}
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>
              <div className="form-row">
                <label>Valor do Desconto</label>
                <div className="input-with-icon">
                  {newList.type === 'percentage' ? <Percent size={16} /> : <DollarSign size={16} />}
                  <input 
                    type="number" 
                    min="0"
                    max={newList.type === 'percentage' ? 100 : undefined}
                    value={newList.discount}
                    onChange={e => setNewList({ ...newList, discount: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <div className="form-row checkbox-row">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={newList.isActive}
                  onChange={e => setNewList({ ...newList, isActive: e.target.checked })}
                />
                <span>Ativar lista imediatamente</span>
              </label>
            </div>
          </div>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleAddList}>
              <Check size={16} /> Criar Lista
            </Button>
          </div>
        </Card>
      )}

      {/* Price Lists Grid */}
      <div className="pricelists-grid">
        {filteredLists.map((list) => (
          <Card key={list.id} className={`pricelist-card ${!list.isActive ? 'inactive' : ''}`}>
            <div className="pricelist-header">
              <div className="pricelist-icon">
                <Tag size={24} />
              </div>
              <div className="pricelist-info">
                <h3>{list.name}</h3>
                <p>{list.description}</p>
              </div>
              <Badge variant={list.isActive ? 'replied' : 'default'}>
                {list.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>

            <div className="pricelist-stats">
              <div className="pricelist-stat">
                <div className="stat-icon-small">
                  {list.type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                </div>
                <span className="stat-value-small">{list.discount}{list.type === 'percentage' ? '%' : ' R$'}</span>
                <span className="stat-label-small">Desconto</span>
              </div>
              <div className="pricelist-stat">
                <div className="stat-icon-small">
                  <Building2 size={14} />
                </div>
                <span className="stat-value-small">{list.companiesCount}</span>
                <span className="stat-label-small">Empresas</span>
              </div>
              <div className="pricelist-stat">
                <div className="stat-icon-small">
                  <Package size={14} />
                </div>
                <span className="stat-value-small">{list.productsCount}</span>
                <span className="stat-label-small">Produtos</span>
              </div>
            </div>

            <div className="pricelist-actions">
              <button className="action-btn" onClick={() => handleToggleActive(list.id)}>
                {list.isActive ? 'Desativar' : 'Ativar'}
              </button>
              <button className="action-btn edit">
                <Edit2 size={14} /> Editar
              </button>
              <button className="action-btn delete" onClick={() => handleDeleteList(list.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <div className="empty-state">
          <Tag size={48} />
          <h3>Nenhuma lista encontrada</h3>
          <p>Crie sua primeira lista de preços para oferecer condições especiais aos clientes B2B</p>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Criar Lista
          </Button>
        </div>
      )}
    </div>
  );
};
