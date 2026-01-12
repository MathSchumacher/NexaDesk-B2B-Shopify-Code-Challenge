import { useState } from 'react';
import { Key, Lock, ShieldAlert, Check, Copy, Terminal } from 'lucide-react';
import { Button } from '../../../components/ui';

export const DocsAuthentication = () => {
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomKey = 'nx_live_' + Array(32).fill(0).map(() => Math.random().toString(36)[2]).join('');
      setApiKey(randomKey);
      setShowKey(true);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-content-wrapper">
      <section id="authentication" className="docs-section">
        <h2><Lock className="icon-inline" /> Segurança e Autenticação</h2>
        <p>
          O acesso à API é protegido por chaves secretas (Secret Keys) que concedem controle total sobre a conta da organização. 
          Utilizamos o padrão Bearer Authentication.
        </p>
        
        <p>
          Nunca compartilhe suas chaves em repositórios públicos ou no frontend do cliente. 
          Para operações client-side, utilize nossos Tokens de Sessão Temporários (veja seção <code>/auth/session</code>).
        </p>

        <div className="api-key-generator-card">
          <div className="generator-header">
            <div className="generator-title">
              <Key className="text-primary" />
              <h3>Gerenciamento de Credenciais</h3>
            </div>
            {!showKey && (
              <Button onClick={handleGenerateKey} disabled={isGenerating}>
                {isGenerating ? 'Gerando Chave Criptográfica...' : 'Gerar Chave de Produção'}
              </Button>
            )}
          </div>

          {showKey ? (
            <div className="key-reveal-container">
              <div className="warning-banner">
                <ShieldAlert size={16} />
                <span>Copie esta chave agora. Por segurança, não poderemos mostrá-la novamente.</span>
              </div>
              <div className="key-display-large">
                <code>{apiKey}</code>
                <button className="copy-btn-large" onClick={copyToClipboard}>
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <p className="key-meta">Escopo: <code>full_access</code> • Criado em: {new Date().toLocaleDateString()}</p>
            </div>
          ) : (
            <div className="key-placeholder">
              <Lock size={48} />
              <p>Nenhuma chave ativa visível nesta sessão. Gere uma nova chave para começar a integrar.</p>
            </div>
          )}
        </div>

        <div className="code-example-block">
          <div className="block-header">
            <Terminal size={14} /> Exemplo de Requisição Autenticada
          </div>
          <pre>{`curl -X POST https://api.nexadesk.io/v2/agents/list \\
  -H "Authorization: Bearer ${showKey ? apiKey : 'nx_live_xxxxxxxx'}" \\
  -H "Content-Type: application/json"`}</pre>
        </div>
      </section>
    </div>
  );
};
