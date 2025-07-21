const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Fungsi untuk memeriksa apakah artikel dengan slug tertentu sudah ada
async function isArticleExists(slug) {
  const blogDir = path.join(__dirname, 'content', 'blog');
  const filePath = path.join(blogDir, `${slug}.md`);
  return fsSync.existsSync(filePath);
}

// Fungsi untuk menghasilkan konten artikel via Pollinations AI (dengan token)
async function generateArticleContent(topic) {
  try {
    const apiUrl = "https://text.pollinations.ai/openai";
    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      throw new Error("POLLINATIONS_TEXT_API_TOKEN tidak ditemukan di environment variables");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}` // Gunakan token seperti route lain
      },
      body: JSON.stringify({
        model: "openai",
        messages: [
          {
            role: "system",
            content: "Kamu adalah penulis artikel teknis ahli. Tulis dengan struktur: Introduction, 3-4 subjudul (dengan ###), dan Conclusion. Panjang 600-800 kata, bahasa Indonesia yang rapi, informatif, dan bebas dari kesalahan grammar."
          },
          {
            role: "user",
            content: `Tulis artikel tentang: ${topic}. Fokus pada teknis dan manfaat praktis.`
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API error (${response.status}): ${errorDetails}`);
    }

    const data = await response.json();
    
    // Validasi struktur respons AI
    if (!data?.choices?.[0]?.message?.content) {
      throw new Error("Respons AI tidak memiliki konten yang valid");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generate konten:", error.message);
    throw error;
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
    if (!content || content.length < 300) {
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

    // Format markdown (sesuai contoh artikel)
    const mdContent = `---
slug: '${slug}'
title: '${title}'
summary: '${safeSummary}'
publishedDate: '${publishedDate}'
imageUrl: '${imageUrl}'
category: '${category}'
author: 'AI Generator'
---

${content}
`;

    // Simpan file
    const blogDir = path.join(__dirname, 'content', 'blog');
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
  "Cloud Computing untuk Pengembang: Pilihan Layanan Terbaik"
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