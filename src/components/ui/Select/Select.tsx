import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './Select.css';

interface SelectOption {
  value: string;
  label: string;
  image?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const Select = ({ options, value, onChange, placeholder = 'Select...', icon, disabled = false }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="select-container" ref={containerRef}>
      <div 
        className={`select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="select-value">
          {icon && <span className="select-icon-wrapper">{icon}</span>}
          {selectedOption ? (
            <div className="selected-content">
              {selectedOption.image && (
                <img src={selectedOption.image} alt="" className="select-option-image" />
              )}
              <span>{selectedOption.label}</span>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={16} className={`select-arrow ${isOpen ? 'rotate' : ''}`} />
      </div>

      {isOpen && (
        <div className="select-dropdown">
          {options.length > 10 && (
             <div className="select-search">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
         
          <div className="select-options-list">
             {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`select-option ${value === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    {option.image && (
                      <img src={option.image} alt="" className="select-option-image" />
                    )}
                    <span>{option.label}</span>
                  </div>
                ))
             ) : (
               <div className="no-options">Nenhum resultado</div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};
