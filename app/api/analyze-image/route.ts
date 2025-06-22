import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { image } = await request.json(); 

    if (!image) {
        return NextResponse.json({ message: "Data gambar (base64) tidak ditemukan." }, { status: 400 });
    }

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      console.error("POLLINATIONS_TEXT_API_TOKEN is not set in environment variables.");
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap untuk analisis gambar." }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pollinationToken}`
    };

    const messages = [
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Describe this image in a very detailed manner for a text-to-image prompt. Focus on the main subject, background, style, colors, lighting, and overall composition."
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${image}`
                    }
                }
            ]
        }
    ];

    const payload = {
      // === PERBAIKAN DI SINI ===
      model: "openai", // Model ini akan diarahkan ke model vision yang sesuai oleh Pollinations.ai
      messages: messages,
      stream: false
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error from Pollinations.ai Vision API: ${response.status} - ${errorText}`);
      return NextResponse.json({ message: `Gagal menganalisis gambar dengan AI: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const fullDescription = data?.choices?.[0]?.message?.content;

    if (fullDescription) {
      return NextResponse.json({ description: fullDescription });
    } else {
      console.warn("Pollinations.ai Vision API returned no description.");
      return NextResponse.json({ message: "Gagal mendapatkan deskripsi gambar dari AI." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in analyze-image API route:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server saat menganalisis gambar." }, { status: 500 });
  }
}