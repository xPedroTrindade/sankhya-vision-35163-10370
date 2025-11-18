/**
 * API Client - Camada de serviços para comunicação com o backend
 * 
 * Este arquivo centraliza todas as chamadas HTTP ao backend Node.js
 * Modos:
 * - MOCK: usa dados estáticos do backend (MOCK_MODE=true)
 * - REAL: conecta à API Freshdesk através do proxy (futuro)
 */

import { Ticket, CompanyData } from '@/types/ticket';

// Configuração da URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper genérico para fazer requisições HTTP
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Serviços da API
 */
export const apiService = {
  /**
   * Retorna o status do backend
   */
  async getStatus() {
    return fetchAPI<{
      status: string;
      mode: string;
      endpoints: Record<string, string>;
    }>('/');
  },

  /**
   * Busca todos os tickets simplificados
   */
  async getTickets(): Promise<Ticket[]> {
    return fetchAPI<Ticket[]>('/api/tickets');
  },

  /**
   * Busca todas as empresas
   */
  async getCompanies(): Promise<CompanyData[]> {
    return fetchAPI<CompanyData[]>('/api/companies');
  },

  /**
   * Busca grupos (company_and_requesters)
   */
  async getGroups() {
    return fetchAPI<any[]>('/api/groups');
  },

  /**
   * Busca lista de tenants disponíveis
   */
  async getTenants(): Promise<string[]> {
    return fetchAPI<string[]>('/api/tenants');
  },

  /**
   * Busca dados de um tenant específico
   */
  async getTenantData(tenantName: string): Promise<Ticket[]> {
    return fetchAPI<Ticket[]>(`/api/tenant/${tenantName}`);
  },

  /**
   * Atualização incremental de tickets de uma empresa
   */
  async updateTickets(empresa: string): Promise<{ ok: boolean; log?: string; error?: string }> {
    return fetchAPI(`/api/update/${empresa}`, {
      method: 'POST',
    });
  },

  /**
   * Reprocessar pipeline completo (admin only)
   */
  async rebuildPipeline(): Promise<{ ok: boolean; message?: string; error?: string }> {
    return fetchAPI('/api/rebuild', {
      method: 'POST',
    });
  },
};

export default apiService;
