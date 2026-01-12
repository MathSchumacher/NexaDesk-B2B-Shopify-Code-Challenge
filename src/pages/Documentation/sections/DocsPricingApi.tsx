import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, Lock, CreditCard, Activity } from 'lucide-react';
import { Button } from '../../../components/ui';

export const DocsPricingApi = () => {
  const navigate = useNavigate();

  const handleGetKey = () => {
    // Redirect to API subscription page
    navigate('/api-subscribe?type=pricing'); 
  };

  return (
    <div className="docs-content-wrapper">
      <section id="pricing-api">
        <div className="api-header">
          <div className="badge-api">API v2.0</div>
          <h1>API de Agente de Auto-Precificação</h1>
          <p className="lead">
            A API de Auto-Precificação permite integrar o motor de inteligência de preços do NexaDesk diretamente 
            ao seu E-commerce ou ERP. Ela monitora concorrentes em tempo real e ajusta seus preços dinamicamente 
            para maximizar margem ou volume de vendas, respeitando suas regras de negócio.
          </p>
        </div>

        <div className="payment-gate-card">
          <div className="gate-content">
            <div className="gate-icon">
              <Lock size={32} />
            </div>
            <div>
              <h3>Chave de Acesso Premium</h3>
              <p>
                Para utilizar a API de Precificação, é necessário uma <strong>Chave de Produção</strong> ativa. 
                A geração da chave requer uma assinatura Enterprise ativa.
              </p>
              <div className="refund-notice">
                <ShieldCheck size={14} />
                <span>Garantia de Satisfação: Se a chave não for utilizada em 7 dias, devolvemos 100% do valor.</span>
              </div>
            </div>
          </div>
          <div className="gate-action">
            <Button onClick={handleGetKey} leftIcon={<CreditCard size={18} />}>
              Assinar & Gerar Chave
            </Button>
          </div>
        </div>

        <hr className="divider" />

        <h2>Sobre o Agente</h2>
        <p>
          O Agente de Precificação não é apenas um "crawler". Ele é um estrategista econômico que utiliza modelos de 
          Elasticidade-Preço da Demanda para prever como uma alteração de R$ 0,10 impactará suas vendas diárias.
        </p>

        <div className="tech-specs-list">
          <li>
            <Zap /> 
            <strong>Latência de Decisão:</strong> &lt; 200ms por SKU.
          </li>
          <li>
            <Activity /> 
            <strong>Fontes Monitoradas:</strong> Google Shopping, Amazon, Mercado Livre e Sites Diretos.
          </li>
        </div>

        <hr className="divider" />

        <h2>Autenticação</h2>
        <p>
          Todas as chamadas devem incluir o header <code>Authorization</code> com sua chave Bearer.
        </p>
        <div className="code-block">
          <pre>{`Authorization: Bearer nx_pricing_live_...`}</pre>
        </div>

        <hr className="divider" />

        <h2>Endpoints Principais</h2>

        {/* Endpoint 1 */}
        <div className="endpoint-section">
          <h3>1. Definir Regras de Precificação (Strategy)</h3>
          <p>
            Configure como o agente deve se comportar para um determinado grupo de produtos (Categoria ou Marca).
          </p>
          
          <div className="endpoint-card">
            <div className="endpoint-header">
              <span className="method post">POST</span>
              <code className="url">/v2/pricing/strategies</code>
            </div>
            <div className="endpoint-body">
              <p>Cria ou atualiza uma estratégia de precificação.</p>
              
              <h4>Parameters</h4>
              <ul className="params-list">
                <li><code>name</code> (string): Nome interno da estratégia.</li>
                <li><code>target_margin</code> (float): Margem de lucro mínima desejada (ex: 0.15 para 15%).</li>
                <li><code>aggressiveness</code> (string): <code>conservative</code>, <code>balanced</code>, ou <code>aggressive</code>.</li>
                <li><code>competitors</code> (array): Lista de domínios para monitorar.</li>
              </ul>

              <div className="code-block">
                <div className="code-header">Request Payload</div>
                <pre>{`{
  "name": "Eletrodomesticos - Black Friday",
  "scope": {
    "category_id": "CAT-9921",
    "brands": ["Samsung", "LG"]
  },
  "rules": {
    "min_margin_percent": 12.5,
    "max_discount_percent": 25.0,
    "reaction_speed": "instant", // Reage em tempo real a quedas do concorrente
    "price_ending": 0.90 // Força preços terminados em .90
  },
  "competitors": [
    "amazon.com.br",
    "magazineluiza.com.br"
  ]
}`}</pre>
              </div>

              <div className="code-block">
                <div className="code-header">Response (201 Created)</div>
                <pre>{`{
  "strategy_id": "strat_882910",
  "status": "active",
  "monitored_skus_count": 450
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="endpoint-section">
          <h3>2. Simulação de Preço (Simulation)</h3>
          <p>
            Antes de aplicar um preço, pergunte ao Agente qual seria o impacto estimado na demanda.
          </p>
          
          <div className="endpoint-card">
            <div className="endpoint-header">
              <span className="method post">POST</span>
              <code className="url">/v2/pricing/simulate</code>
            </div>
            <div className="endpoint-body">
              <p>Retorna a previsão de vendas para um determinado ponto de preço.</p>
              
              <div className="code-block">
                <pre>{`{
  "sku": "TV-55-LED",
  "proposed_price": 2499.90,
  "current_competitor_min_price": 2350.00
}`}</pre>
              </div>

              <div className="code-block">
                <div className="code-header">Response</div>
                <pre>{`{
  "sku": "TV-55-LED",
  "elasticity_score": 1.4, // Alta elasticidade
  "prediction": {
    "daily_sales_volume": 12,
    "total_revenue": 29998.80,
    "win_box_probability": 0.45 
  },
  "agent_recommendation": "REJECT",
  "reason": "Preço proposto tem baixa probabilidade de Buy Box. Sugerido: 2349.90"
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint 3 */}
        <div className="endpoint-section">
          <h3>3. Webhook de Alteração de Preço</h3>
          <p>
            Configure um webhook para ser notificado sempre que o Agente decidir que um preço deve mudar.
            Seu sistema deve escutar este evento para atualizar o E-commerce/ERP.
          </p>
          
          <div className="code-block dark">
            <div className="code-header">Event: price.optimized</div>
            <pre>{`{
  "event_id": "evt_00291",
  "timestamp": "2026-05-10T14:30:00Z",
  "data": {
    "sku": "TV-55-LED",
    "old_price": 2599.00,
    "new_price": 2349.90,
    "trigger": "competitor_price_drop",
    "competitor_url": "https://amazon.../dp/..."
  }
}`}</pre>
          </div>
        </div>

      </section>
    </div>
  );
};
