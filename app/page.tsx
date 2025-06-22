// app/page.tsx

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react'; 
import {
  Header,
  HeroSection,
  AboutSection,
  ServicesSection,
  PortfolioSection, 
  PricingSection,
  BlogSection,
  ContactSection,
  Footer
} from './components';

// Mengembalikan definisi tipe Section seperti semula
type Section = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact' | 'ai-suite'; 

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null); 
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sectionRefs = useMemo(() => ({
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    portfolio: portfolioRef, 
    pricing: pricingRef,
    blog: blogRef,
    contact: contactRef,
  }), []);

  const handleNavClick = (section: Section) => {
    if (section === 'ai-suite') {
      window.location.href = '/ai-suite';
    } else {
      // Pastikan section yang di-scroll ada di dalam sectionRefs
      if (section in sectionRefs) {
          const key = section as keyof typeof sectionRefs;
          sectionRefs[key].current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setCurrentSection(section);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7, 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as Section;
          setCurrentSection(sectionId);
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]);

  return (
    <>
      <Header currentSection={currentSection} onNavClick={handleNavClick} />
      <main>
        <HeroSection onNavClick={handleNavClick} sectionRef={sectionRefs.home} />
        <AboutSection sectionRef={sectionRefs.about} />
        <ServicesSection sectionRef={sectionRefs.services} />
        <PortfolioSection sectionRef={sectionRefs.portfolio} /> 
        <PricingSection sectionRef={sectionRefs.pricing} />
        <BlogSection sectionRef={sectionRefs.blog} />
        <ContactSection sectionRef={sectionRefs.contact} />
      </main>
      <Footer />
    </>
  );
}