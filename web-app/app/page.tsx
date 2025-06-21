'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Header,
  HeroSection,
  AboutSection,
  ServicesSection,
  PortfolioSection, // Impor komponen baru
  PricingSection,
  BlogSection,
  ContactSection,
  Footer
} from './components';

type Section = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact'; // Tambah portfolio

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('home');

  const sectionRefs = {
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    services: useRef<HTMLElement>(null),
    portfolio: useRef<HTMLElement>(null), // Tambah ref baru
    pricing: useRef<HTMLElement>(null),
    blog: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  const handleNavClick = (section: Section) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.4 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id as Section);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const refs = Object.values(sectionRefs);
    refs.forEach(ref => { if (ref.current) { observer.observe(ref.current); } });
    return () => { refs.forEach(ref => { if (ref.current) { observer.unobserve(ref.current); } }); };
  }, []);

  return (
    <>
      <Header currentSection={currentSection} onNavClick={handleNavClick} />
      <main>
        <HeroSection onNavClick={handleNavClick} sectionRef={sectionRefs.home} />
        <AboutSection sectionRef={sectionRefs.about} />
        <ServicesSection sectionRef={sectionRefs.services} />
        <PortfolioSection sectionRef={sectionRefs.portfolio} /> {/* Panggil komponen di sini */}
        <PricingSection sectionRef={sectionRefs.pricing} />
        <BlogSection sectionRef={sectionRefs.blog} />
        <ContactSection sectionRef={sectionRefs.contact} />
      </main>
      <Footer />
    </>
  );
}
