import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Youtube, Instagram, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import './Contact.css';

export const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  const contactInfo = [
    { icon: <Mail size={20} />, label: "Email", value: "contato@nexadesk.com", href: "mailto:contato@nexadesk.com" },
    { icon: <Phone size={20} />, label: "WhatsApp", value: "+55 (11) 99999-9999", href: "https://wa.me/5511999999999" },
    { icon: <MapPin size={20} />, label: "Escritório", value: "Av. Paulista, 1000 - SP", href: "#" },
  ];

  const socialLinks = [
    { icon: <Youtube size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <MessageSquare size={20} />, href: "#" },
  ];

  return (
    <div className="contact-page">
      {/* Mobile Back Button */}
      <button onClick={() => navigate('/')} className="mobile-back-btn-global">
        <ArrowLeft size={20} />
      </button>

      <div className="contact-container">
        <button onClick={() => navigate('/')} className="contact-back-button desktop-back-btn">
          ← Voltar para Home
        </button>

        <div className="contact-content">
          <div className="contact-info">
            <h1>Entre em Contato</h1>
            <p>
              Tem alguma dúvida ou quer saber mais sobre nossos planos Enterprise? Estamos aqui para ajudar sua operação a escalar.
            </p>

            <div className="contact-details">
              {contactInfo.map((item, i) => (
                <a key={i} href={item.href} className="contact-detail-item">
                  <div className="contact-detail-icon">{item.icon}</div>
                  <div>
                    <p className="contact-detail-label">{item.label}</p>
                    <p className="contact-detail-value">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="contact-socials">
              {socialLinks.map((social, i) => (
                <a key={i} href={social.href} className="contact-social-link">{social.icon}</a>
              ))}
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-group">
                <label className="contact-form-label">Nome Completo</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="contact-form-input"
                  placeholder="Seu nome"
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-form-label">E-mail Corporativo</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="contact-form-input"
                  placeholder="nome@empresa.com"
                />
              </div>
              <div className="contact-form-group">
                <label className="contact-form-label">Mensagem</label>
                <textarea 
                  required rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="contact-form-textarea"
                  placeholder="Como podemos ajudar?"
                />
              </div>

              <button type="submit" disabled={loading} className="contact-form-button">
                {loading ? 'Enviando...' : <>Enviar Mensagem <Send size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
