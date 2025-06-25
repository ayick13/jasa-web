// app/page.tsx
'use client'; // Menandakan bahwa komponen ini adalah Client Component

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  // Header dan Footer dihapus dari import karena akan dirender di app/layout.tsx
  HeroSection,
  AboutSection,
  ServicesSection,
  PortfolioSection,
  PricingSection,
  BlogSection,
  ContactSection,
  // Footer juga dihapus dari import
} from './components'; // Mengimpor semua komponen bagian dari file components.tsx

// Mendefinisikan tipe union untuk nama-nama bagian halaman.
// Ini memastikan keamanan tipe untuk state currentSection dan kunci dalam sectionRefs.
type HomeSection = 'home' | 'about' | 'services' | 'portfolio' | 'pricing' | 'blog' | 'contact';

export default function Home() {
  // State untuk melacak bagian halaman yang sedang terlihat (dalam viewport)
  const [currentSection, setCurrentSection] = useState<HomeSection>('home');

  // Membuat referensi untuk setiap bagian halaman menggunakan `useRef`.
  // Ini memungkinkan kita untuk mengakses elemen DOM langsung untuk keperluan scrolling dan observasi.
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Menggunakan useMemo untuk memoize objek sectionRefs.
  // Ini mencegah objek dibuat ulang pada setiap render, yang penting untuk useEffect
  // yang memiliki sectionRefs sebagai dependency.
  const sectionRefs: Record<HomeSection, React.RefObject<HTMLElement>> = useMemo(() => ({
    home: homeRef,
    about: aboutRef,
    services: servicesRef,
    portfolio: portfolioRef,
    pricing: pricingRef,
    blog: blogRef,
    contact: contactRef,
  }), []); // Dependencies kosong karena refs hanya dibuat sekali

  // Fungsi untuk menangani klik navigasi.
  // Akan menggulir ke bagian yang sesuai dengan efek smooth.
  const handleNavClick = (section: HomeSection) => {
    sectionRefs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
    // Update currentSection secara langsung saat navigasi manual
    setCurrentSection(section);
  };

  // Efek samping untuk menginisialisasi IntersectionObserver.
  // Observer akan memantau setiap bagian dan memperbarui `currentSection`
  // ketika sebuah bagian menjadi cukup terlihat dalam viewport.
  useEffect(() => {
    const observerOptions = {
      root: null, // Mengamati relatif terhadap viewport dokumen
      rootMargin: '0px', // Tidak ada margin tambahan
      threshold: 0.7, // Memicu ketika 70% dari elemen target terlihat
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Ketika sebuah bagian terlihat, perbarui `currentSection`
          const sectionId = entry.target.id as HomeSection;
          setCurrentSection(sectionId);
        }
      });
    }, observerOptions);

    // Memulai pengamatan untuk setiap elemen bagian yang memiliki ref.
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Cleanup function: Hentikan pengamatan ketika komponen di-unmount.
    // Ini penting untuk mencegah memory leaks.
    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [sectionRefs]); // Dependensi: sectionRefs agar efek diulang jika refs berubah (meskipun useMemo membuatnya stabil)

  return (
    <>
      {/* Header dan Footer dihapus dari sini.
          Mereka seharusnya hanya dirender di app/layout.tsx */}

      {/* Konten utama halaman */}
      <main>
        {/* Setiap bagian menerima `onNavClick` (jika diperlukan, seperti untuk HeroSection)
            dan `sectionRef` untuk dihubungkan dengan elemen DOM-nya.
            Pastikan setiap section component juga menerima `id` yang sesuai
            agar `IntersectionObserver` dapat mengidentifikasinya. */}
        <HeroSection onNavClick={handleNavClick} sectionRef={sectionRefs.home} />
        <AboutSection sectionRef={sectionRefs.about} />
        <ServicesSection sectionRef={sectionRefs.services} />
        <PortfolioSection sectionRef={sectionRefs.portfolio} />
        <PricingSection sectionRef={sectionRefs.pricing} />
        <BlogSection sectionRef={sectionRefs.blog} />
        <ContactSection sectionRef={sectionRefs.contact} />
      </main>
    </>
  );
}