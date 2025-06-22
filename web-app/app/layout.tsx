import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react";
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast'; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// URL dasar situs Anda
const siteUrl = 'https://ariftirtana.my.id/';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ayick.dev | Web Developer & Digital Accelerator',
    template: '%s | Ayick.dev',
  },
  description: 'Membangun kehadiran online yang kuat dan efektif melalui solusi web yang modern, cepat, dan fungsional di Gresik, Indonesia.',
  keywords: ['Web Developer', 'Jasa Pembuatan Website', 'Next.js', 'React Developer', 'Gresik', 'Digital Accelerator', 'Portfolio'],
  authors: [{ name: 'Ayick', url: siteUrl }],
  creator: 'Ayick',
  publisher: 'Ayick.dev',
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Ayick.dev | Web Developer & Digital Accelerator',
    description: 'Solusi web modern, cepat, dan fungsional untuk bisnis Anda.',
    url: siteUrl,
    siteName: 'Ayick.dev',
    images: [
      {
        url: '/picture/og.png',
        width: 1200,
        height: 630,
        alt: 'Ayick.dev - Web Developer',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ayick.dev | Web Developer & Digital Accelerator',
    description: 'Bangun kehadiran online Anda dengan solusi web dari Ayick.dev.',
    images: ['/picture/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 leading-relaxed antialiased transition-colors duration-300">
        <Providers>
          {children}
          <Analytics />
          {/* PERBAIKAN: Ubah posisi toaster agar tidak menutupi tombol close modal */}
          <Toaster position="bottom-center" /> 
        </Providers>
      </body>
    </html>
  );
}