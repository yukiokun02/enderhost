import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Lock, 
  LogOut, 
  UserCog,
  KeyRound,
  Activity,
  Mail,
  Home,
  CreditCard,
  HelpCircle,
  Info,
  FileQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  checkAdminSession, 
  logoutAdmin, 
  getCurrentAdmin,
  updateLastActivity,
  logUserActivity
} from "@/lib/adminAuth";
import UserManagement from "@/components/admin/UserManagement";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import RedeemCodeManager from "@/components/admin/RedeemCodeManager";
import ActivityLog from "@/components/admin/ActivityLog";
import EmailTemplateEditor from "@/components/admin/EmailTemplateEditor";
import SiteNav from "@/components/admin/SiteNav";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("log");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = checkAdminSession();
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    
    const admin = getCurrentAdmin();
    setCurrentUser(admin);
    setIsAdmin(admin?.group === 'admin');
    
    logUserActivity("Accessed admin dashboard");
    
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    
    const handleUserActivity = () => {
      updateLastActivity();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    const sessionCheckInterval = setInterval(() => {
      if (!checkAdminSession()) {
        navigate("/admin");
      }
    }, 30000);
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [navigate]);

  const handleLogout = () => {
    logUserActivity("Logged out");
    logoutAdmin();
    setIsAdmin(false);
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    logUserActivity(`Switched to ${tab} tab`);
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-64 bg-gradient-to-b from-black to-minecraft-dark border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-minecraft-secondary">EnderHOST</h2>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "log" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("log")}
            >
              <Activity className="mr-2 h-4 w-4" />
              Activity Log
            </Button>
            
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("users")}
            >
              <UserCog className="mr-2 h-4 w-4" />
              User Management
            </Button>

            <Button
              variant={activeTab === "redeemCodes" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("redeemCodes")}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Redeem Codes
            </Button>
            
            <Button
              variant={activeTab === "emails" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("emails")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Templates
            </Button>
            
            <Button
              variant={activeTab === "changePassword" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("changePassword")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>

            <Button
              variant={activeTab === "siteNav" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleTabChange("siteNav")}
            >
              <Home className="mr-2 h-4 w-4" />
              Site Navigation
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10">
          {currentUser && (
            <div className="mb-4 text-sm">
              <p className="text-gray-400">Logged in as</p>
              <p className="font-medium">{currentUser.username}</p>
              <span className="inline-block px-2 py-1 rounded text-xs bg-minecraft-primary/30 text-minecraft-primary mt-1">
                {currentUser.group === 'admin' ? 'Admin Group' : 'Member Group'}
              </span>
            </div>
          )}
          
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
          <h1 className="text-xl font-bold">
            {activeTab === "log" && "Activity Log"}
            {activeTab === "users" && "User Management"}
            {activeTab === "redeemCodes" && "Redeem Codes"}
            {activeTab === "emails" && "Email Templates"}
            {activeTab === "changePassword" && "Change Password"}
            {activeTab === "siteNav" && "Site Navigation"}
          </h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-black/50 to-minecraft-dark/50">
          {activeTab === "log" && <ActivityLog currentUser={currentUser} />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "redeemCodes" && <RedeemCodeManager />}
          {activeTab === "emails" && <EmailTemplateEditor />}
          {activeTab === "changePassword" && <ChangePasswordForm />}
          {activeTab === "siteNav" && <SiteNav />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
