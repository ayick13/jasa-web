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
    slug: 'ruang-riung-space',
    title: 'Ruang Riung Co-working',
    category: 'Company Profile',
    summary: 'Website informatif dan profesional untuk co-working dan event space, Ruang Riung.',
    description: `
      <p>Ruang Riung bertujuan untuk menjadi pusat bagi para profesional dan komunitas di area mereka. Mereka memerlukan website yang tidak hanya menampilkan fasilitas yang tersedia, tetapi juga memudahkan calon penyewa untuk mendapatkan informasi dan melakukan reservasi.</p>
      <p class="mt-4">Website ini dirancang dengan tampilan yang profesional dan modern untuk menarik target audiens yang tepat. Struktur informasi dibuat jelas, menampilkan detail ruang, fasilitas, paket harga, dan galeri foto. Sebuah formulir kontak dan peta lokasi terintegrasi untuk mempermudah calon klien menghubungi dan mengunjungi lokasi.</p>
    `,
    technologies: ['Next.js', 'React', 'Leaflet.js', 'Company Profile'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/6366f1/png?text=Ruang+Riung',
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
    slug: 'sicba-sistem-informasi',
    title: 'SICBA - Sistem Informasi',
    category: 'Aplikasi Web',
    summary: 'Pengembangan aplikasi web fungsional untuk pendataan dan pengelolaan Sistem Informasi Cagar Budaya.',
    description: `
      <p>Proyek SICBA (Sistem Informasi Cagar Budaya) membutuhkan sebuah aplikasi web yang andal untuk mengelola data yang kompleks. Fokus utamanya adalah fungsionalitas, keamanan data, dan kemudahan akses bagi para penggunanya.</p>
      <p class="mt-4">Aplikasi ini dibangun sebagai sistem yang robust, memungkinkan pengguna untuk melakukan pendataan, pencarian, dan pengelolaan data cagar budaya secara efisien. Desain antarmuka dibuat fungsional dan intuitif agar mudah digunakan oleh operator. Proyek ini menunjukkan keahlian dalam merancang dan membangun aplikasi web yang lebih dari sekadar halaman informasi, melainkan sebuah alat kerja digital.</p>
    `,
    technologies: ['PHP', 'CodeIgniter', 'MySQL', 'Web Application'],
    imageUrl: 'https://placehold.co/1200x800/1e293b/14b8a6/png?text=SICBA',
    liveUrl: 'https://sicba.my.id',
  },
];
