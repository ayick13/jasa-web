<<<<<<< HEAD
// File: app/proyek/layout.tsx
=======
>>>>>>> d9434bf (fix: perbaiki header/footer ganda dan konversi artikel ke markdown)

// Anda tidak perlu mengimpor apa pun di sini.

export default function ProyekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  // Baris di bawah ini adalah satu-satunya hal yang Anda perlukan di file ini.
  // Kode ini hanya akan menampilkan konten dari halaman proyek Anda.
  // Header dan Footer utama akan secara otomatis ditambahkan dari 
  // file 'app/layout.tsx' yang membungkus semua halaman.
  return <>{children}</>;
=======
  return (
    <main className="flex-grow">
      {children}
    </main>
  );
>>>>>>> d9434bf (fix: perbaiki header/footer ganda dan konversi artikel ke markdown)
}
