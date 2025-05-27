
import React from "react";
import { Button } from "@/components/ui/button";
import { Signal } from "lucide-react";

interface PurchaseFormHeaderProps {
  setIsDiscordPopupOpen: (isOpen: boolean) => void;
}

const PurchaseFormHeader: React.FC<PurchaseFormHeaderProps> = ({ setIsDiscordPopupOpen }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        Purchase Your Minecraft Server
      </h1>
      <p className="text-gray-400">
        Fill in the details below to get started.
      </p>
      
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:border-minecraft-secondary/50 transition-all duration-300 w-28 justify-center">
          <img 
            src="/lovable-uploads/54053dab-497e-4eee-9a19-ba23d9b0be19.png" 
            alt="Indian Flag" 
            className="w-4 h-4 rounded-sm object-cover"
          />
          <span className="text-xs font-medium text-white">India</span>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:border-minecraft-secondary/50 transition-all duration-300 w-28 justify-center">
          <Signal className="w-3.5 h-3.5 text-minecraft-secondary" />
          <span className="text-xs font-medium text-white">20-60ms</span>
        </div>
        
        <Button 
          variant="ghost" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:border-minecraft-secondary/50 transition-all duration-300 w-28 justify-center"
          onClick={() => setIsDiscordPopupOpen(true)}
        >
          <img 
            src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" 
            alt="Discord" 
            className="w-4 h-4"
          />
          <span className="text-xs font-medium text-white">Discord</span>
        </Button>
      </div>
    </div>
  );
};

export default PurchaseFormHeader;
