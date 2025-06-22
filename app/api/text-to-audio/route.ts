// File: app/api/text-to-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'alloy' } = await req.json();

    if (!text) {
        return new Response(JSON.stringify({ error: "Teks tidak boleh kosong." }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
        console.error("SERVER ERROR: POLLINATIONS_TEXT_API_TOKEN is not set.");
        return new Response(JSON.stringify({ error: "Konfigurasi server salah." }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Membuat URL dengan format GET request sesuai contoh Anda
    const encodedText = encodeURIComponent(text);
    const model = "openai-audio"; // Model yang benar sesuai contoh

    const url = `https://text.pollinations.ai/${encodedText}?model=${model}&voice=${voice}`;

    const response = await fetch(url, {
      method: "GET", // Menggunakan metode GET
      headers: {
        // Token tetap diperlukan untuk beberapa endpoint, lebih aman disertakan
        'Authorization': `Bearer ${pollinationToken}`,
      },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from Pollinations TTS GET API: ${response.status} - ${errorText}`);
        return new Response(JSON.stringify({ error: `Gagal membuat audio: ${errorText}` }), { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Periksa apakah responsnya benar-benar audio
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('audio/mpeg')) {
        console.error("Error: Expected audio response, but received:", await response.text());
        return new Response(JSON.stringify({ error: "Respons dari API bukan file audio." }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Alirkan body respons (file audio) kembali ke klien
    return new Response(response.body, {
        headers: { 'Content-Type': 'audio/mpeg' },
    });
  
  } catch (error) {
    console.error("Error in text-to-audio API route:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan internal pada server." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}