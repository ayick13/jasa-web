import { Metadata } from 'next';
import Link from 'next/link';
import { blogArticles } from '@/lib/blog-data';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Kumpulan artikel, wawasan, dan tutorial seputar pengembangan web dan teknologi dari Ayick.dev.',
};

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Artikel Blog</h1>
        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          Berbagi pemikiran, wawasan, dan tutorial seputar teknologi web.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-10">
        {blogArticles.map((article) => (
          <Link href={`/blog/${article.slug}`} key={article.slug} className="block bg-slate-800 p-8 rounded-xl shadow-lg group border border-slate-700 hover:border-cyan-400 transition-all duration-300">
            <p className="text-sm text-slate-500 mb-2">{article.publishedDate}</p>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
              {article.title}
            </h2>
            <p className="text-slate-400 mb-5">{article.summary}</p>
            <div className="font-semibold text-cyan-500 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
              Baca Selengkapnya <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}