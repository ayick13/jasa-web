'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Tag, User } from 'lucide-react';
import type { PostWithContent } from '@/lib/posts';
import { default as AdSlot } from '@/app/components/AdSlot';
// --- AKHIR PERUBAHAN ---

// --- PERUBAHAN DI SINI ---
// Gunakan tipe yang diimpor untuk props
type BlogPostContentProps = {
  article: PostWithContent;
};
// --- AKHIR PERUBAHAN ---

export default function BlogPostContent({ article }: BlogPostContentProps) {
  return (
    <div className="bg-white dark:bg-slate-900 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center mb-8 font-semibold">
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke Semua Artikel
          </Link>
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-2">
             <Tag size={16} />
            <span className="font-semibold">{article.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">{article.title}</h1>
         <div className="flex flex-wrap items-center text-slate-500 dark:text-slate-400 mb-6 gap-x-4 gap-y-2">
            {article.author && (
              <>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>Ditulis oleh: {article.author}</span>
                </div>
                <span className="hidden sm:inline">•</span>
              </>
            )}
             <span> diterbitkan pada: 
               {new Date(article.publishedDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
          </div>


          <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm">
            <article
              className="
                prose
                lg:prose-xl
                dark:prose-invert
                prose-headings:font-bold
                prose-headings:text-slate-900
                dark:prose-headings:text-white
                prose-a:text-cyan-600
                dark:prose-a:text-cyan-400
                hover:prose-a:underline
                prose-blockquote:border-l-cyan-500
                prose-blockquote:text-slate-600
                dark:prose-blockquote:text-slate-300
                max-w-none
              "
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
            <div className="my-8 text-center">
              <AdSlot
                client="ca-pub-1439044724518446"
                slot="5961316189"
                format="fluid"
                layout="in-article"
                className="mx-auto"
              />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}