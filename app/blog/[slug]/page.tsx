import { getAllPostSlugs, getPostData } from '@/lib/posts';
import BlogPostContent from './blog-post-content';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  
  if (!postData) {
    return {
      title: 'Artikel Tidak Ditemukan'
    }
  }

  return {
    title: postData.title,
    description: postData.summary,
    openGraph: {
        title: postData.title,
        description: postData.summary,
        images: [postData.imageUrl],
    },
  }
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

export default async function BlogPostPage({ params }: Props) {
  const article = await getPostData(params.slug);

  // Pengaman ini SANGAT PENTING
  if (!article) {
    notFound();
  }

  return (
    <BlogPostContent article={article} />
  );
}