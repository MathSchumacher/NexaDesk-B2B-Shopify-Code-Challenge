import { ChevronRight, ShoppingCart, MessageSquare, RefreshCcw, Layers, CheckCircle2 } from 'lucide-react';

export const DocsIntro = () => {
  return (
    <div className="docs-content-wrapper">
      <section id="user-guide-intro">
        <div className="breadcrumb">Docs <ChevronRight size={12} /> Começando</div>
        <h1>Bem-vindo ao NexaDesk</h1>
        <p className="lead">
          O NexaDesk é o sistema operacional da sua operação B2B. Aqui você centraliza pedidos, atendimento e financeiro 
          em uma única tela, enquanto nossos Agentes de IA trabalham nos bastidores para automatizar tarefas repetitivas.
        </p>
        
        <div className="info-box success">
          <CheckCircle2 size={20} />
          <p>
            <strong>Você está no Controle:</strong> A IA sugere e prepara o trabalho, mas as decisões críticas (como aprovar refunds caros) sempre passam por você.
          </p>
        </div>
        
        <hr className="divider" />

        <h2>Como o NexaDesk Funciona?</h2>
        <p>
          Imagine o NexaDesk como uma "camada inteligente" que fica entre seus canais de venda (Shopify, WhatsApp) e seu sistema de gestão (ERP).
        </p>
        <p>
          Em vez de fazer login em 4 ferramentas diferentes para resolver um problema de cliente, você usa o NexaDesk para ver tudo junto.
        </p>

        <div className="features-grid-docs">
          <div className="doc-card">
            <ShoppingCart size={32} className="text-primary" />
            <h3>Gestão de Pedidos</h3>
            <p>
              Visualize todos os pedidos B2B em um só lugar. Se um pedido travar por "Falta de Estoque", 
              o sistema avisa e sugere uma reposição ou troca de produto.
            </p>
          </div>
          <div className="doc-card">
            <MessageSquare size={32} className="text-primary" />
            <h3>Inbox Unificado</h3>
            <p>
              Responda e-mails e mensagens de clientes sem sair da tela do pedido. 
              A IA já deixa um rascunho de resposta pronto baseada no contexto da conversa.
            </p>
          </div>
          <div className="doc-card">
            <RefreshCcw size={32} className="text-primary" />
            <h3>Refunds Inteligentes</h3>
            <p>
              Processo de devolução simplificado. O sistema checa automaticamente se o produto está na garantia e 
              se o cliente é elegível, gerando a etiqueta de reserva instantaneamente.
            </p>
          </div>
        </div>

        <hr className="divider" />

        <h2>Guia Rápido de Uso</h2>

        <h3>1. Controlando seus Pedidos</h3>
        <p>
          No menu lateral, clique em <strong>Orders</strong>. Você verá seus pedidos organizados por urgência.
        </p>
        <ul className="user-guide-list">
          <li><strong>Pedidos Pendentes:</strong> Requerem sua atenção (Ex: Falha no pagamento ou Estoque insuficiente).</li>
          <li><strong>Em Processamento:</strong> Já foram enviados para o ERP e estão sendo separados.</li>
          <li><strong>Ação em Lote:</strong> Selecione vários pedidos para "Aprovar" ou "Imprimir Etiquetas" de uma só vez.</li>
        </ul>

        <h3>2. Gerenciando Devoluções (Refunds)</h3>
        <p>
          Quando um cliente solicita devolução, você recebe um alerta em <strong>Refunds</strong>.
        </p>
        <ul className="user-guide-list">
          <li>Abra a solicitação para ver fotos do produto e o motivo.</li>
          <li>O Agente de IA dará um "Veredito Sugerido" (Aprovar ou Negar) baseado na política da empresa.</li>
          <li>Clique em <strong>Confirmar</strong> para gerar a logística reversa automaticamente.</li>
        </ul>

        <h3>3. Integrando suas Plataformas</h3>
        <p>
          Para que o NexaDesk funcione, ele precisa "ler" seus dados.
        </p>
        <div className="step-card small">
          <div className="step-number">01</div>
          <div className="step-content">
            <h4>Conecte seu Canal de Vendas</h4>
            <p>Vá em <strong>Configurações &gt; Integrações</strong> e clique em "Conectar Shopify" ou "Conectar VTEX".</p>
          </div>
        </div>
        <div className="step-card small">
          <div className="step-number">02</div>
          <div className="step-content">
            <h4>Vincule seu ERP</h4>
            <p>Se você usa SAP, Totvs ou Bling, insira suas credenciais para que possamos sincronizar o estoque em tempo real.</p>
          </div>
        </div>

        <div className="info-box">
          <Layers size={20} />
          <p>
            <strong>Precisa de ajuda técnica?</strong> Se você for do time de TI e precisar da documentação de API, 
            <a href="/docs/platform">clique aqui para ver a documentação técnica</a>.
          </p>
        </div>

      </section>
    </div>
  );
};
