import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MessageSquare } from 'lucide-react';

const BlogCTA = () => (
  <div className="mt-16 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-8 text-center">
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
      Siap Mewujudkan Ide Anda?
    </h3>
    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
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
            images: [article.imageUrl],
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.summary,
            images: [article.imageUrl],
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
            <div className="max-w-3xl mx-auto">
                <Link href="/blog" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke semua artikel
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">{article.title}</h1>

                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8">
                    <Calendar className="w-5 h-5" />
                    <span>Diterbitkan pada {article.publishedDate}</span>
                </div>

                <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                
                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                <BlogCTA />
            </div>
        </article>
    );
}