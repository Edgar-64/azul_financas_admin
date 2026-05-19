import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updated = await db.report.update({
      where: { id: params.id },
      data: { name: body.name }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao renomear" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await db.report.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: "Removido com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar" }, { status: 500 });
  }
}