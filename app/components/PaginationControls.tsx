// /app/components/PaginationControls.tsx

"use client"; // <-- Ini adalah kuncinya!

import Link from 'next/link';

export default function PaginationControls({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      <Link 
        href={`/blog?page=${currentPage - 1}`}
        className={`px-4 py-2 bg-gray-800 text-white rounded-md ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        aria-disabled={!hasPrevPage}
        // Mencegah navigasi jika tombol dinonaktifkan
        onClick={(e) => {
          if (!hasPrevPage) e.preventDefault();
        }}
      >
        Sebelumnya
      </Link>
      
      <span className="text-gray-700">
        Halaman {currentPage} dari {totalPages}
      </span>

      <Link 
        href={`/blog?page=${currentPage + 1}`}
        className={`px-4 py-2 bg-gray-800 text-white rounded-md ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
        aria-disabled={!hasNextPage}
        // Mencegah navigasi jika tombol dinonaktifkan
        onClick={(e) => {
          if (!hasNextPage) e.preventDefault();
        }}
      >
        Berikutnya
      </Link>
    </div>
  );
}