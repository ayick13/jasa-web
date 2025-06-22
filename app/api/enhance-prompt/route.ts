import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { subject, details } = await request.json();

    if (!subject) {
      return NextResponse.json({ message: 'Subjek diperlukan' }, { status: 400 });
    }

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      console.error("POLLINATIONS_TEXT_API_TOKEN is not set in environment variables.");
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap." }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pollinationToken}`
    };

    const instruction = `Create a highly detailed, vivid, and artistic image generation prompt. The main subject is "${subject}". Additional details to include are: "${details}". The output must only be the prompt itself, without any introductory text, quotes, or conversational phrases.`;

    const payload = {
      // === PERBAIKAN DI SINI ===
      model: "openai",
      messages: [{ role: "user", content: instruction }],
      stream: false
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Pollinations.ai API: ${response.status} - ${errorText}`);
      return NextResponse.json({ message: `Gagal membuat prompt dengan AI: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const generatedPrompt = data?.choices?.[0]?.message?.content.trim();

    if (generatedPrompt) {
      return NextResponse.json({ prompt: generatedPrompt });
    } else {
      console.warn("Pollinations.ai API returned no prompt.");
      return NextResponse.json({ message: "Gagal mendapatkan prompt dari AI." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in enhance-prompt API route:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat membuat prompt." }, { status: 500 });
  }
}