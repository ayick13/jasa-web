// File: app/register/page.tsx (Ditambahkan SocialLoginButtons)

'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { SocialLoginButtons } from '../components/SocialLoginButtons'; // <-- IMPORT BARU

function RegisterForm() {
    const router = useRouter();
    const [data, setData] = useState({ name: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Mendaftarkan pengguna...');
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        setIsLoading(false);
        if (response.ok) {
            toast.success('Pendaftaran berhasil! Anda akan diarahkan ke halaman login.', { id: toastId });
            setTimeout(() => router.push('/login'), 2000);
        } else {
            const errorData = await response.text();
            toast.error(`Pendaftaran gagal: ${errorData}`, { id: toastId });
        }
    };
    
    return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-white text-2xl font-bold mb-6 text-center">Buat Akun Baru</h1>
            <form onSubmit={registerUser} className="space-y-6">
                 {/* ... form email/password tidak berubah ... */}
                <div><label htmlFor="name" className="block text-sm font-medium text-slate-300">Nama</label><input id="name" name="name" type="text" required value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                <div><label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label><input id="email" name="email" type="email" autoComplete="email" required value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                <div><label htmlFor="password"className="block text-sm font-medium text-slate-300">Password</label><input id="password" name="password" type="password" required value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" /></div>
                <div><button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50">{isLoading ? 'Mendaftar...' : 'Daftar'}</button></div>
            </form>
             <div className="my-6">
                <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-600" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-800 text-slate-400">Atau daftar dengan</span></div></div>
            </div>
            
            {/* Tombol sosial ditambahkan di sini */}
            <SocialLoginButtons />

            <p className="mt-6 text-center text-sm text-slate-400">
                Sudah punya akun?{' '}
                <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">
                    Masuk di sini
                </Link>
            </p>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <>
            <Toaster />
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                {/* Suspense diperlukan karena SocialLoginButtons menggunakan useSearchParams */}
                <Suspense fallback={<div className="text-white">Memuat...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </>
    )
}