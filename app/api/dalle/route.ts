// File: app/api/dalle/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API Key is required.' }, { status: 401 });
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json', // Meminta gambar sebagai base64
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error?.message || 'Failed to generate image with DALL-E 3.';
        // Kirim kembali pesan error spesifik dari OpenAI
        return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    const imageBase64 = data.data[0].b64_json;

    // Mengembalikan gambar sebagai data URL agar bisa langsung ditampilkan
    return NextResponse.json({ imageUrl: `data:image/png;base64,${imageBase64}` });

  } catch (error) {
    console.error('[DALLE_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}