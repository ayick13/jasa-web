// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header, Footer } from "./components"; // Impor dari file components.tsx
import CookieConsent from "./components/CookieConsent";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

// --- Definisi Metadata ---
const businessName = "Jasa Pembuatan Website";
const authorName = "Arif Tirtana";
const businessDescription = "Selamat datang di Dunia Digital Ayick. Sebagai Web Developer & Akselerator Digital, saya membantu bisnis Anda melesat di dunia online melalui kehadiran digital yang kuat, efektif, dan modern.";
const businessUrl = "https://ariftirtana.my.id";
const imagePath = "/picture/og.png";

export const metadata: Metadata = {
  metadataBase: new URL(businessUrl),
  title: {
    default: `${businessName} | Web Developer & Akselerator Digital`,
    template: `%s | ${businessName}`,
  },
  description: businessDescription,
  keywords: [
    'Dunia Digital Ayick', 'Arif Tirtana', 'akselerator digital', 'web developer profesional',
    'konsultan digital', 'strategi online', 'pembuatan website', 'optimasi website'
  ],
  creator: authorName,
  publisher: authorName,
  authors: [{ name: authorName, url: businessUrl }],
  robots: { index: true, follow: true },
  verification: { google: 'mIxjYjzBb9Y_wduYCvaTHseHQqsa21brXNS0JOX02n4' },
  alternates: {
    canonical: '/',
    languages: { 'id-ID': '/' },
  },
  openGraph: {
    title: {
      default: `${businessName} | Web Developer & Akselerator Digital`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    url: businessUrl,
    siteName: businessName,
    images: [{ url: imagePath, width: 1200, height: 630, alt: `Banner promosi untuk ${businessName}` }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: `${businessName} | Web Developer & Akselerator Digital`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    creator: '@arif_tirtana_dev',
    images: { url: imagePath, alt: `Twitter card promosi untuk ${businessName}` },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jasa Pembuatan Website",
  },
};

// --- Viewport untuk PWA (dideklarasikan terpisah) ---
export const viewport: Viewport = {
  themeColor: "#1D0F2CFF",
};

// --- Komponen RootLayout ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': businessName,
    'image': `${businessUrl}${imagePath}`,
    '@id': businessUrl,
    'url': businessUrl,
    'telephone': '+6281330763633',
    'description': businessDescription,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Usman Sadar No 8/15',
      'addressLocality': 'Gresik',
      'addressRegion': 'Jawa Timur',
      'postalCode': '61118',
      'addressCountry': 'ID'
    },
    'sameAs': [
      'https://www.facebook.com/ayicktigabelas',
      'https://github.com/ayick13',
    ],
    'provider': {
      '@type': 'Person',
      'name': authorName
    }
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1439044724518446`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-slate-900`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}