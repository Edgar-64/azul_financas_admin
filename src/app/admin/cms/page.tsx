'use client';

import { useState, useEffect } from "react";
import { Save, ImageIcon, MessageSquare, Type, Loader2 } from "lucide-react";
import Sidebar from "../../../components/organisms/Sidebar";
import DashboardLayout from "../../../components/templates/DashboardLayout";

export default function CMSPage() {
  // Estados para gerenciar o conteúdo da Landing Page de forma dinâmica
  const [heroTitle, setHeroTitle] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialText, setTestimonialText] = useState("");
  
  // Estados de controle da interface
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. CARREGAR OS DADOS ATUAIS DO CMS DO BANCO
  useEffect(() => {
    async function loadCMSData() {
      try {
        const response = await fetch("/api/cms");
        if (response.ok) {
          const data = await response.json();
          // Se houver dados no banco, preenche os estados. Senão, mantém vazio ou defaults.
          if (data) {
            setHeroTitle(data.heroTitle || "");
            setBannerUrl(data.bannerUrl || "");
            setTestimonialName(data.testimonialName || "");
            setTestimonialText(data.testimonialText || "");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do CMS:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCMSData();
  }, []);

  // 2. ENVIAR AS ATUALIZAÇÕES PARA O BANCO DE DADOS (POST ou PUT)
  const handleSaveCMS = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroTitle,
          bannerUrl,
          testimonialName,
          testimonialText,
        }),
      });

      if (response.ok) {
        alert("Conteúdo da Landing Page atualizado com sucesso!");
      } else {
        alert("Erro ao salvar as alterações do CMS.");
      }
    } catch (error) {
      console.error("Erro ao atualizar CMS:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <main className="max-w-4xl animate-in fade-in duration-500">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestão de Conteúdo</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
            Edite textos e imagens da Landing Page sem alterar o código.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-sm font-medium">Carregando dados da Landing Page...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seção: Hero Banner */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <Type size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Hero Section (Início)</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Título Principal</label>
                  <input 
                    type="text" 
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Ex: Simplifique sua vida financeira"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">URL da Imagem de Fundo</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="https://exemplo.com/banner.jpg"
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    />
                    <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <ImageIcon size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Seção: Depoimentos */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400">
                <MessageSquare size={20} />
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Depoimentos</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nome do Cliente</label>
                  <input 
                    type="text" 
                    value={testimonialName}
                    onChange={(e) => setTestimonialName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Depoimento</label>
                  <textarea 
                    value={testimonialText}
                    onChange={(e) => setTestimonialText(e.target.value)}
                    placeholder="Ex: O melhor app de finanças que já usei!"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all min-h-[100px]"
                  />
                </div>
              </div>
            </section>

            {/* Botão de Salvar */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSaveCMS}
                disabled={saving}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Publicando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Publicar Alterações
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