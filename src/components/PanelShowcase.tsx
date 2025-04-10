
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

export default function PanelShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelImages = [
    "/lovable-uploads/d23159aa-a866-4336-a98d-b9b58ebce59d.png",
    "/lovable-uploads/2fdea8a1-98b9-45cf-bc6e-65c345b1900b.png",
    "/lovable-uploads/27463630-cd59-420d-977c-9913444d1228.png",
    "/lovable-uploads/d5b1a78b-c368-4d8c-813f-6d76b964445c.png",
    "/lovable-uploads/59f3f635-d5b4-4dee-a19a-c441d10b255f.png"
  ];

  // Function to handle dot indicator clicks
  const goToSlide = (index) => {
    setActiveIndex(index);
  };

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
          <CarouselWrapper images={panelImages} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          
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

  return (
    <Carousel 
      className="mx-auto"
      setApi={setApi}
    >
      <CarouselContent className="rounded-xl overflow-hidden">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="relative w-full aspect-[16/9] rounded-xl border border-white/10 shadow-xl overflow-hidden">
              <img 
                src={image} 
                alt={`Panel screenshot ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
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
