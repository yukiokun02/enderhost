
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Settings, CreditCard, IndianRupee, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen(!desktopMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <img 
                src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png" 
                alt="EnderHOST Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-lg">
                <span className="text-white">Ender</span>
                <span className="text-minecraft-secondary">HOST</span>
              </span>
            </a>

            <div className="hidden md:flex items-center">
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
                      ? "max-h-[350px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="py-3 px-4 flex flex-col">
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
                      href="/purchase"
                      className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setDesktopMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4" />
                      Billing Area
                    </a>
                    <a
                      href="#pricing"
                      className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setDesktopMenuOpen(false)}
                    >
                      <IndianRupee className="w-4 h-4" />
                      Pricing
                    </a>
                    <a
                      href="/troubleshooting"
                      className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                      onClick={() => setDesktopMenuOpen(false)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      FAQ's
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
                      Discord
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
        className={`md:hidden bg-black/90 backdrop-blur-md border border-white/10 mt-2 mx-4 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-[350px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="py-3 px-4 flex flex-col">
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
            href="/purchase"
            className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <CreditCard className="w-4 h-4" />
            Billing Area
          </a>
          <a
            href="#pricing"
            className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <IndianRupee className="w-4 h-4" />
            Pricing
          </a>
          <a
            href="/troubleshooting"
            className="py-3 px-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HelpCircle className="w-4 h-4" />
            FAQ's
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
            Discord
          </a>
        </div>
      </div>
    </div>
  );
}
