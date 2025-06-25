// File: middleware.ts (Versi Final)

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Arahkan ke halaman login kustom Anda
  },
});

export const config = {
  matcher: ["/ai-suite/:path*"],
};