// Komponen Consent Cookies Slide Up Kiri Bawah
'use client';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) setVisible(true);
      else setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setAccepted(true);
    setVisible(false);
  };

  if (!visible || accepted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-xs bg-slate-800 text-white rounded-lg shadow-lg p-4 animate-slideup">
      <p className="mb-2 text-sm">Situs ini menggunakan cookies untuk meningkatkan pengalaman Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookies.</p>
      <button onClick={handleAccept} className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded transition-colors text-sm">Saya Setuju</button>
    </div>
  );
}

// Tambahkan animasi di global.css:
// @keyframes slideup { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
// .animate-slideup { animation: slideup 0.5s; }
