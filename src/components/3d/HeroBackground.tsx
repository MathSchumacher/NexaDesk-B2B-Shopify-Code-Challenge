import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// Custom shader for liquid distortion effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uDistortion;
  varying vec2 vUv;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    
    // Base dark background
    vec3 darkBg = vec3(0.04, 0.04, 0.06);
    vec3 color = darkBg;
    
    // NexaDesk Brand Colors
    vec3 primaryGreen = vec3(0.357, 0.749, 0.404);  // #5BBF67
    vec3 deepPurple = vec3(0.404, 0.345, 0.698);    // #6758B2
    
    // Create subtle grid pattern
    float gridSize = 30.0;
    vec2 gridUv = fract(uv * gridSize);
    float gridLine = smoothstep(0.02, 0.0, abs(gridUv.x - 0.5)) + 
                     smoothstep(0.02, 0.0, abs(gridUv.y - 0.5));
    gridLine *= 0.03; 
    color += vec3(gridLine);
    
    // --- MOUSE GLOW LOGIC ---
    float mouseDistance = distance(uv, uMouse);
    
    // Core intense glow (smaller radius, higher intensity)
    float coreGlow = smoothstep(0.15, 0.0, mouseDistance) * 0.6; // Reduced from 1.5
    
    // Outer ambient glow (larger radius)
    float outerGlow = smoothstep(0.5, 0.0, mouseDistance) * 0.15; // Reduced from 0.4
    
    // Distortion effect around mouse
    float distortion = snoise(vec3(uv * 10.0 - uTime * 0.5, uTime * 0.2)) * 0.1;
    float distortedGlow = smoothstep(0.3, 0.0, mouseDistance + distortion) * 0.2; // Reduced from 0.5
    
    // Combine glows and apply to green color
    vec3 glowColor = primaryGreen * (coreGlow + outerGlow + distortedGlow);
    color += glowColor;
    
    // Subtle flowing gradient at bottom
    float bottomGradient = smoothstep(0.0, 0.5, 1.0 - uv.y);
    float noise = snoise(vec3(uv * 2.0, uTime * 0.1)) * 0.5 + 0.5;
    color = mix(color, deepPurple * 0.2, bottomGradient * 0.3 * noise);
    
    // Floating particles / dots affected by mouse
    float particleNoise = snoise(vec3(uv * 40.0, uTime * 0.2));
    float particles = smoothstep(0.9, 0.95, particleNoise);
    
    // Make particles near mouse brighter
    float particleGlow = smoothstep(0.4, 0.0, mouseDistance);
    color += primaryGreen * particles * (0.2 + particleGlow * 0.4); // Reduced from 0.8
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Props interface for FluidPlane
interface FluidPlaneProps {
  mouseRef: React.RefObject<{ x: number; y: number }>;
}

// The animated plane mesh - receives mouse position from parent
function FluidPlane({ mouseRef }: FluidPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uDistortion: { value: 0.3 },
    }),
    [size.width, size.height]
  );

  useFrame((state) => {
    if (meshRef.current && mouseRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Use global mouse position from ref (normalized 0-1)
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      material.uniforms.uMouse.value.x += (targetX - material.uniforms.uMouse.value.x) * 0.08;
      material.uniforms.uMouse.value.y += (targetY - material.uniforms.uMouse.value.y) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

// Fallback for mobile/reduced motion
function StaticGradient() {
  return (
    <div 
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #0C0C0F 0%, #1a1a2e 50%, #0C0C0F 100%)',
      }}
    />
  );
}

// Main exported component
interface HeroBackgroundProps {
  className?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({ className }) => {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Global mouse position ref (normalized 0-1)
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Track mouse position globally on window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to 0-1 range relative to viewport
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1 - (e.clientY / window.innerHeight); // Flip Y for WebGL
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check for reduced motion preference and WebGL support
  useMemo(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Simple WebGL support check
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setIsWebGLSupported(!!gl);
      } catch {
        setIsWebGLSupported(false);
      }
    }
  }, []);

  // Use static fallback for mobile or reduced motion
  if (!isWebGLSupported || prefersReducedMotion) {
    return <StaticGradient />;
  }

  return (
    <div 
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <FluidPlane mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
};

export default HeroBackground;
