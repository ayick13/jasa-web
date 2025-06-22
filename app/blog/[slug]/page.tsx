import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// Interface props tetap sama
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Fungsi generateMetadata sudah async dan benar, tidak perlu diubah
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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

// === PERBAIKAN UTAMA DI SINI ===
// Komponen disederhanakan dan prop yang dikirim sudah benar
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  // Jika artikel tidak ditemukan, panggil notFound()
  if (!article) {
    notFound();
  }

  // Cukup render komponen BlogPostContent dan kirimkan seluruh objek artikel
  return <BlogPostContent article={article} />;
}