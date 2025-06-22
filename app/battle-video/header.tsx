// app/battle-video/header.tsx
'use client'; // <-- Tandai ini sebagai Client Component

import React from 'react';
import Link from 'next/link';
import { Menu, X, Code } from 'lucide-react';
import { ThemeSwitcher } from '../theme-switcher';

// Tipe dan Data Navigasi
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

// Komponen Header
export default function BattlePageHeader() {
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
