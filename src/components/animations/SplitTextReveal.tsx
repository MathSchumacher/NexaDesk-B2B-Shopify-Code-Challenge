import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextRevealProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  splitBy?: 'words' | 'chars' | 'lines';
  staggerAmount?: number;
  duration?: number;
  delay?: number;
  scrub?: boolean | number; // If true, animation is tied to scroll position
  start?: string; // ScrollTrigger start position (e.g., "top 80%")
  end?: string; // ScrollTrigger end position (e.g., "top 40%")
}

/**
 * SplitTextReveal - A custom component that splits text and animates each part on scroll.
 * Replicates SplitText-like behavior without requiring the paid plugin.
 */
export const SplitTextReveal: React.FC<SplitTextRevealProps> = ({
  children,
  className = '',
  style,
  as: Tag = 'p',
  splitBy = 'words',
  staggerAmount = 0.03,
  duration = 0.8,
  delay = 0,
  scrub = 0.05,        // Near-instant scroll response (true = 1 second delay, we want minimal)
  start = 'top 85%',   // Element top hits 85% of viewport
  end = 'top 70%',     // Animation completes at this point
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use gsap.context for proper cleanup in React Strict Mode
    const ctx = gsap.context(() => {
      // Get all the split elements
      const elements = container.querySelectorAll('.split-item');
      
      // Safety check to prevent animating from 0 to 0 on re-renders
      if (elements.length === 0) return;
      
      // Ensure opacity is reset before animation starts to avoid flash
      gsap.set(elements, { opacity: 0, y: 30, rotateX: -20 });

      // Create the scroll animation - scrub links animation directly to scroll position
      gsap.to(elements, {
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: scrub === true ? 1 : (scrub === false ? false : scrub),
          // When scrub is enabled, animation reverses automatically as you scroll back
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: staggerAmount,
        duration,
        delay,
        ease: 'none', // Linear easing works best with scrub
        overwrite: 'auto'
      });
    }, containerRef); // Scope to container

    return () => ctx.revert(); // Revert everything on cleanup
  }, [children, staggerAmount, duration, delay, scrub, start, end]);

  // Split the text based on the splitBy prop
  const splitText = () => {
    if (splitBy === 'chars') {
      return children.split('').map((char, i) => (
        <span 
          key={i} 
          className="split-item" 
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </span>
      ));
    } else if (splitBy === 'words') {
      return children.split(' ').map((word, i, arr) => (
        <span key={i} className="split-item" style={{ display: 'inline-block' }}>
          {word}{i < arr.length - 1 ? '\u00A0' : ''}
        </span>
      ));
    } else {
      // Lines - just treat as single block
      return <span className="split-item" style={{ display: 'block' }}>{children}</span>;
    }
  };

  return (
    <Tag 
      ref={containerRef as any} 
      className={`split-text-reveal ${className}`}
      style={{ perspective: '1000px', ...style }}
    >
      {splitText()}
    </Tag>
  );
};

export default SplitTextReveal;
