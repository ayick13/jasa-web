const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

// Fungsi untuk memeriksa apakah artikel dengan slug tertentu sudah ada
async function isArticleExists(slug) {
const blogDir = path.join(__dirname, '_articles');
const filePath = path.join(blogDir, `${slug}.md`);
  return fsSync.existsSync(filePath);
}

// Fungsi untuk menghasilkan konten artikel via Pollinations AI (dengan token)
async function generateArticleContent(topic) {
  try {
    // --- BLOK INI UNTUK VARIASI AGAR TIDAK MONOTON ---
    const personas = [
      "penulis artikel teknis ahli yang fokus pada detail implementasi",
      "seorang mentor developer yang menjelaskan konsep sulit dengan cara yang mudah dipahami",
      "jurnalis teknologi yang melaporkan tren terbaru dengan sudut pandang yang menarik",
      "seorang arsitek software yang membagikan best practice dalam pengembangan",
      "blogger teknologi yang antusias dan menggunakan gaya bahasa yang santai",
        "pengembang web yang berpengalaman dan selalu update dengan teknologi terbaru",
        "seorang pendidik yang mengajarkan konsep-konsep kompleks dengan analogi sederhana",
        "seorang peneliti yang membahas inovasi terbaru dalam teknologi dan dampaknya",
    ];

    const writingStyles = [
      "dengan menyertakan contoh kode praktis dalam blok markdown.",
      "dengan menggunakan analogi dari kehidupan sehari-hari untuk menjelaskan poin-poin utama.",
      "dengan format listicle (poin-poin bernomor) agar mudah dibaca.",
      "dengan fokus pada keuntungan dan kerugian dari setiap teknologi yang dibahas.",
      "dengan gaya penulisan tanya jawab (Q&A) untuk menjawab pertanyaan umum.",
      "dengan menyertakan kutipan dari ahli atau referensi terpercaya untuk mendukung argumen.",
      "dengan fokus pada studi kasus nyata yang relevan dengan topik.",
    ];

    // Pilih persona dan gaya secara acak
    const randomPersona = personas[Math.floor(Math.random() * personas.length)];
    const randomStyle = writingStyles[Math.floor(Math.random() * writingStyles.length)];
    // --- AKHIR BLOK TAMBAHAN ---

    const apiUrl = "https://text.pollinations.ai/openai";
    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      throw new Error("POLLINATIONS_TEXT_API_TOKEN tidak ditemukan di environment variables");
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
            // --- UBAH BARIS INI ---
            content: `Kamu adalah ${randomPersona}. Selalu tulis artikel dengan struktur: Introduction, 3-4 subjudul (dengan ###), dan Conclusion.`
          },
          {
            role: "user",
            // --- UBAH BARIS INI ---
            content: `Buat artikel tentang: ${topic}, ${randomStyle}`
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

// Fungsi untuk menghasilkan gambar cover (ditingkatkan)
async function generateArticleImage(topic, slug) {
  try {
    const imagePrompt = `Cover artikel tentang ${topic}, desain modern, high resolution, web banner,风格 ${
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
async function createArticle(topic) {
  try {
    // Persiapkan metadata
    const title = topic;
    const slug = title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, ''); // Bersihkan karakter khusus
    const publishedDate = new Date().toISOString().split('T')[0];

    // Cek duplikasi artikel
    if (await isArticleExists(slug)) {
      throw new Error(`Artikel dengan slug "${slug}" sudah ada`);
    }

    // Generate konten
    console.log(`Membuat konten untuk: ${title}...`);
    const content = await generateArticleContent(topic);
    if (!content || content.length < 500) {
      throw new Error("Konten artikel terlalu pendek atau tidak valid");
    }

    // Generate gambar
    console.log(`Membuat gambar untuk: ${title}...`);
    const imageUrl = await generateArticleImage(topic, slug);

    // Buat summary yang aman untuk YAML
    const rawSummary = content.substring(0, 150).replace(/\n/g, ' ');
    const safeSummary = rawSummary.replace(/["']/g, "'").trim() + (content.length > 150 ? '...' : '');

    // Tentukan kategori dinamis berdasarkan topik
    const category = topic.includes("AI") ? "AI, Teknologi" :
                     topic.includes("Web") ? "Pengembangan Web, Teknologi" :
                     "Teknologi, Pemrograman";
    if (!category) {
      throw new Error("Kategori tidak ditemukan untuk topik ini");
    }
    console.log(`Kategori: ${category}`);

    // Format markdown (sesuai contoh artikel)
    const mdContent = `---
slug: '${slug}'
title: '${title}'
summary: '${safeSummary}'
publishedDate: '${publishedDate}'
imageUrl: '${imageUrl}'
category: '${category}'
author: 'Arif Tirtana'
tags: ['${topic}']
---

${content}
`;

    // Simpan file
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

// Daftar topik (ditingkatkan variasinya)
const topics = [
  "Cara Mengoptimalkan Performance Next.js dengan AI",
  "Panduan Praktis Tailwind CSS untuk Desain Responsif",
  "Integrasi AI dalam Pengembangan Web Modern: Kasus Nyata",
  "Serverless Architecture: Keuntungan dan Cara Implementasinya",
  "Tren Aplikasi Mobile 2025: Dari Native ke Cross-Platform",
  "GraphQL vs REST: Kapan Harus Memilih Masing-Masing",
  "TypeScript untuk Pemula: Mengurangi Error dalam Kode",
  "WebSockets: Membangun Aplikasi Real-Time yang Handal",
  "SEO untuk E-Commerce: Strategi Peningkatan Visibilitas",
  "Docker untuk Pengembangan: Cara Memudahkan Deployment",
  "Progressive Web Apps (PWA): Menggabungkan Kelebihan Web dan Mobile",
  "Microservices: Arsitektur untuk Skalabilitas Bisnis",
  "RESTful API dengan Node.js: Best Practices",
  "Debugging Web: Tools dan Teknik Profesional",
  "Manajemen State di React: Redux vs Context API",
  "Cloud Computing untuk Pengembang: Pilihan Layanan Terbaik",
  "Keamanan Web: Praktik Terbaik untuk Melindungi Aplikasi",
  "Membangun Aplikasi Real-Time dengan Socket.IO",
];

// Pilih topik acak dan jalankan
(async () => {
  // Coba 3x jika artikel duplikat
  for (let attempt = 1; attempt <= 3; attempt++) {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const result = await createArticle(randomTopic);
    if (result.success) break;
    
    if (attempt === 3) {
      console.error("Gagal membuat artikel setelah 3 percobaan");
    }
  }
})();