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
 * Uses scrub mode by default for continuous fade-in/out based on scroll position.
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
  start = 'top 85%',   // Element top hits 85% of viewport
  end = 'top 70%',     // Animation completes at this point
  scrub = 0.05,        // Near-instant scroll response (true = 1 second delay, we want minimal)
}) => {
  const containerRef = useRef<any>(null); // adapt ref type

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

      // Animate TO natural state - scrub links animation directly to scroll position
      gsap.to(targets, {
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: scrub === true ? 1 : (scrub === false ? false : scrub),
          // When scrub is enabled, animation reverses automatically as you scroll back
        },
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        rotateY: 0,
        duration,
        delay,
        stagger: stagger > 0 ? stagger : undefined,
        ease: 'none', // Linear easing works best with scrub
        overwrite: 'auto'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [animation, duration, delay, stagger, start, end, scrub]);

  const TagComponent = Tag as React.ElementType;
  
  return (
    <TagComponent ref={containerRef} className={`scroll-reveal ${className}`} style={style}>
      {children}
    </TagComponent>
  );
};

export default ScrollReveal;

