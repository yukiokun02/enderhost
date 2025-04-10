
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ArrowRight } from "lucide-react";

interface DiscordPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiscordPopup({ isOpen, onClose }: DiscordPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-black/95 border border-white/10 text-white backdrop-blur-sm max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Join Our Discord</DialogTitle>
          <DialogDescription className="text-center text-gray-400 mt-2">
            Connect with our community for support and updates
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <a 
            href="https://top.gg/servers/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button 
              variant="outline" 
              className="w-full text-white bg-black/60 border-white/20 hover:bg-white/10 transition-all duration-300 flex gap-2"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>Vote For Us</span>
            </Button>
          </a>
          
          <a 
            href="https://discord.gg/bsGPB9VpUY" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button 
              className="w-full bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white transition-all duration-300 flex gap-2"
            >
              <img 
                src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
                alt="Discord" 
                className="w-5 h-5" 
              />
              <span>Join Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
