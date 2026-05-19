'use client';

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Smartphone, Save, Loader2 } from "lucide-react";
import Sidebar from "../../../components/organisms/Sidebar";
import DashboardLayout from "../../../components/templates/DashboardLayout";

export default function SettingsPage() {
  const [appName, setAppName] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Estados de controle da interface
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. CARREGAR CONFIGURAÇÕES DO BANCO
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setAppName(data.appName || "");
            setMaintenanceMode(!!data.maintenanceMode);
            setPushNotifications(!!data.pushNotifications);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar configurações:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // 2. SALVAR ALTERAÇÕES (POST ou PUT)
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          maintenanceMode,
          pushNotifications,
        }),
      });

      if (response.ok) {
        alert("Configurações sincronizadas com o App Mobile com sucesso!");
      } else {
        alert("Erro ao salvar as configurações.");
      }
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <main className="max-w-4xl animate-in fade-in duration-500 transition-colors duration-300">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes do App</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Controle as variáveis globais do seu aplicativo mobile.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-sm font-medium">Carregando configurações do sistema...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Card: Identidade do App */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <Smartphone size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Interface Mobile</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome do Aplicativo</label>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="Ex: Azul Finanças"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
                />
              </div>
            </section>

            {/* Card: Controle de Sistema */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <SettingsIcon size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Sistema e Notificações</h3>
              </div>

              <div className="space-y-4">
                {/* Toggle: Modo Manutenção */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Modo Manutenção</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">Impede o acesso de usuários ao app mobile durante atualizações.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${maintenanceMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenanceMode ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                {/* Toggle: Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Push Notifications Global</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium">Habilita ou desabilita envios automáticos de alertas para todos os dispositivos.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-12 h-6 rounded-full transition-all relative ${pushNotifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushNotifications ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </section>

            {/* Botão de Ação Final */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-xl dark:shadow-none active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sincronizando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Aplicar no App
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}