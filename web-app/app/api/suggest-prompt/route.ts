// web-app/app/api/suggest-prompt/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { contextPrompt } = await request.json(); // Ambil prompt konteks opsional dari klien

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      console.error("POLLINATIONS_TEXT_API_TOKEN is not set in environment variables.");
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap untuk saran prompt." }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai";
    const headers = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      "Authorization": `Bearer ${pollinationToken}`
    };

    const messages = [
      {
        role: "system",
        content: "You are a creative AI prompt generator. Generate 3 diverse, creative, and detailed prompts for AI image generation. Each prompt should be for a different category (animal, superhero, Panorama, surealism, anime, ghibli etc). Format the response with each prompt on a new line, prefixed with '1. ', '2. ', etc. Each prompt should be 1-2 sentences long and include details about style, lighting, shot and composition."
      }
    ];

    if (contextPrompt) {
        messages.push({ role: "user", content: `Generate prompts related to: "${contextPrompt}"` });
    } else {
        messages.push({ role: "user", content: "Generate diverse image prompts." });
    }

    const payload = {
      model: "openai",
      messages: messages,
      seed: Math.floor(Math.random() * 1000000), // Tambahkan seed acak untuk variasi
      stream: false, // Mengambil respons lengkap
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Pollinations.ai text API (suggestions): ${response.status} - ${errorText}`);
      return NextResponse.json({ message: `Gagal mendapatkan saran prompt dari AI: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const generatedContent = data?.choices?.[0]?.message?.content;

    if (generatedContent) {
      // Proses respons untuk mengekstrak prompt
      const prompts = generatedContent.split('\n')
          .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
          .filter((line: string) => line.length > 0)
          .slice(0, 5); // Ambil hingga 5 prompt

      return NextResponse.json({ suggestions: prompts });
    } else {
      console.warn("Pollinations.ai text API returned no content for suggestions.");
      return NextResponse.json({ message: "Gagal mendapatkan saran prompt dari AI." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in suggest-prompt API route:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat mendapatkan saran prompt." }, { status: 500 });
  }
}