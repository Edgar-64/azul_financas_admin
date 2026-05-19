'use client';

import { Trash2, Edit, UserPlus, X, Mail, User, ShieldCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/organisms/Sidebar";
import DashboardLayout from "../../../components/templates/DashboardLayout";

interface UserType {
  id: string; // Mudado para string caso use IDs UUID/CUID do banco de dados
  name: string;
  email: string;
  status: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'Ativo' });

  // 1. BUSCAR USUÁRIOS DA API DO PROJETO
  async function loadUsers() {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenModal = (user: UserType | null = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({ name: user.name, email: user.email, status: user.status });
    } else {
      setCurrentUser(null);
      setFormData({ name: '', email: '', status: 'Ativo' });
    }
    setIsModalOpen(true);
  };

  // 2. SALVAR OU ATUALIZAR (REQUISIÇÕES REAIS)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser) {
        // Atualizar usuário existente (PUT)
        const response = await fetch(`/api/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        }
      } else {
        // Criar novo usuário (POST)
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newUser = await response.json();
          setUsers([newUser, ...users]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Não foi possível salvar as alterações.");
    }
  };

  // 3. DELETAR DO BANCO (REQUISIÇÃO REAL)
  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este usuário permanentemente?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(u => u.id !== id));
        } else {
          alert("Erro ao excluir usuário.");
        }
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        
        {/* Header da Tabela */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Usuários</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Controle de acessos da Azul Finanças</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm shadow-blue-200 dark:shadow-none font-semibold active:scale-95"
          >
            <UserPlus size={20} /> Novo Usuário
          </button>
        </div>

        {/* TABELA / ESTADO DE LOADING */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-slate-500">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm font-medium">Carregando usuários do sistema...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-12 text-slate-500 dark:text-slate-400">
              Nenhum usuário cadastrado no sistema.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-900 dark:text-slate-100 text-xs uppercase font-bold tracking-widest bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-tight ${
                        user.status === 'Ativo' 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleOpenModal(user)} 
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                  {currentUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <User size={16} className="text-blue-600" /> Nome Completo
                  </label>
                  <input 
                    required
                    placeholder="Ex: Neymar Júnior"
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <Mail size={16} className="text-blue-600" /> E-mail Profissional
                  </label>
                  <input 
                    required
                    placeholder="admin@azulfinancas.com"
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    <ShieldCheck size={16} className="text-blue-600" /> Status da Conta
                  </label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all appearance-none"
                  >
                    <option value="Ativo" className="dark:bg-slate-900">Ativo</option>
                    <option value="Pendente" className="dark:bg-slate-900">Pendente</option>
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 font-bold text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 dark:shadow-none"
                  >
                    {currentUser ? 'Atualizar' : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}