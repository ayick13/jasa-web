// File: app/terms-of-service/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan',
  description: 'Ketentuan Layanan penggunaan aplikasi Jasa Web AI Suite.',
};

const TermsOfServicePage = () => {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Ketentuan Layanan
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Terakhir diperbarui: 17 Juli 2025
        </p>

        <p className="mb-4">
          Selamat datang di aplikasi kami! Ketentuan Layanan ("Ketentuan") ini mengatur akses Anda ke dan penggunaan situs web, produk, dan layanan kami ("Layanan"). Mohon baca Ketentuan ini dengan saksama.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          1. Penerimaan Ketentuan
        </h2>
        <p className="mb-4">
          Dengan mengakses atau menggunakan Layanan kami, Anda setuju untuk terikat oleh Ketentuan ini. Jika Anda tidak setuju dengan Ketentuan ini, Anda tidak boleh mengakses atau menggunakan Layanan kami.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          2. Penggunaan Layanan
        </h2>
        <p className="mb-4">
          Anda setuju untuk menggunakan Layanan kami hanya untuk tujuan yang sah dan sesuai dengan Ketentuan ini. Anda bertanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda. Anda setuju untuk tidak menggunakan Layanan:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li>Dengan cara apa pun yang melanggar hukum atau peraturan yang berlaku.</li>
          <li>Untuk tujuan mengeksploitasi, merugikan, atau mencoba mengeksploitasi atau merugikan anak di bawah umur dengan cara apa pun.</li>
          <li>Untuk mengirimkan, atau mengadakan pengiriman, materi iklan atau promosi apa pun, termasuk "junk mail", "chain letter", "spam", atau permintaan serupa lainnya.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          3. Akun Pengguna
        </h2>
        <p className="mb-4">
          Untuk mengakses beberapa fitur Layanan kami, Anda mungkin diharuskan membuat akun. Anda harus memberikan informasi yang akurat, lengkap, dan terkini saat membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan untuk semua aktivitas yang terjadi di bawah akun Anda.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          4. Pembatasan Tanggung Jawab
        </h2>
        <p className="mb-4">
          Sejauh diizinkan oleh hukum yang berlaku, dalam keadaan apa pun, perusahaan kami, afiliasinya, direktur, karyawan, atau agennya tidak akan bertanggung jawab atas kerugian tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk namun tidak terbatas pada, kehilangan keuntungan, data, penggunaan, atau kerugian tidak berwujud lainnya.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          5. Perubahan pada Ketentuan
        </h2>
        <p className="mb-4">
          Kami berhak untuk mengubah atau mengganti Ketentuan ini kapan saja atas kebijakan kami sendiri. Jika kami melakukan perubahan, kami akan memberi tahu Anda dengan merevisi tanggal di bagian atas kebijakan ini dan, dalam beberapa kasus, kami dapat memberikan pemberitahuan tambahan (seperti menambahkan pernyataan ke beranda kami atau mengirimkan pemberitahuan kepada Anda).
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
          6. Hubungi Kami
        </h2>
        <p className="mb-4">
          Jika Anda memiliki pertanyaan tentang Ketentuan Layanan ini, silakan hubungi kami melalui halaman kontak kami atau kirim email ke alamat dukungan kami.
        </p>
      </div>
    </main>
  );
};

export default TermsOfServicePage;