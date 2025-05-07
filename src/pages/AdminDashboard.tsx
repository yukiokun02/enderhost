
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Lock, 
  LogOut, 
  UserCog,
  KeyRound,
  Activity,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu
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
import SiteNav from "@/components/admin/SiteNav";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("log");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    
    // Load sidebar state from localStorage if available
    const savedSidebarState = localStorage.getItem('adminSidebarCollapsed');
    if (savedSidebarState !== null) {
      setSidebarCollapsed(savedSidebarState === 'true');
    }
    
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
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    logUserActivity(`Switched to ${tab} tab`);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', String(newState));
    logUserActivity(newState ? "Collapsed sidebar" : "Expanded sidebar");
  };

  // Generate tab information with icons and labels
  const tabs = [
    { id: "log", label: "Activity Log", icon: <Activity className="h-4 w-4" /> },
    { id: "users", label: "User Management", icon: <UserCog className="h-4 w-4" /> },
    { id: "redeemCodes", label: "Redeem Codes", icon: <KeyRound className="h-4 w-4" /> },
    { id: "changePassword", label: "Change Password", icon: <Lock className="h-4 w-4" /> },
    { id: "siteNav", label: "Site Navigation", icon: <Home className="h-4 w-4" /> }
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      <div 
        className={`bg-gradient-to-b from-black to-minecraft-dark border-r border-white/10 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-minecraft-secondary">EnderHOST</h2>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-2 flex-1">
          <nav className="space-y-2">
            <TooltipProvider delayDuration={0}>
              {tabs.map((tab) => (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeTab === tab.id ? "secondary" : "ghost"}
                      className={`${
                        sidebarCollapsed ? 'justify-center w-full px-0' : 'justify-start w-full'
                      }`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.icon}
                      {!sidebarCollapsed && <span className="ml-2">{tab.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">
                      {tab.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>
        
        <div className={`p-4 border-t border-white/10 ${sidebarCollapsed ? 'text-center' : ''}`}>
          {currentUser && !sidebarCollapsed && (
            <div className="mb-4 text-sm">
              <p className="text-gray-400">Logged in as</p>
              <p className="font-medium">{currentUser.username}</p>
              <span className="inline-block px-2 py-1 rounded text-xs bg-minecraft-primary/30 text-minecraft-primary mt-1">
                {currentUser.group === 'admin' ? 'Admin Group' : 'Member Group'}
              </span>
            </div>
          )}
          
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className={sidebarCollapsed ? 'w-8 h-8 p-0' : 'w-full'}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {!sidebarCollapsed && <span className="ml-2">Logout</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {activeTab === "log" && "Activity Log"}
            {activeTab === "users" && "User Management"}
            {activeTab === "redeemCodes" && "Redeem Codes"}
            {activeTab === "changePassword" && "Change Password"}
            {activeTab === "siteNav" && "Site Navigation"}
          </h1>
          
          <Button 
            variant="outline" 
            size="sm"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-black/50 to-minecraft-dark/50">
          {activeTab === "log" && <ActivityLog currentUser={currentUser} />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "redeemCodes" && <RedeemCodeManager />}
          {activeTab === "changePassword" && <ChangePasswordForm />}
          {activeTab === "siteNav" && <SiteNav />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
