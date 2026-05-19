import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = await db.report.findMany({
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Simula a criação automática de um documento numerado sequencial
    const total = await db.report.count();
    const newReport = await db.report.create({
      data: {
        name: `Relatório Novo #0${total + 1}`,
        date: new Date(), // Prisma lida com datas nativas do JS
        status: "CONCLUÍDO"
      }
    });
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}