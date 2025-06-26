# **Proyek Jasa Web \- AI Suite**

Ini adalah proyek aplikasi web modern yang dibangun dengan Next.js, didesain untuk menyediakan serangkaian alat bertenaga kecerdasan buatan (AI) yang inovatif, dengan fokus utama pada generasi gambar dan interaksi cerdas. Selain itu, platform ini juga mengintegrasikan modul untuk blog dan portofolio, didukung oleh sistem otentikasi pengguna yang kuat.

## **Ikhtisar Proyek**

Jasa Web dirancang sebagai platform multifungsi yang memadukan layanan pengembangan web dengan kapabilitas AI mutakhir. Komponen inti proyek ini adalah **AI Suite**, yang memberdayakan pengguna untuk merealisasikan ide-ide visual, menganalisis konten gambar, berinteraksi dengan asisten AI, serta mengonversi teks menjadi format audio.

## **Fitur Utama**

### **AI Suite (Modul Unggulan)**

* **Generasi Gambar (Image Generation)**: Transformasikan deskripsi tekstual Anda menjadi gambar visual yang memukau dengan dukungan berbagai model AI terkemuka seperti flux, turbo, dall-e-3, dan gptimage.  
  * **Pengaturan Parameter Lanjutan**: Kontrol detail generasi meliputi gaya seni yang beragam, tingkat kualitas (Standar, HD, Ultra HD), resolusi gambar kustom, dan jumlah gambar yang akan dihasilkan.  
  * **Prompt Creator**: Manfaatkan kecerdasan buatan untuk menyempurnakan atau memperluas *prompt* Anda, meningkatkan potensi hasil generasi gambar yang lebih akurat dan artistik.  
  * **Riwayat Generasi**: Semua gambar yang berhasil dibuat akan secara otomatis tersimpan di penyimpanan lokal browser Anda, memungkinkan peninjauan, pengelolaan, dan pengunduhan kembali kreasi Anda dengan mudah.  
* **Asisten AI (AI Assistant)**: Berinteraksi secara dinamis dengan model AI melalui antarmuka percakapan yang intuitif. Pengguna dapat mengajukan pertanyaan, meminta saran, atau mendapatkan informasi spesifik. Fitur ini mendukung input berbasis teks dan kemampuan analisis gambar.  
* **Analisis Gambar (Image Analyzer)**: Unggah gambar apa pun untuk dianalisis oleh AI, yang kemudian akan menghasilkan deskripsi detail mengenai konten visualnya. Hasil analisis ini dapat secara langsung digunakan sebagai *prompt* untuk generasi gambar lebih lanjut.  
* **Teks ke Audio (Text to Audio)**: Konversi teks tertulis menjadi *output* audio berkualitas tinggi, dengan opsi pemilihan berbagai suara AI untuk personalisasi.

### **Fitur Tambahan**

* **Sistem Otentikasi Pengguna**: Integrasi login dan registrasi pengguna yang aman menggunakan NextAuth.js, memastikan pengelolaan akun yang efisien.  
* **Modul Blog**: Bagian khusus untuk publikasi artikel dan postingan blog, mendukung konten dinamis dan pengelolaan yang mudah.  
* **Modul Portofolio**: Halaman presentasi profesional untuk menampilkan proyek, karya, atau pencapaian Anda.  
* **Pengalih Tema (Theme Switcher)**: Fleksibilitas untuk beralih antara mode antarmuka terang dan gelap, meningkatkan kenyamanan visual pengguna.

## **Tumpukan Teknologi**

Proyek ini dibangun di atas fondasi teknologi modern dan efisien:

* **Framework**: Next.js (dengan App Router)  
* **Bahasa Pemrograman**: TypeScript  
* **Styling**: Tailwind CSS  
* **Otentikasi**: NextAuth.js  
* **Manajemen Database (Contoh/Migrasi)**: Prisma (digunakan untuk skema migrasi NextAuth, arsitektur database dapat disesuaikan lebih lanjut)  
* **Integrasi API Pihak Ketiga**:  
  * **Pollinations.ai**: Digunakan untuk kapabilitas generasi gambar dengan model flux, turbo, dan gptimage.  
  * **OpenAI**: Memfasilitasi generasi gambar DALL-E 3, fungsi asisten AI, dan peningkatan kualitas *prompt*.  
  * **Penyedia Teks ke Audio**: API eksternal (misalnya ElevenLabs atau sejenisnya) untuk konversi teks ke audio. (Implementasi backend mungkin diperlukan untuk API ini)  
