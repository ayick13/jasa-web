// app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Cek apakah email dan password ada
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // 1. Cari pengguna di database berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Jika pengguna tidak ditemukan, kembalikan null
        if (!user) {
          return null;
        }

        // 2. Bandingkan password yang diinput dengan hash di database
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // Jika password tidak cocok, kembalikan null
        if (!isPasswordCorrect) {
          return null;
        }
        
        // 3. Jika semua cocok, kembalikan data pengguna
        // (Jangan kembalikan password!)
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
});

export { handler as GET, handler as POST };