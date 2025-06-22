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

// Tipe didefinisikan secara lokal agar sesuai dengan yang dibutuhkan halaman ini
type HomeSection = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact'; 

export default function Home() {
  const [currentSection, setCurrentSection] = useState<HomeSection>('home');

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null); 
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // sectionRefs sekarang hanya berisi seksi yang ada di halaman utama
  const sectionRefs: Record<HomeSection, React.RefObject<HTMLElement>> = useMemo(() => ({
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    portfolio: portfolioRef, 
    pricing: pricingRef,
    blog: blogRef,
    contact: contactRef,
  }), []);

  // handleNavClick disederhanakan karena navigasi halaman ditangani oleh <Link> di Header
  const handleNavClick = (section: HomeSection) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
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
          const sectionId = entry.target.id as HomeSection;
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
      {/* Sekarang props yang dikirimkan sudah sesuai dengan yang diharapkan Header */}
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