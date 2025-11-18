import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import apiService from '@/services/api';
import { useBackendTickets } from '@/hooks/useBackendTickets';
import { useTickets } from '@/contexts/TicketContext';
import { toast } from 'sonner';

/**
 * Componente para testar e gerenciar conexão com o backend
 */
export function BackendConnection() {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [backendMode, setBackendMode] = useState<string>('');
  
  const { loadTickets, isLoading } = useBackendTickets();
  const { setTickets } = useTickets();

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const status = await apiService.getStatus();
      setConnectionStatus('success');
      setBackendMode(status.mode);
      toast.success('Conexão estabelecida com sucesso!', {
        description: `Backend em modo: ${status.mode.toUpperCase()}`
      });
    } catch (error) {
      setConnectionStatus('error');
      toast.error('Falha na conexão com o backend', {
        description: 'Verifique se o servidor está rodando em http://localhost:3000'
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const loadFromBackend = async () => {
    try {
      const tickets = await apiService.getTickets();
      setTickets(tickets);
      toast.success('Dados carregados do backend!', {
        description: `${tickets.length} tickets importados com sucesso`
      });
    } catch (error) {
      toast.error('Erro ao carregar dados do backend');
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Conexão com Backend
        </CardTitle>
        <CardDescription>
          Gerencie a conexão com o servidor Node.js (Mock Mode)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button 
            onClick={testConnection} 
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
          >
            {isTestingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Testar Conexão
          </Button>

          {connectionStatus === 'success' && (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Conectado
            </Badge>
          )}
          
          {connectionStatus === 'error' && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Desconectado
            </Badge>
          )}
        </div>

        {backendMode && (
          <div className="text-sm text-muted-foreground">
            Modo do backend: <strong className="text-foreground">{backendMode.toUpperCase()}</strong>
          </div>
        )}

        {connectionStatus === 'success' && (
          <Button 
            onClick={loadFromBackend} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Database className="h-4 w-4 mr-2" />
            )}
            Carregar Tickets do Backend
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
