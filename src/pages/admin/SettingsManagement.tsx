
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsManagement() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  // General settings
  const [settings, setSettings] = useState({
    siteName: "EnderHost",
    siteDescription: "Premium Minecraft Server Hosting",
    contactEmail: "support@enderhost.com",
    supportPhone: "+1 (555) 123-4567",
    showPromotion: true,
    enableDarkMode: false,
    maintenanceMode: false
  });
  
  // SMTP settings
  const [smtpSettings, setSmtpSettings] = useState({
    host: "smtp.example.com",
    port: "587",
    username: "mail@example.com",
    password: "**********",
    encryption: "tls",
    fromAddress: "noreply@enderhost.com",
    fromName: "EnderHost Support"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSmtpSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
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
        
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-minecraft-dark">Website Settings</h1>
        
        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="email">Email Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="border-minecraft-primary/20">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic website information and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Website Name</Label>
                  <Input 
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Website Description</Label>
                  <Textarea 
                    id="siteDescription"
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input 
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input 
                      id="supportPhone"
                      name="supportPhone"
                      value={settings.supportPhone}
                      onChange={handleChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.showPromotion}
                      onCheckedChange={(checked) => handleSwitchChange("showPromotion", checked)}
                      className="data-[state=checked]:bg-minecraft-primary"
                    />
                    <Label htmlFor="show-promotion">Show promotional banner</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.enableDarkMode}
                      onCheckedChange={(checked) => handleSwitchChange("enableDarkMode", checked)}
                      className="data-[state=checked]:bg-minecraft-primary"
                    />
                    <Label htmlFor="enable-dark-mode">Enable dark mode option</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                      className="data-[state=checked]:bg-minecraft-primary"
                    />
                    <Label htmlFor="maintenance-mode">Enable maintenance mode</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card className="border-minecraft-primary/20">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure SMTP settings for sending emails from your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="host">SMTP Host</Label>
                    <Input 
                      id="host"
                      name="host"
                      value={smtpSettings.host}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="port">SMTP Port</Label>
                    <Input 
                      id="port"
                      name="port"
                      value={smtpSettings.port}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">SMTP Username</Label>
                    <Input 
                      id="username"
                      name="username"
                      value={smtpSettings.username}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">SMTP Password</Label>
                    <Input 
                      id="password"
                      name="password"
                      type="password"
                      value={smtpSettings.password}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="encryption">Encryption</Label>
                  <select 
                    id="encryption"
                    name="encryption"
                    value={smtpSettings.encryption}
                    onChange={handleSmtpChange}
                    className="w-full border border-minecraft-primary/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-minecraft-primary"
                  >
                    <option value="none">None</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAddress">From Email Address</Label>
                    <Input 
                      id="fromAddress"
                      name="fromAddress"
                      type="email"
                      value={smtpSettings.fromAddress}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromName">From Name</Label>
                    <Input 
                      id="fromName"
                      name="fromName"
                      value={smtpSettings.fromName}
                      onChange={handleSmtpChange}
                      className="border-minecraft-primary/30 focus-visible:ring-minecraft-primary"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="text-minecraft-primary border-minecraft-primary hover:bg-minecraft-primary/10"
                  >
                    Test Email Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2 border-gray-300"
            onClick={() => navigate("/admin/dashboard")}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-minecraft-primary hover:bg-minecraft-secondary flex items-center gap-2"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
