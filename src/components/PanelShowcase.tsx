
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState } from "react";
import EditableText from "@/components/admin/EditableText";

const PANEL_IMAGES = [
  "/lovable-uploads/2ba731ce-22f8-4d9e-93a9-2b3b4ce81b92.png",
  "/lovable-uploads/862cd20c-8c4a-4a79-ba6d-b645849eeba1.png",
  "/lovable-uploads/44889fa3-d6ca-425a-a292-3b162ddf7f6b.png",
  "/lovable-uploads/c9667c3e-3831-4c34-b90b-b0561b8a1630.png",
  "/lovable-uploads/847c8165-f71a-4272-9781-ce62df03bc00.png"
];

export default function PanelShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  
  return (
    <section className="py-8 bg-[#1A1E5A] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-3">
            <span className="text-minecraft-secondary">
              <EditableText id="panel-heading-1" defaultContent="Server" />
            </span> <EditableText id="panel-heading-2" defaultContent="Control Panel" />
          </h2>
          <p className="text-base text-white/90 max-w-2xl mx-auto">
            <EditableText id="panel-description" defaultContent="Our powerful, easy-to-use panel lets you manage your Minecraft server with just a few clicks" />
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl">
          <Carousel
            className="mx-auto"
            opts={{
              align: "center",
              loop: true
            }}
          >
            <CarouselContent>
              {PANEL_IMAGES.map((src, index) => (
                <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
                  <div className="p-1">
                    <Card className="border-minecraft-secondary/20 bg-black/70 backdrop-blur-sm overflow-hidden">
                      <CardContent className="flex items-center justify-center p-2 md:p-4">
                        <div className="overflow-hidden rounded-lg border border-white/10">
                          <img 
                            src={src} 
                            alt={`Server Control Panel View ${index + 1}`}
                            className="w-full h-auto object-cover transition-all duration-300 hover:scale-105"
                            onError={(e) => {
                              console.error(`Error loading image: ${src}`);
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                            loading="lazy"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-3">
              <CarouselPrevious className="relative inset-0 translate-y-0 bg-minecraft-primary/10 backdrop-blur-md text-white border-white/20 hover:bg-minecraft-secondary/20 hover:text-white hover:border-white/40" />
              <CarouselNext className="relative inset-0 translate-y-0 bg-minecraft-primary/10 backdrop-blur-md text-white border-white/20 hover:bg-minecraft-secondary/20 hover:text-white hover:border-white/40" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
