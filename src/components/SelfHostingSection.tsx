
import { Link } from "react-router-dom";
import { WrenchIcon, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import AnimateOnScroll from "./AnimateOnScroll";

export default function SelfHostingSection() {
  return (
    <AnimateOnScroll variant="fade-up">
      <section className="py-16 bg-gradient-to-b from-black to-minecraft-dark/30 border-t border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 bg-black/50 rounded-full border border-minecraft-primary/30">
                <WrenchIcon className="w-4 h-4 mr-2 text-minecraft-primary" />
                <span className="text-xs font-semibold text-white">Expert Panel Installation</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Self-Host Your Own <span className="text-minecraft-secondary">Pterodactyl Panel</span>
              </h2>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto">
                Get expert help to set up and configure your own game control panel on your VPS.
                We provide installation support, troubleshooting, and personalized guidance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 rounded-lg p-4 border border-white/5 hover:border-minecraft-secondary/30 transition-all duration-300">
                <ShieldCheck className="w-6 h-6 text-minecraft-primary mb-2" />
                <h3 className="font-semibold text-white text-base mb-1">Full VPS Setup</h3>
                <p className="text-xs text-gray-400">
                  Complete installation with Docker, Nginx, MariaDB, and SSL configuration
                </p>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 border border-white/5 hover:border-minecraft-secondary/30 transition-all duration-300">
                <HelpCircle className="w-6 h-6 text-minecraft-secondary mb-2" />
                <h3 className="font-semibold text-white text-base mb-1">Expert Guidance</h3>
                <p className="text-xs text-gray-400">
                  Step-by-step help with installation and troubleshooting common issues
                </p>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 border border-white/5 hover:border-minecraft-secondary/30 transition-all duration-300">
                <WrenchIcon className="w-6 h-6 text-minecraft-primary mb-2" />
                <h3 className="font-semibold text-white text-base mb-1">Custom Configuration</h3>
                <p className="text-xs text-gray-400">
                  Configure eggs, domains, databases, and game servers to your needs
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/panel-hosting">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-minecraft-secondary hover:bg-minecraft-secondary/20 text-minecraft-secondary text-sm"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
