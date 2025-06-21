export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string; // Konten penuh artikel dalam format string (bisa berisi HTML)
  publishedDate: string;
}

export const blogArticles: Article[] = [
  {
    slug: 'mengapa-website-cepat-penting',
    title: 'Mengapa Website Cepat & Desain Menarik Penting?',
    summary: 'Pelajari bagaimana kecepatan dan desain memengaruhi kesuksesan bisnis online Anda.',
    publishedDate: '20 Juni 2025',
    content: `
      <p class="mb-4">Di era digital yang serba cepat, perhatian pengguna sangat terbatas. Website yang lambat tidak hanya membuat frustrasi, tetapi juga secara langsung merugikan peringkat SEO dan konversi. Google telah mengonfirmasi bahwa kecepatan situs adalah salah satu faktor peringkat utama.</p>
      <h3 class="text-2xl font-bold text-white mt-6 mb-3">Dampak Kecepatan Website</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Pengalaman Pengguna (UX):</strong> Pengguna mengharapkan halaman dimuat dalam 2-3 detik. Lebih dari itu, kemungkinan mereka akan meninggalkan situs Anda meningkat secara eksponensial.</li>
        <li><strong>Peringkat SEO:</strong> Mesin pencari seperti Google lebih menyukai situs yang cepat karena memberikan pengalaman yang lebih baik bagi pengguna mereka.</li>
        <li><strong>Tingkat Konversi:</strong> Setiap detik penundaan dalam pemuatan halaman dapat menurunkan konversi secara signifikan.</li>
      </ul>
      <p>Sementara itu, desain yang menarik dan intuitif membangun kepercayaan dan memandu pengguna untuk melakukan tindakan yang Anda inginkan, seperti mengisi formulir kontak atau melakukan pembelian.</p>
    `,
  },
  {
    slug: 'panduan-website-bisnis',
    title: 'Panduan Lengkap untuk Website Bisnis Anda',
    summary: 'Langkah penting untuk membangun kehadiran online yang kuat bagi bisnis Anda.',
    publishedDate: '15 Juni 2025',
    content: `
      <p class="mb-4">Memiliki website bisnis bukan lagi pilihan, melainkan keharusan. Ini adalah etalase digital Anda yang buka 24/7. Berikut adalah langkah-langkah penting yang perlu dipertimbangkan:</p>
       <h3 class="text-2xl font-bold text-white mt-6 mb-3">Elemen Kunci Website Bisnis</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Tujuan yang Jelas:</strong> Apa yang ingin Anda capai dengan website ini? Menghasilkan prospek, menjual produk, atau memberikan informasi?</li>
        <li><strong>Desain Profesional & Responsif:</strong> Tampilan harus mencerminkan brand Anda dan berfungsi baik di semua perangkat.</li>
        <li><strong>Konten Berkualitas:</strong> Berikan informasi yang berharga dan relevan bagi target audiens Anda.</li>
        <li><strong>Navigasi Intuitif:</strong> Pengguna harus dapat menemukan apa yang mereka cari dengan mudah.</li>
        <li><strong>Ajakan Bertindak (Call-to-Action):</strong> Setiap halaman harus memiliki CTA yang jelas, seperti "Hubungi Kami" atau "Beli Sekarang".</li>
      </ul>
    `,
  },
  {
    slug: 'website-modern-terjangkau',
    title: 'Website Modern dengan Biaya Terjangkau',
    summary: 'Temukan cara mendapatkan website berkualitas tinggi tanpa merusak anggaran.',
    publishedDate: '10 Juni 2025',
    content: `
      <p class="mb-4">Banyak yang berpikir bahwa website berkualitas tinggi pasti mahal. Namun, dengan teknologi modern seperti Next.js dan Tailwind CSS, kita dapat membangun situs yang cepat, aman, dan menarik secara visual dengan biaya yang lebih efisien.</p>
      <h3 class="text-2xl font-bold text-white mt-6 mb-3">Bagaimana Caranya?</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Framework Modern (Next.js):</strong> Memungkinkan pengembangan yang cepat dan memberikan performa luar biasa secara default.</li>
        <li><strong>Styling Efisien (Tailwind CSS):</strong> Mengurangi waktu yang dihabiskan untuk menulis CSS kustom dari awal.</li>
        <li><strong>Static Site Generation (SSG):</strong> Menghasilkan halaman HTML statis yang sangat cepat saat di-hosting.</li>
        <li><strong>Hosting Terjangkau (Vercel):</strong> Platform seperti Vercel menawarkan paket gratis yang sangat kuat untuk proyek pribadi dan bisnis kecil.</li>
      </ul>
    `,
  },
];