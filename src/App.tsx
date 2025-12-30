import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
// NOTE: Uncomment 'useGLTF' below when you are ready to load your custom 3D model
import { Environment, Float, ContactShadows, useGLTF } from '@react-three/drei'; 
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
  detailImage1: string;
  detailImage2: string;
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
    // Note: In Vite, files in 'public/images/' are accessed as '/images/'
    heroImage: '/images/nattbord_natur.jpg',
    detailImage1: '/images/nattbord_produksjon.jpg',
    detailImage2: '/images/vintereik.jpg',
    features: ['Smoked Oak', 'Soft-Close', 'Integrated Charging'],
    shopifyLink: '#shopify-nattbord'
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

// REPLACE 3D MODEL HERE:
const PlaceholderModel: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // --- UNCOMMENT THIS SECTION TO USE YOUR MODEL ---
   const { scene } = useGLTF('/models/nattbord.glb'); 
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Scroll Interaction: 
      // Rotate 45 degrees total (from -22.5 to +22.5 degrees) based on scroll progress
      const targetRotationY = -Math.PI / 8 + (scrollProgress * (Math.PI / 4));
      
      // Optional: Slight tilt (15 degrees) on X axis to show top surface as you scroll
      const targetRotationX = scrollProgress * (Math.PI / 12);

      // Smooth dampening to reach target
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, delta * 4);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotationY, delta * 4);
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        
        {/* --- UNCOMMENT THIS TO SHOW YOUR MODEL --- */}
        { <primitive object={scene} scale={2} /> }

        

      </Float>
      <ContactShadows opacity={0.4} scale={10} blur={2.5} far={4} />
    </group>
  );
};

// --- Standard UI Components ---

