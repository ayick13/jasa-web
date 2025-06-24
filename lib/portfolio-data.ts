export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string; // Ini adalah konten utama proyek
  technologies: string[];
  imageUrl: string;
  liveUrl: string; // Ini adalah URL proyek live
  githubUrl?: string; // PERBAIKAN: Tambahkan properti githubUrl sebagai opsional
}

export const portfolioProjects: Project[] = [
  {
    slug: 'app-magai-co',
    title: 'app.magai.co',
    category: 'Web AI',
    summary: 'Proyek pengembangan web AI di mana saya berpartisipasi dalam tim selama 4-5 bulan pada tahun 2023.',
    description: `
      <p>Proyek app.magai.co adalah sebuah platform web AI inovatif. Selama 4-5 bulan di tahun 2023, saya berkolaborasi dengan tim untuk mengembangkan berbagai fitur dan fungsionalitas AI pada platform ini. Kontribusi saya mencakup pengembangan bagian frontend dan integrasi API untuk layanan AI, memastikan pengalaman pengguna yang mulus dan responsif.</p>
      <p class="mt-4">Proyek ini berfokus pada pemanfaatan kecerdasan buatan untuk menyediakan solusi web yang cerdas, seperti analisis data, otomatisasi, dan interaksi pengguna yang ditingkatkan. Pengalaman ini memperdalam pemahaman saya tentang arsitektur aplikasi AI dan pengembangan web berskala besar.</p>
    `,
    technologies: ['AI', 'Next.js', 'React', 'TypeScript', 'API Integration'],
    imageUrl: 'https://image.pollinations.ai/prompt/A%20sleek%20and%20futuristic%20web%20interface%20displaying%20AI%20elements%20like%20neural%20networks%20and%20data%20visualizations,%20with%20a%20modern%20minimalist%20design%20and%20glowing%20blue%20accents.?nologo=true&referrer=ariftirtana.my.id',
    liveUrl: 'https://app.magai.co',
  },
  {
    slug: 'dzine-ai',
    title: 'dzine.ai',
    category: 'Web AI',
    summary: 'Berpartisipasi dalam fase wireframe dan desain UI/UX untuk platform web AI dzine.ai.',
    description: `
      <p>Dalam proyek dzine.ai, saya berfokus pada tahap awal pengembangan, yaitu wireframing dan desain UI/UX. Tujuan utama adalah menciptakan antarmuka yang intuitif dan menarik bagi pengguna, memastikan pengalaman yang lancar saat berinteraksi dengan fitur-fitur AI yang canggih.</p>
      <p class="mt-4">Kontribusi saya meliputi pembuatan sketsa kasar (wireframe) untuk struktur halaman, alur pengguna (user flow), dan prototipe interaktif. Saya juga merancang elemen visual seperti tata letak, tipografi, skema warna, dan ikonografi untuk memastikan konsistensi merek dan daya tarik visual. Fokus utama adalah pada kemudahan penggunaan dan estetika yang modern untuk aplikasi berbasis AI.</p>
    `,
    technologies: ['UI/UX Design', 'Wireframing', 'Figma', 'Web Design', 'AI'],
    imageUrl: 'https://image.pollinations.ai/prompt/A%20futuristic%20and%20minimalist%20AI%20design%20studio%20interface%20with%20clean%20lines,%20soft%20gradients,%20and%20interactive%20elements.%20Focus%20on%20intuitive%20layout%20and%20modern%20typography.?nologo=true&referrer=ariftirtana.my.id',
    liveUrl: 'https://dzine.ai',
  },
  {
    slug: 'waffledan-ecommerce',
    title: 'Waffledan F&B E-Commerce',
    category: 'E-Commerce',
    summary: 'Membangun platform e-commerce yang modern dan berfokus pada konversi untuk brand F&B, Waffledan.',
    description: `
      <p>Waffledan membutuhkan sebuah platform digital untuk menjangkau pasar yang lebih luas dan mempermudah proses pemesanan. Tantangannya adalah menciptakan pengalaman belanja yang cepat, menarik, dan mudah digunakan.</p>
      <p class="mt-4">Solusi yang dihadirkan adalah website e-commerce yang dibangun dengan Next.js untuk performa maksimal. Desain UI/UX dibuat bersih dan modern, menonjolkan visual produk waffle yang menggugah selera. Fitur utama meliputi katalog produk, keranjang belanja, dan integrasi pembayaran online yang aman.</p>
    `,
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'E-Commerce'],
    imageUrl: '/images/blog/waffledan.png',
    liveUrl: 'https://waffledan.co.id',
    // githubUrl: 'https://github.com/your-repo-link', // Contoh jika ada GitHub link
  },
  {
    slug: 'ruangriung-ai-image-generator',
    title: 'RuangRiung AI Image Generator',
    category: 'Aplikasi Web / AI',
    summary: 'Aplikasi web inovatif yang berfungsi sebagai AI media generator, terintegrasi dengan Pollinations API untuk membuat gambar, audio, dan video.',
    description: `
      <p>Proyek RuangRiung dikembangkan sebagai sebuah tools kreatif berbasis AI. Tujuannya adalah untuk menyediakan antarmuka yang sederhana dan cepat bagi pengguna untuk berinteraksi dengan model AI yang kompleks tanpa perlu pengetahuan teknis.</p>
      <p class="mt-4">Dengan frontend yang dibangun menggunakan HTML, CSS, dan JavaScript, aplikasi ini terhubung langsung ke Pollinations API. Fitur utamanya meliputi Text-to-Image, Text-to-Audio, dan pembuatan prompt video. Proyek ini menunjukkan kemampuan dalam integrasi API pihak ketiga dan membangun aplikasi yang fungsional untuk kebutuhan kreatif.</p>
    `,
    technologies: ['HTML', 'JavaScript', 'API Integration', 'AI', 'Pollinations'],
    imageUrl: '/images/blog/ruangriung.png',
    liveUrl: 'https://ruangriung.my.id',
    // githubUrl: 'https://github.com/your-repo-link',
  },
  {
    slug: 'rasyifa-nusantara-group',
    title: 'Rasyifa Nusantara Group',
    category: 'Company Profile',
    summary: 'Membangun citra korporat yang kuat melalui website company profile yang elegan dan profesional.',
    description: `
      <p>Sebagai sebuah grup bisnis multi-bidang, Rasyifa Nusantara Group memerlukan sebuah wajah digital yang mampu merepresentasikan semua unit bisnisnya secara kohesif dan profesional. Tujuannya adalah membangun kepercayaan di mata mitra dan calon klien.</p>
      <p class="mt-4">Website ini dirancang dengan palet warna korporat dan tata letak yang bersih untuk memancarkan citra elegan dan terpercaya. Setiap layanan dan unit bisnis dijelaskan secara detail. Desain yang responsif memastikan pengalaman yang optimal bagi pengguna desktop maupun mobile yang mengakses informasi perusahaan.</p>
    `,
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'Corporate Design'],
    imageUrl: '/images/blog/logo-rasyifa.png',
    liveUrl: 'https://rasyifanusantaragroup.com',
  },
  {
    slug: 'cs-fire-fighter',
    title: 'CS Fire Fighter',
    category: 'Company Profile',
    summary: 'Website fungsional yang menonjolkan keandalan dan keamanan untuk penyedia peralatan pemadam kebakaran.',
    description: `
      <p>CS Fire Fighter bergerak di industri yang krusial dimana kepercayaan dan keandalan adalah segalanya. Website mereka harus mencerminkan nilai-nilai ini, dengan fokus pada penyajian informasi produk dan layanan yang jelas dan mudah diakses.</p>
      <p class="mt-4">Dengan desain yang tegas dan palet warna yang sesuai dengan industri keamanan, website ini menonjolkan katalog produk peralatan pemadam yang terstruktur. Informasi teknis dan sertifikasi produk disajikan dengan jelas untuk membangun kepercayaan. Tujuannya adalah menjadi sumber informasi utama bagi klien yang mencari solusi keselamatan kebakaran.</p>
    `,
    technologies: ['WordPress', 'Elementor', 'Product Catalog'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/f43f5e/png?text=CS+Fire+Fighter',
    liveUrl: 'https://csfirefighter.com',
  },
  {
    slug: 'squad-image-creator-bing-ai',
    title: 'Squad Image Creator Bing AI',
    category: 'Aplikasi Web / AI',
    summary: 'Aplikasi AI multifungsi yang menyediakan layanan translator dan generator media, dibangun dengan integrasi Pollinations API.',
    description: `
      <p>Proyek SICBA adalah sebuah demonstrasi kekuatan integrasi API untuk menciptakan tools AI yang bermanfaat. Dibangun dengan frontend sederhana, aplikasi ini memberikan akses langsung ke beberapa model AI melalui satu antarmuka.</p>
      <p class="mt-4">Fungsionalitas utamanya adalah sebagai penerjemah multi-bahasa dan generator media (gambar dan audio). Backend sederhana berfungsi sebagai jembatan yang aman untuk menghubungkan permintaan pengguna ke API key dari Pollinations, menunjukkan kemampuan untuk membangun aplikasi yang cepat dan ringan untuk tugas-tugas spesifik.</p>
    `,
    technologies: ['HTML', 'JavaScript', 'API Integration', 'AI', 'Translator'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/14b8a6/png?text=AI+Image+Generator',
    liveUrl: 'https://sicba.my.id',
    // githubUrl: 'https://github.com/your-repo-link',
  },
];
