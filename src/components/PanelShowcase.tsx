
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

export default function PanelShowcase() {
  const panelImages = [
    {
      src: "/lovable-uploads/fc02dd64-418d-404f-9b5f-de5180d8d3f9.png",
      alt: "Server console view showing Minecraft server logs",
      title: "Server Console",
    },
    {
      src: "/lovable-uploads/f79e0687-60c7-4491-80b8-87c6640eee04.png",
      alt: "File manager showing Minecraft server files and directories",
      title: "File Manager",
    },
    {
      src: "/lovable-uploads/ad4044b2-287d-45a0-bfbf-b44323a8b5c2.png",
      alt: "Login panel for the Minecraft hosting control panel",
      title: "Secure Login",
    },
    {
      src: "/lovable-uploads/92457584-8b8b-4e7c-b38c-dd2c18ff404a.png",
      alt: "Activity logs showing server commands and actions",
      title: "Activity Logs",
    },
    {
      src: "/lovable-uploads/502f172e-f0bf-43a0-88a4-04ceb778cd43.png",
      alt: "Server allocation panel showing hostname and port",
      title: "Server Allocation",
    },
    {
      src: "/lovable-uploads/e647dada-0bed-4764-b3b7-ed77a3038f2a.png",
      alt: "Dashboard overview showing server status and resources",
      title: "Resource Dashboard",
    },
  ];

  return (
    <AnimateOnScroll variant="fade-up">
      <section className="py-16 bg-gradient-to-b from-minecraft-dark/70 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 bg-black/50 rounded-full border border-minecraft-primary/30">
              <Monitor className="w-4 h-4 mr-2 text-minecraft-primary" />
              <span className="text-xs font-semibold text-white">Control Panel</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Powerful <span className="text-minecraft-secondary">Management Console</span>
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              Our intuitive panel gives you complete control over your Minecraft server,
              with real-time monitoring, file management, and one-click actions.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {panelImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-full">
                    <Card className="border border-white/10 bg-black/50 overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full h-auto object-cover aspect-[16/9] border-b border-white/10"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className="bg-black/70 border-white/10 text-white backdrop-blur-sm">
                            {image.title}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex items-center justify-center mt-6">
                <CarouselPrevious className="static transform-none mx-2 bg-black border-white/10 hover:bg-white/10 hover:border-minecraft-secondary/50" />
                <CarouselNext className="static transform-none mx-2 bg-black border-white/10 hover:bg-white/10 hover:border-minecraft-secondary/50" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
