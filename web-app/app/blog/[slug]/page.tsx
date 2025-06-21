import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

type Props = {
  params: { slug: string };
};

// Fungsi untuk generate metadata dinamis
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = blogArticles.find((a) => a.slug === params.slug);
  if (!article) {
    return { title: 'Artikel Tidak Ditemukan' };
  }
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
        title: article.title,
        description: article.summary,
        type: 'article',
        publishedTime: new Date(article.publishedDate).toISOString(),
    }
  };
}

// Fungsi untuk generate halaman statis saat build
export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound(); // Tampilkan halaman 404 jika artikel tidak ada
  }

  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke semua artikel
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-2 text-slate-400 mb-8">
            <Calendar className="w-5 h-5" />
            <span>Diterbitkan pada {article.publishedDate}</span>
        </div>
        
        <div
          className="prose prose-invert prose-lg max-w-none text-slate-300"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}