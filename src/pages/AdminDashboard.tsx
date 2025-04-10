
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Lock, 
  LogOut, 
  Plus, 
  UserPlus, 
  UserCog,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  checkAdminSession, 
  logoutAdmin, 
  getCurrentAdmin,
  updateLastActivity
} from "@/lib/adminAuth";
import UserManagement from "@/components/admin/UserManagement";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = checkAdminSession();
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    
    // Get current admin user
    const admin = getCurrentAdmin();
    setCurrentUser(admin);
    
    // Setup activity tracking
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    
    const handleUserActivity = () => {
      updateLastActivity();
    };
    
    // Add activity event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Session check interval (every 30 seconds)
    const sessionCheckInterval = setInterval(() => {
      if (!checkAdminSession()) {
        navigate("/admin");
      }
    }, 30000);
    
    return () => {
      // Cleanup
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(sessionCheckInterval);
    };
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-black to-minecraft-dark border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-2xl font-bold text-minecraft-secondary">EnderHOST</h2>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Users className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === "users" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("users")}
            >
              <UserCog className="mr-2 h-4 w-4" />
              User Management
            </Button>
            
            <Button
              variant={activeTab === "changePassword" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("changePassword")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Change Password
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
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
          <h1 className="text-xl font-bold">
            {activeTab === "dashboard" && "Admin Dashboard"}
            {activeTab === "users" && "User Management"}
            {activeTab === "changePassword" && "Change Password"}
          </h1>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-black/50 to-minecraft-dark/50">
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-4">Welcome to Admin Panel</h2>
                <p className="text-gray-400">
                  From here you can manage users, access settings and configure your site.
                </p>
              </div>
              
              <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-4">Session Information</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Username:</span>
                    <span>{currentUser?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Group:</span>
                    <span>{currentUser?.group}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Session Timeout:</span>
                    <span>{1600} seconds</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "users" && <UserManagement />}
          
          {activeTab === "changePassword" && <ChangePasswordForm />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
