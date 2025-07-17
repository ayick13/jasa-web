'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  // Header dan Footer tidak perlu diimpor di sini lagi
  HeroSection,
  AboutSection,
  ServicesSection,
  PortfolioSection,
  PricingSection,
  BlogSection,
  ContactSection,
} from './components';
import type { Post } from '@/lib/posts';

type HomeClientProps = {
  recentPosts: Post[];
};

type HomeSection = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact';

export function HomeClientPage({ recentPosts }: HomeClientProps) {
  const [currentSection, setCurrentSection] = useState<HomeSection>('home');

  const sectionRefs: Record<HomeSection, React.RefObject<HTMLElement>> = useMemo(() => ({
    home: React.createRef<HTMLElement>(),
    about: React.createRef<HTMLElement>(),
    services: React.createRef<HTMLElement>(),
    portfolio: React.createRef<HTMLElement>(),
    pricing: React.createRef<HTMLElement>(),
    blog: React.createRef<HTMLElement>(),
    contact: React.createRef<HTMLElement>(),
  }), []);

  const handleNavClick = (section: HomeSection) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    setCurrentSection(section);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id as HomeSection);
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [sectionRefs]);

  // Perhatikan: <Header> dan <Footer> sudah tidak ada di sini
  return (
    <main>
        <HeroSection onNavClick={handleNavClick} sectionRef={sectionRefs.home} />
        <AboutSection sectionRef={sectionRefs.about} />
        <ServicesSection sectionRef={sectionRefs.services} />
        <PortfolioSection sectionRef={sectionRefs.portfolio} />
        <PricingSection sectionRef={sectionRefs.pricing} />
        <BlogSection sectionRef={sectionRefs.blog} recentPosts={recentPosts} />
        <ContactSection sectionRef={sectionRefs.contact} />
    </main>
  );
}