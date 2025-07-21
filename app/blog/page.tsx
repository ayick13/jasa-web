// /app/blog/page.tsx

import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';
import { getAllCategories } from '@/lib/posts';
import Image from 'next/image';
import PaginationControls from '@/app/components/PaginationControls'; // <-- IMPORT BARU
import { default as AdSlot } from '@/app/components/AdSlot';


export default function Blog({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const currentPage = page > 0 ? page : 1;
  const postsPerPage = 6;

  const { posts, totalPages } = getSortedPostsData({ page: currentPage, limit: postsPerPage, category });
  const categories = getAllCategories();
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Artikel Terbaru</h2>
        {/* --- BLOK FILTER KATEGORI DIPINDAHKAN KE SINI --- */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          <Link href="/blog" className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${!category ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-cyan-100 dark:hover:bg-slate-600'}`}>
            Semua
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${cat.toLowerCase()}`}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${category === cat.toLowerCase() ? 'bg-cyan-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-cyan-100 dark:hover:bg-slate-600'}`}
            >
              {cat}
            </Link>
          ))}
        </div>
          <div className="my-8 text-center">
              <AdSlot
                client="ca-pub-1439044724518446"
                slot="5961316189"
                format="fluid"
                layout="in-article"
                className="mx-auto"
              />
            </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(({ slug, title, summary, imageUrl, publishedDate, category, author }) => (
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
                  <p className="text-sm font-semibold text-cyan-600 mb-2">{category}</p>
                  <h3 className="text-gray-800 text-xl font-bold mb-2">{title}</h3>
                   <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-500 mb-4">
                    {author && (
                      <><span>Ditulis oleh: {author}</span><span className="hidden sm:inline mx-1">•</span></>
                    )}
                    <span>diterbitkan pada:</span>
                    <span>{new Date(publishedDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                   </div>
                  <p className="text-gray-700">{summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Gunakan komponen yang sudah diimpor */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} category={category} />

      </div>
    </section>
  );
}

export const metadata = {
  title: 'Blog | Artikel tentang Pengembangan Web dan Teknologi',
  description: 'Kumpulan artikel dan tutorial mengenai pengembangan web, teknologi terbaru, dan tips coding.',
};