// File: app/login/page.tsx

'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { SocialLoginButtons } from '../components/SocialLoginButtons';
import { Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/ai-suite';
  const error = searchParams.get('error');
  
  const [data, setData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Gunakan useSession untuk memeriksa status otentikasi
  const { data: session, status } = useSession();

  useEffect(() => {
    // Jika ada error dari NextAuth (misalnya, kredensial salah), tampilkan toast
    if (error && !isLoading) {
      toast.error('Login gagal: Email atau password salah.');
      // Hapus parameter error dari URL agar tidak muncul lagi saat refresh
      router.replace('/login', { scroll: false });
    }
  }, [error, isLoading, router]);
  
  useEffect(() => {
    // Jika sesi sudah terotentikasi, langsung arahkan
    if (status === 'authenticated') {
      toast.success('Anda sudah masuk. Mengarahkan...');
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);


  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Mencoba masuk...');

    // Biarkan NextAuth menangani pengalihan dengan redirect: true (default)
    // NextAuth akan secara otomatis mengarahkan ke callbackUrl jika berhasil
    await signIn('credentials', {
      ...data,
      callbackUrl, // Berikan callbackUrl ke NextAuth
    });

    // Kode di bawah ini mungkin tidak akan tercapai jika login berhasil karena halaman akan dialihkan
    setIsLoading(false);
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isLoading || status === 'authenticated'} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50">
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
      </form>
      <div className="my-6">
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-slate-400">Atau lanjutkan dengan</span></div></div>
      </div>
      
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