// web-app/app/blog/[slug]/page.tsx
// Halaman ini adalah Komponen Server karena mengekspor generateStaticParams dan generateMetadata.
// OLEH KARENA ITU, JANGAN ADA "use client" DI SINI.

import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data'; // Pastikan path ini benar
import { notFound } from 'next/navigation';
import type { PageProps } from 'next'; // Impor PageProps dari 'next'
import BlogPostContent from './blog-post-content'; // Impor komponen klien baru

// Define Props untuk tipe params
type BlogPostPageProps = PageProps<{ slug: string }>;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const article = blogArticles.find((a) => a.slug === params.slug);
    if (!article) { return { title: 'Artikel Tidak Ditemukan' }; }
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
    return blogArticles.map((article) => ({ slug: article.slug }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const article = blogArticles.find((a) => a.slug === params.slug);
    if (!article) { notFound(); }

    return (
        // Render komponen klien yang berisi konten blog
        <BlogPostContent article={article} />
    );
}