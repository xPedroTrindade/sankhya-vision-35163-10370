import { useState, useMemo } from "react";
import { FileUpload } from "@/components/FileUpload";
import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar";
import { FilterSection, FilterOptions } from "@/components/FilterSection";
import { parseFile, validateTickets } from "@/utils/fileParser";
import { useTickets } from "@/contexts/TicketContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { tickets, setTickets } = useTickets();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    try {
      const parsedTickets = await parseFile(file);
      const validation = validateTickets(parsedTickets);
      
      if (!validation.valid) {
        toast.error("Erro na validação do arquivo", {
          description: validation.errors.join(", ")
        });
        setIsLoading(false);
        return;
      }

      setTickets(parsedTickets);
      toast.success("Arquivo processado com sucesso!", {
        description: `${parsedTickets.length} tickets carregados e prontos para análise`
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      toast.error("Erro ao processar arquivo", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTickets([]);
    setFilters({});
    toast.info("Dashboard limpo", {
      description: "Importe um novo arquivo para começar"
    });
  };

  // Extract unique processes and requesters for filter dropdowns
  const processes = useMemo(() => {
    const uniqueProcesses = Array.from(new Set(tickets.map(t => t.processo).filter(Boolean)));
    return uniqueProcesses.sort();
  }, [tickets]);

  const requesters = useMemo(() => {
    const uniqueRequesters = Array.from(new Set(tickets.map(t => t.nomeSolicitante).filter(Boolean)));
    return uniqueRequesters.sort();
  }, [tickets]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {tickets.length > 0 && (
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-end">
              <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Novo Arquivo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {tickets.length === 0 ? (
          <div className="max-w-3xl mx-auto mt-12">
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
            <div className="mt-8 p-6 rounded-lg bg-muted/30 border border-border">
              <h3 className="font-semibold text-foreground mb-3">Como usar:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Exporte seus tickets de suporte em formato Excel (.xlsx) ou CSV (.csv)</li>
                <li>2. Certifique-se de que o arquivo contém as colunas necessárias</li>
                <li>3. Faça upload do arquivo usando o botão acima</li>
                <li>4. Visualize insights automáticos e gráficos interativos</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            <FilterSection 
              filters={filters} 
              onFilterChange={setFilters}
              processes={processes}
              requesters={requesters}
            />
            <Dashboard tickets={tickets} filters={filters} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            BPsankhya Analytics • Transformando dados em decisões inteligentes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
