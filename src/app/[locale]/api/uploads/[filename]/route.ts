// app/api/uploads/toys/[toyId]/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> } // 👈 params es una Promise
) {
  const { filename } = await params;

  const cleanFilename = path.basename(filename);

  const filePath = path.join(
    process.cwd(),
    'public',
    'uploads',
    cleanFilename
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext];

  if (!mimeType) {
    return NextResponse.json({ error: 'Tipo de archivo no soportado' }, { status: 400 });
  }

  try {
    // ✅ Leer como Buffer y convertir a Uint8Array
    const fileBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}