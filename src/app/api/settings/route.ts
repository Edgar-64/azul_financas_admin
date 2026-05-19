import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.appSettings.findFirst();
    return NextResponse.json(settings || {
      appName: "Azul Finanças",
      maintenanceMode: false,
      pushNotifications: true
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.appSettings.findFirst();

    let updatedSettings;
    if (existing) {
      updatedSettings = await db.appSettings.update({
        where: { id: existing.id },
        data: body
      });
    } else {
      updatedSettings = await db.appSettings.create({
        data: body
      });
    }
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}