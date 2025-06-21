import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Pastikan environment variables sudah di-set
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        console.error("Gmail credentials are not set in environment variables.");
        return NextResponse.json({ message: "Konfigurasi server tidak lengkap." }, { status: 500 });
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
      subject: `Pesan Baru dari Portfolio: ${name}`,
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