import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// Interface untuk mendefinisikan tipe props, terutama untuk generateMetadata
interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Fungsi untuk membuat metadata halaman secara dinamis berdasarkan slug
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

// Komponen utama halaman blog post
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Merender komponen konten dan mengirimkan data artikel sebagai props
  return <BlogPostContent article={article} />;
}