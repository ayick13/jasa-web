// app/battle-video/page.tsx

'use client';

import React from 'react';
import { Award, Calendar, CheckCircle, Gift, Target, ArrowLeft, Home, User, Rss, Layers, Mail, Menu, X, Github, Linkedin, Instagram, Code, Zap, Video } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeSwitcher } from '../theme-switcher'; // Pastikan path import benar
import { Footer } from '../components'; // Import Footer dari components.tsx

// --- Tipe dan Data Navigasi (disederhanakan untuk halaman ini) ---
const navLinks = [
    { href: '/#home', label: 'Beranda' }, 
    { href: '/#about', label: 'Tentang' },
    { href: '/#services', label: 'Layanan' }, 
    { href: '/#portfolio', label: 'Proyek' },
    { href: '/#pricing', label: 'Harga' },
    { href: '/#blog', label: 'Blog' }, 
    { href: '/battle-video', label: 'Battle Video' },
    { href: '/ai-suite', label: 'AI Suite' },
    { href: '/#contact', label: 'Kontak' }
];

// --- Komponen Header Khusus untuk Halaman Ini ---
const BattlePageHeader = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm dark:shadow-slate-950/10 transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="text-2xl font-bold text-slate-800 dark:text-white cursor-pointer flex items-center gap-2">
                        <Code className="w-8 h-8 text-cyan-500"/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Ayick.dev</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center space-x-2">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} className="flex items-center space-x-2 p-2 rounded-md text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <ThemeSwitcher />
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white focus:outline-none" aria-label="Buka menu">
                                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-800 shadow-xl pb-4">
                    <nav className="flex flex-col items-start space-y-2 p-4">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="text-lg w-full p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};


// Metadata untuk SEO halaman ini
export const metadata: Metadata = {
  title: 'Battle Video AI 2025 | Ruangriung AI Image',
  description: 'Ulang tahun pertama Ruangriung AI Image! Ikuti battle video dengan tema IKLAN LUCU RUANG RIUNG dan menangkan hadiah menarik.',
};

// Komponen untuk setiap seksi agar lebih rapi
const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="mb-12">
    <div className="flex items-center mb-6">
      {icon}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 ml-3">{title}</h2>
    </div>
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {children}
    </div>
  </section>
);

export default function BattleVideoPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      {/* === HEADER DITAMBAHKAN DI SINI === */}
      <BattlePageHeader />

      <main className="container mx-auto px-4 py-12 md:py-20">
        
        {/* Header Utama */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            💫 BATTLE VIDEO AI 2025 💫
          </h1>
          <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            RUANGRIUNG AI IMAGE
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12 text-xl">
            <p className="mb-4">Hallo kawan semua!</p>
            <p className="mb-8">Dalam rangka ulang tahun yang pertama RUANGRIUNG AI IMAGE, kami akan mengadakan battle yang seru nih!</p>
          </div>

          {/* Jadwal Penting */}
          <Section title="Jadwal Penting" icon={<Calendar className="w-8 h-8 text-indigo-500" />}>
            <ul>
              <li><strong>Mulai Battle:</strong> Senin, 23 Juni 2025, jam 10.00 WIB</li>
              <li><strong>Batas Akhir:</strong> Minggu, 29 Juni 2025, jam 20.00 WIB</li>
              <li><strong>Pengumuman Pemenang:</strong> Sabtu, 05 Juli 2025, jam 17.00 WIB</li>
            </ul>
          </Section>

          {/* Tema */}
          <Section title="Tema Battle" icon={<Target className="w-8 h-8 text-indigo-500" />}>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-4xl font-bold">💥 IKLAN LUCU RUANG RIUNG 💥</p>
              <p className="mt-2 text-sm">(Contoh video akan kami sediakan di grup)</p>
            </div>
            <p className="mt-6 text-center text-xl">Siapa yang berani menerima tantangan ini? Tunjukkan ide kreatifmu! Akan ada hadiah menarik bagi video-video terbaik!</p>
          </Section>

          {/* Dasar Penilaian */}
          <Section title="Dasar Penilaian" icon={<Award className="w-8 h-8 text-indigo-500" />}>
            <ol>
              <li><strong>Kesesuaian Tema:</strong> Apakah video sesuai dengan brief tema?</li>
              <li><strong>Kreativitas & Originalitas:</strong> Ide harus unik, orisinal, tidak generik.</li>
              <li><strong>Kualitas Produksi:</strong> Gambar jernih, audio jelas, hasil edit rapi.</li>
              <li><strong>Storytelling:</strong> Cerita mengalir, lucu, bikin penonton betah nonton dan share postingan ini.</li>
              <li><strong>Pesan & Call to Action:</strong> Ada pesan yang jelas & ajakan untuk audiens.</li>
              <li><strong>Branding:</strong> Logo/Brand “RUANGRIUNG AI IMAGE” muncul tepat & elegan.</li>
              <li><strong>Kelucuan:</strong> Wajib lucu! Minimal bikin senyum-senyum sendiri.</li>
            </ol>
          </Section>

          {/* Syarat Wajib Peserta */}
          <Section title="Syarat Wajib Peserta" icon={<CheckCircle className="w-8 h-8 text-indigo-500" />}>
            <ol>
              <li>Wajib bergabung dengan grup RUANGRIUNG AI IMAGE.</li>
              <li>Tulisan “RUANGRIUNG AI IMAGE” wajib muncul di dalam visual video (bukan hanya di caption).</li>
              <li>Minimal durasi video: 16 detik.</li>
              <li>Wajib posting video di grup + share ke beranda masing-masing (sertakan screenshot bukti share).</li>
              <li>Tag minimal 5 teman.</li>
              <li>Format & Generator pembuatan video bebas.</li>
              <li>Tidak boleh mengandung unsur pornografi, SARA, politik, atau menggunakan wajah public figure.</li>
              <li>Maksimal kirim 2 video untuk setiap peserta.</li>
              <li>Gunakan hashtag resmi: <strong className="text-indigo-500">#ultah1thnruangriung</strong></li>
              <li>Keputusan juri mutlak & tidak bisa diganggu gugat.</li>
            </ol>
          </Section>

          {/* Hadiah */}
          <Section title="Hadiah Pemenang" icon={<Gift className="w-8 h-8 text-indigo-500" />}>
             <p>Untuk pemenang, kami akan memberikan reward masing-masing dengan ketentuan sebagai berikut:</p>
             <ul className="list-none !pl-0">
                <li><strong className="text-yellow-400">Juara 1:</strong> Rp 300.000,-</li>
                <li><strong className="text-gray-300">Juara 2:</strong> Rp 200.000,-</li>
                <li><strong className="text-yellow-600">Juara 3:</strong> Rp 150.000,-</li>
                <li><strong>Juara 4:</strong> Rp 100.000,-</li>
                <li><strong>Juara 5:</strong> Rp 100.000,-</li>
             </ul>
          </Section>
          
          {/* Tombol Kembali */}
          <div className="text-center mt-20">
            <Link href="/" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                <ArrowLeft className="w-5 h-5" />
                Kembali ke Beranda
            </Link>
          </div>

          {/* Penutup */}
          <div className="text-center mt-12">
            <p className="text-2xl font-bold mb-4">Yuk kawan semua.... kita gaskeun, tunjukkan imajinasi kreatifitasmu disini!</p>
            <p>Terima kasih atas partisipasinya,</p>
            <p className="font-semibold mt-2">Salam dari Team Work RAI (Ruangriung AI Image)</p>
          </div>
        </div>
      </main>

      {/* === FOOTER DITAMBAHKAN DI SINI === */}
      <Footer />
    </div>
  );
}
