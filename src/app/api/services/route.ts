// Exemplo de rota para buscar e salvar serviços no banco de dados
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db'; // sua configuração do prisma

export async function GET() {
  const services = await db.service.findMany();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newService = await db.service.create({ data: body });
  return NextResponse.json(newService);
}