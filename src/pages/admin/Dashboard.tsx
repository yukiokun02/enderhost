
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Image, 
  Tag, 
  Server, 
  BarChart2, 
  Users, 
  LogOut 
} from "lucide-react";
import { toast } from "sonner";

interface AdminMenuItemProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const AdminMenuItem = ({ title, icon, description, onClick }: AdminMenuItemProps) => {
  return (
    <Card 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const menuItems = [
    {
      title: "Content Management",
      icon: <FileText className="h-6 w-6" />,
      description: "Edit website text content and sections",
      onClick: () => navigate("/admin/content")
    },
    {
      title: "Image Management",
      icon: <Image className="h-6 w-6" />,
      description: "Upload and manage website images",
      onClick: () => navigate("/admin/images")
    },
    {
      title: "Pricing Management",
      icon: <Tag className="h-6 w-6" />,
      description: "Update pricing plans and features",
      onClick: () => navigate("/admin/pricing")
    },
    {
      title: "Server Types",
      icon: <Server className="h-6 w-6" />,
      description: "Edit server types and specifications",
      onClick: () => navigate("/admin/server-types")
    },
    {
      title: "Statistics",
      icon: <BarChart2 className="h-6 w-6" />,
      description: "Update website statistics",
      onClick: () => navigate("/admin/stats")
    },
    {
      title: "User Management",
      icon: <Users className="h-6 w-6" />,
      description: "Change admin credentials",
      onClick: () => navigate("/admin/users")
    },
    {
      title: "Settings",
      icon: <Settings className="h-6 w-6" />,
      description: "General website settings",
      onClick: () => navigate("/admin/settings")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your website content and settings</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <AdminMenuItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              description={item.description}
              onClick={item.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
