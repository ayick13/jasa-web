// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

// --- KONFIGURASI METADATA FINAL UNTUK DUNIA DIGITAL AYICK ---

const businessName = "Dunia Digital Ayick";
const authorName = "Arif Tirtana";
const businessDescription = "Selamat datang di Dunia Digital Ayick. Sebagai Web Developer & Akselerator Digital, saya membantu bisnis Anda melesat di dunia online melalui kehadiran digital yang kuat, efektif, dan modern.";
const businessUrl = "https://ariftirtana.my.id"; 
const imagePath = "/picture/og.png";

export const metadata: Metadata = {
  // --- Informasi Fundamental & SEO ---
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
      default: `${businessName} | Web Developer & Akselerator Digital`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    url: businessUrl,
    siteName: businessName,
    images: [
      {
        url: imagePath,
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
      default: `${businessName} | Web Developer & Akselerator Digital`,
      template: `%s | ${businessName}`,
    },
    description: businessDescription,
    creator: '@arif_tirtana_dev',
    images: {
      url: imagePath,
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
  // Data Terstruktur JSON-LD dengan informasi kontak yang sudah terisi
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': businessName,
    'image': `${businessUrl}${imagePath}`,
    '@id': businessUrl,
    'url': businessUrl,
    'telephone': '+6281330763633', // Nomor telepon sudah terisi
    'description': businessDescription,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Usman Sadar No 8/15', // Alamat sudah terisi
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
