// File: app/api/text-to-audio/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, model = 'tts-1', voice = 'alloy' } = await req.json();

    if (!text) {
        return new Response(JSON.stringify({ error: "Text input is required." }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
        console.error("SERVER ERROR: POLLINATIONS_TEXT_API_TOKEN is not set.");
        return new Response(JSON.stringify({ error: "Server configuration error" }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Payload dengan format yang benar untuk endpoint text.pollinations.ai/openai
    // Kita asumsikan ada model 'openai-tts' atau yang serupa
    const payload = {
        model: "openai-tts", // Menggunakan model TTS yang sesuai
        messages: [
            {
                role: "user",
                content: [
                    { "type": "text", "text": "Convert the following text to speech." },
                    {
                        "type": "input_text",
                        "input_text": {
                            "data": text,
                            "voice": voice // Menyertakan parameter suara jika didukung
                        }
                    }
                ]
            }
        ]
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${pollinationToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from Pollinations TTS API: ${response.status} - ${errorText}`);
        return new Response(JSON.stringify({ error: `Gagal membuat audio: ${errorText}` }), { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Karena endpoint ini kemungkinan mengembalikan audio langsung, kita stream body-nya
    return new Response(response.body, {
        headers: { 'Content-Type': 'audio/mpeg' },
    });
  
  } catch (error) {
    console.error("Error in text-to-audio API route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}