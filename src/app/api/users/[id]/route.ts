import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status
      }
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await db.user.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: "Usuário removido" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}