// app/api/generate-daily-article/route.ts
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), 'generate-article.js');
    return new Promise((resolve, reject) => {
      exec(`node ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return reject(new Error(`Gagal menjalankan skrip: ${error.message}`));
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          return reject(new Error(`Stderr: ${stderr}`));
        }
        resolve(NextResponse.json({ 
          message: 'Artikel harian berhasil dibuat', 
          output: stdout 
        }));
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Proses gagal' }, 
      { status: 500 }
    );
  }
}