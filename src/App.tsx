import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronRight, Menu, X, ShoppingBag } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
// NOTE: Uncomment 'useGLTF' below when you are ready to load your custom 3D model
import { Environment, ContactShadows, useGLTF } from '@react-three/drei'; 
import * as THREE from 'three';

// --- Types ---
interface Product {
  id: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  price: string | null;
  heroImage: string;
  heroImageMobile?: string;
  detailImage1: string;
  detailImage1Mobile?: string;
  detailImage2: string;
  detailImage2Mobile?: string;
  features: string[];
  shopifyLink: string;
}

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}

// --- Data ---
const COLLECTION: Product[] = [
  {
    id: 'nattbord',
    name: 'Nattbord',
    type: 'Nightstand',
    tagline: 'Quiet companion for the night.',
    description: 'Minimalist bedside storage designed to keep your sanctuary clutter-free. Crafted from smoked oak with a soft-close mechanism that respects the silence of the bedroom.',
    price: 'From €850',
    heroImage: '/images/nattbord_natur.jpg',
    heroImageMobile: '/images/nattbord_natur.jpg',
    detailImage1: '/images/nattbord_produksjon.jpg',
    detailImage1Mobile: '/images/prod_mobile.jpg',
    detailImage2: '/images/vintereik.jpg',
    detailImage2Mobile: '/images/vintereik.jpg',
    features: ['Smoked Oak', 'Soft-Close', 'Integrated Charging'],
    shopifyLink: 'https://nordlys-moebler-2.myshopify.com/en/products/skrivebord'
  },
  {
    id: 'skrivebord',
    name: 'Skrivebord',
    type: 'Workspace',
    tagline: 'Clarity for your thoughts.',
    description: 'The Horizon desk offers a distraction-free surface of linoleum and walnut. Designed to organize your cables and your mind, perfect for the modern home office.',
    price: 'From €1,400',
    heroImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2070',
    features: ['Walnut Veneer', 'Cable Management', 'Linoleum Top'],
    shopifyLink: '#shopify-skrivebord'
  },
  {
    id: 'skuffeskap',
    name: 'Skuffeskap',
    type: 'Drawer Cabinet',
    tagline: 'Everything in its place.',
    description: 'A tall, slender cabinet featuring vertical grain matching. Each drawer is perfectly sized for documents, sketches, or personal treasures.',
    price: 'From €2,100',
    heroImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1595515106969-1ce29569ff53?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=2070',
    features: ['Vertical Grain', 'Push-to-Open', 'Solid Wood Base'],
    shopifyLink: '#shopify-skuffeskap'
  },
  {
    id: 'skjenk',
    name: 'Skjenk',
    type: 'Sideboard',
    tagline: 'The anchor of the room.',
    description: 'Low, long, and elegant. This sideboard features sliding doors woven from paper cord, hiding your media units while allowing remote signals to pass through.',
    price: 'From €3,200',
    heroImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=2070',
    features: ['Paper Cord Doors', 'Adjustable Shelves', 'Media Ready'],
    shopifyLink: '#shopify-skjenk'
  },
  {
    id: 'kommode',
    name: 'Kommode',
    type: 'Dresser',
    tagline: 'Storage reimagined.',
    description: 'A classic dresser silhouette modernized with sharp angles and floating feet. Built to last generations, with dovetail joinery in every drawer.',
    price: 'From €2,800',
    heroImage: 'https://images.unsplash.com/photo-1595514020173-66b6e3a6a93e?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=2070',
    features: ['Dovetail Joints', 'Cedar Lined', 'Custom Handles'],
    shopifyLink: '#shopify-kommode'
  },
  {
    id: 'custom',
    name: 'Custom',
    type: 'Bespoke Services',
    tagline: 'Your vision, our craft.',
    description: 'For those who need something unique. We work with you to design and build furniture that fits your specific space and dimensions perfectly.',
    price: 'Price on Request',
    heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1601057476885-d2fc76451e50?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=2070',
    features: ['Made to Measure', 'Material Selection', 'Design Consultation'],
    shopifyLink: '#contact-custom'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    type: 'Decor & Lighting',
    tagline: 'The finishing touches.',
    description: 'Sculpted light and hand-turned objects. Our accessories collection brings the warmth of Nordic design into the smallest details of your home.',
    price: 'From €150',
    heroImage: 'https://images.unsplash.com/photo-1513506003013-d3c734b42029?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1507473888900-52e1adad8136?auto=format&fit=crop&q=80&w=2070',
    features: ['Hand-Blown Glass', 'Ceramic Vases', 'Wool Throws'],
    shopifyLink: '#shopify-accessories'
  },
  {
    id: 'om-oss',
    name: 'Om oss',
    type: 'Our Story',
    tagline: 'Born from the north.',
    description: 'Nordlys was founded on the belief that furniture should be quiet, durable, and beautiful. We manufacture everything in our workshop in Oslo, using only sustainable materials.',
    price: null,
    heroImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=2070',
    detailImage1: 'https://images.unsplash.com/photo-1459749411177-287ce3288b71?auto=format&fit=crop&q=80&w=2070',
    detailImage2: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2070',
    features: ['Established 2024', 'Oslo Based', 'Sustainable'],
    shopifyLink: '#contact'
  }
];

