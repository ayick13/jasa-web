// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// --- KONFIGURASI METADATA FINAL UNTUK ARIF TIRTANA ---

const businessName = "Jasa Pembuatan Web Arif Tirtana";
const authorName = "Arif Tirtana";
const businessDescription = "Kami menyediakan jasa pembuatan website modern dan cepat, serta AI Suite untuk membantu optimasi bisnis Anda. Hubungi kami untuk konsultasi gratis!";
const businessUrl = "https://ariftirtana.my.id"; 

export const metadata: Metadata = {
  // --- Informasi Fundamental & SEO ---
  metadataBase: new URL(businessUrl),
  title: {
    default: `${businessName} | Jasa Pembuatan Website & AI Suite`,
    template: `%s | ${businessName}`,
  },
  description: businessDescription,
  keywords: [
    'jasa pembuatan website', 'pembuatan website', 'web developer', 'AI suite', 
    'jasa SEO', 'website murah', 'konsultan IT', 'Arif Tirtana'
  ],
  
  // --- Informasi Kepemilikan & Branding ---
  creator: authorName,
  publisher: authorName,
  authors: [{ name: authorName, url: businessUrl }],
  
  // --- Kontrol Indexing Mesin Pencari ---
  robots: {
    index: true,
    follow: true,
  },

  // --- Verifikasi Layanan Pihak Ketiga ---
  verification: {
    google: 'mIxjYjzBb9Y_wduYCvaTHseHQqsa21brXNS0JOX02n4',
  },

  // --- Pengaturan Tampilan & Tema Browser ---
  themeColor: '#1a73e8',
  colorScheme: 'light',

  // --- URL Kanonikal & Bahasa ---
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/',
    },
  },

  // --- Optimalisasi untuk Media Sosial (Open Graph) ---
  openGraph: {
    title: {
      default: `${businessName} | Jasa Pembuatan Website & AI Suite`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    url: businessUrl,
    siteName: businessName,
    images: [
      {
        // Path gambar diperbarui sesuai permintaan Anda
        url: '/images/picture/og.png', 
        width: 1200,
        height: 630,
        alt: `Banner promosi untuk ${businessName}`,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  
  // --- Optimalisasi untuk Twitter (Twitter Card) ---
  twitter: {
    card: 'summary_large_image',
    title: {
      default: `${businessName} | Jasa Pembuatan Website & AI Suite`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    creator: '@arif_tirtana_dev',
    images: {
      // Path gambar diperbarui sesuai permintaan Anda
      url: '/images/picture/og.png', 
      alt: `Twitter card promosi untuk ${businessName}`,
    },
  },

  // --- Ikon & PWA ---
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

// --- Komponen Layout Utama ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Data Terstruktur JSON-LD untuk Layanan Profesional
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': businessName,
    'image': `${businessUrl}/images/picture/og.png`, // Path gambar diperbarui juga di sini
    '@id': businessUrl,
    'url': businessUrl,
    'telephone': '+62-81330763633',
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
      'https://www.linkedin.com/in/arif-tirtana',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}