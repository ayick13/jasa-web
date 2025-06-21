import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';

const BlogCTA = () => (
  <div className="mt-16 bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
    <h3 className="text-2xl font-bold text-white mb-3">
      Siap Mewujudkan Ide Anda?
    </h3>
    <p className="text-slate-400 max-w-xl mx-auto mb-6">
      Baik itu website baru, optimasi, atau sekadar konsultasi, saya siap membantu. Mari diskusikan bagaimana kita bisa membangun solusi digital yang tepat untuk Anda.
    </p>
    <Link 
      href="/#contact" 
      className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
    >
      <MessageSquare className="w-5 h-5" />
      Hubungi Saya Sekarang
    </Link>
  </div>
);

type Props = {
  params: { slug: string };
};

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

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function BlogPostPage({ params }: Props) {
  const article = blogArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
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

        <BlogCTA />
      </div>
    </article>
  );
}