
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication (in a real app this would be a secure API call)
    // For demo purposes, we're using localStorage
    const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    
    // If no admin users exist, create a default one (for demo purposes)
    if (adminUsers.length === 0) {
      const defaultAdmin = { username: 'admin', password: 'admin123' };
      localStorage.setItem('adminUsers', JSON.stringify([defaultAdmin]));
    }
    
    const foundUser = adminUsers.find(
      (user: { username: string; password: string }) => 
        user.username === username && user.password === password
    );

    setTimeout(() => {
      if (foundUser) {
        // Set admin session
        localStorage.setItem('adminSession', JSON.stringify({
          isLoggedIn: true,
          username: username,
          timestamp: new Date().getTime()
        }));

        toast({
          title: "Login successful",
          description: "You are now logged in as admin",
        });
        
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/9de719a9-cca7-4faa-bc79-f87f3245bd99.png")',
          backgroundPosition: '50% 20%',
          zIndex: 0
        }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-t from-minecraft-dark via-black/85 to-black/40 z-0" />
      
      <div
        className="fixed inset-0 grid-background z-0"
        style={{
          opacity: 0.06,
          backgroundSize: "35px 35px",
        }}
      />

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8 left-8 text-white z-20 md:top-8 md:left-8"
        onClick={() => navigate("/")}
      >
        <ArrowRight className="mr-2 h-4 w-4" />
        Return to Website
      </Button>

      <main className="flex-grow flex items-center justify-center relative z-10">
        <div className="w-full max-w-md px-4">
          <div className="bg-black/50 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-minecraft-primary/30 to-minecraft-secondary/30 flex items-center justify-center mb-4">
                <KeyRound className="h-8 w-8 text-minecraft-secondary" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 text-sm mt-1">Access admin controls</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white/90">
                  Username
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(94,66,227,0.3)] button-texture"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>

          <div className="mt-6 text-center text-gray-500 text-xs">
            <p>Default Admin: username = admin, password = admin123</p>
            <p className="mt-1">This is for demonstration purposes only.</p>
          </div>
        </div>
      </main>

      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm relative z-10 py-4">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} EnderHOST<sup className="text-xs">®</sup>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
