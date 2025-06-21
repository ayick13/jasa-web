// web-app/app/blog/[slug]/page.tsx
// Halaman ini adalah Komponen Server karena mengekspor generateStaticParams dan generateMetadata.
// OLEH KARENA ITU, JANGAN ADA "use client" DI SINI.

import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data'; 
import { notFound } from 'next/navigation';
// PERBAIKAN: Hapus impor PageProps yang salah
// import type { PageProps } from 'next'; 
import BlogPostContent from './blog-post-content'; 

// PERBAIKAN: Definisikan tipe Props secara langsung
type BlogPostPageProps = {
    params: { slug: string };
    // Tambahkan searchParams jika Anda menggunakannya di komponen halaman Anda
    // searchParams?: { [key: string]: string | string[] | undefined };
};

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
        // Merender komponen klien yang berisi konten blog
        <BlogPostContent article={article} />
    );
}