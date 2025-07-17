import { getSortedPostsData } from '@/lib/posts';
import { HomeClientPage } from './home-client'; // Impor komponen client baru

// Hapus 'use client' dari sini. Ini sekarang adalah Server Component.

export default function Home() {
  // 1. Ambil data di sisi server
  const allPosts = getSortedPostsData();
  const recentPosts = allPosts.slice(0, 4);

  // 2. Render komponen client dan kirimkan data sebagai props
  return <HomeClientPage recentPosts={recentPosts} />;
}