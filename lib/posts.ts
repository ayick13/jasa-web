// /lib/posts.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import {notFound} from 'next/navigation';

const postsDirectory = path.join(process.cwd(), '_articles');

// Tipe dasar untuk sebuah post
export type Post = {
    slug: string;
    title: string;
    publishedDate: string;
  summary: string;
  imageUrl: string;
  category: string;
  author?: string; // Jadikan author opsional agar tidak error jika kosong
};

// Tipe baru yang merupakan gabungan dari Post DAN memiliki contentHtml
export type PostWithContent = Post & {
  contentHtml: string;
};

// Tipe baru untuk data yang dipaginasi
export type PaginatedPosts = {
  posts: Post[];
  totalPages: number;
  currentPage: number;
};


// --- FUNGSI YANG DIPERBARUI ---
export function getSortedPostsData({page = 1, limit = 6, category}: { page?: number; limit?: number, category?: string }): PaginatedPosts {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            slug,
            // Menggunakan tipe Omit<Post, 'slug'> lebih aman dan konsisten
            ...(matterResult.data as Omit<Post, 'slug'>),
        };
    });

    // Urutkan post berdasarkan tanggal terbit
    const sortedPosts = allPostsData.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));

    // Filter berdasarkan kategori jika ada
    let filteredPosts = sortedPosts;
    if (category) {
        filteredPosts = sortedPosts.filter(
            (post) => post.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Logika Paginasi
    const totalPages = Math.ceil(filteredPosts.length / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const posts = filteredPosts.slice(startIndex, endIndex);

    return {
        posts,
        totalPages,
        currentPage: page,
    };
}


export function getAllPostSlugs() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => ({params: {slug: fileName.replace(/\.md$/, '')}}));
}

export async function getPostData(slug: string): Promise<PostWithContent> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    notFound();
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const postData: PostWithContent = {
    slug,
    contentHtml,
    // Menggunakan tipe Omit<Post, 'slug'> lebih aman dan konsisten
    ...(matterResult.data as Omit<Post, 'slug'>),
  };

  return postData;
}

export function getAllCategories(): string[] {
    const fileNames = fs.readdirSync(postsDirectory);
    // Menggunakan flatMap untuk memfilter kategori yang tidak valid/kosong
    const allCategories = fileNames.flatMap(fileName => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const category = matterResult.data.category;
        return category && typeof category === 'string' ? [category] : [];
    });
    return Array.from(new Set(allCategories)); // Mengembalikan array kategori unik
}