import { Activity, Layers, Database, Cpu, Globe, Shield, Zap, GitBranch } from 'lucide-react';

export const DocsPlatform = () => {
  return (
    <div className="docs-content-wrapper">
      <section id="platform-architecture">
        <div className="section-header-large">
          <h1>Arquitetura SaaS Enterprise</h1>
          <p className="lead">
            O NexaDesk opera sobre uma infraestrutura distribuída, <strong>Event-Driven</strong> e Multi-tenant, 
            projetada para processar milhões de sinais de comércio por minuto com latência sub-100ms.
          </p>
        </div>

        <div className="info-box success">
          <Globe size={20} />
          <p>
            <strong>Infraestrutura Global:</strong> Nossos clusters estão replicados em 3 Regiões AWS (N. Virginia, Frankfurt, São Paulo) com failover automático.
          </p>
        </div>

        <hr className="divider" />

        <h2>1. Fundamentos da Arquitetura (The Core)</h2>
        <p>
          Diferente de ERPs monolíticos tradicionais, o NexaDesk foi construído como um conjunto de microsserviços 
          orquestrados por um <strong>Commerce Kernel</strong> central.
        </p>

        <div className="architecture-grid">
          <div className="arch-card">
            <div className="arch-icon"><Layers /></div>
            <h3>API Gateway & Edge</h3>
            <p>
              Todo tráfego entra via Cloudflare Enterprise (WAF + CDN). O API Gateway faz o roteamento inteligente, 
              Rate Limiting por Tenant e validação de JWT/API Keys antes de qualquer processamento.
            </p>
          </div>
          <div className="arch-card">
            <div className="arch-icon"><Zap /></div>
            <h3>Event Bus (Kafka)</h3>
            <p>
              O sistema nervoso da plataforma. Cada ação (Ex: "Pedido Criado", "Estoque Baixo") é um evento imutável. 
              Isso permite que múltiplos Agentes reajam ao mesmo estímulo simultaneamente sem bloquear a thread principal.
            </p>
          </div>
          <div className="arch-card">
            <div className="arch-icon"><Database /></div>
            <h3>Polyglot Persistence</h3>
            <p>
              Usamos a ferramenta certa para cada dado:
              <br/>• <strong>PostgreSQL:</strong> Dados transacionais (Pedidos, Faturas).
              <br/>• <strong>Redis:</strong> Cache de sessão e Filas "Hot".
              <br/>• <strong>Elasticsearch:</strong> Busca semântica e Logs de auditoria.
              <br/>• <strong>Vector DB:</strong> Memória de longo prazo dos Agentes IA.
            </p>
          </div>
        </div>

        <hr className="divider" />

        <h2>2. O Motor de Orquestração (CommerceOS)</h2>
        <p>
          O CommerceOS é a máquina de estados que garante a integridade das operações. Ele coordena o fluxo de dados entre 
          o mundo externo (Shopify/ERP) e os Agentes Autônomos.
        </p>

        <div className="code-block dark">
          <div className="code-header">Fluxo de Vida de um Evento (Exemplo: Novo Pedido B2B)</div>
          <pre>{`[Evento: order.created] 
   │
   ├──> 1. Ingestão: Webhook Shopify recebido e validado.
   │
   ├──> 2. Normalização: JSON convertido para "Universal Commerce Model".
   │
   ├──> 3. Enriquecimento: CRM busca histórico do cliente (Risk Score: Low).
   │
   ├──> 4. Broadcast: Evento publicado no tópico 'orders'.
          │
          ├──> Agente de Estoque: Reserva itens no Warehouse Virtual.
          │
          ├──> Agente Fiscal: Emite Pré-Nota no ERP.
          │
          └──> Agente de Suporte: Agenda e-mail de "Obrigado" (Delay 10min).
`}</pre>
        </div>

        <hr className="divider" />

        <h2>3. Isolamento e Segurança (Multi-tenancy)</h2>
        <p>
          A segurança dos dados é garantida através de isolamento lógico estrito. Embora o código rode em infraestrutura compartilhada, 
          os dados nunca se cruzam.
        </p>

        <div className="security-features">
          <div className="sec-item">
            <Shield size={24} className="text-primary" />
            <div>
              <h4>Row-Level Security (RLS)</h4>
              <p>Todas as queries ao banco de dados injetam automaticamente o <code>tenant_id</code> da sessão atual. É fisicamente impossível uma query vazar dados de outro cliente.</p>
            </div>
          </div>
          <div className="sec-item">
            <Activity size={24} className="text-primary" />
            <div>
              <h4>Audit Log Imutável</h4>
              <p>Toda operação de escrita gera um registro criptográfico. Se um Agente altera um preço, sabemos exatamente <i>qual</i> agente, <i>quando</i> e <i>por qual motivo</i>.</p>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <h2>4. Escalabilidade dos Agentes (Serverless Workers)</h2>
        <p>
          Os Agentes de IA operam em um ambiente <strong>Serverless Isolado</strong>. Isso significa que se um Agente de Pricing 
          entrar em um loop complexo de cálculo, ele escala horizontalmente sem afetar a performance do Dashboard ou do Checkout.
        </p>

        <ul className="tech-specs-list">
          <li>
            <Cpu size={18} /> 
            <strong>Runtime:</strong> V8 Isolates (Edge Computing) para respostas em &lt;50ms.
          </li>
          <li>
            <GitBranch size={18} /> 
            <strong>Concorrência:</strong> Suporte a até 10.000 execuções concorrentes por Tenant.
          </li>
          <li>
            <Zap size={18} /> 
            <strong>Timeouts:</strong> Processos longos (Ex: Forecasting mensal) são movidos automaticamente para Background Workers assíncronos.
          </li>
        </ul>

      </section>
    </div>
  );
};
