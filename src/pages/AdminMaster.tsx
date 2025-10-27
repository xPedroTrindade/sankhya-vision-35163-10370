import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Users, Clock, TrendingUp, Building2, Plus, Calendar, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { KPICard } from "@/components/KPICard";
import { toast } from "sonner";

// Dados fictícios de clientes
const clientesIniciais = [
  {
    id: 1,
    nome: "Empresa ABC Ltda",
    horasContratadas: 160,
    horasConsumidas: 95,
    status: "ativo",
    dataContrato: "2024-01-15",
    historico: [
      { mes: "Jan", horas: 20 },
      { mes: "Fev", horas: 25 },
      { mes: "Mar", horas: 30 },
      { mes: "Abr", horas: 20 },
    ],
  },
  {
    id: 2,
    nome: "Tech Solutions Corp",
    horasContratadas: 80,
    horasConsumidas: 78,
    status: "ativo",
    dataContrato: "2024-02-01",
    historico: [
      { mes: "Fev", horas: 18 },
      { mes: "Mar", horas: 25 },
      { mes: "Abr", horas: 35 },
    ],
  },
  {
    id: 3,
    nome: "Inovação Digital SA",
    horasContratadas: 120,
    horasConsumidas: 45,
    status: "ativo",
    dataContrato: "2024-03-10",
    historico: [
      { mes: "Mar", horas: 15 },
      { mes: "Abr", horas: 30 },
    ],
  },
  {
    id: 4,
    nome: "Startup XYZ",
    horasContratadas: 40,
    horasConsumidas: 12,
    status: "ativo",
    dataContrato: "2024-03-20",
    historico: [
      { mes: "Mar", horas: 5 },
      { mes: "Abr", horas: 7 },
    ],
  },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--chart-3))'];

const AdminMaster = () => {
  const [clientes, setClientes] = useState(clientesIniciais);
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
  const [horasRegistrar, setHorasRegistrar] = useState("");
  const [mesRegistro, setMesRegistro] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const totalHorasContratadas = clientes.reduce((acc, c) => acc + c.horasContratadas, 0);
  const totalHorasConsumidas = clientes.reduce((acc, c) => acc + c.horasConsumidas, 0);
  const totalHorasDisponiveis = totalHorasContratadas - totalHorasConsumidas;
  const percentualTotal = (totalHorasConsumidas / totalHorasContratadas) * 100;

  // Clientes com alerta (>80% consumo)
  const clientesAlerta = clientes.filter(c => (c.horasConsumidas / c.horasContratadas) * 100 > 80);

  // Dados agregados por mês
  const dadosPorMes = clientes.reduce((acc: any[], cliente) => {
    cliente.historico.forEach(h => {
      const mesExistente = acc.find(m => m.mes === h.mes);
      if (mesExistente) {
        mesExistente.horas += h.horas;
      } else {
        acc.push({ mes: h.mes, horas: h.horas });
      }
    });
    return acc;
  }, []);

  // Dados para gráfico de pizza (distribuição por cliente)
  const dadosPizza = clientes.map(c => ({
    name: c.nome.split(' ')[0],
    value: c.horasConsumidas,
  }));

  const handleRegistrarHoras = () => {
    if (!selectedCliente || !horasRegistrar || !mesRegistro) {
      toast.error("Preencha todos os campos");
      return;
    }

    const horas = parseFloat(horasRegistrar);
    setClientes(prev => prev.map(c => {
      if (c.id === selectedCliente) {
        return {
          ...c,
          horasConsumidas: c.horasConsumidas + horas,
          historico: [...c.historico, { mes: mesRegistro, horas }],
        };
      }
      return c;
    }));

    toast.success(`${horas}h registradas para ${clientes.find(c => c.id === selectedCliente)?.nome}`);
    setOpenDialog(false);
    setHorasRegistrar("");
    setMesRegistro("");
    setSelectedCliente(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel Admin Master</h1>
            <p className="text-muted-foreground">
              Gestão completa de clientes e contratos de horas
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Horas
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Horas Trabalhadas</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select onValueChange={(v) => setSelectedCliente(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Horas Trabalhadas</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 8"
                    value={horasRegistrar}
                    onChange={(e) => setHorasRegistrar(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mês de Referência</Label>
                  <Select onValueChange={setMesRegistro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jan">Janeiro</SelectItem>
                      <SelectItem value="Fev">Fevereiro</SelectItem>
                      <SelectItem value="Mar">Março</SelectItem>
                      <SelectItem value="Abr">Abril</SelectItem>
                      <SelectItem value="Mai">Maio</SelectItem>
                      <SelectItem value="Jun">Junho</SelectItem>
                      <SelectItem value="Jul">Julho</SelectItem>
                      <SelectItem value="Ago">Agosto</SelectItem>
                      <SelectItem value="Set">Setembro</SelectItem>
                      <SelectItem value="Out">Outubro</SelectItem>
                      <SelectItem value="Nov">Novembro</SelectItem>
                      <SelectItem value="Dez">Dezembro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleRegistrarHoras} className="w-full">
                  Registrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total de Clientes"
            value={clientes.length}
            icon={Building2}
            trend={`${clientes.filter(c => c.status === 'ativo').length} ativos`}
            trendUp
          />
          <KPICard
            title="Horas Contratadas"
            value={`${totalHorasContratadas}h`}
            icon={Clock}
            trend="Total em contratos"
            trendUp
          />
          <KPICard
            title="Horas Consumidas"
            value={`${totalHorasConsumidas}h`}
            icon={TrendingUp}
            trend={`${percentualTotal.toFixed(1)}% utilizado`}
            trendUp={percentualTotal < 80}
          />
          <KPICard
            title="Horas Disponíveis"
            value={`${totalHorasDisponiveis}h`}
            icon={Users}
            trend="Restante total"
            trendUp
          />
        </div>

        {/* Alertas */}
        {clientesAlerta.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Clientes com Alto Consumo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clientesAlerta.map(c => {
                  const perc = ((c.horasConsumidas / c.horasContratadas) * 100).toFixed(1);
                  return (
                    <div key={c.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{c.nome}</span>
                      <span className="text-destructive">{perc}% consumido</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gráficos */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Consumo Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Bar dataKey="horas" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosPizza}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes dos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {clientes.map((cliente) => {
                const percentual = (cliente.horasConsumidas / cliente.horasContratadas) * 100;
                const horasRestantes = cliente.horasContratadas - cliente.horasConsumidas;
                const alerta = percentual > 80;
                
                return (
                  <div key={cliente.id} className={`border rounded-lg p-4 space-y-3 ${alerta ? 'border-destructive/50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {cliente.nome}
                          {alerta && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Contrato desde {new Date(cliente.dataContrato).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {cliente.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Contratadas</p>
                        <p className="font-semibold text-lg">{cliente.horasContratadas}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Consumidas</p>
                        <p className="font-semibold text-lg">{cliente.horasConsumidas}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Restantes</p>
                        <p className="font-semibold text-lg text-accent">{horasRestantes}h</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilização</span>
                        <span className={`font-medium ${alerta ? 'text-destructive' : ''}`}>
                          {percentual.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={percentual} className="h-2" />
                    </div>

                    {/* Histórico de consumo */}
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Histórico mensal:</p>
                      <div className="flex gap-2 flex-wrap">
                        {cliente.historico.map((h, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded">
                            {h.mes}: {h.horas}h
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMaster;
