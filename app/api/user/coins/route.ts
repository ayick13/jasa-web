// app/api/user/coins/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
// import { authOptions } from '../../auth/[...nextauth]/route'; // <--- BARIS INI DIHAPUS

const prisma = new PrismaClient();
const DEFAULT_DAILY_COINS = 500;
const COIN_RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

export async function GET(request: Request) {
  // Panggil getServerSession tanpa authOptions yang diimpor secara eksplisit
  // NextAuth akan mencoba menemukannya secara otomatis dari konfigurasi global.
  const session = await getServerSession(); // <--- BARIS INI BERUBAH

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true, lastCoinResetTimestamp: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let currentCoins = user.coins;
    let lastResetTimestamp = user.lastCoinResetTimestamp ? user.lastCoinResetTimestamp.getTime() : 0;

    if (Date.now() - lastResetTimestamp > COIN_RESET_INTERVAL_MS) {
      currentCoins = DEFAULT_DAILY_COINS;
      lastResetTimestamp = Date.now();
      await prisma.user.update({
        where: { id: session.user.id },
        data: { coins: currentCoins, lastCoinResetTimestamp: new Date(lastResetTimestamp) },
      });
    }

    return NextResponse.json({ coins: currentCoins, lastCoinResetTimestamp: lastResetTimestamp }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user coins:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}