import React, { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType; // allow dynamic tag
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'rotateIn';
  duration?: number;
  delay?: number;
  stagger?: number; // For animating multiple children
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

/**
 * ScrollReveal - A wrapper component that animates its children on scroll.
 * Provides various animation presets with reversibility.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  style,
  as: Tag = 'div', // default to div
  animation = 'fadeUp',
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = 'top 85%',
  end = 'top 40%',
  scrub = false,
}) => {
  const containerRef = useRef<any>(null); // adapt ref type

  // ... (effect logic remains same)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use gsap.context for proper cleanup
    const ctx = gsap.context(() => {
      // Define animation presets - Initial States (FROM)
      const initialStates: Record<string, gsap.TweenVars> = {
        fadeUp: { opacity: 0, y: 50 },
        fadeIn: { opacity: 0 },
        slideLeft: { opacity: 0, x: -80 },
        slideRight: { opacity: 0, x: 80 },
        scaleUp: { opacity: 0, scale: 0.8 },
        rotateIn: { opacity: 0, rotateY: -30, transformPerspective: 1000 },
      };

      const fromVars = initialStates[animation] || initialStates.fadeUp;

      // Get direct children or target container itself
      const targets = stagger > 0 ? container.children : container;
      if (stagger > 0 && (!targets || (targets as any).length === 0)) return;

      // Set initial state immediately to avoid FOUC
      gsap.set(targets, fromVars);

      // Animate TO natural state
      gsap.to(targets, {
        scrollTrigger: {
          trigger: container,
          start,
          end,
          toggleActions: scrub ? undefined : 'play none none reverse',
          scrub: scrub === true ? 1 : scrub,
        },
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animation, duration, delay, stagger, start, end, scrub]);

  return (
    <Tag ref={containerRef} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
};

export default ScrollReveal;
