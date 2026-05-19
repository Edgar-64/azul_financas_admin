'use client';

import { useState, useEffect } from "react";
import { FileText, Edit3, Download, Trash2, Plus, X, CheckCircle2, Loader2 } from "lucide-react";
import Sidebar from "../../../components/organisms/Sidebar";
import DashboardLayout from "../../../components/templates/DashboardLayout";

interface Report {
  id: string; // Alterado para string para suportar os IDs do banco (UUID/CUID)
  name: string;
  date: string;
  status: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<{ id: string; name: string } | null>(null);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // 1. CARREGAR OS RELATÓRIOS DO BANCO
  async function loadReports() {
    setLoading(true);
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
      showToast("Erro ao carregar relatórios.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  // 2. CRIAR UM NOVO RELATÓRIO (POST)
  const handleCreate = async () => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports([newReport, ...reports]);
        showToast("Relatório gerado com sucesso!");
      } else {
        showToast("Erro ao gerar relatório.");
      }
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      showToast("Erro de conexão ao criar.");
    }
  };

  const openEditModal = (id: string, name: string) => {
    setCurrentReport({ id, name });
    setNewName(name);
    setIsModalOpen(true);
  };

  // 3. SALVAR EDIÇÃO DE NOME (PUT)
  const saveEdit = async () => {
    if (!currentReport) return;

    try {
      const response = await fetch(`/api/reports/${currentReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReports(reports.map(r => r.id === currentReport.id ? updatedReport : r));
        setIsModalOpen(false);
        showToast("Nome do relatório atualizado!");
      } else {
        showToast("Erro ao renomear.");
      }
    } catch (error) {
      console.error("Erro ao editar relatório:", error);
      showToast("Erro de conexão ao salvar.");
    }
  };

  // 4. DOWNLOAD DO RELATÓRIO
  const handleDownload = async (id: string, name: string) => {
    showToast(`Iniciando download: ${name}...`);
    try {
      // Redireciona ou engaja o endpoint de download do Next.js de forma nativa
      window.open(`/api/reports/${id}/download`, '_blank');
    } catch (error) {
      console.error("Erro no download:", error);
      showToast("Não foi possível baixar o arquivo.");
    }
  };

  // 5. EXCLUIR RELATÓRIO (DELETE)
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar permanentemente este relatório?")) return;

    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReports(reports.filter(r => r.id !== id));
        showToast("Relatório removido com sucesso.");
      } else {
        showToast("Erro ao excluir relatório.");
      }
    } catch (error) {
      console.error("Erro ao deletar relatório:", error);
      showToast("Erro de conexão ao deletar.");
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <main className="relative transition-colors duration-300">
        
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-10 right-10 bg-slate-900 dark:bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[100]">
            <CheckCircle2 className="text-emerald-400 dark:text-white" size={20} />
            <span className="text-sm font-bold">{toast}</span>
          </div>
        )}

        {/* MODAL DE EDIÇÃO */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-transparent dark:border-slate-800 animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Editar Documento</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 ml-1">Nome do Relatório</p>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-6 font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all mb-8"
              />
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancelar</button>
                <button onClick={saveEdit} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 px-4 md:px-0">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Relatórios</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Controle total dos seus documentos financieros.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 dark:shadow-none transition-all active:scale-95"
          >
            <Plus size={20} /> Novo Relatório
          </button>
        </div>

        {/* TABELA DE RELATÓRIOS */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-all">
          <div className="grid grid-cols-12 px-6 sm:px-10 py-5 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <div className="col-span-9">Documento</div>
            <div className="col-span-3 text-right">Ações</div>
          </div>

          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm font-medium">Buscando documentos armazenados...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
                Nenhum relatório encontrado no sistema.
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="grid grid-cols-12 px-6 sm:px-10 py-8 items-center hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all group">
                  <div className="col-span-9 flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-1 truncate">{report.name}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {new Date(report.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">{report.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-end gap-1 sm:gap-3">
                    <button onClick={() => openEditModal(report.id, report.name)} className="p-2 sm:p-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDownload(report.id, report.name)} className="p-2 sm:p-3 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all">
                      <Download size={18} />
                    </button>
                    <button onClick={() => handleDelete(report.id)} className="p-2 sm:p-3 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}