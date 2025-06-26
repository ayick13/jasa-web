Jasa Web - AI Suite ProjectIni adalah proyek web yang dibangun dengan Next.js, yang difokuskan pada penyediaan berbagai alat bertenaga AI, khususnya untuk generasi gambar dan interaksi cerdas. Proyek ini juga mencakup fitur blog dan portofolio, serta sistem otentikasi.Gambaran Umum ProyekJasa Web adalah platform komprehensif yang mengintegrasikan layanan pengembangan web dengan fitur-fitur AI canggih. Bagian inti dari proyek ini adalah AI Suite, yang memungkinkan pengguna untuk menghasilkan gambar dari teks, menganalisis gambar, berinteraksi dengan asisten AI, dan mengubah teks menjadi audio.Fitur UtamaAI Suite (Fitur Unggulan)Generasi Gambar (Image Generation): Ubah ide-ide tekstual Anda menjadi gambar visual yang menakjubkan dengan berbagai model AI (flux, turbo, dall-e-3, gptimage).Pengaturan Parameter Lanjutan: Kontrol gaya seni, kualitas (standar, HD, Ultra HD), ukuran gambar, dan jumlah gambar yang dihasilkan.Prompt Creator: Manfaatkan AI untuk memperkaya atau menyempurnakan prompt Anda, membantu Anda mendapatkan hasil generasi gambar yang lebih baik.Riwayat Generasi: Semua gambar yang dihasilkan disimpan secara lokal di browser Anda, memudahkan Anda untuk meninjau dan mengunduh kreasi Anda sebelumnya.Asisten AI (AI Assistant): Berinteraksi dengan model AI melalui antarmuka chat. Ajukan pertanyaan, minta saran, atau dapatkan informasi. Mendukung input teks dan gambar (untuk analisis).Analisis Gambar (Image Analyzer): Unggah gambar dan biarkan AI menganalisis serta memberikan deskripsi detail tentang konten gambar tersebut. Hasil analisis dapat langsung digunakan sebagai prompt.Teks ke Audio (Text to Audio): Konversi teks tertulis menjadi file audio dengan pilihan berbagai suara AI.Fitur LainnyaOtentikasi Pengguna: Sistem login dan registrasi terintegrasi menggunakan NextAuth.js.Blog: Bagian untuk artikel atau postingan blog, mendukung konten dinamis.Portofolio: Halaman untuk menampilkan proyek atau karya Anda.Theme Switcher: Beralih antara mode terang dan gelap untuk pengalaman pengguna yang lebih nyaman.Teknologi yang DigunakanFramework: Next.js (dengan App Router)Bahasa Pemrograman: TypeScriptStyling: Tailwind CSSOtentikasi: NextAuth.jsDatabase (Contoh/Migrasi): Prisma (digunakan untuk skema migrasi NextAuth, dapat disesuaikan untuk data aplikasi)API Pihak Ketiga:Pollinations.ai (untuk generasi gambar flux, turbo, gptimage)OpenAI (untuk generasi gambar DALL-E 3, asisten AI, dan prompt enhancement)ElevenLabs atau sejenisnya (untuk teks ke audio - perlu dikonfirmasi/diimplementasikan di backend)Manajemen State: React Hooks (useState, useEffect, ``useCallback, useRef`)Notifikasi: react-hot-toastIkon: lucide-reactMemulai ProyekIkuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal di lingkungan pengembangan Anda.PrasyaratNode.js (versi 18.x atau lebih tinggi)npm atau Yarn atau pnpm atau BunInstalasiKloning repositori:git clone https://github.com/ayick13/jasa-web.git
cd jasa-web
Instal dependensi:npm install
# atau
yarn install
# atau
pnpm install
# atau
bun install
Konfigurasi Environment Variables:Buat file .env.local di root proyek dan tambahkan variabel lingkungan yang diperlukan. Contoh:# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret" # Gunakan string acak yang kuat

# Database (jika menggunakan Prisma/PostgreSQL, contoh)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# OpenAI API Key (Opsional, hanya jika ingin menggunakan model DALL-E 3 atau fitur OpenAI lainnya)
OPENAI_API_KEY="" # Dapat dikonfigurasi melalui modal di UI AI Suite untuk DALL-E 3
Ganti nilai placeholder dengan kredensial Anda yang sebenarnya.Jalankan Migrasi Database (jika menggunakan Prisma):Jika Anda memiliki perubahan skema database atau ini adalah instalasi pertama dengan Prisma, jalankan migrasi:npx prisma migrate dev --name init
Menjalankan Server Pengembangannpm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
Buka http://localhost:3000 di browser Anda untuk melihat hasilnya. Halaman akan otomatis di-reload saat Anda melakukan perubahan pada kode sumber.Pelajari Lebih LanjutNext.js Documentation - Pelajari tentang fitur dan API Next.js.Learn Next.js - Tutorial Next.js interaktif.DeploymentCara termudah untuk mendeploy aplikasi Next.js Anda adalah menggunakan Vercel Platform dari pencipta Next.js.Lihat dokumentasi deployment Next.js untuk detail lebih lanjut.