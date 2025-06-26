// File: app/api/auth/[...nextauth]/route.ts (Final dengan Perbaikan Credentials)

import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // 1. Pastikan kredensial (email & password) ada
        if (!credentials?.email || !credentials.password) {
          throw new Error('Data yang diberikan tidak valid.');
        }

        // 2. Cari pengguna di database berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 3. Jika pengguna tidak ditemukan ATAU pengguna tersebut mendaftar via Google/GitHub (tidak punya password)
        if (!user || !user.password) {
          throw new Error('Pengguna tidak ditemukan atau mendaftar dengan metode lain.');
        }
        
        // 4. Bandingkan password yang dimasukkan dengan hash di database
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Password yang Anda masukkan salah.');
        }

        // 5. Jika semua berhasil, kembalikan data pengguna
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };