
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { logUserActivity } from "@/lib/adminAuth";
import {
  Home,
  CreditCard,
  HelpCircle,
  FileText,
  ShieldAlert,
  Lock,
  ExternalLink
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const SiteNav = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, label: string) => {
    logUserActivity(`Navigated to ${label}`);
    navigate(path);
  };

  const handleExternalNavigation = (url: string, label: string) => {
    logUserActivity(`Opened external link: ${label}`);
    window.open(url, '_blank');
  };

  const sitePages = [
    { 
      title: "Home Page", 
      path: "/", 
      icon: <Home className="h-8 w-8" />,
      description: "Main landing page of the website"
    },
    { 
      title: "Purchase", 
      path: "/purchase", 
      icon: <CreditCard className="h-8 w-8" />,
      description: "Service purchase form page"
    },
    { 
      title: "Troubleshooting", 
      path: "/troubleshooting", 
      icon: <HelpCircle className="h-8 w-8" />,
      description: "FAQ and troubleshooting guide"
    },
    { 
      title: "Terms of Service", 
      path: "/terms", 
      icon: <FileText className="h-8 w-8" />,
      description: "Terms and conditions"
    },
    { 
      title: "Privacy Policy", 
      path: "/privacy", 
      icon: <ShieldAlert className="h-8 w-8" />,
      description: "Privacy policy details"
    },
    { 
      title: "Refund Policy", 
      path: "/refund", 
      icon: <CreditCard className="h-8 w-8" />,
      description: "Refund policy details"
    }
  ];

  const externalLinks = [
    { 
      title: "Game Panel", 
      url: "https://panel.enderhost.in", 
      icon: <Lock className="h-8 w-8" />,
      description: "Access the game server control panel"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-4">Site Navigation</h2>
        <p className="text-gray-400">
          Quick access to all pages of your website for monitoring and management.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sitePages.map((page) => (
          <Card key={page.path} className="bg-black/40 border-white/10 text-white">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{page.title}</CardTitle>
                {page.icon}
              </div>
              <CardDescription className="text-gray-400">{page.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleNavigation(page.path, page.title)}
              >
                Visit Page
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {externalLinks.map((link) => (
          <Card key={link.url} className="bg-black/40 border-white/10 text-white">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{link.title}</CardTitle>
                {link.icon}
              </div>
              <CardDescription className="text-gray-400">{link.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => handleExternalNavigation(link.url, link.title)}
              >
                <ExternalLink className="h-4 w-4" />
                Open Link
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SiteNav;
