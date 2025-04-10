
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, LogOut, Plus, KeyRound, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import RedeemCodeGenerator from "./RedeemCodeGenerator";
import { checkAdminSession, logoutAdmin } from "@/lib/adminAuth";

const AdminToolbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminStatus();
  }, [location.pathname]);

  const checkAdminStatus = () => {
    try {
      const isLoggedIn = checkAdminSession();
      setIsAdmin(isLoggedIn);
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    window.location.reload(); // Reload to remove edit mode
  };

  const handleDashboardClick = () => {
    navigate("/admin/dashboard");
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2">
        <Button 
          size="icon"
          className="w-12 h-12 rounded-full bg-minecraft-secondary hover:bg-minecraft-primary shadow-lg"
          onClick={() => setIsGeneratorOpen(true)}
          title="Generate Redeem Code"
        >
          <KeyRound className="h-5 w-5" />
        </Button>
        
        <Button 
          size="icon"
          className="w-12 h-12 rounded-full bg-minecraft-accent hover:bg-minecraft-accent/90 shadow-lg"
          onClick={handleDashboardClick}
          title="Admin Dashboard"
        >
          <UserCog className="h-5 w-5" />
        </Button>
        
        <Button 
          size="icon"
          className="w-12 h-12 rounded-full bg-black/80 hover:bg-minecraft-accent/90 shadow-lg"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      {isGeneratorOpen && (
        <RedeemCodeGenerator 
          onClose={() => setIsGeneratorOpen(false)} 
        />
      )}
    </>
  );
};

export default AdminToolbar;
