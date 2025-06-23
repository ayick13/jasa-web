// app/api/admin/refill-coins/route.ts
import { NextResponse } from 'next/server';

// Konstanta untuk jumlah koin admin
const MAX_ADMIN_COINS = 500; // Sesuaikan jika Anda ingin jumlah isi ulang yang berbeda

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Pastikan Anda telah mengatur ENVIRONMENT VARIABLE ini di Vercel atau .env.local Anda
    // Contoh: VERCEL_ADMIN_PASSWORD="password_anda_yang_sangat_rahasia"
    const adminPassword = process.env.ADMIN_PASSWORD; 

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set.");
      return NextResponse.json({ error: 'Konfigurasi server tidak lengkap.' }, { status: 500 });
    }

    if (password === adminPassword) {
      // Jika password cocok, kirimkan jumlah koin yang akan ditambahkan/diset
      return NextResponse.json({ success: true, newCoins: MAX_ADMIN_COINS });
    } else {
      return NextResponse.json({ success: false, error: 'Password admin salah.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in admin refill API:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}
