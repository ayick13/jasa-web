// /app/data-deletion/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Instruksi Penghapusan Data',
  description: 'Pelajari cara meminta penghapusan akun dan data pribadi Anda dari layanan kami.',
};

export default function DataDeletionPage() {
  return (
    <div className="bg-white dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl prose prose-lg dark:prose-invert">
        <h1>Instruksi Penghapusan Data</h1>
        <p className="text-slate-500 dark:text-slate-400">Kami menghormati hak Anda atas data pribadi Anda.</p>
        
        <p>
          Anda berhak untuk meminta penghapusan akun dan semua data pribadi terkait yang kami simpan. Mengikuti permintaan ini akan menghapus semua informasi Anda secara permanen dari sistem kami, termasuk detail akun, riwayat, dan informasi lainnya.
        </p>

        <h2>Cara Meminta Penghapusan Data</h2>
        <p>
          Untuk memulai proses penghapusan data, ikuti langkah-langkah sederhana berikut:
        </p>
        <ol>
          <li>
            Kirimkan email dari alamat email yang terdaftar di akun Anda ke alamat email dukungan kami: <strong>[admin@ariftirtana.my.id]</strong>.
          </li>
          <li>
            Gunakan subjek email: <strong>"Permintaan Penghapusan Data Pengguna"</strong>.
          </li>
          <li>
            Di dalam isi email, mohon sebutkan nama lengkap dan alamat email yang terkait dengan akun Anda untuk tujuan verifikasi.
          </li>
        </ol>

        <h2>Proses Setelah Permintaan Diterima</h2>
        <p>
          Setelah kami menerima permintaan Anda, tim kami akan melakukan verifikasi untuk memastikan bahwa permintaan tersebut sah. Setelah diverifikasi, kami akan memulai proses untuk menghapus semua data pribadi Anda dari database dan sistem kami.
        </p>
        <p>
          Proses ini dapat memakan waktu hingga <strong>30 hari kerja</strong>. Kami akan mengirimkan email konfirmasi kepada Anda setelah proses penghapusan selesai.
        </p>
        
        <p>
          Harap dicatat bahwa setelah data dihapus, tindakan ini tidak dapat diurungkan. Anda tidak akan dapat lagi mengakses akun atau data Anda.
        </p>
        
        <h2>Ada Pertanyaan?</h2>
        <p>
          Jika Anda memiliki pertanyaan lebih lanjut tentang proses ini atau kebijakan data kami, silakan baca <Link href="/privacy-policy">Kebijakan Privasi</Link> kami atau hubungi kami langsung di <strong>[admin@ariftirtana.my.id]</strong>.
        </p>
      </div>
    </div>
  );
}