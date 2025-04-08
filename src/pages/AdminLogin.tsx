
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a simple authentication check
    // In a real application, you should use a more secure authentication method
    if (username === "admin" && password === "admin123") {
      // Store authentication state in sessionStorage
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Login successful!");
      navigate("/admin/dashboard");
    } else {
      toast.error("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-minecraft-light to-white">
      <Card className="w-full max-w-md border-minecraft-primary/20">
        <CardHeader className="bg-minecraft-primary/5 rounded-t-lg">
          <CardTitle className="text-2xl text-minecraft-primary">Admin Login</CardTitle>
          <CardDescription>
            Login to access the admin panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-minecraft-primary hover:bg-minecraft-secondary" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
