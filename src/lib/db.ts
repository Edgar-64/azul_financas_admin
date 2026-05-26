import axios from 'axios';

// Força o endereço base do seu NestJS
const BACKEND_URL = 'http://localhost:3000'; 

export const db = axios.create({
  baseURL: BACKEND_URL, // 👈 O Axios assume isso como o início de TODA requisição
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token se existir
db.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function dbRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string, // Aqui você vai passar apenas "/Admin", "/Admin/cadastrar", etc.
  data?: any
): Promise<T> {
  try {
    const response = await db({
      method,
      url, // 👈 O Axios junta automaticamente BACKEND_URL + url (ex: http://localhost:3000 + /Admin)
      data,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro interno na requisição';
    
    // eslint-disable-next-line no-console
    console.error(`❌ Erro na requisição [${method}] para ${url}:`, error);
    
    throw new Error(errorMessage);
  }
}