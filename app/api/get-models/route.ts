// File: app/api/get-models/route.ts
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const response = await fetch('https://text.pollinations.ai/models');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    
    const models = await response.json();
    
    return NextResponse.json(models);

  } catch (error) {
    console.error('[GET_MODELS_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch models from external source.' }, { status: 500 });
  }
}