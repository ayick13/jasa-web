import Link from 'next/link';
import { Home, Rss, Mail, Code } from 'lucide-react';
import { Footer } from '@/app/components'; 

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm dark:shadow-slate-950/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand */}
            <Link href="/" className="text-2xl font-bold text-slate-800 dark:text-white cursor-pointer flex items-center gap-2">
              <Code className="w-8 h-8 text-cyan-500"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">Ayick.dev</span>
            </Link>
            
            {/* Menu Navigasi Blog */}
            <nav className="flex items-center space-x-4 md:space-x-6">
              <Link href="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Beranda</span>
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-cyan-400 transition-colors">
                <Rss className="w-5 h-5" />
                <span className="hidden sm:inline">Blog</span>
              </Link>
              <Link href="/#contact" className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">
                <Mail className="w-5 h-5" />
                <span>Kontak</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}