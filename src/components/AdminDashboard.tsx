import { Ticket } from "@/types/ticket";
import { KPICard } from "./KPICard";
import { InsightCard } from "./InsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterOptions } from "./FilterSection";
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from "recharts";
import { 
  TicketCheck, Clock, AlertTriangle, CheckCircle2,
  TrendingUp, Users, Package, ArrowUpCircle
} from "lucide-react";
import {
  processTicketData,
  getStatusChartData,
  getPriorityChartData,
  getProcessChartData,
  getTypeChartData,
  getTopRequesters,
  getTimelineData,
  generateInsights,
  getCompanyData
} from "@/utils/dataProcessor";
import { getModuleChartData, getTagsChartData, getEscalatedTicketsData } from "@/utils/moduleChartData";

interface AdminDashboardProps {
  tickets: Ticket[];
  selectedCompany?: string;
  filters?: FilterOptions;
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
  'hsl(var(--chart-8))',
];

export const AdminDashboard = ({ tickets, selectedCompany, filters = {} }: AdminDashboardProps) => {
  let filteredTickets = selectedCompany
    ? tickets.filter(t => t.empresa === selectedCompany)
    : tickets;

  // Apply additional filters
  if (filters.status) {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
  }
  if (filters.priority) {
    filteredTickets = filteredTickets.filter(ticket => ticket.prioridade === filters.priority);
  }
  if (filters.process) {
    filteredTickets = filteredTickets.filter(ticket => ticket.processo === filters.process);
  }
  if (filters.requester) {
    filteredTickets = filteredTickets.filter(ticket => ticket.nomeSolicitante === filters.requester);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredTickets = filteredTickets.filter(ticket => 
      ticket.assunto?.toLowerCase().includes(searchLower) ||
      ticket.descricao?.toLowerCase().includes(searchLower)
    );
  }

  const stats = processTicketData(filteredTickets);
  const insights = generateInsights(filteredTickets, stats, true); // true = é admin (inclui insights de tempo)
  const companies = getCompanyData(tickets);

  const statusData = getStatusChartData(filteredTickets);
  const priorityData = getPriorityChartData(filteredTickets);
  const processData = getProcessChartData(filteredTickets);
  const moduleData = getModuleChartData(filteredTickets);
  const typeData = getTypeChartData(filteredTickets);
  const requesterData = getTopRequesters(filteredTickets);
  const timelineData = getTimelineData(filteredTickets);
  const tagsData = getTagsChartData(filteredTickets);
  const escalatedData = getEscalatedTicketsData(filteredTickets);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Dashboard Admin - Análise Completa
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Análise detalhada com métricas de desempenho • {filteredTickets.length} tickets
          {selectedCompany && ` • Empresa: ${selectedCompany}`}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <KPICard
          title="Total de Tickets"
          value={stats.totalTickets}
          icon={TicketCheck}
        />
        <KPICard
          title="Tickets Abertos"
          value={stats.ticketsAbertos}
          icon={AlertTriangle}
          trend={`${Math.round((stats.ticketsAbertos / stats.totalTickets) * 100)}%`}
        />
        <KPICard
          title="Tickets Fechados"
          value={stats.ticketsFechados}
          icon={CheckCircle2}
          trend={`${Math.round((stats.ticketsFechados / stats.totalTickets) * 100)}%`}
        />
        <KPICard
          title="Prioridade Alta"
          value={stats.prioridadeAlta}
          icon={TrendingUp}
        />
        <KPICard
          title="Tempo Médio (horas)"
          value={stats.tempoMedioResolucao}
          icon={Clock}
        />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Insights Automáticos</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Status Chart */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Chart */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Distribuição por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Chart */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Tickets por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={moduleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={80} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-5))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Process Chart */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Tickets por Processo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={processData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={80} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Escalated Tickets */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <ArrowUpCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Tickets Escalados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <PieChart>
                <Pie
                  data={escalatedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {escalatedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Requesters */}
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Top Solicitantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={requesterData.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--foreground))" width={100} fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-6))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="shadow-lg border-none bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            Evolução de Tickets (Últimos 30 Dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={3}
                name="Tickets Criados"
                dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tags Analysis */}
      {tagsData.length > 0 && (
        <Card className="shadow-lg border-none bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm md:text-base">
              <Package className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Tags Mais Utilizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
              <BarChart data={tagsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={11} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
