// Custom Tags Component
// Developer: Matheus Schumacher | 2026

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { customTags } from '../data/companies';
import './CustomTags.css';

interface CustomTagsProps {
  tags: string[];
  onAddTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export const CustomTags = ({ tags, onAddTag, onRemoveTag }: CustomTagsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tagId: string) => {
    const tagInfo = customTags.find(t => t.id === tagId);
    onAddTag(tagId);
    setIsOpen(false);
    toast.success(`Tag "${tagInfo?.label}" adicionada`);
  };

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveTag(tagId);
  };

  const availableTags = customTags.filter(t => !tags.includes(t.id));

  return (
    <div className="custom-tags" ref={dropdownRef}>
      <div className="tags-list">
        {tags.map((tagId) => {
          const tagInfo = customTags.find(t => t.id === tagId);
          if (!tagInfo) return null;
          return (
            <motion.span
              key={tagId}
              className="custom-tag"
              style={{ 
                backgroundColor: `${tagInfo.color}20`,
                borderColor: `${tagInfo.color}40`,
                color: tagInfo.color
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {tagInfo.label}
              <button 
                className="remove-tag"
                onClick={(e) => handleRemoveTag(tagId, e)}
              >
                <X size={10} />
              </button>
            </motion.span>
          );
        })}
        
        {availableTags.length > 0 && (
          <button 
            className="add-tag-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus size={12} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && availableTags.length > 0 && (
          <motion.div 
            className="tags-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                className="tag-option"
                onClick={() => handleAddTag(tag.id)}
              >
                <Tag size={12} style={{ color: tag.color }} />
                <span style={{ color: tag.color }}>{tag.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
