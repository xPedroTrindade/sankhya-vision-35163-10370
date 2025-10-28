import { Navbar } from "@/components/Navbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompany } from "@/contexts/CompanyContext";
import { Building2, LayoutDashboard, ListChecks, Users, Filter, TrendingUp, Clock, HelpCircle, SmilePlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminMaster = () => {
  const { selectedCompany, setSelectedCompany, companies } = useCompany();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(`/admin/${value}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel Admin Master</h1>
            <p className="text-muted-foreground">
              Gestão completa de clientes e visualização de dados por empresa
            </p>
          </div>

          {/* Filtro de Empresa */}
          <Card className="bg-gradient-card border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Building2 className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Selecione a Empresa</label>
                  <Select value={selectedCompany || ""} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Escolha uma empresa para visualizar os dados" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {!selectedCompany && (
            <Alert>
              <Building2 className="h-4 w-4" />
              <AlertDescription>
                Selecione uma empresa acima para visualizar os dados e acessar as funcionalidades
              </AlertDescription>
            </Alert>
          )}

          {selectedCompany && (
            <Card className="bg-gradient-card border-none shadow-lg">
              <CardContent className="p-6">
                <Tabs defaultValue="dashboard" onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2">
                    <TabsTrigger value="dashboard" className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger value="processos" className="gap-2">
                      <ListChecks className="h-4 w-4" />
                      <span className="hidden sm:inline">Processos</span>
                    </TabsTrigger>
                    <TabsTrigger value="solicitantes" className="gap-2">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Solicitantes</span>
                    </TabsTrigger>
                    <TabsTrigger value="analise-avancada" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Análise</span>
                    </TabsTrigger>
                    <TabsTrigger value="controle-horas" className="gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="hidden sm:inline">Horas</span>
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">FAQ</span>
                    </TabsTrigger>
                    <TabsTrigger value="filtros" className="gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filtros</span>
                    </TabsTrigger>
                    <TabsTrigger value="pesquisa-satisfacao" className="gap-2">
                      <SmilePlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Satisfação</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <div className="text-center p-12 text-muted-foreground">
                      <p className="text-lg mb-2">Clique nas abas acima para acessar cada seção</p>
                      <p className="text-sm">Os dados serão filtrados automaticamente pela empresa selecionada: <span className="font-semibold text-foreground">{selectedCompany}</span></p>
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMaster;
