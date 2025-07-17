import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { notFound } from 'next/navigation';

// --- TAMBAHKAN KEMBALI BARIS YANG HILANG DI SINI ---
const postsDirectory = path.join(process.cwd(), '_articles');
// ---------------------------------------------------

// Tipe dasar untuk sebuah post (misalnya untuk daftar)
export type Post = {
  slug: string;
  title: string;
  publishedDate: string;
  summary: string;
  imageUrl: string;
};

// Tipe baru yang merupakan gabungan dari Post DAN memiliki contentHtml
export type PostWithContent = Post & {
  contentHtml: string;
};

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as { title: string; publishedDate: string; summary: string; imageUrl: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.publishedDate < b.publishedDate) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ''),
    },
  }));
}

export async function getPostData(slug: string): Promise<PostWithContent> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    // Fungsi notFound() akan melempar error yang ditangkap Next.js untuk menampilkan 404
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
    title: matterResult.data.title,
    publishedDate: matterResult.data.publishedDate,
    summary: matterResult.data.summary,
    imageUrl: matterResult.data.imageUrl,
  };

  return postData;
}