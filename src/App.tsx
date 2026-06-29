import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Menu, X, ShoppingBag } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF } from '@react-three/drei'; 
import * as THREE from 'three';
import { COLLECTION, type Product, type ButtonProps } from './data/collection';
import { SVG_VIEWBOX, SVG_PATH } from './data/svgConstants';


// --- 3D Components ---

const PlaceholderModel: React.FC<{ rotationProgress: number; isMobile: boolean; modelPath: string }> = ({ rotationProgress, isMobile, modelPath }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  const { scene } = useGLTF(modelPath) as any;
  
  // Range: 90 degrees total (-45 to +45)
  const START_ROTATION = -Math.PI / 4; // -45 deg
  const END_ROTATION = Math.PI / 4;    // +45 deg
  
  const rotation = useRef({ x: 0, y: START_ROTATION });

  useFrame((_, delta) => {
    if (meshRef.current) {
      // 1. Calculate Targets based on rotationProgress (0 to 1)
      const targetY = START_ROTATION + (rotationProgress * (END_ROTATION - START_ROTATION));
      
      // Slight tilt X (0 to 15deg)
      const targetX = rotationProgress * (Math.PI / 12);

      // 2. Smooth Dampening (Linear Interpolation)
      const smoothness = 6; 

      rotation.current.x = THREE.MathUtils.lerp(rotation.current.x, targetX, delta * smoothness);
      rotation.current.y = THREE.MathUtils.lerp(rotation.current.y, targetY, delta * smoothness);

      // Apply to mesh
      meshRef.current.rotation.x = rotation.current.x;
      meshRef.current.rotation.y = rotation.current.y;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Position: y=1.5 on mobile lifts it up to be visible above the text cards */}
      <primitive object={scene} scale={2} position={[0, isMobile ? 1.5 : 0, 0]} />
      <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
    </group>
  );
};

// --- Standard UI Components ---

const ResponsiveImage: React.FC<{
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ desktopSrc, mobileSrc, alt, className, style }) => {
  return (
    <picture className="w-full h-full block">
       {/* If mobileSrc is provided, use it on screens smaller than 768px */}
       {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
       <img src={desktopSrc} alt={alt} className={className} style={style} />
    </picture>
  );
};

const Button: React.FC<ButtonProps> = ({ children, primary, onClick, href, target, rel, className = '' }) => {
  const baseClass = "appearance-none inline-flex items-center justify-center px-8 py-4 text-sm font-medium transition-all duration-300 rounded-[12px] tracking-wide cursor-pointer whitespace-nowrap";
  const primaryClass = "!bg-white !text-black hover:!bg-gray-200 !border !border-transparent";
  const secondaryClass = "!bg-transparent !text-white !border !border-white/30 hover:!bg-white/10 backdrop-blur-sm";
  
  const Component = href ? 'a' : 'button';
  
  const props: any = {
    onClick,
    className: `${baseClass} ${primary ? primaryClass : secondaryClass} ${className}`
  };

  if (href) props.href = href;
  if (target) props.target = target;
  // Default to a safe rel when opening in a new tab, unless one is provided.
  if (target === '_blank') props.rel = rel ?? 'noopener noreferrer';
  else if (rel) props.rel = rel;

  return React.createElement(Component, props, children);
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  );
};

// --- Pictogram Components ---


const NordlysPictogram = () => {
  return (
    <div className="w-full mb-8 relative flex items-center justify-center pointer-events-none z-0">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="aurora-gradient-beam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
            <stop offset="20%" stopColor="#4ade80" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="55%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="80%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="aurora-gradient-fixed" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
            <stop offset="33%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="66%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative flex items-center justify-center reveal-base-layer opacity-90 mix-blend-screen w-full">
        <svg 
          viewBox={SVG_VIEWBOX}
          className="w-[90vw] h-auto md:w-[60vw] max-w-4xl"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <g transform="scale(1,-1)">
             <path 
               fill="none"
               stroke="url(#aurora-gradient-fixed)" 
               strokeLinecap="round" 
               strokeLinejoin="round"
               vectorEffect="non-scaling-stroke"
               strokeWidth="0.9" 
               d={SVG_PATH}
             />
          </g>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center aurora-beam-layer mix-blend-screen">
        <svg 
          viewBox={SVG_VIEWBOX}
          className="w-[90vw] h-auto md:w-[60vw] max-w-4xl"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible', filter: 'blur(5px)' }}
        >
          <g transform="scale(1,-1)">
             <path 
               fill="none"
               stroke="url(#aurora-gradient-beam)" 
               strokeLinecap="round" 
               strokeLinejoin="round"
               vectorEffect="non-scaling-stroke"
               strokeWidth="6" 
               d={SVG_PATH}
             />
          </g>
        </svg>
      </div>
    </div>
  );
};


