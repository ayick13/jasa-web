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
      <button
        onClick={() => socialLogin('facebook')}
        disabled={!!isLoading}
        className="flex items-center justify-center w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors disabled:opacity-50"
        title="Masuk dengan Facebook"
      >
        <Image src="/icons/facebook-icon.svg" alt="Facebook icon" width={24} height={24} />
      </button>
    </div>
  );
};