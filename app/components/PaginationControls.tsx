// /app/components/PaginationControls.tsx

"use client"; // <-- Ini adalah kuncinya!

import Link from 'next/link';

export default function PaginationControls({ currentPage, totalPages, category }: { currentPage: number; totalPages: number, category?: string }) {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const baseLink = category ? `/blog?category=${category}&` : '/blog?';

  return (
    <div className="flex justify-center items-center gap-4 mt-16">
      <Link 
        href={`${baseLink}page=${currentPage - 1}`}
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
        href={`${baseLink}page=${currentPage + 1}`}
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