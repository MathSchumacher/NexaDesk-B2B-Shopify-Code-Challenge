import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Copy, Check, RotateCcw } from 'lucide-react';
import { Button } from '../ui';
import './AIReplyAssistant.css';

interface AIReplyAssistantProps {
  customerName: string;
  emailContext: string;
  onUseReply: (reply: string) => void;
}

const mockAIReplies = [
  "Olá {name},\n\nObrigado por entrar em contato. Compreendo sua preocupação e vou ajudá-lo a resolver isso o mais rápido possível.\n\nAnalisei seu pedido e já estamos trabalhando na solução. Você receberá uma atualização em breve.\n\nAtenciosamente,\nEquipe de Suporte",
  "Prezado(a) {name},\n\nAgradecemos seu contato. Entendo perfeitamente a situação e já estou verificando os detalhes do seu caso.\n\nNosso compromisso é resolver isso de forma ágil e satisfatória para você.\n\nQualquer dúvida, estou à disposição.\n\nCordialmente,\nSuporte TechStore",
  "Oi {name}!\n\nRecebi sua mensagem e já estou cuidando disso. Vou priorizar seu caso para garantir uma resolução rápida.\n\nFique tranquilo(a) que retornarei com uma solução em breve.\n\nAbraços,\nEquipe TechStore"
];

export const AIReplyAssistant = ({ customerName, emailContext, onUseReply }: AIReplyAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generateReply = () => {
    setIsGenerating(true);
    setDisplayedText('');
    setGeneratedReply('');

    // Select random reply and personalize
    const randomReply = mockAIReplies[Math.floor(Math.random() * mockAIReplies.length)]
      .replace('{name}', customerName);
    
    setGeneratedReply(randomReply);

    // Simulate typing effect
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < randomReply.length) {
        setDisplayedText(randomReply.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsGenerating(false);
      }
    }, 15);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUse = () => {
    onUseReply(generatedReply);
  };

  return (
    <div className="ai-reply-assistant">
      <div className="ai-assistant-header">
        <div className="ai-badge">
          <Sparkles size={14} />
          <span>AI Assistant</span>
        </div>
        <button 
          className="generate-btn"
          onClick={generateReply}
          disabled={isGenerating}
        >
          <Wand2 size={16} />
          {isGenerating ? 'Gerando...' : 'Gerar Resposta'}
        </button>
      </div>

      <AnimatePresence>
        {(displayedText || isGenerating) && (
          <motion.div 
            className="ai-reply-box"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="reply-content">
              {isGenerating && !displayedText && (
                <div className="generating-placeholder">
                  <motion.div 
                    className="ai-thinking"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles size={16} />
                    <span>AI está pensando...</span>
                  </motion.div>
                </div>
              )}
              <pre className="reply-text">{displayedText}</pre>
              {isGenerating && displayedText && (
                <motion.span 
                  className="typing-cursor"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </div>

            {!isGenerating && generatedReply && (
              <motion.div 
                className="reply-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button className="action-btn" onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button className="action-btn" onClick={generateReply}>
                  <RotateCcw size={14} />
                  Regenerar
                </button>
                <Button size="sm" onClick={handleUse}>
                  Usar Resposta
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
