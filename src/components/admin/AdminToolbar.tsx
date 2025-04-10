
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, LogOut, Plus, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import RedeemCodeGenerator from "./RedeemCodeGenerator";

interface AdminSession {
  isLoggedIn: boolean;
  username: string;
  timestamp: number;
}

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
      const adminSession = JSON.parse(localStorage.getItem('adminSession') || '{}') as AdminSession;
      
      // Check if session exists and is not expired (24 hours)
      const isValid = adminSession.isLoggedIn && 
                     (new Date().getTime() - adminSession.timestamp) < 24 * 60 * 60 * 1000;
      
      setIsAdmin(isValid);
    } catch (error) {
      setIsAdmin(false);
      console.error("Error checking admin status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    window.location.reload(); // Reload to remove edit mode
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
