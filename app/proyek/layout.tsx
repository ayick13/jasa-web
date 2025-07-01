// File: app/proyek/layout.tsx

// Anda tidak perlu mengimpor apa pun di sini.

export default function ProyekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Baris di bawah ini adalah satu-satunya hal yang Anda perlukan di file ini.
  // Kode ini hanya akan menampilkan konten dari halaman proyek Anda.
  // Header dan Footer utama akan secara otomatis ditambahkan dari 
  // file 'app/layout.tsx' yang membungkus semua halaman.
  return <>{children}</>;
}
