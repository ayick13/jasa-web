// app/battle-video/page.tsx

import { Award, Calendar, CheckCircle, Gift, Target, Users, Video } from 'lucide-react';
import type { Metadata } from 'next';

// Metadata untuk SEO halaman ini
export const metadata: Metadata = {
  title: 'Battle Video AI 2025 | Ruangriung AI Image',
  description: 'Ulang tahun pertama Ruangriung AI Image! Ikuti battle video dengan tema IKLAN LUCU RUANG RIUNG dan menangkan hadiah menarik.',
};

// Komponen untuk setiap seksi agar lebih rapi
const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="mb-12">
    <div className="flex items-center mb-6">
      {icon}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 ml-3">{title}</h2>
    </div>
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {children}
    </div>
  </section>
);

export default function BattleVideoPage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <main className="container mx-auto px-4 py-12 md:py-20">
        
        {/* Header Utama */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
            💫 BATTLE VIDEO AI 2025 💫
          </h1>
          <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            RUANGRIUNG AI IMAGE
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12 text-xl">
            <p className="mb-4">Hallo kawan semua!</p>
            <p className="mb-8">Dalam rangka ulang tahun yang pertama RUANGRIUNG AI IMAGE, kami akan mengadakan battle yang seru nih!</p>
          </div>

          {/* Jadwal Penting */}
          <Section title="Jadwal Penting" icon={<Calendar className="w-8 h-8 text-indigo-500" />}>
            <ul>
              <li><strong>Mulai Battle:</strong> Senin, 23 Juni 2025, jam 10.00 WIB</li>
              <li><strong>Batas Akhir:</strong> Minggu, 29 Juni 2025, jam 20.00 WIB</li>
              <li><strong>Pengumuman Pemenang:</strong> Sabtu, 05 Juli 2025, jam 17.00 WIB</li>
            </ul>
          </Section>

          {/* Tema */}
          <Section title="Tema Battle" icon={<Target className="w-8 h-8 text-indigo-500" />}>
            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-4xl font-bold">💥 IKLAN LUCU RUANG RIUNG 💥</p>
              <p className="mt-2 text-sm">(Contoh video akan kami sediakan di grup)</p>
            </div>
            <p className="mt-6 text-center text-xl">Siapa yang berani menerima tantangan ini? Tunjukkan ide kreatifmu! Akan ada hadiah menarik bagi video-video terbaik!</p>
          </Section>

          {/* Dasar Penilaian */}
          <Section title="Dasar Penilaian" icon={<Award className="w-8 h-8 text-indigo-500" />}>
            <ol>
              <li><strong>Kesesuaian Tema:</strong> Apakah video sesuai dengan brief tema?</li>
              <li><strong>Kreativitas & Originalitas:</strong> Ide harus unik, orisinal, tidak generik.</li>
              <li><strong>Kualitas Produksi:</strong> Gambar jernih, audio jelas, hasil edit rapi.</li>
              <li><strong>Storytelling:</strong> Cerita mengalir, lucu, bikin penonton betah nonton dan share postingan ini.</li>
              <li><strong>Pesan & Call to Action:</strong> Ada pesan yang jelas & ajakan untuk audiens.</li>
              <li><strong>Branding:</strong> Logo/Brand “RUANGRIUNG AI IMAGE” muncul tepat & elegan.</li>
              <li><strong>Kelucuan:</strong> Wajib lucu! Minimal bikin senyum-senyum sendiri.</li>
            </ol>
          </Section>

          {/* Syarat Wajib Peserta */}
          <Section title="Syarat Wajib Peserta" icon={<CheckCircle className="w-8 h-8 text-indigo-500" />}>
            <ol>
              <li>Wajib bergabung dengan grup RUANGRIUNG AI IMAGE.</li>
              <li>Tulisan “RUANGRIUNG AI IMAGE” wajib muncul di dalam visual video (bukan hanya di caption).</li>
              <li>Minimal durasi video: 16 detik.</li>
              <li>Wajib posting video di grup + share ke beranda masing-masing (sertakan screenshot bukti share).</li>
              <li>Tag minimal 5 teman.</li>
              <li>Format & Generator pembuatan video bebas.</li>
              <li>Tidak boleh mengandung unsur pornografi, SARA, politik, atau menggunakan wajah public figure.</li>
              <li>Maksimal kirim 2 video untuk setiap peserta.</li>
              <li>Gunakan hashtag resmi: <strong className="text-indigo-500">#ultah1thnruangriung</strong></li>
              <li>Keputusan juri mutlak & tidak bisa diganggu gugat.</li>
            </ol>
          </Section>

          {/* Hadiah */}
          <Section title="Hadiah Pemenang" icon={<Gift className="w-8 h-8 text-indigo-500" />}>
             <p>Untuk pemenang, kami akan memberikan reward masing-masing dengan ketentuan sebagai berikut:</p>
             <ul className="list-none !pl-0">
                <li><strong className="text-yellow-400">Juara 1:</strong> Rp 300.000,-</li>
                <li><strong className="text-gray-300">Juara 2:</strong> Rp 200.000,-</li>
                <li><strong className="text-yellow-600">Juara 3:</strong> Rp 150.000,-</li>
                <li><strong>Juara 4:</strong> Rp 100.000,-</li>
                <li><strong>Juara 5:</strong> Rp 100.000,-</li>
             </ul>
          </Section>

          {/* Penutup */}
          <div className="text-center mt-16">
            <p className="text-2xl font-bold mb-4">Yuk kawan semua.... kita gaskeun, tunjukkan imajinasi kreatifitasmu disini!</p>
            <p>Terima kasih atas partisipasinya,</p>
            <p className="font-semibold mt-2">Salam dari Team Work RAI (Ruangriung AI Image)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
