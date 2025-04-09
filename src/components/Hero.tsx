
import { Button } from "@/components/ui/button";
import { Server, Zap, Clock, Zap as ZapIcon, Globe } from "lucide-react";

export default function Hero() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/9de719a9-cca7-4faa-bc79-f87f3245bd99.png")',
          backgroundPosition: '50% 20%'
        }}
      />
      
      {/* Enhanced overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-minecraft-dark via-black/85 to-black/40" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-soft-light"
        style={{ 
          backgroundImage: `linear-gradient(#8E9196 1px, transparent 1px), linear-gradient(to right, #8E9196 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 mb-8 bg-black/70 rounded-full animate-fade-up backdrop-blur-md border border-minecraft-secondary/50 shadow-lg">
            <Server className="w-4 h-4 mr-2 text-minecraft-secondary" />
            <span className="text-sm font-semibold text-white md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
              99.9% Uptime
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white animate-fade-up [animation-delay:200ms] tracking-tight leading-tight md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
            MC Hosting<br />
            <span className="bg-gradient-to-r from-minecraft-light to-minecraft-secondary bg-clip-text text-transparent md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">Fast, Reliable</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto animate-fade-up [animation-delay:400ms] md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] font-medium">
            Deploy your server in seconds with premium hardware
            and 24/7 support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up [animation-delay:600ms]">
            <Button
              size="lg"
              className="bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white px-8 py-7 text-lg rounded-lg flex items-center gap-3 transform transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-xl font-minecraft min-w-[220px]"
              onClick={scrollToPricing}
            >
              <Zap className="w-5 h-5" />
              Start Hosting
            </Button>
            
            <a 
              href="https://discord.gg/bsGPB9VpUY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8 px-8 py-7 text-lg rounded-lg border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-minecraft-secondary/70 hover:scale-105 shadow-lg flex items-center gap-3 font-minecraft min-w-[220px]"
            >
              <img 
                src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" 
                alt="Discord" 
                className="w-5 h-5" 
              />
              Support
            </a>
          </div>
          
          {/* Stats section */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Live Support Card */}
            <div 
              className="rounded-lg p-4 backdrop-blur-sm transition-all duration-500 bg-gradient-to-br from-minecraft-primary/15 to-minecraft-secondary/15 bg-black/50 border border-white/10 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(94,66,227,0.2)] animate-fade-up [animation-delay:700ms] w-[90%] sm:w-full mx-auto"
              style={{ boxShadow: '0 0 10px rgba(94, 66, 227, 0.1)' }}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-minecraft-primary/30 to-minecraft-secondary/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-minecraft-secondary" />
                </div>
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Support</div>
              <div className="text-2xl md:text-2xl font-bold mb-1 bg-gradient-to-r from-minecraft-primary to-minecraft-secondary bg-clip-text text-transparent">24/7</div>
              <div className="text-xs md:text-sm text-gray-300">Expert help</div>
            </div>
            
            {/* Hardware Performance Card */}
            <div 
              className="rounded-lg p-4 backdrop-blur-sm transition-all duration-500 bg-gradient-to-br from-minecraft-secondary/15 to-minecraft-primary/15 bg-black/50 border border-white/10 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(94,66,227,0.2)] animate-fade-up [animation-delay:800ms] w-[90%] sm:w-full mx-auto"
              style={{ boxShadow: '0 0 10px rgba(94, 66, 227, 0.1)' }}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-minecraft-secondary/30 to-minecraft-primary/30 flex items-center justify-center">
                  <ZapIcon className="w-5 h-5 text-minecraft-primary" />
                </div>
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Hardware</div>
              <div className="text-2xl md:text-2xl font-bold mb-1 bg-gradient-to-r from-minecraft-secondary to-minecraft-primary bg-clip-text text-transparent">Pro</div>
              <div className="text-xs md:text-sm text-gray-300">Top tier</div>
            </div>
            
            {/* Server Location Card */}
            <div 
              className="rounded-lg p-4 backdrop-blur-sm transition-all duration-500 bg-gradient-to-br from-minecraft-primary/15 to-minecraft-secondary/15 bg-black/50 border border-white/10 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(94,66,227,0.2)] animate-fade-up [animation-delay:900ms] w-[90%] sm:w-full mx-auto"
              style={{ boxShadow: '0 0 10px rgba(94, 66, 227, 0.1)' }}
            >
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-minecraft-primary/30 to-minecraft-secondary/30 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-minecraft-secondary" />
                </div>
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Location</div>
              <div className="text-2xl md:text-2xl font-bold mb-1 bg-gradient-to-r from-minecraft-primary to-minecraft-secondary bg-clip-text text-transparent">India</div>
              <div className="text-xs md:text-sm text-gray-300">Low ping</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
