// /app/blog/page.tsx

import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import Image from 'next/image';
import PaginationControls from '@/app/components/PaginationControls'; // <-- IMPORT BARU

export default function Blog({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const currentPage = page > 0 ? page : 1;
  const postsPerPage = 6;

  const { posts, totalPages } = getSortedPostsData({ page: currentPage, limit: postsPerPage });

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Artikel Terbaru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(({ slug, title, summary, imageUrl, publishedDate }) => (
            <Link href={`/blog/${slug}`} key={slug}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-transform hover:scale-105">
                <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                <div className="p-6">
                  <h3 className="text-gray-800 text-xl font-bold mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{new Date(publishedDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-700">{summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gunakan komponen yang sudah diimpor */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />

      </div>
    </section>
  );
}

export const metadata = {
  title: 'Blog | Artikel tentang Pengembangan Web dan Teknologi',
  description: 'Kumpulan artikel dan tutorial mengenai pengembangan web, teknologi terbaru, dan tips coding.',
};