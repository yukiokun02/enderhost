
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

export default function PanelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Updated panel images with new uploads
  const panelImages = [
    "/lovable-uploads/ebe8df3e-5dbb-48d4-af70-fe5ddd23e6ed.png",
    "/lovable-uploads/7737d780-40ed-4889-a60b-01b1b9a1f1e6.png",
    "/lovable-uploads/d3a1e46c-c178-43b5-8bb1-d22cd2146dde.png",
    "/lovable-uploads/23b89a39-f87c-4283-a32e-5ee9e65fff19.png",
    "/lovable-uploads/d23159aa-a866-4336-a98d-b9b58ebce59d.png"
  ];

  // Function to handle dot indicator clicks
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  // Debug log to confirm images loading
  useEffect(() => {
    console.log("Panel images loaded:", panelImages);
    console.log("Active index:", activeIndex);
  }, [activeIndex]);

  return (
    <section className="py-16 bg-gradient-to-b from-[#1A1E5A]/95 via-[#1A1F2C] to-[#1A1F2C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="pill" className="mb-4">Control Panel</Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Powerful & Intuitive Panel
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Manage your server with our easy-to-use control panel
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CarouselWrapper 
            images={panelImages} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex} 
          />
          
          <div className="flex justify-center mt-4 gap-2">
            {panelImages.map((_, index) => (
              <button 
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? "bg-white scale-125" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Separate component for the carousel to use the API directly without the hook
function CarouselWrapper({ images, activeIndex, setActiveIndex }) {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on("select", handleSelect);
    
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, setActiveIndex]);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(activeIndex);
  }, [activeIndex, api]);

  // Debug log to help identify carousel rendering issues
  useEffect(() => {
    console.log("Carousel API initialized:", !!api);
    if (api) {
      console.log("Carousel canScrollPrev:", api.canScrollPrev());
      console.log("Carousel canScrollNext:", api.canScrollNext());
    }
  }, [api]);

  return (
    <Carousel 
      className="mx-auto"
      setApi={setApi}
      opts={{
        align: "center",
        loop: true
      }}
    >
      <CarouselContent className="rounded-xl overflow-hidden">
        {images.map((image, index) => (
          <CarouselItem key={index} className="overflow-hidden">
            <div className="relative w-full aspect-[16/9] rounded-xl border border-white/10 shadow-xl overflow-hidden">
              <img 
                src={image} 
                alt={`Panel screenshot ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => console.error(`Error loading image ${index}:`, e)}
                onLoad={() => console.log(`Image ${index} loaded successfully`)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 lg:-left-12 bg-black/60 hover:bg-black/80 border-minecraft-secondary/30 text-white" />
      <CarouselNext className="right-2 lg:-right-12 bg-black/60 hover:bg-black/80 border-minecraft-secondary/30 text-white" />
    </Carousel>
  );
}
