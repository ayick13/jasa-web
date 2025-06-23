// app/api/admin/action/route.ts
import { NextResponse } from 'next/server';

const DEFAULT_DAILY_COINS = 500; // Koin harian default yang baru
const MAX_ADMIN_REFILL_AMOUNT = 1000; // Batas maksimum untuk refill kustom

export async function POST(request: Request) {
  try {
    // Menerima password, tipe aksi (reset/refill), dan jumlah (jika refill)
    const { password, actionType, amount } = await request.json(); 

    // Pastikan Anda telah mengatur ENVIRONMENT VARIABLE ini di Vercel atau .env.local Anda
    // Contoh: ADMIN_PASSWORD="password_anda_yang_sangat_rahasia"
    const adminPassword = process.env.ADMIN_PASSWORD; 

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set.");
      return NextResponse.json({ error: 'Konfigurasi server tidak lengkap.' }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Password admin salah.' }, { status: 401 });
    }

    let newCoinsAmount = 0;
    if (actionType === 'reset') {
      newCoinsAmount = DEFAULT_DAILY_COINS; // Reset ke default harian
    } else if (actionType === 'refill') {
      if (typeof amount !== 'number' || amount <= 0 || amount > MAX_ADMIN_REFILL_AMOUNT || !Number.isInteger(amount)) {
        return NextResponse.json({ success: false, error: `Jumlah isi ulang tidak valid. Masukkan angka positif hingga ${MAX_ADMIN_REFILL_AMOUNT}.` }, { status: 400 });
      }
      newCoinsAmount = amount;
    } else {
      return NextResponse.json({ success: false, error: 'Tipe aksi tidak valid.' }, { status: 400 });
    }

    // Dalam aplikasi nyata, Anda akan memperbarui database pengguna di sini.
    // Untuk tujuan ini, kita hanya mengembalikan jumlah koin yang akan diset di klien.
    return NextResponse.json({ success: true, newCoins: newCoinsAmount });

  } catch (error) {
    console.error('Error in admin action API:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal server.' }, { status: 500 });
  }
}
