import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './Interactive3DImage.css';

interface Interactive3DImageProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number; // How strong the tilt effect is
}

export const Interactive3DImage: React.FC<Interactive3DImageProps> = ({ 
  src, 
  alt, 
  className = '',
  intensity = 20 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for the rotation
  const mouseX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.5 });

  // Calculate rotation based on mouse position
  // Move mouse left -> rotateY negative (tilt left)
  // Move mouse up -> rotateX positive (tilt up)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);
  
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center of element (-0.5 to 0.5)
    // 0 = center, -0.5 = left/top edge, 0.5 = right/bottom edge
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize to range -0.5 to 0.5
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;

    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    // Reset to center on leave
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`interactive-3d-container ${className}`}>
      <motion.div
        ref={ref}
        className="interactive-3d-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
      >
        {/* Main Image */}
        <div className="interactive-3d-content">
          <img src={src} alt={alt} />
        </div>

        {/* Dynamic Glare Layer */}
        <motion.div 
          className="interactive-3d-glare"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            // opacity: useTransform(mouseY, [-0.5, 0, 0.5], [0.6, 0.2, 0.6]) // subtle change in intensity
          }}
        />
        
        {/* Border Glow */}
        <div className="interactive-3d-border" />
      </motion.div>
    </div>
  );
};
