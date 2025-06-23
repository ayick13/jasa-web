// jasa-web-main/app/blog/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// Tipe untuk props halaman, didefinisikan secara inline untuk kejelasan
type PageProps = {
  params: {
    slug: string;
  };
};

// Fungsi generateMetadata menggunakan tipe PageProps
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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

// Fungsi generateStaticParams tetap sama
export async function generateStaticParams() {
    return blogArticles.map((article) => ({
      slug: article.slug,
    }));
}
  
// Komponen Halaman menggunakan tipe PageProps
export default function BlogPostPage({ params }: PageProps) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <BlogPostContent article={article} />;
}