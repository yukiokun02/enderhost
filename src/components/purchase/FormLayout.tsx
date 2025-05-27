
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FormLayoutProps {
  children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

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
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <main className="flex-grow relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
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

export default FormLayout;
