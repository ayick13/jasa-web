'use client';

import React from 'react';
import Image from 'next/image';
import { Home, User, Rss, Layers, Mail, Menu, X, Github, Linkedin, Instagram, Code, CheckCircle, Smartphone, BarChart2, ArrowRight, Tag, Star } from 'lucide-react';

// --- Data & Tipe Digabung di sini untuk kesederhanaan ---
type Section = 'home' | 'about' | 'services' | 'pricing' | 'blog' | 'contact';

const navLinks = [
    { section: 'home', label: 'Beranda', icon: Home }, 
    { section: 'about', label: 'Tentang', icon: User },
    { section: 'services', label: 'Layanan', icon: Layers }, 
    { section: 'pricing', label: 'Harga', icon: Tag },
    { section: 'blog', label: 'Blog', icon: Rss }, 
    { section: 'contact', label: 'Kontak', icon: Mail }
] as const;

const servicesData = [
    { icon: Code, title: "Pengembangan Web", description: "Membangun situs web kustom dari awal, memastikan fungsionalitas yang mulus." },
    { icon: Smartphone, title: "Desain Responsif", description: "Memastikan situs web Anda terlihat sempurna di semua perangkat." },
    { icon: BarChart2, title: "Optimasi SEO", description: "Meningkatkan visibilitas situs web Anda di mesin pencari." }
];

const skillsData = [
    { name: "HTML5 & CSS3" }, { name: "JavaScript (ES6+)" }, { name: "TypeScript" },
    { name: "React & Next.js" }, { name: "Tailwind CSS" }, { name: "Node.js" },
    { name: "Firebase" }, { name: "Git & GitHub" }
];

const pricingData = [
    { title: "Basic", price: "1.5jt", period: "proyek", description: "Untuk portofolio pribadi atau website sederhana.", features: ["1 Halaman Landing Page", "Desain Responsif", "Formulir Kontak", "Hosting Dasar"], isRecommended: false },
    { title: "Pro", price: "4jt", period: "proyek", description: "Pilihan terbaik untuk bisnis kecil atau startup.", features: ["Hingga 5 Halaman", "Desain Kustom", "CMS", "Optimasi SEO Dasar", "Dukungan 1 Bulan"], isRecommended: true },
    { title: "Enterprise", price: "Hubungi", period: "kami", description: "Solusi lengkap untuk kebutuhan bisnis yang kompleks.", features: ["Halaman Tak Terbatas", "Fitur E-commerce", "Integrasi API", "Dukungan Prioritas"], isRecommended: false }
];

const blogArticles = [
    { title: "Mengapa Website Cepat & Desain Menarik Penting?", summary: "Pelajari bagaimana kecepatan dan desain memengaruhi kesuksesan bisnis online Anda.", link: "#" },
    { title: "Panduan Lengkap untuk Website Bisnis Anda", summary: "Langkah penting untuk membangun kehadiran online yang kuat bagi bisnis Anda.", link: "#" },
    { title: "Website Modern dengan Biaya Terjangkau", summary: "Temukan cara mendapatkan website berkualitas tinggi tanpa merusak anggaran.", link: "#" }
];


// --- Komponen-komponen ---

