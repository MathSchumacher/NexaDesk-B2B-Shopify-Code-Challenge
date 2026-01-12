import { motion } from 'framer-motion';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 'var(--radius-md)',
  className = ''
}: SkeletonProps) => {
  return (
    <motion.div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

// Pre-built skeleton layouts
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-header">
      <Skeleton width={48} height={48} borderRadius="50%" />
      <div className="skeleton-card-meta">
        <Skeleton width="60%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <Skeleton height={60} />
    <div className="skeleton-card-footer">
      <Skeleton width={80} height={28} />
      <Skeleton width={60} height={28} />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} width={`${20 + i * 5}%`} height={14} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton-table-row">
        {[1, 2, 3, 4].map(j => (
          <Skeleton key={j} width={`${30 + j * 10}%`} height={16} />
        ))}
      </div>
    ))}
  </div>
);
