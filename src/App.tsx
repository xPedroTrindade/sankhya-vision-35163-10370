import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TicketProvider } from "./contexts/TicketContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminMaster from "./pages/AdminMaster";
import Index from "./pages/Index";
import Processos from "./pages/Processos";
import Solicitantes from "./pages/Solicitantes";
import Filtros from "./pages/Filtros";
import AnaliseAvancada from "./pages/AnaliseAvancada";
import ControleHoras from "./pages/ControleHoras";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <TicketProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute requireRole="admin">
                    <AdminMaster />
                  </ProtectedRoute>
                } />
                <Route path="/" element={
                  <ProtectedRoute requireRole="client">
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/processos" element={
                  <ProtectedRoute requireRole="client">
                    <Processos />
                  </ProtectedRoute>
                } />
                <Route path="/solicitantes" element={
                  <ProtectedRoute requireRole="client">
                    <Solicitantes />
                  </ProtectedRoute>
                } />
                <Route path="/filtros" element={
                  <ProtectedRoute requireRole="client">
                    <Filtros />
                  </ProtectedRoute>
                } />
                <Route path="/analise-avancada" element={
                  <ProtectedRoute requireRole="client">
                    <AnaliseAvancada />
                  </ProtectedRoute>
                } />
                <Route path="/controle-horas" element={
                  <ProtectedRoute requireRole="client">
                    <ControleHoras />
                  </ProtectedRoute>
                } />
                <Route path="/faq" element={
                  <ProtectedRoute requireRole="client">
                    <FAQ />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TicketProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
