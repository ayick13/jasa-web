// File: app/api/chat/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
      console.error("SERVER ERROR: POLLINATIONS_TEXT_API_TOKEN is not set.");
      return NextResponse.json({ error: "Konfigurasi token di server salah." }, { status: 500 });
    }

    // Payload non-streaming, properti "stream" dihilangkan
    const payload = {
      model: model || "openai",
      messages: messages,
      // stream: false // Tidak perlu, karena default-nya false
    };

    const externalResponse = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${pollinationToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!externalResponse.ok) {
        const errorBody = await externalResponse.text();
        console.error("External API Error:", errorBody);
        return NextResponse.json({ error: `API eksternal gagal: ${errorBody}` }, { status: externalResponse.status });
    }

    // Tunggu respons JSON penuh dan parsing
    const data = await externalResponse.json();

    // Ekstrak konten pesan lengkap
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
        console.error("Invalid response structure from external API:", data);
        return NextResponse.json({ error: "Gagal mem-parsing balasan dari AI." }, { status: 500 });
    }

    // Kirim balasan lengkap sebagai JSON tunggal
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Error in chat API route:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal pada server." }, { status: 500 });
  }
}