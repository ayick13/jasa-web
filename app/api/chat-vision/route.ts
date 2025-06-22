// File: app/api/chat-vision/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages, image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const pollinationToken = process.env.POLLINATIONS_TEXT_API_TOKEN;
    if (!pollinationToken) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const url = "https://text.pollinations.ai/openai";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pollinationToken}`
    };

    // Gabungkan pesan history dengan prompt gambar
    const visionMessages = [
        ...messages,
        {
            role: "user",
            content: [
                { type: "text", text: "Describe this image in detail." },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
            ]
        }
    ];

    const payload = {
      model: "openai", // Akan diarahkan ke GPT-4o Vision
      messages: visionMessages,
      stream: false
    };

    const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload) });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `External API failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return NextResponse.json({ reply });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}