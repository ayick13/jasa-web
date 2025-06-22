import { NextRequest } from 'next/server';

// Mengaktifkan Edge Runtime untuk performa streaming terbaik
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
      console.error("SERVER ERROR: POLLINATIONS_TEXT_API_TOKEN is not set.");
      return new Response(JSON.stringify({ error: "Konfigurasi token di server salah." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = {
      model: model || "openai",
      messages: messages,
      stream: true,
    };

    // Panggil API eksternal dengan header yang sudah benar
    const externalResponse = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}`,
        // === PERBAIKAN KRUSIAL DI SINI ===
        "Accept": "text/event-stream" 
      },
      body: JSON.stringify(payload),
    });

    if (!externalResponse.ok) {
        const errorBody = await externalResponse.text();
        console.error("External API Error:", errorBody);
        return new Response(JSON.stringify({ error: `API eksternal gagal: ${errorBody}` }), { 
            status: externalResponse.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Buat ReadableStream baru untuk mengalirkan (pipe) respons ke klien
    const stream = new ReadableStream({
      async start(controller) {
        if (!externalResponse.body) {
          controller.close();
          return;
        }
        const reader = externalResponse.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
       },
    });

  } catch (error) {
    console.error("Error in chat streaming API route:", error);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan internal pada server." }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}