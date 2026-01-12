import { useState } from 'react';
import { Mail, Lock, Save, CheckCircle } from 'lucide-react';
import { Card, Button } from '../../components/ui';
import './Settings.css';

export const Settings = () => {
  const [appEmail, setAppEmail] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie as configurações do seu painel</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Email Configuration */}
        <Card className="settings-card">
          <div className="settings-header">
            <Mail size={20} />
            <h3>Configuração de E-mail</h3>
          </div>
          <p className="settings-description">
            Configure as credenciais do e-mail que será usado para enviar e receber mensagens dos clientes.
          </p>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="app-email">E-mail do Aplicativo</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="app-email"
                  type="email"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  placeholder="suporte@minhaloja.com.br"
                />
              </div>
              <span className="input-hint">Use um e-mail dedicado para o suporte da loja</span>
            </div>

            <div className="form-group">
              <label htmlFor="app-password">Senha do Aplicativo</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="app-password"
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
              </div>
              <span className="input-hint">Use uma senha de aplicativo gerada pelo seu provedor de e-mail</span>
            </div>

            <div className="form-actions">
              <Button 
                onClick={handleSave}
                isLoading={isSaving}
                leftIcon={<Save size={16} />}
              >
                Salvar Configurações
              </Button>

              {showSuccess && (
                <div className="success-message">
                  <CheckCircle size={16} />
                  <span>Configurações salvas com sucesso!</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="info-card-settings">
          <h4>💡 Dica</h4>
          <p>
            Para maior segurança, recomendamos usar senhas de aplicativo ao invés da senha principal da conta de e-mail.
          </p>
          <ul>
            <li><strong>Gmail:</strong> Acesse Configurações → Segurança → Senhas de App</li>
            <li><strong>Outlook:</strong> Acesse Segurança → Senhas de App</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
