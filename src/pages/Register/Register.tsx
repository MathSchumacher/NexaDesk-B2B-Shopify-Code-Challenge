import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, Globe, ArrowRight, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { Button, Select } from '../../components/ui';
import { toast } from 'sonner';
import countryList from 'country-list';
import './Register.css';

export const Register = () => {
  const navigate = useNavigate();
  // Get all countries and sort by name
  const countries = countryList.getData().sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    website: '',
    role: '',
    country: 'br',
    cnpj: '',
    zipCode: '',
    street: '',
    number: '',
    city: '',
    state: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCnpjBlur = async () => {
    const cleanCnpj = formData.cnpj.replace(/\D/g, '');
    if (!cleanCnpj || cleanCnpj.length < 14) return;

    setIsLoadingCnpj(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      
      if (response.status === 404) {
         toast.error('CNPJ não encontrado na Receita Federal.');
         throw new Error('CNPJ not found');
      }
      
      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        company: data.razao_social || data.nome_fantasia || prev.company,
        zipCode: data.cep || prev.zipCode,
        street: `${data.logradouro || ''}`,
        number: data.numero || '',
        city: data.municipio || prev.city,
        state: data.uf || prev.state
      }));
      
      toast.success('Buscamos os dados do CNPJ com sucesso!');
    } catch (error: any) {
      if (error.message !== 'CNPJ not found') {
        toast.info('Não foi possível buscar automaticamente. Por favor, preencha manualmente.');
      }
    } finally {
      setIsLoadingCnpj(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Conta criada com sucesso!', {
        description: 'Bem-vindo ao NexaDesk. Faça login para começar.'
      });
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="register-page">
      {/* Mobile Back Button */}
      <button onClick={() => navigate('/')} className="mobile-back-btn-global">
        <ArrowLeft size={20} />
      </button>

      {/* Left Panel - Branding */}
      <div className="register-branding">
        <div className="branding-content">
          <div className="branding-logo">
            <Link to="/" className="logo-icon-large">
              <img src="/brand-logo.png" alt="NexaDesk" />
            </Link>
          </div>
          
          <p className="branding-tagline">
            Junte-se a centenas de empresas B2B que escalam suas operações com o NexaDesk.
          </p>

          <div className="branding-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Crie sua conta</h4>
                <p>Preencha os dados da sua empresa</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Conecte sua Loja</h4>
                <p>Integração nativa com Shopify e outras</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Comece a Escalar</h4>
                <p>Tenha controle total da sua operação</p>
              </div>
            </div>
          </div>
        </div>

        <div className="branding-footer">
          <p>© 2026 NexaDesk • Enterprise B2B Solutions</p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="register-form-container">
        <div className="register-form-wrapper">
          <div className="register-header">
            <h2>Criar Conta B2B</h2>
            <p>Comece seu teste grátis de 7 dias do plano Enterprise</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail Corporativo</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="voce@empresa.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="country">País de Origem</label>
              <div className="input-with-icon">
                <Select
                  options={[
                    { value: 'br', label: 'Brasil (Destaque)', image: 'https://flagcdn.com/w20/br.png' },
                    ...countries.map(c => ({
                      value: c.code.toLowerCase(),
                      label: c.name,
                      image: `https://flagcdn.com/w20/${c.code.toLowerCase()}.png`
                    }))
                  ]}
                  value={formData.country}
                  onChange={(value) => handleChange({ target: { id: 'country', value } } as any)}
                  placeholder="Selecione um país"
                />
              </div>
            </div>

            {formData.country === 'br' ? (
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="cnpj">CNPJ</label>
                  <div className="input-with-icon">
                    {isLoadingCnpj ? (
                      <Loader2 size={18} className="input-icon animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Building2 size={18} className="input-icon" />
                    )}
                    <input
                      id="cnpj"
                      type="text"
                      value={formData.cnpj}
                      onChange={handleChange}
                      onBlur={handleCnpjBlur}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      required
                      disabled={isLoadingCnpj}
                    />
                  </div>
                </div>
              </div>
            ) : (
               <div className="form-group">
                  <label htmlFor="company">Nome da Empresa</label>
                  <div className="input-with-icon">
                    <Building2 size={18} className="input-icon" />
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Sua Empresa Ltda"
                      required
                    />
                  </div>
                </div>
            )}

            {formData.country === 'br' && (
              <>
                 <div className="form-group">
                  <label htmlFor="company">Razão Social / Nome Fantasia</label>
                  <div className="input-with-icon">
                    <Building2 size={18} className="input-icon" />
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Preenchimento automático..."
                      required
                      readOnly={!!formData.cnpj && !isLoadingCnpj}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">CEP</label>
                    <div className="input-with-icon">
                      <MapPin size={18} className="input-icon" />
                      <input
                        id="zipCode"
                        type="text"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">Estado</label>
                     <div className="input-with-icon">
                      <input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="UF"
                        maxLength={2}
                      />
                     </div>
                  </div>
                </div>
                
                <div className="form-row">
                   <div className="form-group" style={{ flex: 2 }}>
                    <label htmlFor="street">Logradouro</label>
                     <div className="input-with-icon">
                      <input
                        id="street"
                        type="text"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Rua, Av..."
                      />
                     </div>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="number">Número</label>
                     <div className="input-with-icon">
                      <input
                        id="number"
                        type="text"
                        value={formData.number}
                        onChange={handleChange}
                        placeholder="123"
                      />
                     </div>
                  </div>
                </div>
                 <div className="form-group">
                    <label htmlFor="city">Cidade</label>
                     <div className="input-with-icon">
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Cidade"
                      />
                     </div>
                  </div>
              </>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Site / Loja</label>
                <div className="input-with-icon">
                  <Globe size={18} className="input-icon" />
                  <input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="loja.com.br"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
              style={{ marginTop: '1rem' }}
            >
              Criar Conta Grátis
            </Button>
          </form>

          <p className="signup-link">
            Já tem uma conta? <Link to="/login">Fazer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