interface NavLinkProps {
  section: Section; label: string; icon: React.ElementType; currentSection: Section;
  onClick: (section: Section) => void; isMobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ section, label, icon: Icon, currentSection, onClick, isMobile = false }) => (
  <a href={`#${section}`} onClick={(e) => { e.preventDefault(); onClick(section); }}
    className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-300 ${
      currentSection === section ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    } ${isMobile ? 'text-lg w-full' : 'text-sm'}`}>
    <Icon className="w-5 h-5" /> <span>{label}</span>
  </a>
);

export const Header: React.FC<{ currentSection: Section; onNavClick: (section: Section) => void }> = ({ currentSection, onNavClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleNavClick = (section: Section) => { onNavClick(section); setIsOpen(false); };

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-md shadow-slate-950/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavClick('home');}} className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2">
            <Code className="w-8 h-8 text-cyan-400"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Ayick.dev</span>
          </a>
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => <NavLink key={link.section} {...link} currentSection={currentSection} onClick={handleNavClick} />)}
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white focus:outline-none" aria-label="Buka menu">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-800 shadow-xl pb-4">
          <nav className="flex flex-col items-start space-y-2 p-4">
            {navLinks.map(link => <NavLink key={link.section} {...link} currentSection={currentSection} onClick={handleNavClick} isMobile />)}
          </nav>
        </div>
      )}
    </header>
  );
};


export const HeroSection: React.FC<{ onNavClick: (section: Section) => void; sectionRef: React.RefObject<HTMLElement> }> = ({ onNavClick, sectionRef }) => (
    <section ref={sectionRef} id="home" className="min-h-screen flex items-center justify-center bg-grid-pattern animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight">
                Selamat Datang di Dunia Digital <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Ayick</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Web Developer & Akselerator Digital. Membantu Anda membangun kehadiran online yang kuat dan efektif.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={() => onNavClick('contact')} className="bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">Hubungi Saya</button>
                <button onClick={() => onNavClick('services')} className="bg-slate-700 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-600 transition-all duration-300 w-full sm:w-auto">Lihat Layanan</button>
            </div>
        </div>
    </section>
);


export const AboutSection: React.FC<{ sectionRef: React.RefObject<HTMLElement> }> = ({ sectionRef }) => (
    <section ref={sectionRef} id="about" className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-16">
                <div className="w-full md:w-1/3 flex-shrink-0 flex justify-center">
                    <Image src="https://placehold.co/400x400/1e293b/93c5fd?text=AY" alt="Foto profil Ayick" width={256} height={256} className="rounded-full shadow-2xl shadow-cyan-500/20 border-4 border-slate-700" />
                </div>
                <div className="w-full md:w-2/3 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tentang Saya</h2>
                    <p className="text-slate-300 mb-4 text-lg">
                        Pengembang web dari Gresik, Indonesia. Dengan hasrat untuk teknologi dan kreativitas, saya berdedikasi menciptakan solusi web yang fungsional dan menarik secara visual.
                    </p>
                    <p className="text-slate-400 mb-6">
                        Tujuan saya adalah membantu Anda mencapai tujuan melalui kehadiran online yang kuat, desain yang baik, dan kode yang bersih.
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-4 mt-8">Keahlian Saya</h3>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {skillsData.map(skill => (
                            <div key={skill.name} className="flex items-center gap-2 bg-slate-800 text-cyan-300 py-2 px-4 rounded-full text-sm font-medium">
                                <CheckCircle className="w-5 h-5"/> <span>{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export const ServicesSection: React.FC<{ sectionRef: React.RefObject<HTMLElement> }> = ({ sectionRef }) => (
    <section ref={sectionRef} id="services" className="py-16 md:py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Layanan Kami</h2>
                <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Solusi yang saya tawarkan untuk membangun kehadiran digital Anda.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {servicesData.map((service, index) => (
                    <div key={index} className="bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700 flex flex-col text-center items-center hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2">
                        <div className="bg-slate-900 p-4 rounded-full mb-5 border-2 border-cyan-500/30">
                           <service.icon className="w-10 h-10 text-cyan-400"/>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                        <p className="text-slate-400">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


export const PricingSection: React.FC<{ sectionRef: React.RefObject<HTMLElement>; onNavClick: (section: Section) => void; }> = ({ sectionRef, onNavClick }) => (
    <section ref={sectionRef} id="pricing" className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Paket Harga</h2>
                <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Pilih paket yang paling sesuai dengan kebutuhan Anda.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
                {pricingData.map((tier) => (
                    <div key={tier.title} className={`bg-slate-800 p-8 rounded-xl shadow-lg border-2 flex flex-col h-full relative overflow-hidden ${tier.isRecommended ? 'border-cyan-500' : 'border-slate-700'}`}>
                        {tier.isRecommended && <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg flex items-center gap-1"><Star className="w-4 h-4" /><span>PALING POPULER</span></div>}
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.title}</h3>
                        <p className="text-slate-400 mb-6 flex-grow">{tier.description}</p>
                        <div className="mb-6">
                            {tier.price === 'Hubungi' ? <span className="text-4xl font-extrabold text-white">Hubungi</span> : <span className="text-4xl font-extrabold text-white">Rp {tier.price}</span>}
                            <span className="text-slate-400 ml-1">/ {tier.period}</span>
                        </div>
                        <ul className="space-y-4 mb-8 text-slate-300">
                            {tier.features.map((feature) => (<li key={feature} className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0"/> <span>{feature}</span></li>))}
                        </ul>
                        <button onClick={() => onNavClick('contact')} className={`w-full mt-auto font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 ${tier.isRecommended ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-600' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>Pilih Paket</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


export const BlogSection: React.FC<{ sectionRef: React.RefObject<HTMLElement> }> = ({ sectionRef }) => (
    <section ref={sectionRef} id="blog" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Artikel Terbaru</h2>
                <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Berbagi pemikiran, wawasan, dan tutorial seputar teknologi.</p>
            </div>
            <div className="max-w-4xl mx-auto grid gap-10">
                {blogArticles.map((article, index) => (
                    <div key={index} className="bg-slate-800 p-8 rounded-xl shadow-lg group border border-slate-700 hover:border-cyan-400 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">{article.title}</h3>
                        <p className="text-slate-400 mb-5">{article.summary}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-500 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">Baca Selengkapnya <ArrowRight className="w-4 h-4"/></a>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


export const ContactSection: React.FC<{ sectionRef: React.RefObject<HTMLElement> }> = ({ sectionRef }) => (
    <section ref={sectionRef} id="contact" className="py-16 md:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Hubungi Saya</h2>
                <p className="text-slate-400 mt-3 max-w-2xl mx-auto">Punya proyek atau ide? Mari kita diskusikan!</p>
            </div>
            <div className="max-w-2xl mx-auto bg-slate-800 p-8 md:p-12 rounded-xl shadow-2xl border border-slate-700">
                <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-slate-300 mb-2 font-medium">Nama</label>
                            <input type="text" id="name" name="name" required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Nama Anda" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-slate-300 mb-2 font-medium">Email</label>
                            <input type="email" id="email" name="email" required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="email@contoh.com" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-slate-300 mb-2 font-medium">Pesan</label>
                        <textarea id="message" name="message" rows={5} required className="w-full bg-slate-700 border border-slate-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Jelaskan kebutuhan Anda..."></textarea>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="bg-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105">Kirim Pesan</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
);


export const Footer: React.FC = () => (
    <footer className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
            <div className="flex justify-center space-x-6 mb-4">
                <a href="#" aria-label="GitHub" className="hover:text-cyan-400 transition-colors"><Github className="w-6 h-6"/></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-cyan-400 transition-colors"><Linkedin className="w-6 h-6"/></a>
                <a href="#" aria-label="Instagram" className="hover:text-cyan-400 transition-colors"><Instagram className="w-6 h-6"/></a>
            </div>
            <p>&copy; {new Date().getFullYear()} Ayick.dev. Hak Cipta Dilindungi.</p>
        </div>
    </footer>
);