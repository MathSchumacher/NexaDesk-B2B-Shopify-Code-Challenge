import { useState } from 'react';
import { Search, Book, Copy, Tag, ChevronRight, FileText } from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { knowledgeBase, cannedResponses } from '../../data/mockData';
import { toast } from 'sonner';
import './KnowledgeBase.css';

export const KnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'articles' | 'templates'>('articles');

  const categories = [...new Set(knowledgeBase.map(kb => kb.category))];

  const filteredArticles = knowledgeBase.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Template copiado!');
  };

  return (
    <div className="knowledge-base-page">
      <div className="page-header">
        <div>
          <h1>Base de Conhecimento</h1>
          <p>FAQ, artigos e templates de resposta para suporte</p>
        </div>
      </div>

      <div className="kb-tabs">
        <button 
          className={`kb-tab ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          <Book size={16} />
          Artigos
        </button>
        <button 
          className={`kb-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FileText size={16} />
          Templates de Resposta
        </button>
      </div>

      {activeTab === 'articles' && (
        <>
          <div className="kb-filters">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Buscar artigos, tags..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="articles-list">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="article-card" hoverable>
                <div className="article-header">
                  <div className="article-icon">
                    <Book size={20} />
                  </div>
                  <div className="article-info">
                    <Badge variant="default">{article.category}</Badge>
                    <h3>{article.title}</h3>
                  </div>
                  <ChevronRight size={16} className="article-arrow" />
                </div>
                <div className="article-content">
                  <pre>{article.content}</pre>
                </div>
                <div className="article-tags">
                  {article.tags.map(tag => (
                    <span key={tag} className="tag">
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="templates-list">
          {cannedResponses.map((template) => (
            <Card key={template.id} className="template-card">
              <div className="template-header">
                <h3>{template.title}</h3>
                <Button 
                  size="sm" 
                  variant="secondary"
                  leftIcon={<Copy size={14} />}
                  onClick={() => handleCopyTemplate(template.content)}
                >
                  Copiar
                </Button>
              </div>
              <p className="template-content">{template.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