// --- 3D Components ---

const PlaceholderModel: React.FC<{ rotationProgress: number; isMobile: boolean }> = ({ rotationProgress, isMobile }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Custom model loaded
  const { scene } = useGLTF('/models/nattbord.glb'); 
  
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

// Responsive Image Component (Helper)
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

const Button: React.FC<ButtonProps> = ({ children, primary, onClick, href, className = '' }) => {
  const baseClass = "inline-flex items-center justify-center px-8 py-4 text-sm font-medium transition-all duration-300 rounded-[12px] tracking-wide cursor-pointer whitespace-nowrap";
  const primaryClass = "bg-white text-black hover:bg-gray-200 border border-transparent";
  const secondaryClass = "bg-transparent text-white border border-white/30 hover:bg-white/10 backdrop-blur-sm";
  
  const Component = href ? 'a' : 'button';
  
  const props: any = {
    onClick,
    className: `${baseClass} ${primary ? primaryClass : secondaryClass} ${className}`
  };

  if (href) props.href = href;

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

// --- New Component: Nordlys Pictogram Animation (FIXED: JS CALCULATION) ---

// 1. Paste your QCAD Export Data Here
const SVG_VIEWBOX = "-1663.1228 -1093.5197 3787.7549 1176"; 
const SVG_PATH = "m 1532.8451,925.0197 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,42.5 v -115 m 0,234 v -115 m 353,-4 v -115 m 0,234 v -115 m -353,115 h 353 m -353,-119 h 353 m -353,4 h 353 m -353,-119 h 353 m -161.5,325.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-342 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 186.5,-133.5 h -3 m 3,-42 h -3 m 9,40 h -6 m 6,-38 h -6 m 0,-2 v 42 m 0,88.5 h -3 m 3,42 h -3 m 9,-40 h -6 m 6,38 h -6 m 36,-6 a 12,12 0 0 1 -12,12 m 0,0 h -12 m 24,-12 v -386.5 m -36,394.5 v -42 m 12,46 a 6,6 0 0 1 -6,-6 m 0,0 v -392.5 m -409,264 h 3 m -3,-42 h 3 m -9,40 h 6 m -6,-38 h 6 m 0,-2 v 42 m 0,88.5 h 3 m -3,42 h 3 m -9,-40 h 6 m -6,38 h 6 m -24,6 a 12,12 0 0 1 -12,-12 m 12,12 h 12 m -24,-12 v -386.5 m 36,394.5 v -42 m -6,40 a 6,6 0 0 1 -6,6 m 6,-6 v -392.5 m 47,1176 a 38,38 0 0 1 -38,-38 m 38,38 h 321 m -321,-22 h 321 m -321,4 h 321 m -337,-20 v -99 m 16,115 a 16,16 0 0 1 -16,-16 m 353,0 a 16,16 0 0 1 -16,16 m 16,-16 v -99 m -353,-361 v -115 m 0,234 v -115 m 353,-4 v -115 m 0,234 v -115 m -16,-498 a 38,38 0 0 1 38,38 m -359,-38 h 321 m -321,18 h 321 m -337,357 v -115 m 353,115 v -115 m -375,-222 a 38,38 0 0 1 38,-38 m -38,954 v -916 m 18,0 a 20,20 0 0 1 20,-20 m 0,956 a 20,20 0 0 1 -20,-20 m 0,0 v -916 m 195.5,71.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,-56.5 a 16,16 0 0 1 16,-16 m -16,115 v -99 m 0,218 v -115 m 46,833 h 291 m -337,-361 h 353 m -353,242 h 353 m -353,-361 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -337,-119 h 321 m 0,0 a 16,16 0 0 1 16,16 m 0,99 v -99 m 0,218 v -115 m 22,813 a 38,38 0 0 1 -38,38 m 38,-38 v -916 m -38,-20 a 20,20 0 0 1 20,20 m 0,916 a 20,20 0 0 1 -20,20 m 20,-20 v -916 m -1463.476,428.5 v -15 m 30,15 v -15 m -30,15 h 30 m -30,-15 h 30 m -191.5,42.5 v -115 m 0,115 h 353 m -353,-115 h 353 m 0,115 v -115 m -161.5,-31.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,42.5 v -115 m 0,115 h 353 m -353,-115 h 353 m 0,115 v -115 m -161.5,325.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-342 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 186.5,-133.5 h -3 m 3,-42 h -3 m 9,40 h -6 m 6,-38 h -6 m 0,-2 v 42 m 0,88.5 h -3 m 3,42 h -3 m 9,-40 h -6 m 6,38 h -6 m 36,-6 a 12,12 0 0 1 -12,12 m 0,0 h -12 m 24,-12 v -386.5 m -36,394.5 v -42 m 12,46 a 6,6 0 0 1 -6,-6 m 0,0 v -392.5 m -409,264 h 3 m -3,-42 h 3 m -9,40 h 6 m -6,-38 h 6 m 0,-2 v 42 m 0,88.5 h 3 m -3,42 h 3 m -9,-40 h 6 m -6,38 h 6 m -24,6 a 12,12 0 0 1 -12,-12 m 12,12 h 12 m -24,-12 v -386.5 m 36,394.5 v -42 m -6,40 a 6,6 0 0 1 -6,6 m 6,-6 v -392.5 m 368,184 a 38,38 0 0 1 38,38 m -359,-38 h 321 m -321,18 h 321 m -337,579 v -99 m 353,99 a 16,16 0 0 1 -16,16 m 16,-16 v -99 m -375,-460 a 38,38 0 0 1 38,-38 m -38,597 v -559 m 18,0 a 20,20 0 0 1 20,-20 m -20,579 v -559 m 195.5,71.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,-56.5 a 16,16 0 0 1 16,-16 m -16,115 v -99 m 0,218 v -115 m 16,472 a 16,16 0 0 1 -16,-16 m 16,16 h 321 m -321,22 a 38,38 0 0 1 -38,-38 m 38,38 h 321 m -321,-18 a 20,20 0 0 1 -20,-20 m 20,20 h 321 m -337,-361 h 353 m -353,242 h 353 m -353,-361 h 353 m -353,4 h 353 m -337,-119 h 321 m 0,0 a 16,16 0 0 1 16,16 m 0,99 v -99 m 0,218 v -115 m 22,456 a 38,38 0 0 1 -38,38 m 38,-38 v -559 m -38,-20 a 20,20 0 0 1 20,20 m 0,559 a 20,20 0 0 1 -20,20 m 20,-20 v -559 m -813.1851,309.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,42.5 v -115 m 0,115 h 353 m -353,-115 h 353 m 0,115 v -115 m -161.5,206.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-223 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 186.5,-133.5 h -3 m 3,-42 h -3 m 9,40 h -6 m 6,-38 h -6 m 0,-2 v 42 m 0,88.5 h -3 m 3,42 h -3 m 9,-40 h -6 m 6,38 h -6 m 36,-6 a 12,12 0 0 1 -12,12 m 0,0 h -12 m 24,-12 v -386.5 m -36,394.5 v -42 m 12,46 a 6,6 0 0 1 -6,-6 m 0,0 v -392.5 m -409,264 h 3 m -3,-42 h 3 m -9,40 h 6 m -6,-38 h 6 m 0,-2 v 42 m 0,88.5 h 3 m -3,42 h 3 m -9,-40 h 6 m -6,38 h 6 m -24,6 a 12,12 0 0 1 -12,-12 m 12,12 h 12 m -24,-12 v -386.5 m 36,394.5 v -42 m -6,40 a 6,6 0 0 1 -6,6 m 6,-6 v -392.5 m 368,184 a 38,38 0 0 1 38,38 m -359,-38 h 321 m -321,18 h 321 m -337,460 v -99 m 353,99 a 16,16 0 0 1 -16,16 m 16,-16 v -99 m -375,-341 a 38,38 0 0 1 38,-38 m -38,478 v -440 m 18,0 a 20,20 0 0 1 20,-20 m -20,460 v -440 m 195.5,71.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,-56.5 a 16,16 0 0 1 16,-16 m -16,115 v -99 m 0,218 v -115 m 16,353 a 16,16 0 0 1 -16,-16 m 16,16 h 321 m -321,22 a 38,38 0 0 1 -38,-38 m 38,38 h 321 m -321,-18 a 20,20 0 0 1 -20,-20 m 20,20 h 321 m -337,-242 h 353 m -353,123 h 353 m -353,-242 h 353 m -353,4 h 353 m -337,-119 h 321 m 0,0 a 16,16 0 0 1 16,16 m 0,99 v -99 m 0,218 v -115 m 22,337 a 38,38 0 0 1 -38,38 m 38,-38 v -440 m -38,-20 a 20,20 0 0 1 20,20 m 0,440 a 20,20 0 0 1 -20,20 m 20,-20 v -440 m -803.8542,309.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 186.5,-133.5 h -3 m 3,-42 h -3 m 9,40 h -6 m 6,-38 h -6 m 0,-2 v 42 m 0,88.5 h -3 m 3,42 h -3 m 9,-40 h -6 m 6,38 h -6 m 36,-6 a 12,12 0 0 1 -12,12 m 0,0 h -12 m 24,-12 v -386.5 m -36,394.5 v -42 m 12,46 a 6,6 0 0 1 -6,-6 m 0,0 v -392.5 m -409,264 h 3 m -3,-42 h 3 m -9,40 h 6 m -6,-38 h 6 m 0,-2 v 42 m 0,88.5 h 3 m -3,42 h 3 m -9,-40 h 6 m -6,38 h 6 m -24,6 a 12,12 0 0 1 -12,-12 m 12,12 h 12 m -24,-12 v -386.5 m 36,394.5 v -42 m -6,40 a 6,6 0 0 1 -6,6 m 6,-6 v -392.5 m 368,184 a 38,38 0 0 1 38,38 m -359,-38 h 321 m -321,18 h 321 m -337,341 v -99 m 353,99 a 16,16 0 0 1 -16,16 m 16,-16 v -99 m -375,-222 a 38,38 0 0 1 38,-38 m -38,359 v -321 m 18,0 a 20,20 0 0 1 20,-20 m -20,341 v -321 m 195.5,71.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,-56.5 a 16,16 0 0 1 16,-16 m -16,115 v -99 m 0,218 v -115 m 16,234 a 16,16 0 0 1 -16,-16 m 16,16 h 321 m -321,22 a 38,38 0 0 1 -38,-38 m 38,38 h 321 m -321,-18 a 20,20 0 0 1 -20,-20 m 20,20 h 321 m -337,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -337,-119 h 321 m 0,0 a 16,16 0 0 1 16,16 m 0,99 v -99 m 0,218 v -115 m 22,218 a 38,38 0 0 1 -38,38 m 38,-38 v -321 m -38,-20 a 20,20 0 0 1 20,20 m 0,321 a 20,20 0 0 1 -20,20 m 20,-20 v -321 m 1758.8935,666.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 0,-104 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m 186.5,-133.5 h -3 m 3,-42 h -3 m 9,40 h -6 m 6,-38 h -6 m 0,-2 v 42 m 0,88.5 h -3 m 3,42 h -3 m 9,-40 h -6 m 6,38 h -6 m 36,-6 a 12,12 0 0 1 -12,12 m 0,0 h -12 m 24,-12 v -386.5 m -36,394.5 v -42 m 12,46 a 6,6 0 0 1 -6,-6 m 0,0 v -392.5 m -409,264 h 3 m -3,-42 h 3 m -9,40 h 6 m -6,-38 h 6 m 0,-2 v 42 m 0,88.5 h 3 m -3,42 h 3 m -9,-40 h 6 m -6,38 h 6 m -24,6 a 12,12 0 0 1 -12,-12 m 12,12 h 12 m -24,-12 v -386.5 m 36,394.5 v -42 m -6,40 a 6,6 0 0 1 -6,6 m 6,-6 v -392.5 m 47,938 a 38,38 0 0 1 -38,-38 m 38,38 h 321 m -321,-22 h 321 m -321,4 h 321 m -337,-20 v -99 m 16,115 a 16,16 0 0 1 -16,-16 m 353,0 a 16,16 0 0 1 -16,16 m 16,-16 v -99 m -353,-123 v -115 m 0,234 v -115 m 353,-4 v -115 m 0,234 v -115 m -16,-498 a 38,38 0 0 1 38,38 m -359,-38 h 321 m -321,18 h 321 m -337,357 v -115 m 353,115 v -115 m -375,-222 a 38,38 0 0 1 38,-38 m -38,716 v -678 m 18,0 a 20,20 0 0 1 20,-20 m 0,718 a 20,20 0 0 1 -20,-20 m 0,0 v -678 m 195.5,71.5 v -15 m -30,15 v -15 m 0,15 h 30 m -30,-15 h 30 m -191.5,-56.5 a 16,16 0 0 1 16,-16 m -16,115 v -99 m 0,218 v -115 m 46,595 h 291 m -337,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -353,-123 h 353 m -353,4 h 353 m -337,-119 h 321 m 0,0 a 16,16 0 0 1 16,16 m 0,99 v -99 m 0,218 v -115 m 22,575 a 38,38 0 0 1 -38,38 m 38,-38 v -678 m -38,-20 a 20,20 0 0 1 20,20 m 0,678 a 20,20 0 0 1 -20,20 m 20,-20 v -678 m -2731.8461,-222 h 3787.7549"

const NordlysPictogram = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
        // Measure the *exact* length of the path in its own coordinate system
        const length = pathRef.current.getTotalLength();
        setPathLen(length);
    }
  }, []);

  return (
    // Changed absolute positioning to relative flex so it doesn't overlap text
    <div className="relative flex items-center justify-center pointer-events-none z-0 opacity-40 mix-blend-screen w-full mb-8">
      <svg 
        viewBox={SVG_VIEWBOX}
        className="w-[90vw] h-auto md:w-[60vw] max-w-4xl"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="aurora-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.2" /> {/* Light Green */}
            <stop offset="25%" stopColor="#4ade80" stopOpacity="1" />   {/* Green */}
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />   {/* Teal */}
            <stop offset="75%" stopColor="#818cf8" stopOpacity="1" />   {/* Indigo */}
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" /> 
          </linearGradient>
        </defs>
        
        {/* QCAD uses scale(1, -1) because Y is flipped. We keep it to maintain orientation. */}
        <g transform="scale(1,-1)">
           <path 
             ref={pathRef}
             id="path75"
             className={pathLen > 0 ? "animate-draw-aurora" : "opacity-0"}
             fill="none"
             stroke="url(#aurora-gradient)" 
             strokeLinecap="round" 
             strokeLinejoin="round"
             
             // Pass the calculated length to CSS
             style={{ 
                 '--path-len': pathLen 
             } as React.CSSProperties}

             // vectorEffect ensures 1.5px is always 1.5px on screen
             vectorEffect="non-scaling-stroke"
             strokeWidth="1.5" 
             
             d={SVG_PATH}
           />
        </g>
      </svg>
    </div>
  );
};

