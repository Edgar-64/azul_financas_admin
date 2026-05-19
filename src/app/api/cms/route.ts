import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Busca o primeiro registro de configuração da landing page
    const cmsData = await db.cmsData.findFirst();
    return NextResponse.json(cmsData || {
      heroTitle: "Soluções Financeiras Inteligentes",
      heroSubtitle: "Controle suas finanças e expanda seu negócio com nossa plataforma completa.",
      ctaText: "Começar Agora Gratuitamente"
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar dados do CMS" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.cmsData.findFirst();

    let updatedCms;
    if (existing) {
      updatedCms = await db.cmsData.update({
        where: { id: existing.id },
        data: body
      });
    } else {
      updatedCms = await db.cmsData.create({
        data: body
      });
    }
    return NextResponse.json(updatedCms);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar dados do CMS" }, { status: 500 });
  }
}