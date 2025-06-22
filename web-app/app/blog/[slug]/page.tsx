// web-app/app/blog/[slug]/page.tsx
// Halaman ini adalah Komponen Server karena mengekspor generateStaticParams dan generateMetadata.
// OLEH KARENA ITU, JANGAN ADA "use client" DI SINI.

import { Metadata } from 'next';
import { blogArticles } from '@/lib/blog-data'; 
import { notFound } from 'next/navigation';
import BlogPostContent from './blog-post-content'; 

// PERBAIKAN: Gunakan 'any' untuk params untuk melewati error build yang persisten
type BlogPostPageProps = {
    params: any; // Menggunakan 'any' sebagai workaround
    // Jika Anda menggunakan searchParams, tambahkan di sini juga:
    // searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    // Di sini, kita akan secara aman menganggap params.slug sebagai string
    const slug = params.slug as string; 
    const article = blogArticles.find((a) => a.slug === slug);
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
    // Di sini juga, kita akan secara aman menganggap params.slug sebagai string
    const slug = params.slug as string; 
    const article = blogArticles.find((a) => a.slug === slug);
    if (!article) { notFound(); }

    return (
        // Merender komponen klien yang berisi konten blog
        <BlogPostContent article={article} />
    );
}