// Generic Product Pictogram (Uses Nattbord as default placeholder)
// TODO: Pass specific SVG path and viewBox for each product

const ProductPictogram = ({ product }: { product: Product }) => {
  // Using generic ID for gradients to prevent conflicts if multiple exist, though we only render one page at a time.
  const safeId = product.id.replace(/[^a-zA-Z0-9_-]/g, '-');
  const gradientIdBeam = `product-${safeId}-gradient-beam`;
  const gradientIdFixed = `product-${safeId}-gradient-fixed`;
  const viewBoxProduct = product.pictogramViewBox;
  const path = product.pictogramPath; 

  return (
    <div className="w-full mb-8 relative flex items-center justify-center pointer-events-none z-0">
      
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientIdBeam} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0" />
            <stop offset="20%" stopColor="#4ade80" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="55%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="80%" stopColor="#a78bfa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={gradientIdFixed} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
            <stop offset="33%" stopColor="#2dd4bf" stopOpacity="1" />
            <stop offset="66%" stopColor="#818cf8" stopOpacity="1" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative flex items-center justify-center reveal-base-layer opacity-90 mix-blend-screen w-full">
        <svg 
          viewBox={viewBoxProduct}
          className="w-[90vw] h-auto md:w-[60vw] max-w-4xl"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible' }}
        >
          <g transform="scale(1,-1)">
             <path 
               fill="none"
               stroke={`url(#${gradientIdFixed})`} 
               strokeLinecap="round" 
               strokeLinejoin="round"
               vectorEffect="non-scaling-stroke"
               strokeWidth="0.9" 
               d={path}
             />
          </g>
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center aurora-beam-layer mix-blend-screen">
        <svg 
          viewBox={viewBoxProduct}
          className="w-[90vw] h-auto md:w-[60vw] max-w-4xl"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: 'visible', filter: 'blur(5px)' }}
        >
          <g transform="scale(1,-1)">
             <path 
               fill="none"
               stroke={`url(#${gradientIdBeam})`} 
               strokeLinecap="round" 
               strokeLinejoin="round"
               vectorEffect="non-scaling-stroke"
               strokeWidth="6" 
               d={path}
             />
          </g>
        </svg>
      </div>
    </div>
  );
};


