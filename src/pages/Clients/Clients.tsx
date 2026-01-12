import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, CreditCard, ChevronRight } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { companies } from '../../data/companies';
import './Clients.css';

export const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.primaryContact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || company.tier === filterTier;
    return matchesSearch && matchesTier;
  });

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

  const handleViewClient = (companyId: string) => {
    navigate(`/clients/${companyId}`);
  };

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Clientes B2B</h1>
          <p>Diretório de empresas clientes da plataforma</p>
        </div>
      </div>

      <div className="clients-filters">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)}>
          <option value="all">Todos os Tiers</option>
          <option value="enterprise">Enterprise</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
      </div>

      <div className="clients-grid">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="client-card" hoverable onClick={() => handleViewClient(company.id)}>
            <div className="client-header">
              <div className="client-icon">
                <Building2 size={24} />
              </div>
              <div className="client-info">
                <h3>{company.name}</h3>
                <div className="client-badges">
                  {getTierBadge(company.tier)}
                  {getStatusBadge(company.status)}
                </div>
              </div>
              <ChevronRight size={16} className="client-arrow" />
            </div>

            <div className="client-details">
              <div className="detail-row">
                <span className="detail-label">Contato:</span>
                <span>{company.primaryContact.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span>{company.primaryContact.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">CNPJ:</span>
                <span>{company.cnpj}</span>
              </div>
            </div>

            <div className="client-credit">
              <div className="credit-header">
                <CreditCard size={14} />
                <span>Crédito</span>
              </div>
              <div className="credit-bar">
                <div 
                  className="credit-bar-fill" 
                  style={{ width: `${Math.min((company.creditUsed / company.creditLimit) * 100, 100)}%` }}
                />
              </div>
              <div className="credit-values">
                <span>Usado: {formatCurrency(company.creditUsed)}</span>
                <span>Limite: {formatCurrency(company.creditLimit)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="empty-state">
          <Building2 size={48} />
          <h3>Nenhum cliente encontrado</h3>
          <p>Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
};
