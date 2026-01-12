import { Server, AlertCircle } from 'lucide-react';

export const DocsIntegration = () => {
  return (
    <div className="docs-content-wrapper">
      <section id="erp-integration" className="docs-section highlight-section">
        <div className="section-badge">Enterprise Only</div>
        <h2><Server className="icon-inline" /> Guia de Integração ERP (Partner Connect)</h2>
        <p>
          Esta seção é destinada a parceiros de ERP (SAP, Oracle, Totvs, Microsoft Dynamics) que desejam criar 
          um conector nativo com o NexaDesk.
        </p>
        <p>
          Para garantir a segurança dos dados entre o Fornecedor (usuário NexaDesk) e o Cliente (usuário ERP), 
          utilizamos um protocolo de <strong>Tunelamento via Linking Key</strong>.
        </p>

        <div className="integration-guide-detailed">
          <h3>Fluxo de Implementação Recomendado</h3>
          
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-content">
              <h4>Criação da Tela de Conexão no ERP</h4>
              <p>
                Seu ERP deve disponibilizar uma tela de configurações chamada "Integração NexaDesk B2B".
                Esta tela deve conter dois campos obrigatórios:
              </p>
              <ul>
                <li><code>Supplier ID</code> (CNPJ ou ID NexaDesk do Fornecedor)</li>
                <li><code>Integration Token</code> (Chave gerada pelo Fornecedor no painel NexaDesk)</li>
              </ul>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-content">
              <h4>Geração da Linking Key (Cliente Específico)</h4>
              <p>
                Quando o usuário salvar as configurações no ERP, o seu sistema deve fazer uma chamada 
                de handshake para nossos servidores para estabelecer um túnel seguro para <em>aquele cliente específico</em>.
                Isso impede que uma chave vazada dê acesso a todos os clientes do fornecedor.
              </p>
              <div className="code-block dark">
                <pre>{`POST https://api.nexadesk.io/v2/partners/handshake

{
  "supplier_integration_token": "tk_int_882938...", // Fornecido pelo usuário
  "client_details": {
    "erp_client_id": "cli_9921",
    "legal_name": "Tech Solutions LTDA",
    "tax_id": "12.345.678/0001-99"
  },
  "permissions": ["stock.read", "orders.create"]
}`}</pre>
              </div>
            </div>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-content">
              <h4>Armazenamento Seguro e Uso</h4>
              <p>
                O NexaDesk responderá com uma <code>client_linking_key</code>. 
                <strong>Esta é a única chave que o ERP deve armazenar para este cliente.</strong>
                Todas as futuras requisições de estoque ou pedido devem usar esta chave no header.
              </p>
              <div className="alert-box">
                <AlertCircle size={16} />
                <span>A Linking Key rotaciona automaticamente a cada 90 dias. Seu adaptador deve estar preparado para o evento <code>auth.key_rotation</code>.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
