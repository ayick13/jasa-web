// app/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { UserPlus, LogIn } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
        const missingFieldsError = 'Semua field wajib diisi.';
        setError(missingFieldsError);
        toast.error(missingFieldsError); // Menambahkan toast error di sini
        setIsLoading(false);
        return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        toast.success('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Tunggu 2 detik sebelum redirect
      } else {
        const data = await res.json();
        const apiError = data.error || 'Terjadi kesalahan saat registrasi.';
        setError(apiError);
        toast.error(apiError); // Menambahkan toast error dari API di sini
      }
    } catch (err) {
      console.error('Error during registration fetch:', err); // Lebih baik log error sebenarnya
      const serverError = 'Terjadi kesalahan pada server. Coba lagi nanti.';
      setError(serverError);
      toast.error(serverError); // Menambahkan toast error untuk kesalahan server
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ // Menambahkan toastOptions untuk styling
        className: 'dark:bg-slate-700 dark:text-white',
        style: { background: '#fff', color: '#000' }
      }} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/20">
          <div className="text-center">
            <div className="inline-block p-3 bg-slate-700/50 rounded-full mb-4">
              <UserPlus className="h-8 w-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Buat Akun Baru
            </h1>
            <p className="mt-2 text-slate-400">Daftar untuk mendapatkan akses ke AI Suite.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-300"
              >
                Nama Lengkap
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-300"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Daftar</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-slate-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Login di sini
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}