// --- Cinematic Panning Component (Scroll Linked) ---
const CinematicMaterial: React.FC<{ image: string; mobileImage?: string; alt?: string; title: string; subtitle: string }> = ({ image, mobileImage, alt, title, subtitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current || !imageRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const distance = viewportHeight + rect.height;
        const progress = (viewportHeight - rect.top) / distance;
        
        const panRangeX = 10; 
        const panRangeY = 10;
        
        const x = (progress - 0.5) * panRangeX; 
        const y = (progress - 0.5) * panRangeY; 

        imageRef.current.style.transform = `scale(1.3) translate3d(${x}%, ${y}%, 0)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[80vh] overflow-hidden relative bg-[#110614] border-t border-b border-white/5">
      <div className="absolute inset-0 w-full h-full">
        <picture className="w-full h-full block">
            {mobileImage && <source media="(max-width: 768px)" srcSet={mobileImage} />}
            <img 
              ref={imageRef}
              src={image}
              alt={alt || title || 'Material Detail'}
              className="w-full h-full object-cover opacity-80 will-change-transform"
              style={{ transform: 'scale(1.3)' }} 
            />
        </picture>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#110614] via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute bottom-12 left-6 md:left-24 z-10 max-w-lg">
         <div className="backdrop-blur-md bg-black/30 p-8 rounded-2xl border border-white/10">
            <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-3">{subtitle}</p>
            <h3 className="text-3xl md:text-4xl font-ubuntu text-white font-light">{title}</h3>
         </div>
      </div>
    </div>
  );
};

// --- Page Sections ---

const LandingPage: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => (
  <div className="w-full bg-[#110614] text-white">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-24">
         <NordlysPictogram />
         <div className="z-10 flex flex-col items-center justify-center relative">
            <FadeIn delay={200}>
              <p className="mb-6 font-medium uppercase text-gray-400 font-sans text-center whitespace-nowrap text-[clamp(0.6rem,3vw,0.875rem)] tracking-[0.2em] sm:tracking-[0.3em]">HANDMADE - SCANDINAVIAN - FURNITURE</p>
            </FadeIn>
            
            <FadeIn delay={600}>
                <div className="mt-12">
                <Button primary onClick={onOpenMenu}>
                    Utforsk utvalget
                </Button>
                </div>
            </FadeIn>
         </div>
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 z-10">
            <ChevronDown size={32} />
         </div>
      </div>

      {/* Section 1: Handmade in Vikna */}
      <div className="relative min-h-[140vh] md:min-h-[90vh] w-full flex flex-col md:flex-row">
         <div className="sticky top-0 h-screen w-full md:relative md:h-full md:w-1/2 md:order-2 z-0 md:p-8">
            <div className="w-full h-full md:rounded-2xl overflow-hidden shadow-2xl relative">
              <ResponsiveImage 
                desktopSrc="/images/brand/A-homepage-banner-desktop-nm-Gruppe-18686.jpg"
                mobileSrc="/images/brand/A-homepage-banner-mobile-nm-Gruppe-18686.jpg"
                alt="Craftsman at work"
                className="h-full w-full object-contain md:object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 md:hidden"></div>
         </div>

         <div className="relative z-10 w-full md:w-1/2 md:order-1 flex flex-col justify-end md:justify-center p-6 pb-24 md:p-24 md:pb-0 h-full md:min-h-auto bg-transparent md:bg-[#110614] pointer-events-none md:pointer-events-auto">
            <div className="w-full bg-black/30 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none pointer-events-auto">
                <FadeIn>
                   <span className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-4 block">Håndverk</span>
                   <h2 className="text-4xl md:text-5xl font-light mb-8 font-ubuntu">Håndlaget i Vikna</h2>
                   <p className="text-lg text-gray-200 md:text-gray-300 leading-relaxed font-light mb-8">
                      Hos nordlys møbler møter skandinavisk design et kompromissløst håndverk. Med et tydelig nikk til 70-talls retro og tidløse, avrundede former, skaper vi objekter i massiv eik. Ingen masseproduksjon, bare ærlige møbler bygget for å passe inn overalt og tåle hverdagens bruk i generasjoner.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                     <Button primary href="https://www.nordlys-moebler.no">Tilpass din</Button>
                   </div>
                </FadeIn>
            </div>
         </div>
      </div>

      {/* Section 2: Norwegian Oak */}
      <div className="relative min-h-[140vh] md:min-h-[90vh] w-full flex flex-col md:flex-row">
         <div className="sticky top-0 h-screen w-full md:relative md:h-full md:w-1/2 z-0 md:p-8">
             <div className="w-full h-full md:rounded-2xl overflow-hidden shadow-2xl relative">
                <ResponsiveImage 
                  desktopSrc="/images/brand/B-desktop-quer-T2A9853.jpg"
                  mobileSrc="/images/brand/B-mobil-quadratisch-T2A9853.jpg"
                  alt="Norwegian Forest"
                  className="h-full w-full object-contain md:object-cover"
                />
             </div>
            <div className="absolute inset-0 bg-black/20 md:hidden"></div>
         </div>
         
         <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-end md:justify-center p-6 pb-24 md:p-24 md:pb-0 h-full md:min-h-auto bg-transparent md:bg-[#110614] pointer-events-none md:pointer-events-auto">
            <div className="w-full bg-black/30 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none pointer-events-auto">
                <FadeIn>
                   <span className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-4 block">Materialer</span>
                   <h2 className="text-4xl md:text-5xl font-light mb-8 font-ubuntu">Norsk Eik</h2>
                   <p className="text-lg text-gray-200 md:text-gray-300 leading-relaxed font-light mb-8">
                      Norges spektakulære natur, solide råvarer og et usedvanlig ærlig samfunn gir den perfekte grobunnen for nordlys møbler. Her ute i havgapet på Vikna, i mitt "knøttsmå" verksted, tar jeg imot eikestokkene. Å lokke frem treets fineste egenskaper krever ro. Når jeg lar eikens mønster diktere linjene, og former materialet til det uttrykker nøyaktig den samme harmonien som landskapet utenfor, føles håndverket brått som et litt annet og langt mer visjonært kall.
                   </p>
                   <ul className="space-y-4 text-gray-300 md:text-gray-400 mb-8">
                      <li className="flex items-center"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>Norske råvarer og storslått natur som fundament</li>
                      <li className="flex items-center"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>Unike møbler skapt med kompromissløs tålmodighet</li>
                      <li className="flex items-center"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></div>Produsert i et "knøttlite" verksted ute i havgapet på Vikna</li>
                   </ul>
                   <div className="flex flex-col sm:flex-row gap-4">
                     <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                     <Button primary href="https://www.nordlys-moebler.no">Tilpass din</Button>
                   </div>
                </FadeIn>
            </div>
         </div>
      </div>
  </div>
);

// Default info blocks. Used for any product that doesn't define its own `specs`.
// To override for a single product, add a `specs: [...]` array to that product in collection.ts.
const DEFAULT_SPECS: { header: string; tagline?: string; body: string }[] = [
  { header: 'Norske råvarer', tagline: 'bærekraft er ikke et slagord ', body: 'Hvert nattbord skjæres fra én eikeplanke fra Sør-Agder. Vi tørker treet selv. Ekte natur og bøffelskinn ved sengen.' },
  { header: 'Form & Håndverk', tagline: 'fordi detaljene faktisk betyr alt', body: 'Vi bygger kun 40 møbler i året. Nattbordets avrundede hjørner og tette sammenføyninger freses fra massiv eik med kompromissløs presisjon.' },
  { header: 'Livsløp & Bruk', tagline: 'Mitt øyeblikk. Din evighet. ', body: 'Nattbordet er like stramt bakfra som forfra. Sett det fritt i rommet, eller sitt på det. Bygget for generasjoner.' },
];

// --- PRODUCT EXPERIENCE (Formerly NattbordExperience) ---
// This is now the universal layout for "Premium" products.
// It adapts based on the 'product' prop passed to it.
const ProductExperience: React.FC<{ product: Product }> = ({ product }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modelOpacity, setModelOpacity] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // Use Features from the product to populate headers, or fallback to generic
  const feat1 = product.features[0] || 'Premium Materials';
  const feat2 = product.features[1] || 'Seamless Motion';

  useEffect(() => {
    // Reset scroll when product changes
    window.scrollTo(0, 0);
  }, [product.id]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const scrollPixels = -top;
      
      // 1. Rotation Progress
      const freezeDistance = viewportHeight * 1.5;
      const rProgress = Math.min(Math.max(scrollPixels / freezeDistance, 0), 1);
      setRotationProgress(rProgress);

      // 2. Opacity Logic (Mobile Only)
      if (window.innerWidth < 768) {
        const fadeStart = viewportHeight * 1.5;
        const fadeEnd = viewportHeight * 2.05;
        
        let newOpacity = 1;
        if (scrollPixels > fadeStart) {
            newOpacity = 1 - ((scrollPixels - fadeStart) / (fadeEnd - fadeStart));
        }
        setModelOpacity(Math.min(Math.max(newOpacity, 0), 1));
      } else {
        setModelOpacity(1);
      }

      // 3. Scroll Hint Logic
      if (scrollPixels > -100 && scrollPixels < 300) {
        setShowScrollHint(true);
      } else {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unfinished products: keep the SVG animation, show only a "coming soon" disclaimer.
  if (product.comingSoon) {
    return (
      <div className="bg-[#110614] text-white w-full relative min-h-screen flex flex-col items-center justify-center px-6">
        <ProductPictogram product={product} />
        <FadeIn delay={300}>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-4 text-center font-ubuntu lowercase">
            {product.name}
          </h1>
          <div className="h-1 w-24 bg-white/20 mx-auto rounded-full"></div>
        </FadeIn>
        <FadeIn delay={500}>
          <p className="mt-10 text-2xl md:text-3xl font-light text-gray-200 text-center max-w-2xl font-ubuntu">
            Her kommer interiøravdelingen til nordlys møbler
          </p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="bg-[#110614] text-white w-full relative">
      {/* 1. Title Screen */}
      <div className="h-screen w-full flex flex-col items-center justify-center relative px-6 z-10 bg-[#110614]">
        
        {/* Uses Generic Product Pictogram (Placeholder for now) */}
        <ProductPictogram product={product} />

        <FadeIn delay={200}>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-gray-400 font-sans text-center">{product.tagline}</p>
        </FadeIn>

        <FadeIn delay={300}>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tight mb-4 text-center font-ubuntu lowercase">
            {product.name}
          </h1>
          <div className="h-1 w-24 bg-white/20 mx-auto rounded-full"></div>
        </FadeIn>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
            <ChevronDown size={32} />
        </div>
      </div>

      {/* Intro Section: Split Screen (Image Left | Text Right) */}
      <div className="relative min-h-[140vh] w-full flex flex-col md:flex-row z-20">
          {/* Image Layer - Left on Desktop */}
          <div className="sticky top-0 h-screen w-full md:relative md:h-full md:w-1/2 z-0 md:p-8">
             <div className="w-full h-full md:rounded-2xl overflow-hidden shadow-2xl relative">
                <ResponsiveImage 
                    desktopSrc={product.pictureA}
                    mobileSrc={product.pictureAMobile}
                    alt={product.pictureAAlt || product.name}
                    className="h-full w-full object-contain md:object-cover"
                />
             </div>
             <div className="absolute inset-0 bg-black/20 md:hidden"></div>
          </div>
          
          {/* Text Layer - Right on Desktop */}
          <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-end md:justify-center p-6 pb-24 md:p-24 md:pb-0 h-full md:min-h-auto bg-transparent md:bg-[#110614] pointer-events-none md:pointer-events-auto">
             <div className="w-full bg-black/30 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none pointer-events-auto">
                 <h3 className="text-2xl font-light italic text-gray-200 font-ubuntu">"{product.text1}"</h3>
                 <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                    <Button primary href={product.shopifyLink}>
                        Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 </div>
             </div>
          </div>
      </div>

      {/* 2. Feature Section: sticky 3D-model scrollytelling when a model exists, otherwise a normal picture section */}
      {product.modelPath ? (
      <div ref={containerRef} className="relative w-full">
        
        {/* STICKY MODEL LAYER */}
        <div 
            className="sticky top-0 h-screen w-full overflow-hidden z-0 transition-opacity duration-100 ease-linear flex flex-col md:flex-row"
            style={{ opacity: modelOpacity }}
        >
           {/* DESKTOP: Left Side Text (Dynamic Header) */}
           <div className="hidden md:flex w-1/2 h-full items-center justify-center p-24 bg-[#110614]">
               <div className="max-w-xl">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">{feat1}.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light mb-8">
                        {product.text2}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                        <Button primary href={product.shopifyLink}>
                            Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
               </div>
           </div>

           {/* RIGHT SIDE: Canvas */}
           <div className="w-full md:w-1/2 h-full relative md:p-8">
               <div className="absolute inset-0 w-full h-full md:static md:w-full md:h-full md:rounded-2xl overflow-hidden shadow-2xl md:shadow-none bg-[#110614] md:bg-transparent border border-white/5 md:border-0">
                  {product.modelPath ? (
                     <Canvas camera={{ position: [0, 0, isMobile ? 9 : 6], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />
                        <Environment preset="city" />
                        <PlaceholderModel rotationProgress={rotationProgress} isMobile={isMobile} modelPath={product.modelPath} />
                     </Canvas>
                  ) : (
                     <ResponsiveImage
                        desktopSrc={product.pictureB}
                        mobileSrc={product.pictureBMobile}
                        alt={product.pictureBAlt || product.name}
                        className="h-full w-full object-contain md:object-cover"
                     />
                  )}
                  
                  {/* SCROLL HINT */}
                  <div 
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-700 ${showScrollHint ? 'opacity-100' : 'opacity-0'}`}
                  >
                      <div className="flex flex-col items-center animate-bounce">
                        <ChevronDown className="text-white/50" size={32} />
                      </div>
                  </div>
               </div>
           </div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 -mt-[100vh]">
             
             {/* THE FREEZE SPACER */}
             <div className="h-[150vh] w-full pointer-events-none"></div>

             {/* Block 1: Feature 1 (Text Left | Model Right) */}
             <div className="min-h-screen w-full flex flex-col md:flex-row">
                 {/* MOBILE ONLY: Text Overlay */}
                 <div className="relative z-10 w-full md:hidden flex flex-col justify-end p-6 pb-8 min-h-screen bg-transparent">
                     <div className="w-full bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                        <h2 className="text-4xl font-bold mb-6 font-ubuntu">{feat1}.</h2>
                        <p className="text-xl text-gray-300 leading-relaxed font-light mb-8">
                            {product.text2}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank" className="w-full">Utforsk mer</Button>
                            <Button primary href={product.shopifyLink} className="w-full">
                                Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                     </div>
                 </div>

                 {/* DESKTOP ONLY: Spacer */}
                 <div className="hidden md:block w-full min-h-screen pointer-events-none"></div>
            </div>
            {/* ADDED BUFFER FOR MOBILE ONLY */}
            <div className="md:hidden h-[100vh] w-full pointer-events-none"></div>
        </div>
      </div>
      ) : (
      <div className="relative min-h-[140vh] md:min-h-screen w-full flex flex-col md:flex-row bg-[#110614]">
         {/* Image Layer - Right on Desktop */}
         <div className="sticky top-0 h-screen w-full md:relative md:h-full md:w-1/2 z-0 md:order-2 md:p-8">
            <div className="w-full h-full md:rounded-2xl overflow-hidden shadow-2xl relative">
              <ResponsiveImage
                  desktopSrc={product.pictureB}
                  mobileSrc={product.pictureBMobile}
                  alt={product.pictureBAlt || product.name}
                  className="h-full w-full object-contain md:object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/20 md:hidden"></div>
         </div>

         {/* Text Layer - Left on Desktop */}
         <div className="relative z-10 w-full md:w-1/2 md:order-1 flex flex-col justify-end md:justify-center p-6 pb-24 md:p-24 md:pb-0 h-full md:min-h-auto bg-transparent md:bg-[#110614] pointer-events-none md:pointer-events-auto">
             <div className="w-full bg-black/30 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none pointer-events-auto">
                 <h2 className="text-4xl font-bold mb-6 font-ubuntu">{feat1}.</h2>
                 <p className="text-xl text-gray-300 leading-relaxed font-light mb-8">
                     {product.text2}
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                    <Button primary href={product.shopifyLink}>
                        Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 </div>
             </div>
         </div>
      </div>
      )}

      {/* 3. Subsequent Content (Slides UP) */}
      <div className={`relative z-20 bg-[#110614] ${product.modelPath ? '-mt-[100vh] md:mt-0' : ''}`}>
            {/* Block 2: Feature 2 (Image Left | Text Right) */}
            <div className="relative min-h-[140vh] md:min-h-screen w-full flex flex-col md:flex-row bg-[#110614]">
               {/* Image Layer - Left on Desktop */}
               <div className="sticky top-0 h-screen w-full md:relative md:h-full md:w-1/2 z-0 md:order-1 md:p-8">
                  <div className="w-full h-full md:rounded-2xl overflow-hidden shadow-2xl relative">
                    <ResponsiveImage 
                        desktopSrc={product.pictureC}
                        mobileSrc={product.pictureCMobile}
                        alt={product.pictureCAlt || product.name}
                        className="h-full w-full object-contain md:object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 md:hidden"></div>
               </div>

               {/* Text Layer - Right on Desktop */}
               <div className="relative z-10 w-full md:w-1/2 md:order-2 flex flex-col justify-end md:justify-center p-6 pb-24 md:p-24 md:pb-0 h-full md:min-h-auto bg-transparent md:bg-[#110614] pointer-events-none md:pointer-events-auto">
                    <div className="w-full bg-black/30 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none pointer-events-auto">
                        <h2 className="text-4xl font-bold mb-6 font-ubuntu">{feat2}.</h2>
                        <p className="text-xl text-gray-300 leading-relaxed font-light mb-6">
                            "{product.text3}"
                        </p>
                        <p className="text-lg italic text-white/60 mb-8">"{product.tagline2}"</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                           <Button href="https://www.nordlys-moebler.no/#systemgrafik" target="_blank">Utforsk mer</Button>
                           <Button primary href={product.shopifyLink}>
                               Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </div>
                     </div>
               </div>
            </div>

            {/* Block 3: Cinematic Material Detail (Scroll Linked) */}
            <CinematicMaterial
                image={product.detailImage ?? '/images/shared/lifestyle/nm34L_close_up.jpg'}
                mobileImage={product.detailImageMobile ?? '/images/shared/lifestyle/close_up.jpg'}
                alt={product.detailImageAlt}
                title="Presisjonsarbeid"
                subtitle="Detaljer"
            />

      </div>

      {/* 4. Specs / Detail Grid (Placeholder Specs) */}
      <div className="py-32 px-6 max-w-7xl mx-auto bg-[#110614] relative z-20">
        <h3 className="text-4xl font-ubuntu mb-16 text-center">Core Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(product.specs ?? DEFAULT_SPECS).map((spec, i) => (
                <div key={i} className="bg-[#1a0c1e] p-10 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <h4 className="text-2xl font-ubuntu font-light mb-3">{spec.header}</h4>
                    {spec.tagline && <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-4">{spec.tagline}</p>}
                    <p className="text-sm text-gray-400 leading-relaxed">{spec.body}</p>
                </div>
            ))}
        </div>
      </div>
      
      {/* 5. Final CTA */}
      <div className="pb-32 text-center bg-[#110614] relative z-20">
         <Button primary href={product.shopifyLink}>Tilpass din</Button>
      </div>
    </div>
  );
};

