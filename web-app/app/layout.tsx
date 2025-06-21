import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ayick.dev | Web Developer & Digital Accelerator',
  description:
    'Membangun kehadiran online yang kuat dan efektif melalui solusi web yang modern, cepat, dan fungsional.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans bg-slate-950 text-slate-300 leading-relaxed antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
