// app/login/page.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { KeyRound, LogIn } from 'lucide-react';
import Image from 'next/image'; // Import Image dari next/image

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        toast.success('Login berhasil! Mengarahkan...'); //
        router.replace('/ai-suite'); //
      } else {
        const errorMessage = result?.error || 'Email atau Password salah. Silakan coba lagi.'; //
        setError(errorMessage); //
        toast.error(errorMessage); //

        const form = document.getElementById('login-form'); //
        form?.classList.add('animate-shake'); //
        setTimeout(() => form?.classList.remove('animate-shake'), 500); //
      }
    } catch (fetchError) {
      console.error('Error during fetch or signIn process:', fetchError); //
      setError('Terjadi kesalahan pada server. Coba lagi nanti.'); //
      toast.error('Terjadi kesalahan pada server. Coba lagi nanti.'); //
    } finally {
      setIsLoading(false); //
    }
  };

  // Fungsi untuk menangani login dengan Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('google', { callbackUrl: '/ai-suite' }); // Mengarahkan ke /ai-suite setelah login Google berhasil
      if (result?.error) {
        toast.error(`Gagal login dengan Google: ${result.error}`);
        setError(`Gagal login dengan Google: ${result.error}`);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Terjadi kesalahan saat login dengan Google.');
      setError('Terjadi kesalahan saat login dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };


  const style = `
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
  `;

  return (
    <>
      <style>{style}</style>
      <Toaster position="top-center" toastOptions={{ //
        className: 'dark:bg-slate-700 dark:text-white', //
        style: { background: '#fff', color: '#000' } //
      }} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <div id="login-form" className="w-full max-w-md p-8 space-y-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/20">
          <div className="text-center">
              <div className="inline-block p-3 bg-slate-700/50 rounded-full mb-4">
                  <KeyRound className="h-8 w-8 text-cyan-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Access AI Suite
              </h1>
              <p className="mt-2 text-slate-400">Silakan login untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
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
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                  </>
                ) : (
                  <>
                      <LogIn size={18} />
                      <span>Login</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Tombol Login Google */}
          <div className="mt-4">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-slate-800 bg-white rounded-lg shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                      <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                  )}
                  <span>{isLoading ? 'Menghubungkan...' : 'Login dengan Google'}</span>
              </button>
          </div>

          <div className="text-center text-sm text-slate-400">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}