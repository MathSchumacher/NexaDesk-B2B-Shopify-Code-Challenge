import React, { forwardRef, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, type, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Combine refs to ensure we can access the input internally even if a ref is passed
    const setRef = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
      }
    };

    const updateValue = (delta: number) => {
      const input = internalRef.current;
      if (input) {
        const value = parseFloat(input.value) || 0;
        const step = parseFloat(input.step) || 1;
        const min = input.min ? parseFloat(input.min) : -Infinity;
        const max = input.max ? parseFloat(input.max) : Infinity;
        
        let newValue = value + (delta * step);
        if (newValue < min) newValue = min;
        if (newValue > max) newValue = max;

        // Use native setter to trigger React's event listening if possible
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeSetter?.call(input, newValue);
        
        // Dispatch events to ensure state updates
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    const isNumber = type === 'number';

    return (
      <div className={`input-wrapper ${error ? 'input-error' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-container">
          {isNumber && (
            <button 
              type="button" 
              className="input-spinner-btn decrement" 
              onClick={() => updateValue(-1)}
              tabIndex={-1}
            >
              <Minus size={14} />
            </button>
          )}

          {leftIcon && !isNumber && <span className="input-icon input-icon-left">{leftIcon}</span>}
          
          <input
            ref={setRef}
            id={inputId}
            type={type}
            className={`input-field ${leftIcon && !isNumber ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''} ${isNumber ? 'has-spinners' : ''}`}
            {...props}
          />
          
          {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}

          {isNumber && (
            <button 
              type="button" 
              className="input-spinner-btn increment" 
              onClick={() => updateValue(1)}
              tabIndex={-1}
            >
              <Plus size={14} />
            </button>
          )}
        </div>
        {error && <span className="input-message input-message-error">{error}</span>}
        {hint && !error && <span className="input-message input-message-hint">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
