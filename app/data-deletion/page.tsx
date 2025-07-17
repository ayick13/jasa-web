// Halaman Petunjuk Penghapusan Data

export default function DataDeletionPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-slate-900 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-6">Petunjuk Penghapusan Data</h1>
      <ol className="list-decimal ml-6 mb-4">
        <li>Kirim email ke <a href="mailto:admin@ariftirtana.my.id" className="text-cyan-500 underline">ayicktigabelas@gmail.com</a> dengan subjek "Permintaan Penghapusan Data".</li>
        <li>Sertakan alamat email yang terdaftar di aplikasi ini.</li>
        <li>Tim kami akan memproses permintaan Anda dalam waktu maksimal 7 hari kerja.</li>
      </ol>
      <p>Jika ada pertanyaan lebih lanjut, silakan hubungi kami melalui email di atas.</p>
    </div>
  );
}
