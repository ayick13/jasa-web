// web-app/app/page.tsx
'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react'; // Import useMemo
import { HeroSection, AboutSection, ServicesSection, PortfolioSection, PricingSection, BlogSection, ContactSection, Header, Footer } from '@/app/components';
import { ThemeProvider } from './providers'; // Import ThemeProvider

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Bungkus sectionRefs dalam useMemo
  const sectionRefs = useMemo(() => ({
    home: heroRef,
    about: aboutRef,
    services: servicesRef,
    portfolio: portfolioRef,
    pricing: pricingRef,
    blog: blogRef,
    contact: contactRef,
  }), []); // Dependency array kosong karena ref tidak akan berubah

  const [currentSection, setCurrentSection] = useState<keyof typeof sectionRefs>('home');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7, // Percentage of the section that needs to be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as keyof typeof sectionRefs;
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
  }, [sectionRefs]); // sectionRefs sekarang aman di sini

  const handleNavClick = (section: keyof typeof sectionRefs) => {
    const ref = sectionRefs[section];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
    setCurrentSection(section);
  };

  return (
    <>
      <Header currentSection={currentSection} onNavClick={handleNavClick} />
      <HeroSection onNavClick={handleNavClick} sectionRef={heroRef} />
      <AboutSection sectionRef={aboutRef} />
      <ServicesSection sectionRef={servicesRef} />
      <PortfolioSection sectionRef={portfolioRef} />
      <PricingSection sectionRef={pricingRef} />
      <BlogSection sectionRef={blogRef} />
      <ContactSection sectionRef={contactRef} />
      <Footer />
    </>
  );
}