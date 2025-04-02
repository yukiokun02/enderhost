
import { ExternalLink } from "lucide-react";

const serverTypes = [
  {
    name: "Vanilla",
    description: "Original Minecraft experience",
    imageSrc: "/lovable-uploads/dd9e7569-2fd6-4024-98ce-f6e15de312a5.png",
    color: "from-green-500 to-green-700",
    url: "https://www.minecraft.net/en-us/download/server"
  },
  // Bukkit removed
  {
    name: "Spigot",
    description: "Optimized Bukkit fork",
    imageSrc: "/lovable-uploads/d0061f99-fbb0-48a4-917d-ea5a0d94dbda.png",
    color: "from-yellow-500 to-yellow-700",
    url: "https://www.spigotmc.org/"
  },
  {
    name: "Paper",
    description: "High performance Spigot fork",
    imageSrc: "/lovable-uploads/b5a2e2ef-52e6-4868-9001-4aa6232b1f09.png",
    color: "from-red-500 to-red-700",
    url: "https://papermc.io/"
  },
  {
    name: "Purpur",
    description: "Paper fork with more features",
    imageSrc: "/lovable-uploads/67f71f89-8184-4a6f-8e97-47eaa5c7e909.png",
    color: "from-purple-500 to-purple-700",
    url: "https://purpurmc.org/"
  },
  {
    name: "Forge",
    description: "Mod support for Minecraft",
    imageSrc: "/lovable-uploads/c518c79f-b1b5-4b6a-8b36-6f1eb687bf7b.png",
    color: "from-orange-500 to-orange-700",
    url: "https://files.minecraftforge.net/"
  },
  {
    name: "NeoForge",
    description: "Modern Forge continuation",
    imageSrc: "/lovable-uploads/aa9f85f2-daf8-485d-a9f4-7e47a71d257e.png",
    color: "from-amber-500 to-amber-700",
    url: "https://neoforged.net/"
  },
  {
    name: "Fabric",
    description: "Lightweight modern modding",
    imageSrc: "/lovable-uploads/32ae7d2d-65eb-4b47-9c06-c61d76c82313.png",
    color: "from-indigo-500 to-indigo-700",
    url: "https://fabricmc.net/"
  },
  {
    name: "Quilt",
    description: "Community-driven modding API",
    imageSrc: "/lovable-uploads/1812089d-9509-46f3-bc3c-6ad3cc7823d6.png",
    color: "from-pink-500 to-pink-700",
    url: "https://quiltmc.org/"
  },
  // New server types
  {
    name: "Velocity",
    description: "Modern, high-performance proxy",
    imageSrc: "/lovable-uploads/084aacb0-25b6-4ae9-bdcb-4747cae6efcd.png",
    color: "from-cyan-400 to-cyan-600",
    url: "https://papermc.io/software/velocity"
  },
  {
    name: "BungeeCord",
    description: "Original proxy server solution",
    imageSrc: "/lovable-uploads/49ac0a25-d9a1-4f05-9c08-124068bf78f5.png",
    color: "from-amber-400 to-amber-600",
    url: "https://www.spigotmc.org/wiki/bungeecord/"
  },
  {
    name: "GeyserMC",
    description: "Bedrock to Java connectivity",
    imageSrc: "/lovable-uploads/b37194dc-12f5-4b46-980a-e6cd44332d52.png",
    color: "from-blue-400 to-orange-500",
    url: "https://geysermc.org/"
  },
  {
    name: "Sponge",
    description: "Advanced plugin framework",
    imageSrc: "/lovable-uploads/45e4aa45-228f-48e6-b19e-e0369749999e.png",
    color: "from-yellow-400 to-yellow-500",
    url: "https://spongepowered.org/"
  },
];

export default function ServerTypes() {
  return (
    <section className="py-16 bg-gradient-to-b from-minecraft-dark/70 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Minecraft Server Types
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We support all major Minecraft server platforms to fit your unique gameplay needs
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {serverTypes.map((type, index) => (
            <a
              key={type.name}
              href={type.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-minecraft-secondary/50 transition-all duration-300 animate-fade-up hover:shadow-[0_0_15px_rgba(94,66,227,0.2)] hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-16 h-16 flex items-center justify-center mb-3 overflow-hidden rounded-lg bg-gradient-to-r ${type.color} p-0.5`}>
                <div className="w-full h-full bg-black/20 rounded-md p-2 flex items-center justify-center">
                  <img 
                    src={type.imageSrc} 
                    alt={`${type.name} Server`} 
                    className="w-full h-full object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] filter brightness-110"
                  />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1 text-center flex items-center gap-1">
                {type.name}
                <ExternalLink className="w-3 h-3 inline-block opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-gray-400 text-xs text-center">{type.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
