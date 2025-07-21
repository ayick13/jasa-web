// /app/page.tsx

import { getSortedPostsData } from '@/lib/posts';
import { HomeClientPage } from './home-client'; // Impor komponen client baru

export default function Home() {
  // 1. Panggil fungsi dengan argumen yang benar untuk mendapatkan 4 postingan teratas
  const { posts } = getSortedPostsData({ page: 1, limit: 4 });

  // 2. Kirimkan data 'posts' yang sudah benar ke komponen HomeClientPage
  return <HomeClientPage recentPosts={posts} />;
}