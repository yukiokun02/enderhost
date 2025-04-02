
import { ExternalLink } from "lucide-react";

const serverTypes = [
  {
    name: "Vanilla",
    description: "Original Minecraft experience",
    imageSrc: "/Image-elements/server-vanilla.png",
    color: "from-green-500 to-green-700",
    url: "https://www.minecraft.net/en-us/download/server"
  },
  {
    name: "Spigot",
    description: "Optimized Bukkit fork",
    imageSrc: "/Image-elements/server-spigot.png",
    color: "from-yellow-500 to-yellow-700",
    url: "https://www.spigotmc.org/"
  },
  {
    name: "Paper",
    description: "High performance Spigot fork",
    imageSrc: "/Image-elements/server-paper.png",
    color: "from-red-500 to-red-700",
    url: "https://papermc.io/"
  },
  {
    name: "Purpur",
    description: "Paper fork with more features",
    imageSrc: "/Image-elements/server-purpur.png",
    color: "from-purple-500 to-purple-700",
    url: "https://purpurmc.org/"
  },
  {
    name: "Forge",
    description: "Mod support for Minecraft",
    imageSrc: "/Image-elements/server-forge.png",
    color: "from-orange-500 to-orange-700",
    url: "https://files.minecraftforge.net/"
  },
  {
    name: "NeoForge",
    description: "Modern Forge continuation",
    imageSrc: "/Image-elements/server-neoforge.png",
    color: "from-amber-500 to-amber-700",
    url: "https://neoforged.net/"
  },
  {
    name: "Fabric",
    description: "Lightweight modern modding",
    imageSrc: "/Image-elements/server-fabric.png",
    color: "from-indigo-500 to-indigo-700",
    url: "https://fabricmc.net/"
  },
  {
    name: "Quilt",
    description: "Community-driven modding API",
    imageSrc: "/Image-elements/server-quilt.png",
    color: "from-pink-500 to-pink-700",
    url: "https://quiltmc.org/"
  },
  {
    name: "Velocity",
    description: "Modern, high-performance proxy",
    imageSrc: "/Image-elements/server-velocity.png",
    color: "from-cyan-400 to-cyan-600",
    url: "https://papermc.io/software/velocity"
  },
  {
    name: "BungeeCord",
    description: "Original proxy server solution",
    imageSrc: "/Image-elements/server-bungeecord.png",
    color: "from-amber-400 to-amber-600",
    url: "https://www.spigotmc.org/wiki/bungeecord/"
  },
  {
    name: "GeyserMC",
    description: "Bedrock to Java connectivity",
    imageSrc: "/Image-elements/server-geysermc.png",
    color: "from-blue-400 to-orange-500",
    url: "https://geysermc.org/"
  },
  {
    name: "Sponge",
    description: "Advanced plugin framework",
    imageSrc: "/Image-elements/server-sponge.png",
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
