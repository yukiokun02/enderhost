
import { Cpu, HardDrive, Gauge, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const serverSpecs = [
  {
    icon: Cpu,
    title: "Premium CPUs",
    description: "AMD EPYC & Intel Xeon processors",
  },
  {
    icon: HardDrive,
    title: "Fast Storage",
    description: "NVMe SSD storage for maximum performance",
  },
  {
    icon: Gauge,
    title: "High Memory",
    description: "DDR4 ECC RAM for reliability",
  },
  {
    icon: Network,
    title: "Fast Network",
    description: "1Gbps unmetered bandwidth",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {serverSpecs.map((spec, index) => (
            <Card
              key={spec.title}
              className="border-white/10 bg-black/50 hover:border-minecraft-secondary/50 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-minecraft-primary/10 to-minecraft-secondary/10 flex items-center justify-center mb-4">
                  <spec.icon className="w-6 h-6 text-minecraft-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{spec.title}</h3>
                <p className="text-gray-400">{spec.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
