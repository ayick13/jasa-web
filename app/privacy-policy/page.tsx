// Halaman Kebijakan Privasi

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-slate-900 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi</h1>
      <p className="mb-4">Kami menghargai privasi Anda. Data yang Anda berikan hanya digunakan untuk keperluan autentikasi, personalisasi layanan, dan tidak akan dibagikan ke pihak ketiga tanpa izin Anda.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Kami hanya menyimpan data yang diperlukan untuk layanan.</li>
        <li>Anda dapat meminta penghapusan data kapan saja.</li>
        <li>Cookie digunakan untuk meningkatkan pengalaman pengguna.</li>
      </ul>
      <p>Untuk permintaan penghapusan data, silakan kunjungi halaman <a href="/data-deletion" className="text-cyan-500 underline">Petunjuk Penghapusan Data</a>.</p>
    </div>
  );
}
