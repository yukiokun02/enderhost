
import { Cpu, HardDrive, Gauge, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimateOnScroll from "./AnimateOnScroll";

const serverSpecs = [
  {
    id: "cpu",
    icon: Cpu,
    title: "Premium CPUs",
    description: "AMD EPYC & Intel Xeon processors with up to 3.9GHz clock speeds, 32 cores, and advanced multi-threading capabilities for smooth performance under heavy load.",
    details: "Our servers use the latest generation processors optimized for gaming workloads, ensuring your Minecraft world runs without lag or stuttering even with many players online."
  },
  {
    id: "storage",
    icon: HardDrive,
    title: "Fast Storage",
    description: "NVMe SSD storage with read speeds up to 7,000MB/s ensures fast world loading, chunk generation, and seamless gameplay without disk I/O bottlenecks.",
    details: "Say goodbye to lag spikes when generating new terrain or loading complex redstone contraptions. Our enterprise-grade SSDs deliver consistently fast performance."
  },
  {
    id: "memory",
    icon: Gauge,
    title: "High Memory",
    description: "DDR4 ECC RAM at 3,200MHz with up to 256GB capacity provides ample memory for large modpacks, complex redstone builds, and numerous concurrent players.",
    details: "Memory errors can cause server crashes and data corruption. Our ECC RAM automatically detects and corrects memory errors, keeping your server stable and your world safe."
  },
  {
    id: "network",
    icon: Network,
    title: "Fast Network",
    description: "1Gbps unmetered bandwidth with low latency connections and advanced DDoS protection keeps your server online and accessible even during attack attempts.",
    details: "Our network infrastructure is built for reliability with multiple redundant connections, automatic failover, and 24/7 monitoring to ensure your server stays online."
  }
];

export default function Features() {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-minecraft-dark/70">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Enterprise Hardware
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Powered by the latest server technology
          </p>
        </div>
        
        <AnimateOnScroll variant="fade-up">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="cpu" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="bg-black/50 border border-white/10 p-1">
                  {serverSpecs.map((spec) => (
                    <TabsTrigger 
                      key={spec.id} 
                      value={spec.id}
                      className="data-[state=active]:bg-minecraft-secondary/20 data-[state=active]:text-minecraft-secondary"
                    >
                      <spec.icon className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">{spec.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {serverSpecs.map((spec) => (
                <TabsContent 
                  key={spec.id} 
                  value={spec.id} 
                  className="border border-white/10 rounded-lg p-6 bg-black/30 backdrop-blur-sm"
                >
                  <div className="flex items-start">
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-minecraft-primary/10 to-minecraft-secondary/10 flex items-center justify-center">
                        <spec.icon className="w-8 h-8 text-minecraft-secondary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{spec.title}</h3>
                      <p className="text-gray-300 mb-4">{spec.description}</p>
                      <p className="text-sm text-gray-400">{spec.details}</p>
                      <div className="mt-4 py-1 px-3 inline-block bg-minecraft-secondary/10 rounded text-sm text-minecraft-secondary font-medium border border-minecraft-secondary/20">
                        {spec.id === "cpu" && "Up to 3.9GHz with 32 cores"}
                        {spec.id === "storage" && "Read speeds up to 7,000MB/s"}
                        {spec.id === "memory" && "3,200MHz with up to 256GB capacity"}
                        {spec.id === "network" && "1Gbps unmetered, DDoS protected"}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