* **Manajemen State**: Pemanfaatan *React Hooks* (useState, useEffect, useCallback, useRef) untuk pengelolaan state yang efisien dan reaktif.  
* **Notifikasi**: react-hot-toast untuk penyediaan umpan balik pengguna yang non-intrusif dan informatif.  
* **Ikonografi**: lucide-react untuk menyediakan set ikon yang bersih dan dapat disesuaikan.

## **Panduan Memulai Proyek**

Ikuti langkah-langkah detail di bawah ini untuk menginisiasi dan menjalankan proyek secara lokal di lingkungan pengembangan Anda.

### **Prasyarat**

Pastikan Anda telah menginstal lingkungan berikut:

* Node.js (Disarankan versi 18.x atau yang lebih tinggi)  
* Manajer Paket: npm, Yarn, pnpm, atau Bun

### **Instalasi**

1. **Kloning Repositori:**  
   git clone https://github.com/ayick13/jasa-web.git  
   cd jasa-web

2. **Instal Dependensi Proyek:**  
   npm install  
   \# atau  
   yarn install  
   \# atau  
   pnpm install  
   \# atau  
   bun install

3. Konfigurasi Variabel Lingkungan:  
   Buat file bernama .env.local di direktori root proyek Anda. Salin konten berikut dan sesuaikan nilainya:  
   \# Konfigurasi NextAuth.js  
   NEXTAUTH\_URL="http://localhost:3000"  
   NEXTAUTH\_SECRET="your\_nextauth\_secret\_here" \# Ganti dengan string acak yang kuat dan unik

   \# Konfigurasi Database (Contoh untuk PostgreSQL dengan Prisma)  
   \# Sesuaikan dengan koneksi database Anda yang sebenarnya  
   DATABASE\_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

   \# OpenAI API Key (Opsional)  
   \# Ini dapat dikonfigurasi melalui modal di UI AI Suite untuk DALL-E 3  
   \# Namun, Anda bisa menyediakannya di sini jika diinginkan untuk fitur backend lainnya.  
   OPENAI\_API\_KEY=""

   *Pastikan untuk mengganti nilai placeholder (misalnya your\_nextauth\_secret\_here, user, password, mydb) dengan kredensial dan konfigurasi yang sesuai untuk lingkungan Anda.*  
4. Jalankan Migrasi Database (Jika Menggunakan Prisma):  
   Apabila Anda memiliki perubahan skema database atau ini adalah instalasi Prisma pertama, jalankan perintah migrasi berikut untuk menerapkan skema ke database Anda:  
   npx prisma migrate dev \--name init

### **Menjalankan Server Pengembangan**

Setelah semua prasyarat terpenuhi dan dependensi terinstal, jalankan server pengembangan:

npm run dev  
\# atau  
yarn dev  
\# atau  
pnpm dev  
\# atau  
bun dev

Aplikasi kini akan tersedia di [http://localhost:3000](http://localhost:3000). Browser Anda akan otomatis me-*reload* setiap kali Anda menyimpan perubahan pada kode sumber.

## **Sumber Daya Pembelajaran**

Untuk informasi lebih lanjut tentang Next.js dan pengembangannya, Anda dapat merujuk ke sumber daya berikut:

* [Dokumentasi Next.js](https://nextjs.org/docs) \- Panduan komprehensif tentang fitur dan API Next.js.  
* [Pelajari Next.js](https://nextjs.org/learn) \- Tutorial interaktif untuk memahami dasar-dasar Next.js.

## **Deployment**

Metode deployment paling sederhana untuk aplikasi Next.js adalah melalui [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), yang dikembangkan oleh pencipta Next.js.

Untuk detail lebih lanjut mengenai proses deployment, kunjungi [dokumentasi deployment Next.js](https://nextjs.org/docs/app/building-your-application/deploying).