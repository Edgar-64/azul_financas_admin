'use client';

import { useState, useEffect } from "react";
import { 
  DollarSign, Users, BarChart3, ArrowUpRight, ArrowDownLeft, Loader2 
} from "lucide-react";
import Sidebar from "../../components/organisms/Sidebar";
import DashboardLayout from "../../components/templates/DashboardLayout";

interface Transaction {
  id: string | number;
  type: 'Entrada' | 'Saída';
  title: string;
  value: string; // Ex: "R$ 200,00" ou apenas o número formatado
  date: string;
}

interface DashboardData {
  totalRevenue: string;
  activeUsers: number;
  totalReports: number;
  chartData: number[];
  months: string[];
  transactions: Transaction[];
}

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR OS DADOS DINÂMICOS DO DASHBOARD
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // 2. EXPORTAR RELATÓRIO VIA CSV UTILIZANDO OS DADOS REAIS
  const handleExport = () => {
    if (!data || data.transactions.length === 0) {
      alert("Não há dados de transações para exportar.");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Tipo,Titulo,Valor,Data\n"
      + data.transactions.map(t => `${t.id},${t.type},${t.title},${t.value},${t.date}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_azul_financas_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <main className="animate-in fade-in duration-500 pb-10 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="mb-8 px-4 md:px-0 pt-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Controle financeiro atualizado em tempo real.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-24 gap-3 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mx-4 md:mx-0">
            <Loader2 className="animate-spin text-blue-600" size={36} />
            <p className="text-sm font-medium">Consolidando métricas financeiras...</p>
          </div>
        ) : !data ? (
          <div className="text-center p-12 text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 mx-4 md:mx-0">
            Não foi possível carregar os dados consolidados do painel.
          </div>
        ) : (
          <>
            {/* Cards de Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4 md:px-0">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-all hover:shadow-md">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Receita Total</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{data.totalRevenue}</h3>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex-shrink-0">
                  <DollarSign size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-all hover:shadow-md">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Usuários Ativos</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {data.activeUsers.toLocaleString('pt-BR')}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex-shrink-0">
                  <Users size={24} />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Relatórios</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{data.totalReports}</h3>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                  <BarChart3 size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
              {/* Gráfico de Desempenho */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Desempenho Mensal</h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full uppercase">Relatório {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-end gap-3 sm:gap-5 h-64 overflow-x-auto pb-4 scrollbar-hide">
                  {data.chartData.map((h, i) => (
                    <div key={i} className="flex flex-col items-center flex-1 min-w-[35px] group">
                      <div 
                        className="w-full max-w-[40px] bg-blue-600 dark:bg-blue-500 rounded-t-xl transition-all duration-300 group-hover:bg-blue-400 relative"
                        style={{ height: `${h * 2}px` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-xl" />
                      </div>
                      <span className="text-[11px] mt-4 font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{data.months[i] || ""}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimas Atividades */}
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-all">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-8">Últimas Atividades</h3>
                <div className="space-y-4 flex-1">
                  {data.transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl shadow-sm ${t.type === 'Entrada' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'}`}>
                          {t.type === 'Entrada' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{t.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{t.date}</p>
                        </div>
                      </div>
                      <span className={`font-black text-sm whitespace-nowrap ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                        {t.type === 'Entrada' ? `+ ${t.value.split(',')[0]}` : `- ${t.value.split(',')[0]}`}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleExport}
                  className="w-full mt-8 py-4 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]"
                >
                  Exportar Relatório
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}