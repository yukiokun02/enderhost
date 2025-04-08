
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function UserManagement() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const handleSaveCredentials = () => {
    // Simple validation
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }
    
    // In a real app, we would verify the current password against stored value
    // Here we'll just check if it matches the default "admin123"
    if (currentPassword !== "admin123") {
      toast.error("Current password is incorrect");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      // In a real app, we would save the new credentials to a server
      // Here we'll just show a success message
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Admin credentials updated successfully!");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-minecraft-light to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/dashboard")}
            className="text-minecraft-primary hover:bg-minecraft-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">User Management</h1>
        
        <Card className="border-minecraft-primary/20 mb-8">
          <CardHeader>
            <CardTitle>Update Admin Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input 
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Default password is "admin123"
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input 
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleSaveCredentials}
                disabled={isSaving}
                className="w-full bg-minecraft-primary hover:bg-minecraft-secondary flex items-center justify-center gap-2"
              >
                {isSaving ? "Updating Credentials..." : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Credentials
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-minecraft-primary/20">
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Use a strong password with a mix of letters, numbers, and special characters</li>
              <li>Change your password regularly</li>
              <li>Don't share your admin credentials with others</li>
              <li>Always log out when you're done administering the site</li>
              <li>Consider implementing two-factor authentication for additional security</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
