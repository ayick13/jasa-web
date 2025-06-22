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
      // === TAMBAHKAN BLOK BARU INI ===
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
      // ==============================
    ],
  },
};

export default nextConfig;