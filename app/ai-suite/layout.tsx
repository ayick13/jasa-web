// app/ai-suite/layout.tsx
import React from 'react';

// Layout ini hanya meneruskan children tanpa menambahkan elemen DOM tambahan
export default function AiSuiteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}