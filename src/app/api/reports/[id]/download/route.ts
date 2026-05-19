import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const report = await db.report.findUnique({
      where: { id: params.id }
    });

    if (!report) {
      return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
    }

    // Conteúdo simulado do arquivo (pode ser um CSV estruturado do seu relatório real)
    const fileContent = `Relatorio: ${report.name}\nData de Emissao: ${report.date}\nStatus: ${report.status}\n\nDados consolidados de operacao da plataforma de financas.`;
    
    // Transforma a string em um buffer de download
    const buffer = Buffer.from(fileContent, 'utf-8');

    return new NextResponse(buffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${report.name.replace(/\s+/g, '_')}.txt"`,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro no download" }, { status: 500 });
  }
}