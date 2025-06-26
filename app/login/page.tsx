// File: app/login/page.tsx (Menggunakan SocialLoginButtons)

'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { SocialLoginButtons } from '../components/SocialLoginButtons'; // <-- IMPORT BARU

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/ai-suite';
  const error = searchParams.get('error');
  const [data, setData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error === "OAuthAccountNotLinked") {
      toast.error("Email ini sudah terdaftar dengan metode lain. Silakan masuk dengan metode yang sama.", { duration: 5000 });
    }
  }, [error]);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Mencoba masuk...');
    const result = await signIn('credentials', {
      ...data,
      redirect: false,
      callbackUrl,
    });
    setIsLoading(false);
    toast.dismiss(toastId);
    if (result?.error) {
      toast.error('Login gagal: Email atau password salah.');
    } else if (result?.url) {
      toast.success('Login berhasil! Mengarahkan...');
      router.push(result.url);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-white text-2xl font-bold mb-6 text-center">Masuk ke Akun Anda</h1>
      <form onSubmit={loginUser} className="space-y-6">
        {/* ... form email/password tidak berubah ... */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
          <input id="password" name="password" type="password" required value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50">
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
      </form>
      <div className="my-6">
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-slate-400">Atau lanjutkan dengan</span></div></div>
      </div>
      
      {/* Tombol sosial diganti dengan komponen baru */}
      <SocialLoginButtons />

      <p className="mt-6 text-center text-sm text-slate-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Suspense fallback={<div className="text-white">Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </>
  );
}