// --- SEO ---

const SITE_NAME = 'Nordlys Møbler';
const HOME_DESCRIPTION = 'Handcrafted Scandinavian furniture from our workshop in Rørvik. Explore nightstands, desks, sideboards, dressers and bespoke pieces.';

const setMeta = (name: string, content: string, isProperty = false) => {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
};

const setCanonical = (url: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  (el as HTMLLinkElement).href = url;
};

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ?? window.location.origin;

const updateMetaTags = (product: Product | null) => {
  const base = SITE_URL;

  if (product) {
    const title = `${product.name} – ${product.type} | ${SITE_NAME}`;
    const desc = product.price
      ? `${product.description} ${product.price}.`
      : product.description;
    const url = `${base}/${product.id}`;
    const image = product.pictureA.startsWith('http')
      ? product.pictureA
      : `${base}${product.pictureA}`;

    document.title = title;
    setMeta('description', desc);
    setMeta('og:title', title, true);
    setMeta('og:description', desc, true);
    setMeta('og:url', url, true);
    setMeta('og:image', image, true);
    setMeta('og:type', 'product', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', image);
    setCanonical(url);
  } else {
    const title = `${SITE_NAME} – Scandinavian Furniture from Norway`;
    const url = base;

    document.title = title;
    setMeta('description', HOME_DESCRIPTION);
    setMeta('og:title', title, true);
    setMeta('og:description', HOME_DESCRIPTION, true);
    setMeta('og:url', url, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', HOME_DESCRIPTION);
    setCanonical(url);
  }
};

// --- Main App ---

const getProductFromPath = (): Product | null => {
  const id = window.location.pathname.slice(1);
  if (!id) return null;
  return COLLECTION.find(p => p.id === id) ?? null;
};

export default function App() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(getProductFromPath);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Update meta tags on every navigation
  useEffect(() => {
    updateMetaTags(activeProduct);
  }, [activeProduct]);

  // Handle scroll for nav bar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setActiveProduct(getProductFromPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToProduct = (product: Product) => {
    setActiveProduct(product);
    setIsMenuOpen(false);
    window.history.pushState(null, '', '/' + product.id);
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    setActiveProduct(null);
    setIsMenuOpen(false);
    window.history.pushState(null, '', '/');
    window.scrollTo(0, 0);
  };
  
  const openMenu = () => setIsMenuOpen(true);

  return (
    <div className="bg-[#110614] min-h-screen w-full font-sans selection:bg-white selection:text-black">
      {/* Inline Styles & Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

        .font-ubuntu {
            font-family: 'Ubuntu', sans-serif;
        }

        body {
            overflow-x: hidden;
        }

        .menu-text-responsive {
            font-size: 5.4vh; 
            line-height: 1.1;
            font-weight: 700;
            letter-spacing: -0.05em;
        }
        @media (min-width: 768px) {
            .menu-text-responsive {
                font-size: 8vh; 
            }
        }

        @keyframes slow-pan {
            0% { transform: scale(1.25) translate(0%, 0%); }
            50% { transform: scale(1.35) translate(-2%, -2%); }
            100% { transform: scale(1.25) translate(0%, 0%); }
        }
        .animate-slow-pan {
            animation: slow-pan 30s ease-in-out infinite alternate;
        }

        /* --- AURORA ANIMATION LOGIC --- */
        @keyframes reveal-base {
          0% { mask-position: 100% 0; -webkit-mask-position: 100% 0; }
          100% { mask-position: 0% 0; -webkit-mask-position: 0% 0; }
        }

        @keyframes beam-sweep {
          0% { mask-position: 100% 0; -webkit-mask-position: 100% 0; opacity: 1; }
          80% { opacity: 1; }
          100% { mask-position: 0% 0; -webkit-mask-position: 0% 0; opacity: 0; } 
        }

        .reveal-base-layer {
          mask-image: linear-gradient(110deg, black 45%, transparent 55%);
          -webkit-mask-image: linear-gradient(110deg, black 45%, transparent 55%);
          mask-size: 300% 100%;
          -webkit-mask-size: 300% 100%;
          mask-position: 100% 0;
          -webkit-mask-position: 100% 0;
          animation: reveal-base 3s ease-out forwards;
          animation-delay: 0.2s;
        }

        .aurora-beam-layer {
          mask-image: linear-gradient(110deg, transparent 40%, black 50%, transparent 60%);
          -webkit-mask-image: linear-gradient(110deg, transparent 40%, black 50%, transparent 60%);
          mask-size: 300% 100%;
          -webkit-mask-size: 300% 100%;
          animation: beam-sweep 3s ease-out forwards;
          animation-delay: 0.2s;
        }

        @media (min-width: 768px) {
            .reveal-base-layer { animation-duration: 5s; }
            .aurora-beam-layer { animation-duration: 5s; }
        }

        /* Reset Vite Default Layout Constraints */
        :root { max-width: none !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
        body { display: block !important; place-items: unset !important; min-width: 0 !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
        #root { max-width: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; text-align: left !important; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .nav-logo { font-size: 2.25rem !important; }

        nav button, .menu-overlay button {
          background-color: transparent !important; border: none !important; outline: none !important; box-shadow: none !important;
          padding: 0.5rem 0 !important; margin: 0 !important; border-radius: 0 !important;
        }
        nav button:focus, nav button:focus-visible, nav button:active, nav button:hover,
        .menu-overlay button:focus, .menu-overlay button:focus-visible, .menu-overlay button:active, .menu-overlay button:hover {
          outline: none !important; box-shadow: none !important; background-color: transparent !important; border-color: transparent !important;
        }

        nav a { color: white !important; text-decoration: none !important; }
        nav a:hover { color: #d1d5db !important; }
      `}</style>
      
      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? 'bg-[#110614]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="relative w-full h-20 flex items-center justify-between px-6">
          <button onClick={() => setIsMenuOpen(true)} className="text-white p-2 z-50 hover:text-gray-300 transition-colors" aria-label="Open Menu">
            <Menu size={32} />
          </button>
          <button onClick={navigateHome} className="absolute left-1/2 transform -translate-x-1/2 nav-logo text-4xl font-bold tracking-tighter text-white appearance-none bg-transparent border-none p-0 cursor-pointer font-ubuntu lowercase z-50 whitespace-nowrap">
            nordlys møbler
          </button>
          <div className="flex items-center justify-end z-50">
             <a href={activeProduct?.shopifyLink || "https://www.nordlys-moebler.no"} className={`text-white p-2 hover:text-gray-300 transition-all duration-500 ease-out transform ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`} aria-label="Shop">
                <ShoppingBag size={28} />
             </a>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className={`menu-overlay fixed inset-0 z-50 bg-[#110614] transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 left-6 text-white p-2 hover:text-gray-300 transition-colors z-50">
            <X size={32} />
        </button>

        <div className="h-full w-full flex flex-col justify-evenly items-start pt-[3vh] pb-[13vh] pl-6 md:pl-12 pr-4 overflow-hidden">
            <button
                onClick={navigateHome}
                className={`menu-text-responsive flex items-center justify-start text-left font-ubuntu uppercase whitespace-nowrap bg-transparent border-none cursor-pointer transition-all duration-300 ${
                    !activeProduct ? 'text-white underline decoration-2 underline-offset-8' : 'text-gray-400 hover:text-white hover:scale-105 origin-left'
                }`}
            >
                Home
            </button>

            {COLLECTION.map(item => (
                <button
                    key={item.id}
                    onClick={() => navigateToProduct(item)}
                    className={`menu-text-responsive flex items-center justify-start text-left font-ubuntu lowercase whitespace-nowrap bg-transparent border-none cursor-pointer transition-all duration-300 ${
                        activeProduct?.id === item.id
                        ? 'text-white underline decoration-2 underline-offset-8'
                        : 'text-gray-400 hover:text-white hover:scale-105 origin-left'
                    }`}
                >
                    {item.name}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full">
        {activeProduct ? (
          <ProductExperience key={activeProduct.id} product={activeProduct} />
        ) : (
          <LandingPage onOpenMenu={openMenu} />
        )}
      </main>

      {/* Simple Footer */}
      {!activeProduct && (
        <footer className="bg-[#110614] text-gray-500 py-12 px-6 border-t border-white/10 w-full">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
            <p>&copy; 2026 nordlys møbler</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://www.instagram.com/nordlysmoebler/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Address is assembled at click time so it never appears in the
                  // static/prerendered HTML, reducing spam-scraper harvesting.
                  window.location.href = `mailto:${['contact', 'nordlys-moebler.no'].join('@')}`;
                }}
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
