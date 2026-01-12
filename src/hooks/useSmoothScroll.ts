import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface UseSmoothScrollOptions {
  /** Lerp value for smooth scrolling (0-1). Lower = smoother. Default: 0.1 */
  lerp?: number;
  /** Scroll duration multiplier. Default: 1.2 */
  duration?: number;
  /** Enable/disable smooth scroll. Default: true */
  enabled?: boolean;
}

/**
 * Custom hook to initialize Lenis smooth scrolling with GSAP ScrollTrigger integration.
 * Automatically handles cleanup on unmount.
 */
export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const { lerp = 0.1, duration = 1.2, enabled = true } = options;
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Skip if disabled or on mobile (for performance)
    if (!enabled) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis
    const lenis = new Lenis({
      lerp,
      duration,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP's lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [lerp, duration, enabled]);

  return lenisRef;
}

export default useSmoothScroll;