// --- Cinematic Panning Component (Scroll Linked) ---
const CinematicMaterial: React.FC<{ image: string; mobileImage?: string; title: string; subtitle: string }> = ({ image, mobileImage, title, subtitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!containerRef.current || !imageRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Optimize: Don't calculate if off screen
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const distance = viewportHeight + rect.height;
        // 0 = just entered bottom, 1 = just left top
        const progress = (viewportHeight - rect.top) / distance;
        
        // Calculate Translation
        // We pan diagonally: X (-5% to +5%), Y (-3% to +3%)
        // Scale constant at 1.3 to ensure edges are covered
        const panRangeX = 10; 
        const panRangeY = 6;
        
        const x = (progress - 0.5) * panRangeX; 
        const y = (progress - 0.5) * panRangeY; 

        imageRef.current.style.transform = `scale(1.3) translate3d(${x}%, ${y}%, 0)`;
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calc
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[80vh] overflow-hidden relative bg-[#110614] border-t border-b border-white/5">
      {/* Scroll-Linked Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        {/* We use the picture tag logic here manually to preserve the Ref on the IMG */}
        <picture className="w-full h-full block">
            {mobileImage && <source media="(max-width: 768px)" srcSet={mobileImage} />}
            <img 
              ref={imageRef}
              src={image} 
              alt="Material Detail" 
              className="w-full h-full object-cover opacity-80 will-change-transform"
              style={{ transform: 'scale(1.3)' }} // Default state
            />
        </picture>
      </div>
      
      {/* Overlay Content */}
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

const LandingHero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (
  <div className="relative min-h-screen w-full bg-[#110614] text-white flex flex-col items-center justify-center overflow-hidden py-24">
    
    {/* Aurora Furniture Outline */}
    <NordlysPictogram />

    {/* Content */}
    <div className="z-10 flex flex-col items-center justify-center relative">
        <FadeIn delay={200}>
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-gray-400 font-sans">Nordlys Collection</p>
        </FadeIn>
        <FadeIn delay={400}>
        <h1 className="text-6xl md:text-9xl font-bold tracking-tight text-white font-ubuntu lowercase">
            nordlys møbler
        </h1>
        </FadeIn>
        <FadeIn delay={600}>
            <div className="mt-12">
            <Button primary onClick={onExplore}>
                Explore Collection
            </Button>
            </div>
        </FadeIn>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30 z-10">
      <ChevronDown size={32} />
    </div>
  </div>
);

// --- The Nattbord Experience (Apple Style Layered Mixed Media) ---
const NattbordExperience: React.FC<{ product: Product }> = ({ product }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modelOpacity, setModelOpacity] = useState(1);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
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
      // When top <= 0, we are inside the sticky zone.
      // We want to track the scroll for the first 150vh (Freeze Spacer)
      const freezeDistance = viewportHeight * 1.5;
      const rProgress = Math.min(Math.max(scrollPixels / freezeDistance, 0), 1);
      setRotationProgress(rProgress);

      // 2. Opacity Logic (Mobile Only)
      // Fade out the model as the "Smoked Oak" text block scrolls over it
      if (window.innerWidth < 768) {
        // Start fade roughly when text block starts moving up over the model (1.5vh)
        // End fade well before the next solid image block arrives (2.05vh) for aggressive fade
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#110614] text-white w-full relative">
      {/* 1. Title Screen */}
      <div className="h-screen w-full flex flex-col items-center justify-center relative px-6 z-10 bg-[#110614]">
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

      {/* 2. Layered Scrollytelling Section */}
      {/* This container must act as the track for sticky elements */}
      <div ref={containerRef} className="relative w-full">
        
        {/* STICKY MODEL LAYER */}
        <div 
            className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none z-0 transition-opacity duration-100 ease-linear"
            style={{ opacity: modelOpacity }}
        >
           <div className="absolute inset-0 w-full h-full">
              <Canvas camera={{ position: [0, 0, isMobile ? 9 : 6], fov: 45 }}>
                 <ambientLight intensity={0.5} />
                 <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                 <pointLight position={[-10, -10, -10]} intensity={0.5} />
                 <Environment preset="city" />
                 <PlaceholderModel rotationProgress={rotationProgress} isMobile={isMobile} />
              </Canvas>
           </div>
        </div>

        {/* CONTENT LAYER */}
        {/* Negative margin pulls this whole stack UP so it overlaps the sticky model container */}
        <div className="relative z-10 -mt-[100vh]">
             
             {/* THE FREEZE SPACER: 150vh of nothingness to allow for rotation */}
             <div className="h-[150vh] w-full pointer-events-none"></div>

             {/* Block 1: Text (Transparent Background to see model) */}
            <div className="min-h-screen flex flex-col justify-end md:justify-center px-6 md:px-24 pb-24 md:pb-0">
                 <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Smoked Oak.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light mb-8">
                        Sourced from sustainable forests in Northern Europe. The wood is smoked to achieve a deep, rich color that permeates the grain, not just a surface stain. A texture you can feel.
                    </p>
                    {/* Added "Tilpass din" Button */}
                    <div className="md:hidden w-full">
                        <Button primary href={product.shopifyLink} className="w-full">
                            Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="hidden md:block">
                        <Button primary href={product.shopifyLink}>
                            Tilpass din <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                 </div>
            </div>

            {/* Block 2: Full Width Image (Opaque, covers model) */}
            <div className="w-full h-screen bg-[#110614] flex items-center justify-center relative overflow-hidden">
               <ResponsiveImage 
                 desktopSrc={product.heroImage} 
                 mobileSrc={product.heroImageMobile}
                 alt="Hero" 
                 className="w-full h-full object-cover opacity-90"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#110614] via-transparent to-[#110614]/50"></div>
               <div className="absolute bottom-20 left-12 md:left-24 max-w-lg">
                  <h3 className="text-3xl font-light italic font-ubuntu">"A silhouette that defines the room."</h3>
               </div>
            </div>

            {/* Block 3: Text (Opaque BG to keep model covered) */}
            <div className="min-h-screen bg-[#110614] flex flex-col justify-end md:justify-center px-6 md:px-24 pb-24 md:pb-0">
                 <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Silent Motion.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Precision-engineered soft-close hinges ensure your peace is never disturbed. The drawer glides effortlessly, respecting the silence of your sanctuary.
                    </p>
                 </div>
            </div>

            {/* Block 4: Cinematic Material Detail (Scroll Linked) */}
            <CinematicMaterial 
                image="public/images/close_up.jpg"
                mobileImage="public/images/close_up.jpg" // Example mobile crop
                title="Tangible Texture." 
                subtitle="The Details" 
            />

            {/* Block 5: Text (Opaque BG to keep model covered) */}
             <div className="min-h-screen bg-[#110614] flex flex-col justify-end md:justify-center px-6 md:px-24 pb-24 md:pb-0">
                 <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none p-8 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Integrated Power.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Hidden cable management and optional wireless charging integration keep your devices ready for the morning without cluttering your night.
                    </p>
                 </div>
            </div>

            {/* Block 5.5: Restored Detail Image 1 */}
            <div className="w-full h-screen bg-[#110614] flex items-center justify-center relative overflow-hidden">
               <ResponsiveImage 
                 desktopSrc={product.detailImage1} 
                 mobileSrc={product.detailImage1Mobile}
                 alt="Detail View" 
                 className="w-full h-full object-cover"
               />
            </div>

            {/* Block 6: Detail Image + Quote */}
            <div className="w-full min-h-screen bg-[#110614] flex flex-col justify-center">
                <div className="px-6 md:px-12 mb-12 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl font-light italic text-gray-200 font-ubuntu">"We removed everything unnecessary, until only the essential remained."</h3>
                </div>
               <div className="w-full h-[70vh] relative overflow-hidden">
                  <ResponsiveImage 
                    desktopSrc={product.detailImage2} 
                    mobileSrc={product.detailImage2Mobile}
                    alt="Lifestyle" 
                    className="w-full h-full object-cover"
                  />
               </div>
            </div>

        </div>
      </div>

      {/* 4. Specs / Detail Grid */}
      <div className="py-32 px-6 max-w-7xl mx-auto bg-[#110614] relative z-20">
        <h3 className="text-4xl font-ubuntu mb-16 text-center">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a0c1e] p-10 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-4">Dimensions</h4>
                <p className="text-3xl font-light">45 x 45 x 60 cm</p>
                <p className="text-sm text-gray-500 mt-2">Width x Depth x Height</p>
            </div>
            <div className="bg-[#1a0c1e] p-10 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-4">Material</h4>
                <p className="text-3xl font-light">Solid Oak</p>
                <p className="text-sm text-gray-500 mt-2">FSC Certified</p>
            </div>
            <div className="bg-[#1a0c1e] p-10 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-gray-400 uppercase tracking-widest text-xs mb-4">Weight</h4>
                <p className="text-3xl font-light">12 kg</p>
                <p className="text-sm text-gray-500 mt-2">Solid construction</p>
            </div>
        </div>
      </div>
      
      {/* 5. Final CTA */}
      <div className="pb-32 text-center bg-[#110614] relative z-20">
         <Button primary href={product.shopifyLink}>Configure Yours</Button>
      </div>
    </div>
  );
};

const DefaultProductShowcase: React.FC<{ product: Product }> = ({ product }) => {
  // Reset scroll when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  const isAboutPage = product.id === 'om-oss';

  return (
    <div className="min-h-screen bg-[#110614] text-white w-full">
      {/* 1. Solid Cover Screen */}
      <div className="h-screen w-full bg-[#110614] flex flex-col items-center justify-center relative px-6">
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

      {/* 2. Hero Image & Key Details */}
      <div className="min-h-screen w-full relative flex flex-col md:flex-row">
         <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
            <ResponsiveImage 
                desktopSrc={product.heroImage} 
                mobileSrc={product.heroImageMobile}
                alt={product.name} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
         </div>

         <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 bg-[#110614]">
             <FadeIn>
                {!isAboutPage && (
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-amber-500 mb-4 block">Product Overview</span>
                )}
                <h2 className="text-3xl md:text-4xl font-light mb-6 font-ubuntu">{product.type}</h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 font-light">
                  {product.tagline}
                </p>
                
                <div className="flex flex-col gap-6">
                    {product.price && <p className="text-2xl font-medium">{product.price}</p>}
                    
                    <div className="flex gap-4">
                        <Button primary href={product.shopifyLink}>
                        {isAboutPage ? 'Contact Us' : 'Customize & Buy'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
             </FadeIn>
         </div>
      </div>

      {/* 3. Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-[#16081a] p-12 md:p-24 flex flex-col justify-center">
          <FadeIn>
            <span className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-4 block">
              {isAboutPage ? 'Our Philosophy' : 'The Story'}
            </span>
            <h3 className="text-2xl md:text-3xl font-light mb-8 leading-relaxed font-ubuntu">
              {product.description}
            </h3>
            <ul className="space-y-4">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-400 border-b border-white/10 pb-4">
                  <ChevronRight className="h-4 w-4 mr-4 text-white" />
                  {feature}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
        <div className="h-[60vh] md:h-auto overflow-hidden">
          <ResponsiveImage 
            desktopSrc={product.detailImage1} 
            mobileSrc={product.detailImage1Mobile}
            alt="Detail" 
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* 4. Full Width Visual */}
      <div className="relative h-[80vh] w-full overflow-hidden">
         <ResponsiveImage 
            desktopSrc={product.detailImage2} 
            mobileSrc={product.detailImage2Mobile}
            alt="Lifestyle" 
            className="h-full w-full object-cover fixed-attachment"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-[#110614]/40">
             <div className="text-center p-8 backdrop-blur-md bg-[#110614]/30 rounded-xl border border-white/10 max-w-lg">
                <h4 className="text-2xl font-light mb-2 font-ubuntu">Designed in Oslo</h4>
                <p className="text-gray-300">Experience the essence of Scandinavian minimalism.</p>
             </div>
          </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white text-black py-32 px-6 text-center">
        <h3 className="text-4xl md:text-6xl font-light mb-8 font-ubuntu">
          {isAboutPage ? 'Visit our showroom.' : 'Make it yours.'}
        </h3>
        {product.price && <p className="text-gray-600 mb-10 text-xl">Starting at {product.price}</p>}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {!isAboutPage && (
            <Button className="bg-black text-white hover:bg-gray-800" href={product.shopifyLink}>
              Configure Your {product.name}
            </Button>
          )}
          <Button className="bg-transparent text-black border border-black hover:bg-gray-100">
             Contact Showroom
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null); // null = Landing Page
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for nav bar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToProduct = (product: Product) => {
    setActiveProduct(product);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    setActiveProduct(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#110614] min-h-screen w-full font-sans selection:bg-white selection:text-black">
      {/* Inline Styles & Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

        /* Custom Font Utility */
        .font-ubuntu {
            font-family: 'Ubuntu', sans-serif;
        }

        /* Prevent overflow on the body to allow sticky positioning to work correctly */
        body {
            overflow-x: hidden;
        }

        /* Responsive Large Menu Text - BYPASSING TAILWIND */
        .menu-text-responsive {
            font-size: 5.4vh; /* Reduced by ~10% */
            line-height: 1.1;
            font-weight: 700;
            letter-spacing: -0.05em;
        }
        @media (min-width: 768px) {
            .menu-text-responsive {
                font-size: 8vh; /* Reduced by ~10% */
            }
        }

        /* Cinematic Slow Pan Animation */
        @keyframes slow-pan {
            0% {
                transform: scale(1.25) translate(0%, 0%);
            }
            50% {
                transform: scale(1.35) translate(-2%, -2%);
            }
            100% {
                transform: scale(1.25) translate(0%, 0%);
            }
        }
        .animate-slow-pan {
            animation: slow-pan 30s ease-in-out infinite alternate;
        }

        /* Aurora Animation */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Draw and Fill Aurora Path Animation - NOW USING CSS VARIABLES */
        @keyframes draw-and-fill {
          0% { 
            stroke-dashoffset: var(--path-len); 
            fill-opacity: 0; 
          }
          60% { 
            stroke-dashoffset: 0; 
            fill-opacity: 0; 
          }
          100% { 
            stroke-dashoffset: 0; 
            /* REMOVED FILL OPACITY: Keeping fill 0 ensures no polygon stacking */
            fill-opacity: 0; 
          }
        }
        
        .animate-draw-aurora {
          /* Using the variable calculated via JS ensure this works on ANY SVG size */
          stroke-dasharray: var(--path-len);
          stroke-dashoffset: var(--path-len);
          
          fill: none; /* FORCE NO FILL */
          fill-opacity: 0; /* Start transparent */
          
          animation: draw-and-fill 4s ease-out forwards;
          animation-delay: 0.5s; 
        }

        /* Reset Vite Default Layout Constraints */
        :root {
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          text-align: left !important;
        }
        body {
          display: block !important;
          place-items: unset !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        #root {
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          text-align: left !important;
        }

        /* Scrollbar Utility */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Force Logo Size Override */
        .nav-logo {
            font-size: 2.25rem !important; /* ~text-4xl */
        }

        /* Aggressive Reset for Navigation & Overlay Buttons to Remove "Vite Blue Glow" */
        nav button,
        .menu-overlay button {
          background-color: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0.5rem 0 !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
        nav button:focus,
        nav button:focus-visible,
        nav button:active,
        nav button:hover,
        .menu-overlay button:focus,
        .menu-overlay button:focus-visible,
        .menu-overlay button:active,
        .menu-overlay button:hover {
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
          border-color: transparent !important;
        }

        /* Added nav a reset here as requested */
        nav a {
            color: white !important;
            text-decoration: none !important;
        }
        nav a:hover {
            color: #d1d5db !important; /* gray-300 */
        }
      `}</style>
      
      {/* Navigation Bar - Always Visible */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isMenuOpen ? 'bg-[#110614]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="relative w-full h-20 flex items-center justify-between px-6">
          
          {/* Hamburger Menu (Left) */}
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="text-white p-2 z-50 hover:text-gray-300 transition-colors"
            aria-label="Open Menu"
          >
            <Menu size={32} />
          </button>

          {/* Logo (Absolute Center) */}
          <button 
            onClick={navigateHome} 
            className="absolute left-1/2 transform -translate-x-1/2 nav-logo text-4xl font-bold tracking-tighter text-white appearance-none bg-transparent border-none p-0 cursor-pointer font-ubuntu lowercase z-50 whitespace-nowrap"
          >
            nordlys møbler
          </button>

          {/* Shop Icon (Right) - Fades in on scroll */}
          <div className="flex items-center justify-end z-50">
             <a 
                href={activeProduct?.shopifyLink || "#"}
                className={`text-white p-2 hover:text-gray-300 transition-all duration-500 ease-out transform ${
                    scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
                aria-label="Shop"
             >
                <ShoppingBag size={28} />
             </a>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div className={`menu-overlay fixed inset-0 z-50 bg-[#110614] transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Close Button */}
        <button 
            onClick={() => setIsMenuOpen(false)} 
            className="absolute top-6 left-6 text-white p-2 hover:text-gray-300 transition-colors z-50"
        >
            <X size={32} />
        </button>

        <div className="h-full w-full flex flex-col justify-evenly items-start py-12 pl-6 md:pl-12 pr-4">
            <button 
                onClick={navigateHome} 
                className={`menu-text-responsive flex items-center justify-start text-left font-ubuntu uppercase bg-transparent border-none cursor-pointer transition-all duration-300 ${
                    !activeProduct ? 'text-white underline decoration-2 underline-offset-8' : 'text-gray-400 hover:text-white hover:scale-105 origin-left'
                }`}
            >
                Home
            </button>
            
            {COLLECTION.map(item => (
                <button 
                    key={item.id}
                    onClick={() => navigateToProduct(item)}
                    className={`menu-text-responsive flex items-center justify-start text-left font-ubuntu lowercase bg-transparent border-none cursor-pointer transition-all duration-300 ${
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
          activeProduct.id === 'nattbord' ? (
             <NattbordExperience product={activeProduct} />
          ) : (
             <DefaultProductShowcase product={activeProduct} />
          )
        ) : (
          <LandingHero onExplore={() => navigateToProduct(COLLECTION[0])} />
        )}
      </main>

      {/* Simple Footer */}
      {!activeProduct && (
        <footer className="bg-[#110614] text-gray-500 py-12 px-6 border-t border-white/10 w-full">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
            <p>&copy; 2024 Nordlys Showroom.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Pinterest</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}