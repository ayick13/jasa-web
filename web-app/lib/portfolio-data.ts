export interface Project {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl: string;
}

export const portfolioProjects: Project[] = [
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
    imageUrl: 'https://placehold.co/1200x800/1e293b/93c5fd/png?text=Waffledan',
    liveUrl: 'https://waffledan.co.id',
  },
  {
    slug: 'ai-media-generator',
    title: 'AI Media Generator Suite',
    category: 'Aplikasi Web / AI',
    summary: 'Aplikasi web inovatif yang berfungsi sebagai AI media generator, terintegrasi dengan Pollinations API untuk membuat gambar, audio, dan video.',
    description: `
      <p>Proyek ini (sebelumnya Ruang Riung) dikembangkan sebagai sebuah tools kreatif berbasis AI. Tujuannya adalah untuk menyediakan antarmuka yang sederhana dan cepat bagi pengguna untuk berinteraksi dengan model AI yang kompleks tanpa perlu pengetahuan teknis.</p>
      <p class="mt-4">Dengan frontend yang dibangun menggunakan HTML, CSS, dan JavaScript, aplikasi ini terhubung langsung ke Pollinations API. Fitur utamanya meliputi Text-to-Image, Text-to-Audio, dan pembuatan prompt video. Proyek ini menunjukkan kemampuan dalam integrasi API pihak ketiga dan membangun aplikasi yang fungsional untuk kebutuhan kreatif.</p>
    `,
    technologies: ['HTML', 'JavaScript', 'API Integration', 'AI', 'Pollinations'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/6366f1/png?text=AI+Generator',
    liveUrl: 'https://ruangriung.my.id',
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
    imageUrl: 'https://placehold.co/1200x800/1e293b/a855f7/png?text=Rasyifa+Group',
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
    slug: 'multi-language-ai-tool',
    title: 'Multi-Language AI Tool',
    category: 'Aplikasi Web / AI',
    summary: 'Aplikasi AI multifungsi yang menyediakan layanan translator dan generator media, dibangun dengan integrasi Pollinations API.',
    description: `
      <p>Proyek ini (sebelumnya SICBA) adalah sebuah demonstrasi kekuatan integrasi API untuk menciptakan tools AI yang bermanfaat. Dibangun dengan frontend sederhana, aplikasi ini memberikan akses langsung ke beberapa model AI melalui satu antarmuka.</p>
      <p class="mt-4">Fungsionalitas utamanya adalah sebagai penerjemah multi-bahasa dan generator media (gambar dan audio). Backend sederhana berfungsi sebagai jembatan yang aman untuk menghubungkan permintaan pengguna ke API key dari Pollinations, menunjukkan kemampuan untuk membangun aplikasi yang cepat dan ringan untuk tugas-tugas spesifik.</p>
    `,
    technologies: ['HTML', 'JavaScript', 'API Integration', 'AI', 'Translator'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/14b8a6/png?text=AI+Translator',
    liveUrl: 'https://sicba.my.id',
  },
];
