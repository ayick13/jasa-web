import Link from 'next/link';
import { Home, Rss, Mail, Code } from 'lucide-react';
import { Footer } from '@/app/components'; // Mengimpor Footer dari komponen utama

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-md shadow-slate-950/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <Link href="/" className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2">
              <Code className="w-8 h-8 text-cyan-400"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Jasa Pembuatan Website</span>
            </Link>
            
            {/* Menu Navigasi Blog */}
            <nav className="flex items-center space-x-4 md:space-x-6">
              <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors">
                <Rss className="w-5 h-5" />
                <span className="hidden sm:inline">Blog</span>
              </Link>
              <Link href="/#contact" className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-full hover:bg-slate-600 transition-all duration-300">
                <Mail className="w-5 h-5" />
                <span className="hidden sm:inline">Kontak</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Konten Halaman (Indeks atau Artikel) */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}