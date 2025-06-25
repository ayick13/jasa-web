// File: app/login/page.tsx (Versi Final dengan import yang benar)

'use client';

import { Suspense, useState, useEffect } from 'react'; // <--- useEffect DITAMBAHKAN DI SINI
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

// Komponen LoginForm yang berisi logika dan hook useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/ai-suite';
  const error = searchParams.get('error');

  const [data, setData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Menampilkan error jika ada (misalnya OAuthAccountNotLinked)
  useEffect(() => {
    if (error) {
      toast.error("Gagal masuk. Jika Anda sebelumnya mendaftar dengan metode lain, coba gunakan metode tersebut.");
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
  
  const loginWithGoogle = () => {
    setIsLoading(true);
    toast.loading("Mengarahkan ke Google...");
    signIn('google', { callbackUrl });
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-white text-2xl font-bold mb-6 text-center">Masuk ke Akun Anda</h1>
      <form onSubmit={loginUser} className="space-y-6">
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-slate-400">Atau lanjutkan dengan</span>
          </div>
        </div>
      </div>
      <div>
        <button onClick={loginWithGoogle} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50">
          <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.9c0-54.4 16.8-103.7 46.3-143.5l88.5 69.3c-11.3 22.6-17.4 47.7-17.4 74.2 0 66.5 54.1 120.6 120.6 120.6 66.5 0 120.6-54.1 120.6-120.6 0-21.6-5.7-42-15.8-59.8l88.5-69.3c36.3 35.8 57.5 83.1 57.5 135zM124.3 162.7L35.8 93.3C69.3 50.8 123.4 16 186.3 16c68.3 0 128.8 35.8 168.1 90.1l-88.5 69.3C241.7 122.9 200.4 93.3 150.9 93.3c-23.2 0-44.8 7.5-62.8 20.3z"></path></svg>
          Masuk dengan Google
        </button>
      </div>
       <p className="mt-4 text-center text-sm text-slate-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}

// Komponen Halaman utama yang mengekspor default
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