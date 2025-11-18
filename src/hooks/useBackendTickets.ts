import { useState, useEffect } from 'react';
import { Ticket } from '@/types/ticket';
import apiService from '@/services/api';
import { toast } from 'sonner';

/**
 * Hook para carregar tickets do backend
 * Substitui o upload manual de arquivos quando conectado ao backend
 */
export function useBackendTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega tickets do backend
   */
  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getTickets();
      setTickets(data);
      toast.success('Tickets carregados do backend', {
        description: `${data.length} tickets disponíveis`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar tickets do backend', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carrega dados de um tenant específico
   */
  const loadTenantData = async (tenantName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getTenantData(tenantName);
      setTickets(data);
      toast.success(`Dados do tenant ${tenantName} carregados`, {
        description: `${data.length} tickets disponíveis`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error('Erro ao carregar dados do tenant', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tickets,
    isLoading,
    error,
    loadTickets,
    loadTenantData,
  };
}
