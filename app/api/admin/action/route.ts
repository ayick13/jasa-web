// app/api/admin/action/route.ts

// Jika file ini hanya untuk mengelola koin, Anda bisa menghapusnya.
// Jika ada fungsi admin lain, modifikasi hanya untuk menghapus logika koin.
// Contoh jika Anda ingin mempertahankan validasi password admin untuk fungsi masa depan:

/*
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Menganggap Anda memiliki PrismaClient diimpor di sini jika ada interaksi DB lainnya
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();


export async function POST(request: Request) {
  const { password, actionType, amount } = await request.json(); // 'amount' bisa dihapus jika tidak ada aksi lain

  // Validasi password admin
  const adminPasswordHash = process.env.ADMIN_PASSWORD;
  if (!adminPasswordHash) {
    return NextResponse.json({ error: 'Konfigurasi server admin tidak lengkap.' }, { status: 500 });
  }

  // Bandingkan password yang dimasukkan dengan hash yang tersimpan
  const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Password admin salah.' }, { status: 403 });
  }

  // Jika Anda tidak memiliki aksi admin lain yang ingin dipertahankan,
  // Anda bisa langsung mengembalikan pesan sukses atau error generik di sini.
  return NextResponse.json({ message: 'Aksi admin diterima (tanpa efek koin).' }, { status: 200 });

}
*/
// Jika Anda ingin menghapus seluruhnya, hapus saja file app/api/admin/action/route.ts.