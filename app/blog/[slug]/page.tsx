import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// Definisikan tipe props secara lokal dan spesifik untuk halaman ini.
// Ini adalah praktik terbaik.
type Props = {
  params: {
    slug: string;
  };
};

// Gunakan tipe 'Props' yang sudah benar.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

// (Sangat disarankan) Fungsi untuk membuat halaman statis saat build.
export async function generateStaticParams() {
    return blogArticles.map((article) => ({
      slug: article.slug,
    }));
}
  

// Gunakan tipe 'Props' untuk komponen utama.
export default function BlogPostPage({ params }: Props) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return <BlogPostContent article={article} />;
}