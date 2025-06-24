// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  // Melindungi semua halaman di dalam /ai-suite
  matcher: ["/ai-suite/:path*"],
};