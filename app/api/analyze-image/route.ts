// web-app/app/api/analyze-image/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json(); // Ambil gambar base64 dari klien

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;

    if (!pollinationToken) {
      console.error("POLLINATIONS_TEXT_API_TOKEN is not set in environment variables.");
      return NextResponse.json({ message: "Konfigurasi server tidak lengkap untuk analisis gambar." }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai"; // Endpoint yang sama, gunakan untuk Vision
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pollinationToken}`
    };

    const messages = [
        {
            role: "system",
            content: "You are an expert at analyzing images. Describe the image in detail, including objects, colors, style, composition, and any text present. Be thorough and precise."
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Please analyze this image and describe it in detail."
                },
                {
                    type: "image_url",
                    image_url: {
                        url: `data:image/jpeg;base64,${base64Image}` // Data URL gambar
                    }
                }
            ]
        }
    ];

    const payload = {
      model: "openai", // Model ini akan diarahkan ke model vision yang sesuai oleh Pollinations.ai
      messages: messages,
      seed: Math.floor(Math.random() * 1000000), // Seed untuk konsistensi/variasi
      stream: false // Mengambil respons lengkap
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