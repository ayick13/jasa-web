// app/providers.tsx

'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // SessionProvider membungkus semuanya untuk menyediakan data login
    <SessionProvider>
      {/* ThemeProvider dikembalikan ke konfigurasi aslinya yang sudah benar */}
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}