const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// --- KUMPULAN TOPIK BERDASARKAN KATEGORI ---
const topicsByCategory = {
  "Pengembangan Web": [
    "Cara Mengoptimalkan Performance Next.js dengan AI",
    "Panduan Praktis Tailwind CSS untuk Desain Responsif",
    "Serverless Architecture: Keuntungan dan Cara Implementasinya",
    "WebSockets: Membangun Aplikasi Real-Time yang Handal",
    "Progressive Web Apps (PWA): Menggabungkan Kelebihan Web dan Mobile",
    "Wordpress untuk E-Commerce: Tips dan Trik",
    "Membangun API dengan Node.js dan Express: Panduan Lengkap",
    "GraphQL vs REST: Kapan Harus Memilih Masing-Masing",
    "TypeScript untuk Pemula: Mengurangi Error dalam Kode",
    "Docker untuk Pengembangan: Cara Memudahkan Deployment",
    "Manajemen State di React: Redux vs Context API",
    "RESTful API dengan Node.js: Best Practices",
  ],
  "AI & Teknologi": [
    "Integrasi AI dalam Pengembangan Web Modern: Kasus Nyata",
    "Tren Aplikasi Mobile 2025: Dari Native ke Cross-Platform",
    "Microservices: Arsitektur untuk Skalabilitas Bisnis",
    "Wordpress blog untuk SEO: Cara Meningkatkan Visibilitas",
    "Cloud Computing untuk Pengembang: Pilihan Layanan Terbaik",
    "Keamanan Web: Praktik Terbaik untuk Melindungi Aplikasi",
  ],
  "Mobile Development": [
    "Flutter vs React Native: Mana yang Lebih Baik untuk Proyek Anda?",
    "Membangun Aplikasi Mobile dengan Ionic: Panduan Lengkap",
    "Kotlin untuk Android: Tips dan Trik untuk Pengembang",
  ],
  "E-Commerce": [
    "SEO untuk E-Commerce: Strategi Peningkatan Visibilitas",
    "Debugging Web: Tools dan Teknik Profesional",
    "Membangun Aplikasi Real-Time dengan Socket.IO",
    "Menerapkan Pembayaran Online di Aplikasi E-Commerce",
    "Menerapkan Sistem Rekomendasi di Aplikasi E-Commerce",
    "Menerapkan Sistem Manajemen Inventaris di Aplikasi E-Commerce",
    "Menerapkan Sistem Pengiriman di Aplikasi E-Commerce",
  ],
  "Data Science & AI": [
    "Machine Learning untuk Pengembang Web: Panduan Awal",
    "Deep Learning dengan TensorFlow.js: Langkah Pertama",
    "Natural Language Processing (NLP) untuk Aplikasi Web",
    "Computer Vision dengan OpenCV.js: Membangun Aplikasi Cerdas",
    "AI dalam Pengembangan Web: Tren dan Teknologi Terkini",
    "Membangun Chatbot dengan Dialogflow dan Node.js",
    "Rekomendasi Produk dengan Machine Learning: Studi Kasus",
    "Analisis Data Besar dengan Apache Spark dan Node.js",
    "Visualisasi Data dengan D3.js: Panduan Lengkap",
    "Membangun Sistem Rekomendasi dengan Python dan Flask",
    "Pengolahan Gambar dengan TensorFlow.js: Aplikasi Praktis",
    "Membangun Aplikasi AI dengan Python: Panduan untuk Pengembang Web",
    "Menerapkan AI dalam Pengembangan Web: Studi Kasus Nyata",
    "Membangun Aplikasi AI dengan React dan TensorFlow.js",
    "Menerapkan Deep Learning dalam Aplikasi Web: Panduan Praktis",
    "Membangun Aplikasi AI dengan Python dan Flask: Panduan Lengkap",
    "Menerapkan Machine Learning dalam Aplikasi Web: Studi Kasus",  
  ],
  "DevOps & Infrastruktur": [
    "CI/CD untuk Pengembang Web: Praktik Terbaik",
    "Docker untuk Pengembangan: Cara Memudahkan Deployment",
    "Kubernetes untuk Pengembang: Panduan Awal",
    "Monitoring Aplikasi Web dengan Prometheus dan Grafana",
    "Pengelolaan Infrastruktur dengan Terraform: Panduan Lengkap",
    "Serverless Architecture: Keuntungan dan Cara Implementasinya",
  ],
  "UI/UX Design": [
    "Desain Responsif dengan Tailwind CSS: Panduan Praktis",
    "Membuat Prototipe Interaktif dengan Figma: Tips dan Trik",
    "Desain Antarmuka Pengguna yang Efektif: Prinsip dan Praktik",
    "Menerapkan Desain Material di Aplikasi Web: Panduan Lengkap",
    "Desain UI/UX untuk Aplikasi Mobile: Tips dan Trik",
    "Menerapkan Prinsip Desain Universal dalam Aplikasi Web",
    "Desain Antarmuka Pengguna yang Efektif: Prinsip dan Praktik",
    "Menerapkan Desain Responsif di Aplikasi Web: Panduan Praktis",
  ],
  "Monetisasi & Bisnis": [
    "Monetisasi Aplikasi Web: Strategi dan Model Bisnis",
    "Membangun Aplikasi Berbasis Langganan: Panduan untuk Pengembang",
    "Crowdfunding untuk Proyek Teknologi: Cara Memulai", 
    "Membangun Komunitas Pengguna: Strategi untuk Aplikasi Web",
    "Menerapkan Model Freemium dalam Aplikasi Web: Tips dan Trik",
    "Membangun Aplikasi Berbasis Iklan: Panduan untuk Pengembang",
    "Menerapkan Model Bisnis Berlangganan di Aplikasi Web: Panduan Lengkap",
    "Membangun Aplikasi Berbasis Donasi: Cara Memulai", 
    "Menerapkan Model Bisnis Berbasis Iklan di Aplikasi Web: Tips dan Trik",
  ],
  "Next.js & React": [
    "Next.js untuk Pemula: Panduan Lengkap", 
    "Membangun Aplikasi Web dengan React: Tips dan Trik",
    "State Management di React: Redux vs Context API",
    "Optimasi Kinerja Aplikasi React: Teknik dan Alat",
    "Menerapkan Server-Side Rendering di Next.js: Panduan Praktis",
    "Membangun Aplikasi Web dengan Next.js: Panduan untuk Pengembang",
    "Menerapkan Static Site Generation di Next.js: Panduan Lengkap",
    "Menerapkan Incremental Static Regeneration di Next.js: Tips dan Trik",
    "Menerapkan API Routes di Next.js: Panduan Praktis",
    "Menerapkan Middleware di Next.js: Panduan Lengkap",
    "Menerapkan Internationalization di Next.js: Panduan untuk Pengembang",
    "Menerapkan Image Optimization di Next.js: Panduan Praktis",
    "Menerapkan Authentication di Next.js: Panduan Lengkap",
    "Menerapkan Deployment di Next.js: Panduan untuk Pengembang",
    "Menerapkan SEO di Next.js: Panduan Praktis",
  ],
  "SEO & Pemasaran Digital": [
      "SEO untuk E-Commerce: Strategi Peningkatan Visibilitas",
      "Debugging Web: Tools dan Teknik Profesional",
      "Membangun Aplikasi Real-Time dengan Socket.IO",
  ]
};

