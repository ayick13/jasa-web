import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt: userPrompt } = await request.json(); // Dapatkan prompt dari request body

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      console.error("POLLINATIONS_TEXT_API_TOKEN is not set in environment variables.");
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap untuk enhancement." }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai"; // Endpoint API text Pollinations.ai
    const headers = {
      "Content-Type": "application/json",
      "Accept": "text/event-stream", // Meskipun kita tidak streaming, ini adalah header yang disarankan
      "Authorization": `Bearer ${pollinationToken}` // Menggunakan token di header
    };
    const payload = {
      model: "openai",
      messages: [
        { role: "user", content: `Enhance this image generation prompt: "${userPrompt}". Make it highly detailed, focusing on visual aspects like quality, lighting, texture, and mood. Ensure it's ready for an AI image model and maintain the core subject. Include terms like 'ultra quality', '4K', 'highly detailed', 'cinematic lighting', 'photorealistic'.` }
      ],
      stream: false // Kita akan mengambil respons lengkap sekaligus
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Pollinations.ai text API: ${response.status} - ${errorText}`);
      return NextResponse.json({ message: `Gagal memperkaya prompt dari AI: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const enhancedContent = data?.choices?.[0]?.message?.content;

    if (enhancedContent) {
      return NextResponse.json({ enhancedPrompt: enhancedContent });
    } else {
      console.warn("Pollinations.ai text API returned no enhanced content.");
      return NextResponse.json({ message: "Gagal mendapatkan prompt yang diperkaya dari AI." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in enhance-prompt API route:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat memperkaya prompt." }, { status: 500 });
  }
}