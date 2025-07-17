// File: app/components/SocialLoginButtons.tsx

'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export const SocialLoginButtons = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/ai-suite';

  const socialLogin = (provider: 'google' | 'github' | 'facebook') => {
    setIsLoading(provider);
    toast.loading(`Mengarahkan ke ${provider}...`);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <button
        onClick={() => socialLogin('google')}
        disabled={!!isLoading}
        className="flex items-center justify-center w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        title="Masuk dengan Google"
      >
        <Image src="/icons/google-icon.svg" alt="Google icon" width={24} height={24} />
      </button>
      <button
        onClick={() => socialLogin('github')}
        disabled={!!isLoading}
        className="flex items-center justify-center w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        title="Masuk dengan GitHub"
      >
        <Image src="/icons/github-icon.svg" alt="GitHub icon" width={24} height={24} />
      </button>
       {/* --- MULAI NONAKTIFKAN DARI SINI --- */}
      {/*
      <button
        onClick={() => socialLogin('facebook')}
        disabled={!!isLoading}
        className="flex items-center justify-center w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        title="Masuk dengan Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.131c0-1.758 1.278-2.869 2.999-2.869h1.501v2z"/></svg>
      </button>
      */}
      {/* --- SELESAI NONAKTIFKAN DI SINI --- */}
    </div>
  );
};