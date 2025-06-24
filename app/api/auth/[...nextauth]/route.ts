// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ==========================================================
        // =              PERBAIKAN UTAMA ADA DI SINI               =
        // ==========================================================

        // 1. Cek jika user tidak ada ATAU jika user ada tapi tidak punya password
        //    (Ini terjadi jika mereka mendaftar via Google/Facebook)
        if (!user || !user.password) {
          return null;
        }

        // 2. Sekarang kita bisa dengan aman membandingkan password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password // TypeScript sekarang tahu ini pasti sebuah string
        );
        
        // ==========================================================

        if (!isPasswordCorrect) {
          return null;
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Menambahkan data `id` ke dalam token sesi
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // Menambahkan data `id` dari token ke objek sesi di client
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };