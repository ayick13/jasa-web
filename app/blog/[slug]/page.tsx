// jasa-web-main/app/blog/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// PERBAIKAN: Tipe untuk props didefinisikan secara inline
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = params.slug;
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
        title: article.title,
        description: article.summary,
        images: [
            {
                url: article.imageUrl,
                width: 1200,
                height: 630,
                alt: article.title,
            },
        ],
    },
  };
}

export async function generateStaticParams() {
    return blogArticles.map((article) => ({
      slug: article.slug,
    }));
}
  
// PERBAIKAN: Tipe untuk props didefinisikan secara inline
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <BlogPostContent article={article} />;
}