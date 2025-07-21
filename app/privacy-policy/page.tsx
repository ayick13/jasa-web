// /app/privacy-policy/page.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Pahami bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl prose prose-lg dark:prose-invert">
        <h1>Kebijakan Privasi</h1>
        <p className="text-slate-500 dark:text-slate-400">Terakhir diperbarui: 21 Juli 2025</p>
        
        <p>
          Selamat datang di Kebijakan Privasi kami. Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan jenis informasi yang kami kumpulkan dari Anda, bagaimana kami menggunakannya, dan langkah-langkah yang kami ambil untuk melindunginya saat Anda menggunakan website dan layanan kami.
        </p>

        <h2>1. Informasi yang Kami Kumpulkan</h2>
        <p>
          Kami mengumpulkan informasi untuk memberikan pengalaman yang lebih baik bagi semua pengguna kami. Jenis informasi yang kami kumpulkan meliputi:
        </p>
        <ul>
          <li>
            <strong>Informasi yang Anda berikan secara langsung:</strong> Saat Anda mendaftar untuk sebuah akun, kami mengumpulkan informasi pribadi seperti nama dan alamat email Anda.</li>
          
          <li>
            <strong>Informasi dari Layanan Pihak Ketiga:</strong> Jika Anda memilih untuk mendaftar atau login menggunakan penyedia pihak ketiga seperti Google atau GitHub, kami akan menerima informasi profil dasar dari akun tersebut, seperti nama, alamat email, dan gambar profil Anda, sesuai dengan otorisasi yang Anda berikan kepada layanan tersebut.
          </li>
          <li>
            <strong>Informasi Penggunaan:</strong> Kami dapat mengumpulkan informasi non-pribadi tentang bagaimana Anda berinteraksi dengan layanan kami, seperti halaman yang dikunjungi atau fitur yang digunakan.
          </li>
          <li>
            <strong>Cookie dan Teknologi Serupa:</strong> Kami menggunakan cookie untuk membantu mengelola sesi login Anda dan meningkatkan pengalaman pengguna. Anda dapat mengontrol penggunaan cookie melalui pengaturan browser Anda.
          </li>
        </ul>

        <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
        <p>
          Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
        </p>
        <ul>
          <li>Untuk menyediakan, mengoperasikan, dan memelihara layanan kami.</li>
          <li>Untuk mempersonalisasi dan meningkatkan pengalaman Anda.</li>
          <li>Untuk mengelola akun Anda dan proses autentikasi.</li>
          <li>Untuk berkomunikasi dengan Anda, termasuk menanggapi pertanyaan atau permintaan Anda.</li>
          <li>Untuk tujuan keamanan dan mencegah penipuan.</li>
        </ul>

        <h2>3. Berbagi dan Pengungkapan Informasi</h2>
        <p>
          Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan informasi dalam keadaan berikut:
        </p>
        <ul>
          <li>
            <strong>Dengan Persetujuan Anda:</strong> Kami dapat membagikan informasi pribadi dengan persetujuan eksplisit dari Anda.
          </li>
          <li>
            <strong>Untuk Kepatuhan Hukum:</strong> Kami dapat mengungkapkan informasi jika diwajibkan oleh hukum atau sebagai tanggapan atas permintaan yang sah dari otoritas publik.
          </li>
        </ul>

        <h2>4. Keamanan Data</h2>
        <p>
          Kami berkomitmen untuk melindungi keamanan data Anda. Kami menggunakan berbagai teknologi dan prosedur keamanan untuk membantu melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah.
        </p>
        
        <h2>5. Hak Anda</h2>
        <p>
          Anda memiliki hak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda. Silakan lihat halaman "Penghapusan Data" kami untuk instruksi lebih lanjut mengenai cara meminta penghapusan data.
        </p>

        <h2>6. Perubahan pada Kebijakan Ini</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini dan memperbarui tanggal "Terakhir diperbarui" di bagian atas.
        </p>

        <h2>7. Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi kami di: <strong>[admin@ariftirtana.my.id]</strong>.
        </p>
      </div>
    </div>
  );
}