// Fungsi untuk memeriksa apakah artikel dengan slug tertentu sudah ada
async function isArticleExists(slug) {
  const blogDir = path.join(__dirname, '_articles');
  const filePath = path.join(blogDir, `${slug}.md`);
  return fsSync.existsSync(filePath);
}

// Fungsi untuk menghasilkan konten artikel (dibuat lebih fleksibel)
async function generateArticleContent(topic) {
  try {
    const personas = [
      "penulis artikel teknis ahli yang fokus pada detail implementasi",
      "seorang mentor developer yang menjelaskan konsep sulit dengan cara yang mudah dipahami",
      "jurnalis teknologi yang melaporkan tren terbaru dengan sudut pandang yang menarik",
      "pengembang web berpengalaman yang berbagi tips praktis dan studi kasus",
      "seorang ahli UX/UI yang menjelaskan pentingnya desain dalam pengembangan web",
    ];

    const writingStyles = [
      "dengan menyertakan contoh kode praktis dalam blok markdown.",
      "dengan menggunakan analogi dari kehidupan sehari-hari.",
      "dengan format listicle agar mudah dibaca.",
      "dengan nada yang santai dan mudah dipahami.",
      "dengan fokus pada aspek teknis dan implementasi.",
      "dengan pendekatan yang berbasis data dan statistik.",
      "dengan menyertakan wawancara dengan ahli di bidangnya.",
      "dengan menyertakan kutipan dari sumber terpercaya.",
      "dengan menyertakan grafik atau diagram untuk visualisasi.",
    ];
    
    const promptVariations = [
      `Tulis sebuah panduan mendalam tentang: ${topic}.`,
      `Bandingkan kelebihan dan kekurangan dari: ${topic}.`,
      `Jelaskan konsep ${topic} untuk pemula.`,
      `Tulis sebuah artikel yang membahas tren terbaru dalam: ${topic}.`,
      `Buat sebuah tutorial langkah-demi-langkah tentang: ${topic}.`,
      `Tulis sebuah artikel opini tentang: ${topic}.`,
      `Diskusikan tantangan dan solusi dalam: ${topic}.`,
      `Tulis sebuah studi kasus tentang implementasi ${topic} di industri.`,
      `Buat sebuah artikel yang membahas dampak ${topic} terhadap industri teknologi.`,
      `Tulis sebuah artikel yang menjelaskan bagaimana ${topic} dapat meningkatkan efisiensi pengembangan.`,
      `Tulis sebuah artikel yang membahas bagaimana ${topic} dapat membantu dalam pengambilan keputusan bisnis.`,
      `Tulis sebuah artikel yang membahas bagaimana ${topic} dapat meningkatkan pengalaman pengguna.`,
    ];

    const articleStructures = [
        "Introduction, 3-4 subjudul (dengan ###), dan Conclusion.",
        "sebuah artikel opini dengan pendahuluan yang kuat, argumen utama, dan kesimpulan.",
        "sebuah tutorial langkah-demi-langkah dengan bagian 'Persiapan' dan 'Langkah-langkah Implementasi'.",
        "sebuah panduan lengkap dengan bagian 'Apa itu', 'Mengapa Penting', dan 'Cara Implementasi'.",
        "sebuah artikel yang membahas sejarah dan evolusi topik, dengan subjudul yang menjelaskan setiap fase penting.",
        "sebuah artikel yang membahas dampak teknologi terhadap industri, dengan subjudul yang menjelaskan setiap aspek penting.",
        "sebuah artikel yang membahas tantangan dan solusi dalam pengembangan web, dengan subjudul yang menjelaskan setiap aspek penting.",
        "sebuah artikel yang membahas bagaimana teknologi dapat meningkatkan produktivitas, dengan subjudul yang menjelaskan setiap aspek penting.",
        "sebuah artikel yang membahas bagaimana teknologi dapat membantu dalam pengambilan keputusan bisnis, dengan subjudul yang menjelaskan setiap aspek penting.",
        "sebuah artikel yang membahas bagaimana teknologi dapat meningkatkan pengalaman pengguna, dengan subjudul yang menjelaskan setiap aspek penting.",
    ];

    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    const randomStyle = writingStyles[Math.floor(Math.random() * writingStyles.length)];
    const randomPrompt = promptVariations[Math.floor(Math.random() * promptVariations.length)];
    const randomStructure = articleStructures[Math.floor(Math.random() * articleStructures.length)];

    const apiUrl = "https://text.pollinations.ai/openai";
    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      throw new Error("POLLINATIONS_TEXT_API_TOKEN tidak ditemukan");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}`
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content: `Kamu adalah ${randomPersona}. Tulis artikel dengan struktur: ${randomStructure}`
          },
          {
            role: "user",
            content: `${randomPrompt} ${randomStyle}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch ke Pollinations AI: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error generate konten:", error.message);
    throw new Error(`❌ Gagal membuat artikel: ${error.message}`);
  }
}

