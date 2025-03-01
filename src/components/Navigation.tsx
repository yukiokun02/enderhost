
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Server, LogIn, Menu, X, IndianRupee, LogOut, ChevronDown, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(auth === "true");
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen(!desktopMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    toast.success("Successfully signed out");
    
    window.dispatchEvent(new Event("storage"));
  };

  const navigateToAuth = () => {
    navigate("/auth");
    const currentTab = localStorage.getItem("authTab") || "signin";
    localStorage.setItem("authTab", currentTab);
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <nav className="mx-auto max-w-7xl bg-black/80 backdrop-blur-md border border-white/10 rounded-full">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <img 
                src="/lovable-uploads/d5ae654c-f14d-4d97-b527-ca032ca18666.png" 
                alt="EnderHOST Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-lg">
                <span className="text-white">Ender</span>
                <span className="text-minecraft-secondary">HOST</span>
              </span>
            </a>

            <div className="hidden md:flex items-center">
              <div className="flex items-center mr-4">
                {isAuthenticated ? (
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 px-4"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={navigateToAuth}
                    variant="ghost"
                    className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/10 px-4"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In / Up</span>
                  </Button>
                )}
              </div>

              <div className="relative">
                <Button
                  onClick={toggleDesktopMenu}
                  className="bg-minecraft-secondary hover:bg-minecraft-dark text-white flex items-center gap-2 rounded-full px-6"
                >
                  <Menu className="w-4 h-4" />
                  <span>Menu</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                <div
                  className={`absolute right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out w-48 ${
                    desktopMenuOpen
                      ? "max-h-[300px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="py-3 px-4 flex flex-col">
                    {isAuthenticated && (
                      <>
                        <a
                          href="https://panel.enderhost.in"
                          className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                          onClick={() => setDesktopMenuOpen(false)}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Settings className="w-4 h-4" />
                          Game Panel
                        </a>
                        <a
                          href="/client-area"
                          className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                          onClick={() => setDesktopMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Client Area
                        </a>
                      </>
                    )}
                    <a
                      href="#pricing"
                      className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setDesktopMenuOpen(false)}
                    >
                      <IndianRupee className="w-4 h-4" />
                      Pricing
                    </a>
                    <a
                      href="https://discord.gg/bsGPB9VpUY"
                      className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setDesktopMenuOpen(false)}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img 
                        src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
                        alt="Discord" 
                        className="w-4 h-4" 
                      />
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-400 hover:text-white hover:bg-white/10"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`md:hidden bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[300px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="py-3 px-4 flex flex-col">
          {isAuthenticated && (
            <>
              <a
                href="https://panel.enderhost.in"
                className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Settings className="w-4 h-4" />
                Game Panel
              </a>
              <a
                href="/client-area"
                className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                Client Area
              </a>
            </>
          )}
          <a
            href="#pricing"
            className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <IndianRupee className="w-4 h-4" />
            Pricing
          </a>
          <a
            href="https://discord.gg/bsGPB9VpUY"
            className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
              alt="Discord" 
              className="w-4 h-4" 
            />
            Support
          </a>
          
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button
              onClick={navigateToAuth}
              className="mt-2 py-3 px-4 bg-minecraft-secondary hover:bg-minecraft-dark text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
