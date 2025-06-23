import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogArticles, Article } from '@/lib/blog-data';
import BlogPostContent from './blog-post-content';

// Definisikan tipe props secara lokal untuk file ini.
// Ini adalah cara yang paling aman dan tidak akan berkonflik.
type Props = {
  params: {
    slug: string;
  };
};

// Gunakan tipe lokal 'Props' untuk generateMetadata.
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

/**
 * (Opsional tapi sangat disarankan)
 * Fungsi ini memberi tahu Next.js untuk membuat semua halaman blog saat build.
 * Ini membuat situs Anda lebih cepat dan optimal.
 */
export async function generateStaticParams() {
    return blogArticles.map((article) => ({
      slug: article.slug,
    }));
}
  

// Gunakan tipe lokal 'Props' untuk komponen halaman utama.
export default function BlogPostPage({ params }: Props) {
  const slug = params.slug;
  const article: Article | undefined = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Merender komponen konten dengan data artikel yang ditemukan
  return <BlogPostContent article={article} />;
}