const Button: React.FC<ButtonProps> = ({ children, primary, onClick, href, className = '' }) => {
  const baseClass = "inline-flex items-center justify-center px-8 py-4 text-sm font-medium transition-all duration-300 rounded-full tracking-wide cursor-pointer whitespace-nowrap";
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

// --- Page Sections ---

const LandingHero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (
  <div className="relative h-screen w-full bg-[#110614] text-white flex flex-col items-center justify-center">
    <FadeIn delay={200}>
      <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-gray-400 font-sans">Nordlys Collection</p>
    </FadeIn>
    <FadeIn delay={400}>
      <h1 className="text-6xl md:text-9xl font-bold tracking-tight text-white font-ubuntu">
        nordlys
      </h1>
    </FadeIn>
    <FadeIn delay={600}>
        <div className="mt-12">
          <Button primary onClick={onExplore}>
            Explore Collection
          </Button>
        </div>
    </FadeIn>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
      <ChevronDown size={32} />
    </div>
  </div>
);

// --- The Nattbord Experience (Apple Style Layered Mixed Media) ---
const NattbordExperience: React.FC<{ product: Product }> = ({ product }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-top / (height - window.innerHeight), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#110614] text-white w-full">
      {/* 1. Title Screen */}
      <div className="h-screen w-full flex flex-col items-center justify-center relative px-6 z-10">
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
      <div ref={containerRef} className="relative grid grid-cols-1">
        
        {/* Layer A: Sticky 3D Model (Pinned to right) */}
        <div className="col-start-1 row-start-1 h-screen sticky top-0 pointer-events-none z-0">
           <div className="absolute right-0 w-full md:w-1/2 h-full">
              <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                 <color attach="background" args={['#110614']} />
                 <ambientLight intensity={0.5} />
                 <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                 <pointLight position={[-10, -10, -10]} intensity={0.5} />
                 <Environment preset="city" />
                 <PlaceholderModel scrollProgress={scrollProgress} />
              </Canvas>
           </div>
        </div>

        {/* Layer B: Content Blocks (Scrolls over Layer A) */}
        <div className="col-start-1 row-start-1 z-10 relative">
             
             {/* Block 1: Text */}
            <div className="min-h-screen flex items-center px-12 md:px-24">
                 <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Smoked Oak.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Sourced from sustainable forests in Northern Europe. The wood is smoked to achieve a deep, rich color that permeates the grain, not just a surface stain. A texture you can feel.
                    </p>
                 </div>
            </div>

            {/* Block 2: Full Width Image (Opaque, covers model) */}
            <div className="w-full h-screen bg-[#110614] flex items-center justify-center relative overflow-hidden">
               <img 
                 src={product.heroImage} 
                 alt="Hero" 
                 className="w-full h-full object-cover opacity-90"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#110614] via-transparent to-[#110614]/50"></div>
               <div className="absolute bottom-20 left-12 md:left-24 max-w-lg">
                  <h3 className="text-3xl font-light italic font-ubuntu">"A silhouette that defines the room."</h3>
               </div>
            </div>

            {/* Block 3: Text */}
            <div className="min-h-screen flex items-center px-12 md:px-24">
                 <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Silent Motion.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Precision-engineered soft-close hinges ensure your peace is never disturbed. The drawer glides effortlessly, respecting the silence of your sanctuary.
                    </p>
                 </div>
            </div>

            {/* Block 4: Full Width Image */}
            <div className="w-full h-screen bg-[#110614] flex items-center justify-center relative overflow-hidden">
               <img 
                 src={product.detailImage1} 
                 alt="Detail" 
                 className="w-full h-full object-cover"
               />
            </div>

            {/* Block 5: Text */}
             <div className="min-h-screen flex items-center px-12 md:px-24">
                 <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold mb-6 font-ubuntu">Integrated Power.</h2>
                    <p className="text-xl text-gray-300 leading-relaxed font-light">
                        Hidden cable management and optional wireless charging integration keep your devices ready for the morning without cluttering your night.
                    </p>
                 </div>
            </div>

            {/* Block 6: Detail Image + Quote */}
            <div className="w-full min-h-screen bg-[#110614] flex flex-col justify-center">
                <div className="px-6 md:px-12 mb-12 text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl font-light italic text-gray-200 font-ubuntu">"We removed everything unnecessary, until only the essential remained."</h3>
                </div>
               <div className="w-full h-[70vh] relative overflow-hidden">
                  <img 
                    src={product.detailImage2} 
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
}

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
            <img 
                src={product.heroImage} 
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
          <img 
            src={product.detailImage1} 
            alt="Detail" 
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      {/* 4. Full Width Visual */}
      <div className="relative h-[80vh] w-full overflow-hidden">
         <img 
            src={product.detailImage2} 
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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for nav bar transparency
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToProduct = (product: Product) => {
    setActiveProduct(product);
    window.scrollTo(0, 0);
  };

  const navigateHome = () => {
    setActiveProduct(null);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#110614] min-h-screen w-full font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Inline Styles & Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

        /* Custom Font Utility */
        .font-ubuntu {
            font-family: 'Ubuntu', sans-serif;
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

        /* Aggressive Reset for Navigation Buttons to Remove "Vite Blue Glow" */
        nav button {
          background-color: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 0.5rem 0 !important; /* Adjust padding to look like text */
          margin: 0 !important;
          border-radius: 0 !important;
        }
        nav button:focus,
        nav button:focus-visible,
        nav button:active,
        nav button:hover {
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
          border-color: transparent !important;
        }
      `}</style>
      
      {/* Navigation Bar - Always Visible */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#110614]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto h-20 flex items-center justify-between px-6 w-full">
          {/* Logo */}
          <button onClick={navigateHome} className="nav-logo text-4xl font-bold tracking-tighter text-white mr-8 shrink-0 appearance-none bg-transparent border-none p-0 cursor-pointer font-ubuntu lowercase">
            nordlys
          </button>

          {/* Nav Items - Scrollable on mobile, Centered/Flex on desktop */}
          <div className="flex-1 flex items-center justify-start md:justify-center overflow-x-auto gap-8 no-scrollbar mask-gradient md:mask-none px-2 w-full">
            {COLLECTION.map(item => (
              <button 
                key={item.id}
                onClick={() => navigateToProduct(item)}
                className={`text-sm tracking-wide font-light transition-all duration-300 whitespace-nowrap relative group py-2 bg-transparent border-none appearance-none outline-none cursor-pointer font-ubuntu lowercase ${
                  activeProduct?.id === item.id ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {item.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left transition-transform duration-300 ${activeProduct?.id === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </button>
            ))}
          </div>
        </div>
      </nav>

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