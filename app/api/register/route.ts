// app/api/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    console.log('Register attempt received:'); // Log 1
    console.log('Email:', email, 'Name:', name); // Log 2 (Jangan log password secara langsung)

    if (!email || !password || !name) {
      console.log('Error: Incomplete data received.'); // Log 3
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Existing user check result:', existingUser); // Log 4

    if (existingUser) {
      console.log('Error: Email already registered.'); // Log 5
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully.'); // Log 6 (Jangan log hash-nya)

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    console.log('New user created successfully:', newUser.id, newUser.email); // Log 7

    return NextResponse.json({ message: 'User berhasil dibuat', user: { id: newUser.id, email: newUser.email, name: newUser.name } }, { status: 201 });

  } catch (error: any) { // Tangkap error agar bisa melihat pesannya
    console.error('Registration error caught in API route:', error); // Log 8: Detail error
    // Periksa apakah error adalah instance dari Error dan memiliki properti message
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if ('code' in error) { // Prisma errors often have a 'code'
        console.error('Prisma Error Code:', (error as any).code);
      }
    }
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}