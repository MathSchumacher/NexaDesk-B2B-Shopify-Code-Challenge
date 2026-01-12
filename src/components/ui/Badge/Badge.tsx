import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'new' | 'replied' | 'pending';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};