// Fungsi untuk menghasilkan gambar cover
async function generateArticleImage(topic, slug) {
  try {
    const imagePrompt = `Cover artikel tentang ${topic}, desain modern, ilustasi, high resolution, web banner, tanpa text, ${
      topic.includes("AI") ? "futuristik" : 
      topic.includes("Web") ? "teknis dan clean" : "profesional"
    }`;
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=flux&nologo=true&seed=${Math.floor(Math.random() * 10000)}`;

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Gagal mengambil gambar (${response.status})`);
    
    const imageDir = path.join(__dirname, 'public', 'images', 'blog');
    if (!fsSync.existsSync(imageDir)) {
      fsSync.mkdirSync(imageDir, { recursive: true });
    }

    const imagePath = path.join(imageDir, `${slug}.png`);
    const buffer = await response.buffer();
    await fs.writeFile(imagePath, buffer);

    return `/images/blog/${slug}.png`;
  } catch (error) {
    console.error("Error gambar:", error.message);
    throw error;
  }
}

// Fungsi utama untuk membuat artikel
async function createArticle(topic, category) {
  try {
    const title = topic;
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
    const publishedDate = new Date().toISOString().split('T')[0];

    if (await isArticleExists(slug)) {
      console.log(`🟡 Artikel dengan slug "${slug}" sudah ada. Melanjutkan ke topik lain.`);
      return { success: false, error: 'duplicate' }; // Memberikan status duplikat
    }

    console.log(`Membuat konten untuk: ${title}...`);
    let content = await generateArticleContent(topic);
    if (!content || content.length < 300) {
      throw new Error("Konten artikel terlalu pendek atau tidak valid");
    }

    // Membersihkan konten dari baris --- yang mungkin muncul
    content = content.replace(/^\s*---\s*$/gm, '');

    console.log(`Membuat gambar untuk: ${title}...`);
    const imageUrl = await generateArticleImage(topic, slug);

    const rawSummary = content.substring(0, 150).replace(/\n/g, ' ');
    const safeSummary = rawSummary.replace(/["':]/g, "").trim() + (content.length > 150 ? '...' : '');

    console.log(`Kategori: ${category}`);
    const tags = `${topic.split(' ')[0]}, ${category}`;

    // ✨ --- PERBAIKAN FORMAT YAML --- ✨
    // Pastikan tidak ada spasi di awal setiap baris metadata
    const mdContent = `---
slug: '${slug}'
title: '${title}'
summary: '${safeSummary}'
publishedDate: '${publishedDate}'
imageUrl: '${imageUrl}'
category: '${category}'
author: 'Arif Tirtana'
tags: '${tags}'
---

${content}
`;
    // --- AKHIR PERBAIKAN ---

    const blogDir = path.join(__dirname, '_articles');
    if (!fsSync.existsSync(blogDir)) {
      fsSync.mkdirSync(blogDir, { recursive: true });
    }
    const mdPath = path.join(blogDir, `${slug}.md`);
    await fs.writeFile(mdPath, mdContent);

    console.log(`✅ Artikel berhasil dibuat: ${mdPath}`);
    return { success: true, slug };
  } catch (error) {
    console.error(`❌ Gagal membuat artikel: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Blok eksekusi utama
(async () => {
  let createdCount = 0;
  const maxAttempts = 10; // Coba hingga 10 kali untuk memastikan artikel dibuat
  for (let attempt = 1; attempt <= maxAttempts && createdCount < 1; attempt++) {
    const allCategories = Object.keys(topicsByCategory);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    
    const topicsInCategory = topicsByCategory[randomCategory];
    const randomTopic = topicsInCategory[Math.floor(Math.random() * topicsInCategory.length)];

    console.log(`\n--- Percobaan ${attempt} ---`);
    console.log(`Memilih topik "${randomTopic}" dari kategori "${randomCategory}"`);

    const result = await createArticle(randomTopic, randomCategory);
    
    if (result.success) {
        createdCount++;
        console.log("--------------------------\n");
    } else if (result.error !== 'duplicate') {
        // Jika gagal bukan karena duplikat, tunggu sebentar sebelum mencoba lagi
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    if (attempt === maxAttempts && createdCount === 0) {
      console.error("Gagal membuat artikel baru setelah beberapa percobaan.");
    }
  }
})();