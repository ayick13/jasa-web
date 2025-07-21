import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message, 'cf-turnstile-response': turnstileToken } = await request.json();

    // Pastikan environment variables sudah di-set
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY; // Kunci rahasia Turnstile baru

    if (!user || !pass || !turnstileSecretKey) {
        console.error("Environment variables for Gmail or Cloudflare Turnstile are not set.");
        return NextResponse.json({ message: "Konfigurasi server tidak lengkap." }, { status: 500 });
    }

    // Verifikasi Cloudflare Turnstile
    const turnstileFormData = new FormData();
    turnstileFormData.append('secret', turnstileSecretKey); //
    turnstileFormData.append('response', turnstileToken); //
    turnstileFormData.append('remoteip', request.headers.get('CF-Connecting-IP') || ''); // Opsional: Sertakan IP pengguna

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'; //
    const turnstileResponse = await fetch(url, {
        method: 'POST',
        body: turnstileFormData,
    });

    const turnstileResult = await turnstileResponse.json();

    if (!turnstileResult.success) { //
        console.error("Cloudflare Turnstile verification failed:", turnstileResult['error-codes']);
        return NextResponse.json({ message: "Verifikasi CAPTCHA gagal. Silakan coba lagi." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass,
      },
    });

    const mailOptions = {
      from: user,
      to: user, // Kirim ke alamat email Anda sendiri
      replyTo: email, // Agar saat membalas, langsung ke email pengirim
      subject: `Pesan Baru dari ariftirtana.my.id: ${name}`,
      html: `
        <h2>Pesan Baru dari Formulir Kontak</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Pesan berhasil dikirim!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengirim pesan." }, { status: 500 });
  }
}
