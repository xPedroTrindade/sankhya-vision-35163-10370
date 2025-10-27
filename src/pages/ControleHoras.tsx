import { useState } from "react";
import { Navbar } from "@/components/Navbar";
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
  Info
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
  ];

  const [mesSelecionado, setMesSelecionado] = useState("Outubro 2025");
  
  // Buscar dados do mês selecionado
  const dadosMesAtual = historicoMensal.find(
    item => `${item.month} ${item.year}` === mesSelecionado
  ) || historicoMensal[historicoMensal.length - 1];

  // Função para determinar cor do status
  const getStatusColor = (percentual: number) => {
    if (percentual >= 90) return "destructive";
    if (percentual >= 75) return "warning";
    return "success";
  };

  // Função para determinar cor da badge
  const getBadgeVariant = (percentual: number) => {
    if (percentual >= 90) return "destructive";
    if (percentual >= 75) return "default";
    return "secondary";
  };

  // Função para mensagem de alerta
  const getMensagemAlerta = (percentual: number) => {
    if (percentual >= 90) 
      return "⚠️ Atenção: Mais de 90% das horas foram utilizadas neste mês.";
    if (percentual >= 75) 
      return "💡 Aviso: Você já utilizou mais de 75% das horas do mês.";
    return "✅ Consumo saudável. Continue acompanhando o uso das horas.";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Controle de Horas de Suporte
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o uso mensal de horas contratadas do seu contrato de SLA
          </p>
        </div>

        {/* Filtro de Mês */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Card className="border-none shadow-lg bg-gradient-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Selecione o período:</span>
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

              <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    O ciclo de horas é reiniciado a cada mês. As horas não são cumulativas entre períodos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Mês Atual */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              {dadosMesAtual.month} {dadosMesAtual.year}
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
                        ? 'bg-destructive shadow-lg' 
                        : dadosMesAtual.percentualUtilizado >= 75 
                        ? 'bg-warning shadow-lg' 
                        : 'bg-gradient-success shadow-success'
                    }`}
                    style={{ width: `${dadosMesAtual.percentualUtilizado}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                dadosMesAtual.percentualUtilizado >= 90 
                  ? 'bg-destructive/10 border border-destructive/20' 
                  : dadosMesAtual.percentualUtilizado >= 75 
                  ? 'bg-warning/10 border border-warning/20' 
                  : 'bg-success/10 border border-success/20'
              }`}>
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  dadosMesAtual.percentualUtilizado >= 90 
                    ? 'text-destructive' 
                    : dadosMesAtual.percentualUtilizado >= 75 
                    ? 'text-warning' 
                    : 'text-success'
                }`} />
                <p className="text-sm text-foreground">
                  {getMensagemAlerta(dadosMesAtual.percentualUtilizado)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Meses Anteriores */}
        <div className="animate-fade-in" style={{ animationDelay: "600ms" }}>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Histórico Mensal
          </h2>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Resumo dos Últimos Meses</CardTitle>
            </CardHeader>
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
                        className="hover:bg-muted/30 transition-colors"
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
                                    ? 'bg-destructive' 
                                    : item.percentualUtilizado >= 75 
                                    ? 'bg-warning' 
                                    : 'bg-success'
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
                              ? 'Crítico' 
                              : item.percentualUtilizado >= 75 
                              ? 'Atenção' 
                              : 'Saudável'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
