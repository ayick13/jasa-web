const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Fungsi untuk memeriksa apakah artikel dengan slug tertentu sudah ada
async function isArticleExists(slug) {
  const blogDir = path.join(__dirname, '_articles');
  const filePath = path.join(blogDir, `${slug}.md`);
  return fsSync.existsSync(filePath);
}

// Fungsi baru untuk menghasilkan topik menggunakan AI dalam bahasa Indonesia
async function generateTopicsFromAI(baseCategory = "Pengembangan Web, AI, dan Teknologi Terbaru") {
  try {
    const apiUrl = "https://text.pollinations.ai/openai";
    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      throw new Error("POLLINATIONS_TEXT_API_TOKEN tidak ditemukan");
    }

    // Perubahan di sini: Menambahkan "dalam bahasa Indonesia" ke prompt
    const prompt = `Hasilkan 5 topik artikel yang unik dan menarik untuk blog teknologi yang berfokus pada ${baseCategory}. Untuk setiap topik, berikan ringkasan singkat satu kalimat. Pastikan topik relevan dan menarik bagi pengembang dan penggemar teknologi. Format output sebagai array JSON dari objek dengan bidang "topic" dan "summary". Semua dalam bahasa Indonesia.`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}`
      },
      body: JSON.stringify({
        model: "openai", // Atau model lain seperti "gpt-4", "gpt-3.5-turbo" jika tersedia
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gagal fetch topik dari Pollinations AI: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    try {
      return JSON.parse(generatedContent);
    } catch (parseError) {
      console.warn("AI tidak menghasilkan JSON murni. Mencoba mengekstrak JSON dari teks.", generatedContent);
      const jsonMatch = generatedContent.match(/\[.*\]/s);
      if (jsonMatch && jsonMatch[0]) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Gagal parse JSON dari respons AI.");
    }

  } catch (error) {
    console.error("Error saat menghasilkan topik dengan AI:", error.message);
    return []; 
  }
}

// Fungsi untuk menghasilkan konten artikel (dibuat lebih fleksibel) dalam bahasa Indonesia
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
        "Pendahuluan, 3-4 subjudul (dengan ###), dan Kesimpulan.",
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
          // Perubahan di sini: Menambahkan "dalam bahasa Indonesia" ke system content
          {
            role: "system",
            content: `Kamu adalah ${randomPersona}. Tulis artikel dengan struktur: ${randomStructure}. Seluruh konten harus dalam bahasa Indonesia.`
          },
          // Perubahan di sini: Menambahkan "dalam bahasa Indonesia" ke user content
          {
            role: "user",
            content: `${randomPrompt} ${randomStyle}. Tulis ini dalam bahasa Indonesia.`
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
    // Prompt untuk gambar tidak perlu diubah ke bahasa Indonesia karena ini instruksi internal AI
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
      return { success: false, error: 'duplicate' }; 
    }

    console.log(`Membuat konten untuk: ${title}...`);
    let content = await generateArticleContent(topic);
    if (!content || content.length < 300) {
      throw new Error("Konten artikel terlalu pendek atau tidak valid");
    }

    content = content.replace(/^\s*---\s*$/gm, '');

    console.log(`Membuat gambar untuk: ${title}...`);
    const imageUrl = await generateArticleImage(topic, slug);

    const rawSummary = content.substring(0, 150).replace(/\n/g, ' ');
    const safeSummary = rawSummary.replace(/["':]/g, "").trim() + (content.length > 150 ? '...' : '');

    console.log(`Kategori: ${category}`);
    const tags = `${topic.split(' ')[0]}, ${category}`;

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

// Blok eksekusi utama yang dimodifikasi
(async () => {
  let createdCount = 0;
  const maxArticlesToGenerate = 1; 
  const maxAttemptsPerTopic = 3; 

  console.log("Mencoba menghasilkan topik baru menggunakan AI...");
  let potentialTopics = [];
  try {
    potentialTopics = await generateTopicsFromAI("Pengembangan Web, AI, Mobile Development, E-Commerce, Data Science & AI, DevOps & Infrastruktur, UI/UX Design, Monetisasi & Bisnis, Next.js & React, SEO & Pemasaran Digital");
    console.log(`AI menyarankan ${potentialTopics.length} topik.`);
  } catch (error) {
    console.error("Gagal mendapatkan saran topik dari AI:", error.message);
    return; 
  }

  if (potentialTopics.length === 0) {
    console.log("Tidak ada topik yang disarankan oleh AI atau terjadi kesalahan.");
    return;
  }

  for (const topicData of potentialTopics) {
    if (createdCount >= maxArticlesToGenerate) break; 

    const topicTitle = topicData.topic;
    // Kategori bisa disimpulkan dari topik, atau AI bisa diminta untuk memberikan kategori juga
    // Untuk kesederhanaan, kita bisa menggunakan kategori umum atau meminta AI untuk menyediakannya dalam JSON
    const category = "Teknologi"; // Placeholder, idealnya ini juga dinamis atau ditentukan dari topik

    console.log(`\n--- Mencoba membuat artikel untuk topik: "${topicTitle}" ---`);

    for (let attempt = 1; attempt <= maxAttemptsPerTopic; attempt++) {
        console.log(`Percobaan ${attempt} untuk topik "${topicTitle}"`);
        const result = await createArticle(topicTitle, category); 

        if (result.success) {
            createdCount++;
            console.log("--------------------------\n");
            break; 
        } else if (result.error === 'duplicate') {
            console.log(`🟡 Artikel dengan slug untuk "${topicTitle}" sudah ada. Melanjutkan ke topik lain.`);
            break; 
        } else {
            console.error(`❌ Gagal membuat artikel untuk "${topicTitle}": ${result.error}. Menunggu sebelum mencoba lagi...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); 
        }
    }
  }

  if (createdCount === 0) {
    console.error("Tidak ada artikel baru yang berhasil dibuat setelah semua percobaan.");
  } else {
    console.log(`🎉 Berhasil membuat ${createdCount} artikel baru.`);
  }
})();