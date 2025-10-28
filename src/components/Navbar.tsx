import { NavLink, useNavigate } from "react-router-dom";
import { Home, Filter, Package, Users, TrendingUp, Clock, HelpCircle, Moon, Sun, Eye, Type, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import sankhyaIcon from "@/assets/sankhya-icon.png";

export const Navbar = () => {
  const { isDarkMode, isAccessibilityMode, fontSize, toggleDarkMode, toggleAccessibilityMode, setFontSize } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const clientNavItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/processos", label: "Processos", icon: Package },
    { path: "/solicitantes", label: "Solicitantes", icon: Users },
    { path: "/analise-avancada", label: "Análise Avançada", icon: TrendingUp },
    { path: "/controle-horas", label: "Controle de Horas", icon: Clock },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/filtros", label: "Filtros", icon: Filter },
  ];

  const adminNavItems = [
    { path: "/admin", label: "Painel Master", icon: Home },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={sankhyaIcon} alt="Sankhya" className="h-12 w-12" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">Sankhya</span>
              <span className="text-xs text-muted-foreground">BP Indaiatuba & SP Metropolitana</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {(user?.role === "client" ? clientNavItems : adminNavItems).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">
                  {user.role === "admin" ? "Admin Master" : "Cliente"}
                </span>
              </div>
            )}

            {/* Toggle Dark Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
              aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-foreground" />
              ) : (
                <Moon className="h-5 w-5 text-foreground" />
              )}
            </Button>

            {/* Acessibilidade Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Opções de acessibilidade"
                >
                  <Eye className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Acessibilidade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={toggleAccessibilityMode}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  <span>
                    {isAccessibilityMode ? "Desativar" : "Ativar"} Alto Contraste
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Tamanho da Fonte
                </DropdownMenuLabel>
                
                <DropdownMenuItem
                  onClick={() => setFontSize('normal')}
                  className={`cursor-pointer ${fontSize === 'normal' ? 'bg-accent' : ''}`}
                >
                  <span className="ml-6">Normal</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => setFontSize('large')}
                  className={`cursor-pointer ${fontSize === 'large' ? 'bg-accent' : ''}`}
                >
                  <span className="ml-6">Grande</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => setFontSize('extra-large')}
                  className={`cursor-pointer ${fontSize === 'extra-large' ? 'bg-accent' : ''}`}
                >
                  <span className="ml-6">Extra Grande</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="h-9 w-9"
              aria-label="Sair"
            >
              <LogOut className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
