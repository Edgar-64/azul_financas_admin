import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 1. Busca contadores reais do banco
    const totalUsers = await db.user.count();
    const totalReports = await db.report.count();

    // 2. Busca as últimas 3 transações/atividades para o painel
    // Se você não tiver uma tabela de transações, pode buscar os últimos usuários criados ou serviços
    const latestTransactions = [
      { id: '1', type: 'Entrada', title: 'Assinatura Premium', value: 'R$ 200,00', date: 'Hoje' },
      { id: '2', type: 'Saída', title: 'Servidor AWS', value: 'R$ 500,00', date: 'Ontem' },
      { id: '3', type: 'Saída', title: 'Domínio Anual', value: 'R$ 120,00', date: '02 Abr' },
    ];

    // Dados mockados para o esqueleto do gráfico (substitua por queries de agregação se necessário)
    const chartData = [40, 60, 30, 80, 50, 90, 70];
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"];

    return NextResponse.json({
      totalRevenue: "R$ 25.000,00", // Pode ser estático ou somado do seu banco
      activeUsers: totalUsers || 1245, // Fallback caso o banco esteja vazio no início
      totalReports: totalReports,
      chartData,
      months,
      transactions: latestTransactions
    });
  } catch (error) {
    console.error("Erro no GET do Dashboard:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}