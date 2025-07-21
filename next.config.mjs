import withPWAInit from 'next-pwa';

// Inisialisasi PWA dengan konfigurasi
const withPWA = withPWAInit({
  dest: 'public', // Direktori output untuk file service worker
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA di mode development
  register: true, // Daftarkan service worker secara otomatis
  skipWaiting: true, // Langsung aktifkan service worker baru tanpa menunggu
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
       // Remote pattern untuk googleusercontent.com yang lama bisa dihapus jika tidak diperlukan
       // Jika masih ragu, biarkan saja tidak apa-apa
    ],
  },
};

// Bungkus konfigurasi Next.js Anda dengan konfigurasi PWA
export default withPWA(nextConfig);