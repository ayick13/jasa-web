export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedDate: string;
  imageUrl: string; // Properti untuk gambar sampul
}

export const blogArticles: Article[] = [
  {
    slug: 'mengapa-website-cepat-penting',
    title: 'Mengapa Website Cepat & Desain Menarik Adalah Kunci Sukses?',
    summary: 'Selami lebih dalam bagaimana kecepatan dan estetika desain menjadi pilar utama kesuksesan bisnis online Anda di era modern.',
    publishedDate: '20 Juni 2025',
    // --- PATH GAMBAR DI SINI ---
    imageUrl: 'https://placehold.co/1200x630/1e293b/93c5fd/png?text=Kecepatan+Website', 
    content: `
      <p class="mb-4">Di era digital yang serba cepat, perhatian pengguna adalah komoditas yang paling berharga. Anda hanya punya beberapa detik untuk membuat kesan pertama. Jika website Anda lambat, Anda tidak hanya kehilangan calon pelanggan, tetapi juga kepercayaan mereka. Website yang lambat terasa tidak profesional dan tidak dapat diandalkan.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-3">Dampak Nyata Kecepatan Website</h3>
      <p class="mb-4">Google secara eksplisit menyatakan bahwa kecepatan situs adalah salah satu faktor peringkat utama untuk hasil pencarian. Mengapa? Karena Google ingin memberikan pengalaman terbaik bagi penggunanya.</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Pengalaman Pengguna (UX):</strong> Studi menunjukkan bahwa 40% pengguna akan meninggalkan situs yang membutuhkan waktu lebih dari 3 detik untuk dimuat. Pengalaman yang mulus dan cepat membuat pengunjung betah.</li>
        <li><strong>Peringkat SEO:</strong> Metrik <a href="https://web.dev/vitals/" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:underline">Core Web Vitals</a> dari Google secara langsung mengukur kecepatan, interaktivitas, dan stabilitas visual. Skor yang baik akan meningkatkan visibilitas Anda.</li>
        <li><strong>Tingkat Konversi:</strong> Bagi situs e-commerce atau layanan, setiap detik penundaan dapat menurunkan tingkat konversi hingga 7%. Kecepatan adalah uang.</li>
      </ul>

      <blockquote class="p-4 my-6 border-l-4 border-cyan-500 bg-slate-800">
        <p class="text-lg italic leading-relaxed text-white">"Desain bukan hanya tentang bagaimana tampilannya. Desain adalah tentang bagaimana ia berfungsi."</p>
        <cite class="block text-right not-italic text-slate-400 mt-2">- Steve Jobs</cite>
      </blockquote>
      
      <p>Sementara kecepatan adalah fondasinya, desain yang menarik adalah fasadnya. Desain yang baik membangun kredibilitas, menyampaikan pesan brand Anda secara efektif, dan memandu pengguna dengan mudah menuju tujuan mereka, baik itu mengisi formulir kontak atau menyelesaikan pembelian.</p>
      <p class="mt-4">Kombinasi keduanya—kecepatan teknis dan keindahan visual—menciptakan pengalaman digital yang kuat dan tak terlupakan.</p>
    `,
  },
  {
    slug: 'panduan-website-bisnis',
    title: 'Panduan Esensial Membangun Website Bisnis yang Efektif',
    summary: 'Dari nol hingga menjadi aset digital. Inilah langkah-langkah penting untuk membangun kehadiran online yang kuat bagi bisnis Anda.',
    publishedDate: '15 Juni 2025',
    // --- PATH GAMBAR DI SINI ---
    imageUrl: 'https://placehold.co/1200x630/1e293b/6366f1/png?text=Website+Bisnis',
    content: `
      <p class="mb-4">Memiliki website bisnis bukan lagi pilihan, melainkan sebuah keharusan strategis. Ini adalah markas digital Anda, pusat dari semua aktivitas pemasaran online, dan etalase yang buka 24/7 untuk pelanggan di seluruh dunia.</p>
      <p class="mb-4">Namun, sekadar 'memiliki' website tidaklah cukup. Website tersebut harus efektif. Berikut adalah panduan esensial yang perlu Anda pertimbangkan.</p>
      
      <h3 class="text-2xl font-bold text-white mt-8 mb-3">Elemen Kunci Website Bisnis yang Sukses</h3>
      <ul class="list-disc list-inside space-y-3 mb-4">
        <li><strong>Tujuan yang Jelas (Goals):</strong> Apa fungsi utama website ini? Menghasilkan prospek (leads)? Menjual produk secara langsung? Atau membangun otoritas brand melalui konten? Tentukan tujuan utama Anda sejak awal.</li>
        <li><strong>Desain Profesional & Responsif:</strong> Tampilan harus mencerminkan identitas brand Anda dan yang terpenting, harus berfungsi sempurna di semua ukuran layar, dari desktop hingga smartphone.</li>
        <li><strong>Konten Berkualitas Tinggi:</strong> "Content is king." Sediakan informasi yang berharga, relevan, dan menjawab pertanyaan target audiens Anda. Ini termasuk halaman layanan, tentang kami, dan blog.</li>
        <li><strong>Navigasi Intuitif:</strong> Struktur menu harus logis. Pengguna harus dapat menemukan apa yang mereka cari dalam maksimal tiga klik.</li>
        <li><strong>Ajakan Bertindak (Call-to-Action - CTA) yang Jelas:</strong> Setiap halaman harus memiliki CTA yang spesifik. Jangan biarkan pengunjung bertanya-tanya, "Apa selanjutnya?". Arahkan mereka dengan tombol seperti "Hubungi Kami", "Lihat Portofolio", atau "Beli Sekarang".</li>
      </ul>

       <pre class="bg-slate-800 rounded-lg p-4 overflow-x-auto my-6 text-sm"><code>&lt;!-- Contoh CTA yang baik --&gt;
&lt;a href="/#contact" class="cta-button"&gt;
  Diskusikan Proyek Anda
&lt;/a&gt;</code></pre>

      <p class="mt-4">Dengan merencanakan elemen-elemen ini secara cermat, website Anda akan bertransformasi dari sekadar brosur online menjadi mesin pemasaran yang bekerja tanpa henti untuk bisnis Anda.</p>
    `,
  },
  {
    slug: 'website-modern-terjangkau',
    title: 'Mitos Biaya: Membangun Website Modern dengan Anggaran Terjangkau',
    summary: 'Bagaimana teknologi modern memungkinkan pembuatan website berkualitas tinggi tanpa harus menguras anggaran.',
    publishedDate: '10 Juni 2025',
    // --- PATH GAMBAR DI SINI ---
    imageUrl: 'https://placehold.co/1200x630/1e293b/f43f5e/png?text=Anggaran+Terjangkau',
    content: `
      <p class="mb-4">"Website berkualitas pasti mahal." Ini adalah mitos yang sudah usang. Berkat kemajuan ekosistem pengembangan web, kini sangat mungkin untuk mendapatkan situs yang cepat, aman, dan modern secara visual dengan biaya yang jauh lebih efisien daripada beberapa tahun lalu.</p>

      <h3 class="text-2xl font-bold text-white mt-8 mb-3">Teknologi di Balik Efisiensi Biaya</h3>
      <p class="mb-4">Kuncinya terletak pada pemanfaatan alat dan kerangka kerja (framework) yang tepat:</p>
      <ul class="list-disc list-inside space-y-3 mb-4">
        <li><strong>Framework Modern (seperti Next.js):</strong> Menggunakan Next.js memungkinkan pengembangan yang lebih cepat karena banyak fitur kompleks (seperti routing dan optimasi gambar) sudah ditangani secara default.</li>
        <li><strong>Styling Utility-First (seperti Tailwind CSS):</strong> Daripada menulis CSS dari nol, Tailwind menyediakan "blok bangunan" kelas-kelas kecil yang mempercepat proses desain secara dramatis tanpa mengorbankan kustomisasi.</li>
        <li><strong>Static Site Generation (SSG):</strong> Teknologi ini membuat versi HTML statis dari halaman Anda saat proses build. Hasilnya adalah website yang sangat cepat dimuat dan lebih murah untuk di-hosting karena tidak memerlukan server yang kompleks.</li>
        <li><strong>Platform Hosting Canggih (seperti Vercel):</strong> Platform seperti Vercel (tempat situs ini di-hosting) menawarkan paket gratis yang sangat kuat dan terintegrasi langsung dengan GitHub, mengotomatiskan proses deployment dan mengurangi biaya operasional.</li>
      </ul>

      <blockquote class="p-4 my-6 border-l-4 border-cyan-500 bg-slate-800">
        <p class="text-lg italic leading-relaxed text-white">Fokus pada 'nilai', bukan 'biaya'. Website yang efektif adalah investasi, bukan pengeluaran. Dengan teknologi yang tepat, nilai yang Anda dapatkan bisa jauh melampaui biayanya.</p>
      </blockquote>
      
      <p class="mt-4">Jadi, jangan biarkan asumsi biaya menghalangi Anda untuk memiliki kehadiran online yang profesional. Dengan pendekatan yang cerdas, website impian Anda lebih terjangkau dari yang Anda kira.</p>
    `,
  },
];