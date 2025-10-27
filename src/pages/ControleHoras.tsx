import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export default function ControleHoras() {
  // Dados simulados - futuramente integrar com API/Banco
  const horasContratadas = 100;
  const horasConsumidas = 67;
  const horasRestantes = horasContratadas - horasConsumidas;
  const percentualConsumido = (horasConsumidas / horasContratadas) * 100;

  const chartData = [
    { name: "Consumidas", value: horasConsumidas, color: "hsl(var(--chart-1))" },
    { name: "Restantes", value: horasRestantes, color: "hsl(var(--chart-3))" },
  ];

  const cards = [
    {
      title: "Horas Contratadas",
      value: `${horasContratadas}h`,
      icon: Clock,
      gradient: "bg-gradient-primary",
      iconBg: "bg-gradient-secondary",
    },
    {
      title: "Horas Consumidas",
      value: `${horasConsumidas}h`,
      icon: TrendingUp,
      gradient: "bg-gradient-accent",
      iconBg: "bg-gradient-accent",
      subtitle: `${percentualConsumido.toFixed(1)}% do contrato`,
    },
    {
      title: "Horas Restantes",
      value: `${horasRestantes}h`,
      icon: TrendingDown,
      gradient: "bg-gradient-success",
      iconBg: "bg-gradient-success",
      subtitle: `${(100 - percentualConsumido).toFixed(1)}% disponível`,
    },
    {
      title: "Status do Contrato",
      value: percentualConsumido < 80 ? "Saudável" : "Atenção",
      icon: Activity,
      gradient: percentualConsumido < 80 ? "bg-gradient-success" : "bg-warning",
      iconBg: percentualConsumido < 80 ? "bg-success" : "bg-warning",
      subtitle: "Monitoramento ativo",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Controle de Horas</h1>
          <p className="text-muted-foreground">
            Acompanhe o consumo de horas do seu contrato de SLA em tempo real
          </p>
        </div>

        {/* Cards de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, index) => (
            <Card 
              key={card.title}
              className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold text-foreground animate-pulse">{card.value}</p>
                    {card.subtitle && (
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${card.iconBg}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráfico de Donut e Detalhes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-card animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Distribuição de Horas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle className="text-foreground">Análise Detalhada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso de Consumo</span>
                  <span className="font-semibold text-foreground">{percentualConsumido.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-accent h-full rounded-full transition-all duration-1000 ease-out shadow-glow"
                    style={{ width: `${percentualConsumido}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Média Mensal</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(horasConsumidas / 3).toFixed(1)}h
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Projeção</p>
                  <p className="text-2xl font-bold text-foreground">
                    {((horasConsumidas / 3) * 4).toFixed(0)}h
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gradient-success rounded-lg text-white shadow-success">
                <p className="text-sm font-medium mb-2">💡 Recomendação</p>
                <p className="text-xs opacity-95">
                  {percentualConsumido < 70 
                    ? "Seu consumo está dentro do esperado. Continue monitorando."
                    : percentualConsumido < 90
                    ? "Atenção: você já consumiu mais de 70% do contrato. Planeje suas demandas."
                    : "Crítico: menos de 10% de horas disponíveis. Considere renovação."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card className="border-none shadow-lg bg-card animate-fade-in" style={{ animationDelay: "600ms" }}>
          <CardHeader>
            <CardTitle className="text-foreground">Histórico e Tendências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Última Atualização</p>
                <p className="text-lg font-semibold text-foreground">Hoje, 14:30</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Tickets Atendidos</p>
                <p className="text-lg font-semibold text-foreground">48 tickets</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Tempo Médio/Ticket</p>
                <p className="text-lg font-semibold text-foreground">1.4h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
