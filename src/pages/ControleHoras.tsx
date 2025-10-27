import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { FilterSection, FilterOptions } from "@/components/FilterSection";
import { generateMockTickets } from "@/utils/mockTickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Tipos
interface MonthData {
  month: string;
  year: number;
  horasContratadas: number;
  horasConcluidas: number;
  horasRestantes: number;
  percentualUtilizado: number;
}

export default function ControleHoras() {
  const navigate = useNavigate();
  
  // Carregar tickets fictícios
  const mockTickets = useMemo(() => generateMockTickets(), []);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showHistorico, setShowHistorico] = useState(false);
  
  // Dados simulados - futuramente integrar com API/Banco
  const historicoMensal: MonthData[] = [
    {
      month: "Janeiro",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 38,
      horasRestantes: 2,
      percentualUtilizado: 95
    },
    {
      month: "Fevereiro",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 35,
      horasRestantes: 5,
      percentualUtilizado: 87.5
    },
    {
      month: "Março",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 40,
      horasRestantes: 0,
      percentualUtilizado: 100
    },
    {
      month: "Abril",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 32,
      horasRestantes: 8,
      percentualUtilizado: 80
    },
    {
      month: "Maio",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 28,
      horasRestantes: 12,
      percentualUtilizado: 70
    },
    {
      month: "Junho",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 36,
      horasRestantes: 4,
      percentualUtilizado: 90
    },
    {
      month: "Julho",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 33,
      horasRestantes: 7,
      percentualUtilizado: 82.5
    },
    {
      month: "Agosto",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 39,
      horasRestantes: 1,
      percentualUtilizado: 97.5
    },
    {
      month: "Setembro",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 40,
      horasRestantes: 0,
      percentualUtilizado: 100
    },
    {
      month: "Outubro",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 35,
      horasRestantes: 5,
      percentualUtilizado: 87.5
    },
    {
      month: "Setembro",
      year: 2025,
      horasContratadas: 40,
      horasConcluidas: 40,
      horasRestantes: 0,
      percentualUtilizado: 100
    },
  ];

  // Extract unique processes and requesters for filter dropdowns
  const processes = useMemo(() => {
    const uniqueProcesses = Array.from(new Set(mockTickets.map(t => t.processo).filter(Boolean)));
    return uniqueProcesses.sort();
  }, [mockTickets]);

  const requesters = useMemo(() => {
    const uniqueRequesters = Array.from(new Set(mockTickets.map(t => t.nomeSolicitante).filter(Boolean)));
    return uniqueRequesters.sort();
  }, [mockTickets]);

  const [mesSelecionado, setMesSelecionado] = useState("Outubro 2025");
  
  // Buscar dados do mês selecionado
  const dadosMesAtual = historicoMensal.find(
    item => `${item.month} ${item.year}` === mesSelecionado
  ) || historicoMensal[0];
  
  // Filtrar tickets pelo mês selecionado
  const getMonthNumber = (monthName: string): number => {
    const months: Record<string, number> = {
      'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
      'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
      'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
    };
    return months[monthName] ?? -1;
  };

  const filteredTicketsByMonth = useMemo(() => {
    const targetMonth = getMonthNumber(dadosMesAtual.month);
    if (targetMonth === -1) return mockTickets;

    return mockTickets.filter(ticket => {
      try {
        const dateStr = ticket.horaCriacao;
        let date: Date | null = null;

        if (dateStr.includes('/')) {
          const parts = dateStr.split(/[/, ]/);
          if (parts.length >= 3) {
            date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
        } else {
          date = new Date(dateStr);
        }

        if (!date || isNaN(date.getTime())) return false;
        
        return date.getMonth() === targetMonth && date.getFullYear() === dadosMesAtual.year;
      } catch {
        return false;
      }
    });
  }, [mockTickets, dadosMesAtual]);

  // Função para determinar cor do status (INVERTIDO: usar todas as horas = saudável)
  const getStatusColor = (percentual: number) => {
    if (percentual >= 90) return "success"; // Verde - ótima utilização
    if (percentual >= 75) return "warning"; // Amarelo - boa utilização
    return "destructive"; // Vermelho - baixa utilização
  };

  // Função para determinar cor da badge (INVERTIDO)
  const getBadgeVariant = (percentual: number) => {
    if (percentual >= 90) return "secondary"; // Verde
    if (percentual >= 75) return "default"; // Amarelo
    return "destructive"; // Vermelho
  };

  // Função para mensagem de alerta (INVERTIDO)
  const getMensagemAlerta = (percentual: number) => {
    if (percentual >= 90) 
      return "✅ Excelente! Você está utilizando as horas contratadas de forma eficiente.";
    if (percentual >= 75) 
      return "💡 Boa utilização. Considere usar o restante das horas disponíveis.";
    return "⚠️ Atenção: Baixa utilização das horas contratadas. Aproveite melhor seu contrato!";
  };

  // Função para navegar ao dashboard filtrado por mês
  const handleMonthClick = (month: string, year: number) => {
    navigate('/', { 
      state: { 
        filterMonth: month,
        filterYear: year 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Controle de Horas de Suporte
          </h1>
          <p className="text-muted-foreground">
            Visualização inteligente do uso de horas contratadas • {filteredTicketsByMonth.length} tickets em {dadosMesAtual.month}
          </p>
        </div>

        {/* Filtro de Mês e Filtros */}
        <div className="mb-6 animate-fade-in space-y-4" style={{ animationDelay: "100ms" }}>
          <Card className="border-none shadow-lg bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Período:</span>
                </div>
                <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
                  <SelectTrigger className="w-[200px] bg-background">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {historicoMensal.map((item) => (
                      <SelectItem 
                        key={`${item.month}-${item.year}`} 
                        value={`${item.month} ${item.year}`}
                      >
                        {item.month} {item.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <FilterSection 
            filters={filters} 
            onFilterChange={setFilters}
            processes={processes}
            requesters={requesters}
          />
        </div>

        {/* Dashboard com dados do mês */}
        <Dashboard tickets={filteredTicketsByMonth} filters={filters} />

        {/* Resumo de Horas do Mês Atual */}
        <div className="mb-8 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Resumo de Horas - {dadosMesAtual.month} {dadosMesAtual.year}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card Horas Contratadas */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all animate-fade-in" 
                  style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Horas Contratadas</p>
                    <p className="text-4xl font-bold text-foreground">{dadosMesAtual.horasContratadas}h</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-primary">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Horas Concluídas */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all animate-fade-in" 
                  style={{ animationDelay: "300ms" }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Horas Concluídas</p>
                    <p className="text-4xl font-bold text-foreground">{dadosMesAtual.horasConcluidas}h</p>
                    <p className="text-xs text-muted-foreground">
                      {dadosMesAtual.percentualUtilizado.toFixed(1)}% utilizado
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-accent">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Horas Restantes */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all animate-fade-in" 
                  style={{ animationDelay: "400ms" }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Horas Restantes</p>
                    <p className="text-4xl font-bold text-foreground">{dadosMesAtual.horasRestantes}h</p>
                    <p className="text-xs text-muted-foreground">
                      {(100 - dadosMesAtual.percentualUtilizado).toFixed(1)}% disponível
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gradient-success">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barra de Progresso e Alerta */}
          <Card className="border-none shadow-lg animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Progresso de Utilização</span>
                  <span className="font-bold text-foreground text-lg">
                    {dadosMesAtual.percentualUtilizado.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      dadosMesAtual.percentualUtilizado >= 90 
                        ? 'bg-gradient-success shadow-success' 
                        : dadosMesAtual.percentualUtilizado >= 75 
                        ? 'bg-warning shadow-lg' 
                        : 'bg-destructive shadow-lg'
                    }`}
                    style={{ width: `${dadosMesAtual.percentualUtilizado}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                dadosMesAtual.percentualUtilizado >= 90 
                  ? 'bg-success/10 border border-success/20' 
                  : dadosMesAtual.percentualUtilizado >= 75 
                  ? 'bg-warning/10 border border-warning/20' 
                  : 'bg-destructive/10 border border-destructive/20'
              }`}>
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  dadosMesAtual.percentualUtilizado >= 90 
                    ? 'text-success' 
                    : dadosMesAtual.percentualUtilizado >= 75 
                    ? 'text-warning' 
                    : 'text-destructive'
                }`} />
                <p className="text-sm text-foreground">
                  {getMensagemAlerta(dadosMesAtual.percentualUtilizado)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Contratos - Expansível */}
        <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <Card className="border-none shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setShowHistorico(!showHistorico)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Ver Histórico de Contratos</CardTitle>
                </div>
                {showHistorico ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            
            {showHistorico && (
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-bold">Período</TableHead>
                      <TableHead className="font-bold text-center">Contratadas</TableHead>
                      <TableHead className="font-bold text-center">Concluídas</TableHead>
                      <TableHead className="font-bold text-center">Restantes</TableHead>
                      <TableHead className="font-bold text-center">Utilização</TableHead>
                      <TableHead className="font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historicoMensal.map((item, index) => (
                      <TableRow 
                        key={`${item.month}-${item.year}`}
                        onClick={() => handleMonthClick(item.month, item.year)}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {item.month} {item.year}
                        </TableCell>
                        <TableCell className="text-center">{item.horasContratadas}h</TableCell>
                        <TableCell className="text-center font-semibold">
                          {item.horasConcluidas}h
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={item.horasRestantes === 0 ? 'text-muted-foreground' : 'font-medium'}>
                            {item.horasRestantes}h
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className={`h-full rounded-full ${
                                  item.percentualUtilizado >= 90 
                                    ? 'bg-success' 
                                    : item.percentualUtilizado >= 75 
                                    ? 'bg-warning' 
                                    : 'bg-destructive'
                                }`}
                                style={{ width: `${item.percentualUtilizado}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[45px] text-right">
                              {item.percentualUtilizado.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={getBadgeVariant(item.percentualUtilizado)}>
                            {item.percentualUtilizado >= 90 
                              ? 'Saudável' 
                              : item.percentualUtilizado >= 75 
                              ? 'Atenção' 
                              : 'Crítico'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
