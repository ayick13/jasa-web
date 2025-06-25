// app/api/user/update-coins/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
// import { authOptions } from '../../auth/[...nextauth]/route'; // <--- BARIS INI DIHAPUS

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // Panggil getServerSession tanpa authOptions yang diimpor secara eksplisit
  const session = await getServerSession(); // <--- BARIS INI BERUBAH

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { decrementBy, newAmount } = await request.json();

  if (typeof decrementBy !== 'number' && typeof newAmount !== 'number') {
    return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedCoins;
    if (typeof decrementBy === 'number') {
      if (decrementBy <= 0) {
        return NextResponse.json({ error: 'Decrement amount must be positive' }, { status: 400 });
      }
      if (user.coins < decrementBy) {
        return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 });
      }
      updatedCoins = user.coins - decrementBy;
    } else {
      updatedCoins = newAmount;
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { coins: updatedCoins },
    });

    return NextResponse.json({ newCoins: updatedCoins }, { status: 200 });
  } catch (error) {
    console.error('Failed to update user coins:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}