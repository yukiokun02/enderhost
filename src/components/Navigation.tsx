
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Settings, CreditCard, IndianRupee, HelpCircle, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import DiscordPopup from "./DiscordPopup";
import { checkAdminSession, logoutAdmin, logUserActivity } from "@/lib/adminAuth";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [isDiscordPopupOpen, setIsDiscordPopupOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { visible } = useScrollDirection();

  useEffect(() => {
    // Check admin status whenever component mounts or location changes
    const checkAdmin = () => {
      try {
        const adminLoggedIn = checkAdminSession();
        setIsAdmin(adminLoggedIn);
      } catch (error) {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen(!desktopMenuOpen);
  };

  const handleNavigation = (path: string) => {
    // Close menus after navigation
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
    
    // If current page contains the anchor already, just scroll to it
    if (location.pathname === '/' && path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    if (isAdmin) {
      logUserActivity("Logged out from navigation menu");
    }
    
    logoutAdmin();
    setIsAdmin(false);
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <img 
                src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png" 
                alt="EnderHOST Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-lg">
                <span className="text-white">Ender</span>
                <span className="text-minecraft-secondary">HOST</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center">
              <div className="relative">
                <Button
                  onClick={toggleDesktopMenu}
                  className="bg-minecraft-secondary hover:bg-minecraft-dark text-white flex items-center gap-2 rounded-full px-5 py-2"
                >
                  <Menu className="w-4 h-4" />
                  <span>Menu</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                <div
                  className={`absolute right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out w-52 ${
                    desktopMenuOpen
                      ? "max-h-[350px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                  }`}
                >
                  <div className="py-2 px-3 flex flex-col space-y-1">
                    <a
                      href="https://panel.enderhost.in"
                      className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                      onClick={() => setDesktopMenuOpen(false)}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Game Panel</span>
                    </a>
                    <Link
                      to="/purchase"
                      className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                      onClick={() => handleNavigation('/purchase')}
                    >
                      <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Billing Area</span>
                    </Link>
                    <Link
                      to="/#pricing"
                      className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                      onClick={() => handleNavigation('#pricing')}
                    >
                      <IndianRupee className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Pricing</span>
                    </Link>
                    <Link
                      to="/troubleshooting"
                      className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                      onClick={() => handleNavigation('/troubleshooting')}
                    >
                      <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">FAQ's</span>
                    </Link>
                    <button
                      className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5 w-full text-left"
                      onClick={() => {
                        setDesktopMenuOpen(false);
                        setIsDiscordPopupOpen(true);
                      }}
                    >
                      <img 
                        src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
                        alt="Discord" 
                        className="w-3.5 h-3.5 flex-shrink-0" 
                      />
                      <span className="truncate">Discord</span>
                    </button>
                    
                    {/* Only show Admin Dashboard link if user is logged in as admin */}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                        onClick={() => handleNavigation('/admin/dashboard')}
                      >
                        <Settings className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Admin Dashboard</span>
                      </Link>
                    )}
                    
                    {/* Only show Logout if user is logged in as admin */}
                    {isAdmin && (
                      <button
                        className="py-1.5 px-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1.5 w-full text-left"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Logout</span>
                      </button>
                    )}
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
        <div className="py-2 px-3 flex flex-col space-y-1">
          <a
            href="https://panel.enderhost.in"
            className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            onClick={() => setMobileMenuOpen(false)}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Settings className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Game Panel</span>
          </a>
          <Link
            to="/purchase"
            className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            onClick={() => handleNavigation('/purchase')}
          >
            <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Billing Area</span>
          </Link>
          <Link
            to="/#pricing"
            className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            onClick={() => handleNavigation('#pricing')}
          >
            <IndianRupee className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">Pricing</span>
          </Link>
          <Link
            to="/troubleshooting"
            className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
            onClick={() => handleNavigation('/troubleshooting')}
          >
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">FAQ's</span>
          </Link>
          <button
            className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5 w-full text-left"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsDiscordPopupOpen(true);
            }}
          >
            <img 
              src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
              alt="Discord" 
              className="w-3.5 h-3.5 flex-shrink-0" 
            />
            <span className="truncate">Discord</span>
          </button>
          
          {/* Only show Admin Dashboard link if user is logged in as admin */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="py-1.5 px-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
              onClick={() => handleNavigation('/admin/dashboard')}
            >
              <Settings className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Admin Dashboard</span>
            </Link>
          )}
          
          {/* Only show Logout if user is logged in as admin */}
          {isAdmin && (
            <button
              className="py-1.5 px-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-1.5 w-full text-left"
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Discord Popup */}
      <DiscordPopup 
        isOpen={isDiscordPopupOpen} 
        onClose={() => setIsDiscordPopupOpen(false)} 
      />
    </div>
  );
}
