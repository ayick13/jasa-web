// File: app/api/chat/route.ts
import { NextRequest } from 'next/server';

// Fungsi ini memungkinkan Next.js untuk menangani streaming
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
      return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500 });
    }

    const payload = {
      model: model || "openai", // Gunakan model yang dipilih, atau fallback ke "openai"
      messages: messages,
      stream: true,
    };

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}`,
      },
      body: JSON.stringify(payload),
    });

    // Membuat stream baru untuk dikirim ke klien
    const stream = new ReadableStream({
      async start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const chunk = decoder.decode(value);
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Error in chat streaming API route:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}