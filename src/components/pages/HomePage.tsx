// HPI 1.6-V
import React, { useState, useEffect, useRef } from 'react';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import {
  Shield,
  Brain,
  Lock,
  TrendingUp,
  CheckCircle,
  Zap,
  Award,
  Users,
  BarChart3,
  FileCheck,
  ArrowRight,
  ChevronRight,
  Globe,
  Search
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Utility Components for "Living Experience" ---

// Mandatory Intersection Observer Component for Scroll Reveals
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-up' | 'fade-in' | 'slide-in-right' | 'scale-up';
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ 
  children, 
  className, 
  delay = 0,
  animation = 'fade-up' 
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Add a small delay via style if needed, or just let CSS handle it
        setTimeout(() => {
            element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.15 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  const getAnimationClass = () => {
    switch(animation) {
        case 'fade-in': return 'opacity-0 transition-opacity duration-1000 ease-out';
        case 'slide-in-right': return 'opacity-0 translate-x-10 transition-all duration-700 ease-out';
        case 'scale-up': return 'opacity-0 scale-95 transition-all duration-700 ease-out';
        case 'fade-up': default: return 'opacity-0 translate-y-8 transition-all duration-700 ease-out';
    }
  };

  return (
    <div ref={ref} className={`${className || ''} ${getAnimationClass()} group-visible`}>
      <style>{`
        .is-visible { opacity: 1 !important; transform: none !important; }
      `}</style>
      {children}
    </div>
  );
};

// Sticky Section Component
const StickySection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="relative w-full max-w-[120rem] mx-auto px-6 lg:px-12 py-24 lg:py-32 grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 relative">
                <div className="sticky top-32 pb-12">
                    <AnimatedElement animation="fade-in">
                        <div className="w-12 h-1 bg-primary mb-6"></div>
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold text-secondary leading-tight mb-6">
                            {title}
                        </h2>
                        <p className="font-paragraph text-lg text-secondary/70 max-w-xs">
                            Explore the core technologies that power the CertiVault ecosystem.
                        </p>
                    </AnimatedElement>
                </div>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-16 lg:gap-24">
                {children}
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function HomePage() {
  const { isAuthenticated, actions } = useMember();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Canonical Data Sources
  const features = [
    {
      id: 'ai-analysis',
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our proprietary OCR engine extracts data with 99.8% accuracy, identifying issuing bodies, dates, and credential types automatically.',
      image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-ai-analysis'
    },
    {
      id: 'encrypted-vault',
      icon: Lock,
      title: 'Military-Grade Vault',
      description: 'Your documents are encrypted with AES-256 before they even touch our servers. Only you hold the keys to your professional history.',
      image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-encryption'
    },
    {
      id: 'fraud-detection',
      icon: Shield,
      title: 'Smart Fraud Detection',
      description: 'Real-time verification algorithms cross-reference global databases to flag anomalies and ensure absolute authenticity.',
      image: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=feature-fraud'
    }
  ];

  const steps = [
    { step: '01', title: 'Upload', desc: 'Drag & drop PDF or Image credentials.', icon: Award },
    { step: '02', title: 'Analyze', desc: 'AI extracts skills & verifies data.', icon: Zap },
    { step: '03', title: 'Verify', desc: 'Generate secure public links.', icon: FileCheck },
  ];

  const benefits = [
    'End-to-end encryption',
    'AI-powered fraud detection',
    'Automated skill extraction',
    'Career path recommendations',
    'Instant verification links',
    'Comprehensive analytics',
  ];

  return (
    <div className="min-h-screen bg-background overflow-clip selection:bg-primary selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <Header />

      {/* HERO SECTION - Split Layout based on Inspiration Image */}
      <section className="relative w-full max-w-[120rem] mx-auto min-h-[90vh] flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Content - Typography Heavy */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-20 lg:py-0 z-10 bg-background">
          <AnimatedElement animation="fade-up" delay={100}>
            <span className="inline-block py-1 px-3 border border-secondary/20 rounded-full text-xs font-bold tracking-widest uppercase mb-8 text-secondary/60">
              v2.0 Now Live
            </span>
          </AnimatedElement>
          
          <AnimatedElement animation="fade-up" delay={200}>
            <h1 className="font-heading text-[12vw] lg:text-[7rem] leading-[0.9] font-bold text-secondary tracking-tight mb-8">
              Certi<br/>Vault<span className="text-primary">.</span>AI
            </h1>
          </AnimatedElement>

          <AnimatedElement animation="fade-up" delay={300}>
            <p className="font-paragraph text-lg lg:text-xl text-secondary/70 max-w-md mb-10 leading-relaxed border-l-2 border-primary/30 pl-6">
              Amplify your professional resonance with data-driven credential management and AI verification.
            </p>
          </AnimatedElement>

          <AnimatedElement animation="fade-up" delay={400}>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="h-14 px-8 bg-primary text-white rounded-none hover:bg-primary/90 transition-all text-base font-medium tracking-wide">
                    OPEN DASHBOARD
                  </Button>
                </Link>
              ) : (
                <Button 
                  onClick={actions.login}
                  className="h-14 px-8 bg-secondary text-white rounded-none hover:bg-secondary/80 transition-all text-base font-medium tracking-wide"
                >
                  START SECURING
                </Button>
              )}
              <Link to="/verify">
                <Button variant="outline" className="h-14 px-8 border-secondary/20 rounded-none hover:bg-secondary/5 text-base font-medium tracking-wide">
                  VERIFY A CERT
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        </div>

        {/* Right Image - Full Bleed Portrait */}
        <div className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-auto bg-secondary/5">
          <div className="absolute inset-0 w-full h-full">
             <Image
                src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=hero-professional-v2"
                alt="Professional managing certificates"
                width={1200}
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay Gradient for Text Readability on Mobile if needed, or style */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent lg:hidden"></div>
          </div>
          
          {/* Floating Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-md p-6 max-w-xs shadow-2xl border-l-4 border-primary hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm tracking-wider uppercase">Verified Status</span>
            </div>
            <p className="text-sm text-secondary/80">
                "CertiVault has transformed how I present my credentials to top-tier recruiters."
            </p>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE TICKER - Dynamic Motion */}
      <div className="w-full bg-secondary py-4 overflow-hidden flex items-center relative z-20">
        <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
            {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                    <span className="text-secondary-foreground/40 font-heading text-sm tracking-[0.2em] uppercase flex items-center gap-4">
                        <Lock className="w-4 h-4" /> ISO 27001 Compliant
                    </span>
                    <span className="text-secondary-foreground/40 font-heading text-sm tracking-[0.2em] uppercase flex items-center gap-4">
                        <Brain className="w-4 h-4" /> AI-Powered Analysis
                    </span>
                    <span className="text-secondary-foreground/40 font-heading text-sm tracking-[0.2em] uppercase flex items-center gap-4">
                        <Globe className="w-4 h-4" /> Global Verification
                    </span>
                    <span className="text-secondary-foreground/40 font-heading text-sm tracking-[0.2em] uppercase flex items-center gap-4">
                        <Zap className="w-4 h-4" /> Instant Processing
                    </span>
                </React.Fragment>
            ))}
        </div>
        <style>{`
            .animate-marquee { animation: marquee 30s linear infinite; }
            @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}</style>
      </div>

      {/* STICKY FEATURES SECTION - The "Living" Core */}
      <section className="bg-background relative z-10">
        <StickySection title="Intelligent Defense">
            {features.map((feature, index) => (
                <AnimatedElement key={feature.id} animation="fade-up" className="group">
                    <div className="grid md:grid-cols-2 gap-8 items-center p-8 border border-secondary/10 hover:border-primary/30 transition-all duration-500 bg-white hover:shadow-xl hover:shadow-primary/5">
                        <div className="order-2 md:order-1">
                            <div className="w-14 h-14 bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-secondary mb-4">
                                {feature.title}
                            </h3>
                            <p className="font-paragraph text-secondary/70 leading-relaxed mb-6">
                                {feature.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider cursor-pointer group/link">
                                Learn More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        <div className="order-1 md:order-2 overflow-hidden h-[300px] relative">
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                width={600}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </div>
                </AnimatedElement>
            ))}
        </StickySection>
      </section>

      {/* HORIZONTAL SCROLL / STEPS SECTION */}
      <section className="w-full bg-backgrounddark text-white py-32 overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            <AnimatedElement animation="fade-up">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
                    <h2 className="font-heading text-4xl lg:text-6xl font-bold max-w-2xl">
                        Workflow <span className="text-primary">Simplified</span>
                    </h2>
                    <p className="text-white/50 mt-4 md:mt-0 max-w-md text-right">
                        From raw file to verified asset in three automated steps.
                    </p>
                </div>
            </AnimatedElement>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {steps.map((item, i) => (
                    <AnimatedElement key={i} delay={i * 150} animation="fade-up">
                        <div className="relative p-8 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 h-full group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 font-heading text-6xl font-bold group-hover:opacity-40 transition-opacity">
                                {item.step}
                            </div>
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                                <item.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="font-paragraph text-white/60 leading-relaxed">
                                {item.desc}
                            </p>
                            <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    </AnimatedElement>
                ))}
            </div>
        </div>
      </section>

      {/* PARALLAX / IMMERSIVE SECTION */}
      <section className="w-full py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 -skew-x-12 translate-x-1/4 z-0"></div>
        
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <AnimatedElement animation="slide-in-right">
                    <div className="relative">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                        <Image
                            src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=career-growth-chart"
                            alt="Career Analytics Dashboard"
                            width={800}
                            className="w-full h-auto shadow-2xl shadow-secondary/20 relative z-10"
                        />
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-primary/20 z-0 hidden lg:block"></div>
                    </div>
                </AnimatedElement>

                <div>
                    <AnimatedElement animation="fade-up">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            <span className="font-bold text-sm tracking-widest uppercase text-primary">Career Intelligence</span>
                        </div>
                        <h2 className="font-heading text-4xl lg:text-5xl font-bold text-secondary mb-8 leading-tight">
                            Data That Drives <br/> Your Promotion
                        </h2>
                        <p className="font-paragraph text-lg text-secondary/70 mb-10 leading-relaxed">
                            Don't just store certificates. Leverage them. Our AI analyzes your verified skills against current market trends to recommend your next best career move.
                        </p>
                    </AnimatedElement>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <AnimatedElement key={index} delay={index * 50} animation="fade-up">
                                <div className="flex items-center gap-3 group cursor-default">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                                        <CheckCircle className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-secondary/80 font-medium text-sm group-hover:text-primary transition-colors">
                                        {benefit}
                                    </span>
                                </div>
                            </AnimatedElement>
                        ))}
                    </div>

                    <AnimatedElement animation="fade-up" delay={400}>
                        <div className="mt-12">
                            <Link to="/dashboard">
                                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5 pl-0 text-lg font-semibold group">
                                    View Analytics Demo <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </AnimatedElement>
                </div>
            </div>
        </div>
      </section>

      {/* CTA SECTION - Bold & Centered */}
      <section className="w-full bg-primary py-32 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-black/10 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <AnimatedElement animation="scale-up">
                <h2 className="font-heading text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                    Secure Your Future.
                </h2>
                <p className="font-paragraph text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join the network of professionals who trust CertiVault AI for credential management and verification.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    {isAuthenticated ? (
                        <Link to="/vault">
                            <Button className="h-16 px-10 bg-white text-primary hover:bg-white/90 text-lg font-bold rounded-none min-w-[200px]">
                                ACCESS VAULT
                            </Button>
                        </Link>
                    ) : (
                        <Button 
                            onClick={actions.login}
                            className="h-16 px-10 bg-secondary text-white hover:bg-secondary/90 text-lg font-bold rounded-none min-w-[200px]"
                        >
                            GET STARTED
                        </Button>
                    )}
                    <Link to="/verify">
                        <Button variant="outline" className="h-16 px-10 border-white/30 text-white hover:bg-white/10 text-lg font-bold rounded-none min-w-[200px]">
                            PUBLIC VERIFY
                        </Button>
                    </Link>
                </div>
            </AnimatedElement>
        </div>
      </section>

      <Footer />
    </div>
  );
}