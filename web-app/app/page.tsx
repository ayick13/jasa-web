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

type Section = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact' | 'ai-suite'; 

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  // PERBAIKAN: Panggil useRef di tingkat teratas komponen
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null); 
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Gunakan useMemo untuk objek sectionRefs, mereferensikan ref yang sudah dibuat di atas
  const sectionRefs = useMemo(() => ({
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    portfolio: portfolioRef, 
    pricing: pricingRef,
    blog: blogRef,
    contact: contactRef,
  }), []); // Dependency array kosong karena refs ini stabil

  const handleNavClick = (section: Section) => {
    // Navigasi ke AI Suite adalah halaman terpisah, bukan scroll ke section
    if (section === 'ai-suite') {
      window.location.href = '/ai-suite'; 
    } else {
      sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
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

    // Observe all sections
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Disconnect observer on cleanup
    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
      observer.disconnect();
    };
  }, [sectionRefs]); // sectionRefs sekarang aman di sini karena dimemoized

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