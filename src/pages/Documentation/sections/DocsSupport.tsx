import { HelpCircle, AlertTriangle, MessageSquare } from 'lucide-react';

export const DocsSupport = () => {
  return (
    <div className="docs-content-wrapper">
      <section id="faq">
        <h1>Central de Ajuda & Troubleshooting</h1>
        <p className="lead">
          Soluções rápidas para problemas comuns de integração e configuração dos Agentes.
        </p>

        <h2>Perguntas Frequentes (FAQ)</h2>
        
        <div className="faq-item">
          <h3><HelpCircle size={18} /> O Agente de Estoque fez uma compra errada. Como reverter?</h3>
          <p>
            O NexaDesk possui uma janela de segurança de 30 minutos (configurável) antes de enviar a ordem final ao fornecedor. 
            Acesse <strong>Supply Chain &gt; Pendentes</strong> e cancele a ordem #ID. Se já foi enviada, entre em contato diretamente com o fornecedor via módulo Inbox.
          </p>
        </div>

        <div className="faq-item">
          <h3><HelpCircle size={18} /> Minha API Key parou de funcionar.</h3>
          <p>
            Verifique se sua chave foi rotacionada ou revogada no painel de Segurança. 
            Tentativas excessivas de erro (401) podem bloquear seu IP temporariamente por 1 hora.
          </p>
        </div>

        <div className="faq-item">
          <h3><HelpCircle size={18} /> O Handshake com ERP SAP falhou.</h3>
          <p>
            Certifique-se de que o firewall do seu ERP permite tráfego de entrada na porta 443 vindo de <code>hooks.nexadesk.io</code>. 
            Verifique também se o CNPJ do cliente bate exatamente com o cadastro na Receita Federal.
          </p>
        </div>

        <hr className="divider" />

        <h2>Troubleshooting Guide</h2>
        
        <div className="troubleshoot-grid">
          <div className="error-card">
            <h4><AlertTriangle size={18} className="text-error" /> Error 429: Too Many Requests</h4>
            <p><strong>Causa:</strong> Você excedeu a quota de 1000 requests/min.</p>
            <p><strong>Correção:</strong> Implemente "Exponential Backoff" na sua lógica de retry ou solicite aumento de quota.</p>
          </div>

          <div className="error-card">
            <h4><AlertTriangle size={18} className="text-error" /> Error 409: Conflict</h4>
            <p><strong>Causa:</strong> Tentativa de atualizar um recurso (Ex: Pedido) que foi modificado por outro Agente simultaneamente.</p>
            <p><strong>Correção:</strong> Use  <code>ETag</code> nas headers para controle de concorrência optimista.</p>
          </div>
        </div>

        <div className="support-cta">
          <MessageSquare size={24} />
          <div>
            <h4>Ainda precisa de ajuda?</h4>
            <p>Nosso time de engenharia está disponível no canal <strong>#dev-support</strong> do Discord ou via Ticket Nível 3.</p>
            <a href="#">Abrir Ticket</a>
          </div>
        </div>

      </section>
    </div>
  );
};
