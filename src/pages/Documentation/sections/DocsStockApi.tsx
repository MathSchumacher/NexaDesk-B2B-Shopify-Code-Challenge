import { useNavigate } from 'react-router-dom';
import { Server, Package, Truck, ShieldCheck, Lock, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui';

export const DocsStockApi = () => {
  const navigate = useNavigate();

  const handleGetKey = () => {
    navigate('/api-subscribe?type=stock');
  };

  return (
    <div className="docs-content-wrapper">
      <section id="stock-api">
        <div className="api-header">
          <div className="badge-api">API v2.1</div>
          <h1>API de Reposição de Estoque (Supply Chain)</h1>
          <p className="lead">
            A API de Reposição permite automatizar o ciclo de compras da sua empresa. 
            O Agente de Estoque monitora níveis de inventário, calcula o ponto de pedido (Reorder Point) 
            e dispara ordens de compra diretamente para seus fornecedores ou centro de distribuição.
          </p>
        </div>

        <div className="payment-gate-card">
          <div className="gate-content">
            <div className="gate-icon">
              <Lock size={32} />
            </div>
            <div>
              <h3>Chave de Acesso Supply Chain</h3>
              <p>
                Para habilitar a automação de compras e integração ERP, é necessário uma licença ativa.
              </p>
              <div className="refund-notice">
                <ShieldCheck size={14} />
                <span>Risco Zero: Se não usar a chave, peça reembolso total a qualquer momento.</span>
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

        <h2>Fluxo de Trabalho do Agente</h2>
        <div className="tech-specs-list">
          <li>
            <Package /> 
            <strong>Monitoramento:</strong> O agente lê seu estoque a cada 15 minutos.
          </li>
          <li>
            <Truck /> 
            <strong>Fornecedores:</strong> Mantém uma lista de fornecedores homologados e seus Lead Times.
          </li>
        </div>

        <hr className="divider" />

        <h2>Endpoints Principais</h2>

        {/* Endpoint 1 */}
        <div className="endpoint-section">
          <h3>1. Análise de Previsão de Demanda (Forecast)</h3>
          <p>
            Consulte a previsão de vendas calculada pelo agente para os próximos 30, 60 e 90 dias.
          </p>
          
          <div className="endpoint-card">
            <div className="endpoint-header">
              <span className="method get">GET</span>
              <code className="url">/v2/stock/forecast/:sku</code>
            </div>
            <div className="endpoint-body">
              <div className="code-block">
                <pre>{`{
  "sku": "NX-900",
  "confidence": 0.94,
  "trend": "upward", // stable, upward, downward, seasonal
  "predictions": [
    { "month": "Jun/2026", "expected_sales": 1200, "std_dev": 50 },
    { "month": "Jul/2026", "expected_sales": 1450, "std_dev": 75 }
  ]
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint 2 */}
        <div className="endpoint-section">
          <h3>2. Disparar Reposição Manual (Trigger)</h3>
          <p>
            Força a criação de uma PO (Purchase Order) ignorando o calendário automático.
          </p>
          
          <div className="endpoint-card">
            <div className="endpoint-header">
              <span className="method post">POST</span>
              <code className="url">/v2/stock/replenish</code>
            </div>
            <div className="endpoint-body">
              <div className="code-block">
                <pre>{`{
  "sku": "NX-900",
  "quantity": 500,
  "supplier_id": "sup_default",
  "priority": "urgent", // urgent = frete aéreo se disponível
  "note": "Reposição de emergência para evento XPTO"
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* INTEGRATION SECTION */}
        <div className="integration-section-wrapper">
          <div className="section-badge">Enterprise Integration</div>
          <h2><Server className="icon-inline" /> Integração com ERP (SAP, Totvs, Oracle)</h2>
          <p>
            Para que o Agente de Estoque funcione integradamente ao seu ERP legado, utilizamos o protocolo <strong>Partner Connect</strong>.
            Isso permite que o NexaDesk leia o saldo de estoque do ERP e escreva Pedidos de Compra (PO) no ERP.
          </p>

          <div className="alert-box">
            <AlertTriangle size={16} />
            <span>Esta integração requer envolvimento do time de TI responsável pelo ERP.</span>
          </div>

          <h3>Protocolo de Handshake Seguro</h3>
          <p>
            Para não expor todos os dados da empresa, criamos um túnel seguro cliente-a-cliente.
          </p>

          <div className="integration-guide-detailed">
            
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-content">
                <h4>Instalação no ERP</h4>
                <p>
                  No seu ERP, crie um parceiro comercial "NexaDesk". 
                  Insira o <strong>Integration Token</strong> obtido no painel (que requer a assinatura acima).
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-content">
                <h4>Chamada de Handshake (Linking Key)</h4>
                <p>
                  O ERP deve fazer um POST único para obter a chave definitiva de operação.
                </p>
                <div className="code-block dark">
                  <pre>{`POST https://api.nexadesk.io/v2/partners/handshake

{
  "integration_token": "tk_int_XYZ...", 
  "erp_system": "SAP_S4HANA",
  "erp_version": "2025.1"
}

// Response:
{
  "client_linking_key": "lk_live_99887766", // USE ESTA CHAVE
  "expires_in_days": 90
}`}</pre>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-content">
                <h4>Sincronização Bidirecional</h4>
                <p>
                  Com a <code>client_linking_key</code>, o ERP agora pode enviar Webhooks de atualização de estoque para o NexaDesk.
                  <br/>
                  <code>POST /webhooks/stock-update</code>
                </p>
                <div className="info-box success">
                  <CheckCircle size={16} />
                  <p>Pronto! O Agente agora enxerga seu estoque físico real.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
};
