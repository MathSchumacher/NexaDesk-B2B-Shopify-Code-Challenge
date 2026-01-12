

export const DocsAgents = () => {
  return (
    <div className="docs-content-wrapper">
      <section id="stock-agent" className="docs-section">
        <h1>Agents API Reference</h1>
        <p className="lead">
          Controle programaticamente seus operadores digitais.
        </p>
        
        <hr className="divider" />
        
        <h2>Stock Control Agent</h2>
        <p>
          O Agente de Controle de Estoque é um sistema autônomo capaz de tomar decisões de compra baseadas em 
          previsão de demanda (Forecasting) e regras de negócio configuráveis.
        </p>

        <h3>1. Configurando Regras de Reabastecimento</h3>
        <p>
          Antes de o agente operar, você deve definir as "Physics" do seu estoque (Lead Time, Margem de Segurança, Curva ABC).
        </p>
        
        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <code className="url">/v2/agents/stock/rules</code>
          </div>
          <div className="endpoint-body">
            <p>Define os limites operacionais para um SKU ou Categoria.</p>
            <div className="code-block">
              <pre>{`{
  "target_sku": "NX-900-PRO",
  "warehouse_strategy": {
    "min_stock_level": 500,
    "max_stock_level": 2500,
    "safety_stock_days": 15,
    "lead_time_days": 5
  },
  "auto_buy_settings": {
    "enabled": true,
    "max_budget_per_order": 50000.00,
    "preferred_suppliers": ["sup_id_8829", "sup_id_1120"],
    "approval_required_above": 10000.00
  }
}`}</pre>
            </div>
          </div>
        </div>

        <h3>2. Disparo de Análise de Recompra (Trigger)</h3>
        <p>
          Embora o agente rode automaticamente a cada 6 horas, você pode forçar uma análise imediata se seu ERP detectar 
          um pico súbito de vendas.
        </p>

        <div className="endpoint-card">
          <div className="endpoint-header">
            <span className="method post">POST</span>
            <code className="url">/v2/agents/stock/analyze</code>
          </div>
          <div className="endpoint-body">
            <p>O agente analisará o histórico de 90 dias e o estoque atual para recomendar compras.</p>
            <div className="code-block">
              <pre>{`// Response 200 OK
{
  "analysis_id": "an_9928371",
  "status": "completed",
  "recommendations": [
    {
      "action": "BUY",
      "sku": "NX-900-PRO",
      "suggested_quantity": 1200,
      "reason": "Forecast indica aumento de 40% na demanda para próxima semana (Black Friday)",
      "confidence_score": 0.98,
      "estimated_cost": 12500.00
    }
  ]
}`}</pre>
            </div>
          </div>
        </div>

        <hr className="divider" />
        
        <h2>Pricing Agent (Beta)</h2>
        <p>
            Documentação em breve. O endpoint <code>/v2/agents/pricing</code> está disponível apenas para parceiros Beta.
        </p>
      </section>
    </div>
  );
};
