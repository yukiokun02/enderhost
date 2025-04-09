import { Check, ChevronDown, ChevronUp, Cpu, Cloud, HardDrive, Gauge, Signal, Users, FlagTriangleRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const minecraftItems = {
  "Oak Log": "/lovable-uploads/9b5fa930-abf6-434b-b424-efa2c7da4843.png",
  "Stone Pickaxe": "/lovable-uploads/709d4d94-57cc-473b-ba6b-ddde49e58729.png", 
  "Cobblestone": "/lovable-uploads/97fc8ca9-a0f0-42c1-b355-8f5edd9c8e90.png",
  "Iron Pickaxe": "/lovable-uploads/573f8adb-bb56-458c-b9bd-eb7db91fb9ee.png",
  "Iron Ore": "/lovable-uploads/f70619f2-e8e9-459f-b10a-1f81111f0133.png",
  "Diamond": "/lovable-uploads/536cdfad-ca51-4101-9b13-5df237b1bfac.png",
  "Ice Block": "/lovable-uploads/dbb67a3c-36d2-43f5-a6c8-46b89c9775ce.png",
  "Obsidian": "/lovable-uploads/f8e42c18-4a5d-44a1-89bb-017d93a845d0.png",
  "Ancient Debris": "/lovable-uploads/59bf24a7-8b32-4615-bb79-48e1427f928e.png",
  "End Portal Frame": "/lovable-uploads/5f380a30-bc96-4223-a9bb-9fc744036d09.png",
  "Elytra": "/lovable-uploads/42f68d43-0471-44a4-a49f-19b186484ba1.png"
};

const itemButtonColors = {
  "Oak Log": "bg-green-500 hover:bg-green-600 text-white",
  "Stone Pickaxe": "bg-green-800 hover:bg-green-900 text-white",
  "Cobblestone": "bg-gray-800 hover:bg-gray-900 text-white",
  "Iron Pickaxe": "bg-gray-500 hover:bg-gray-600 text-white",
  "Iron Ore": "bg-gray-500 hover:bg-gray-600 text-white",
  "Diamond": "bg-cyan-400 hover:bg-cyan-500 text-white",
  "Ice Block": "bg-orange-400 hover:bg-orange-500 text-white",
  "Obsidian": "bg-red-900 hover:bg-red-950 text-white",
  "Ancient Debris": "bg-amber-800 hover:bg-amber-900 text-white",
  "End Portal Frame": "bg-yellow-700 hover:bg-yellow-800 text-white",
  "Elytra": "bg-purple-700 hover:bg-purple-800 text-white"
};

const planIdMap = {
  "Getting Woods": "getting-woods",
  "Getting an Upgrade": "getting-an-upgrade",
  "Stone Age": "stone-age",
  "Acquire Hardware": "acquire-hardware",
  "Isn't It Iron Pick?": "isnt-it-iron-pick",
  "Diamonds": "diamonds",
  "Ice Bucket Challenge": "ice-bucket-challenge",
  "We Need to Go Deeper": "we-need-to-go-deeper",
  "Hidden in the Depths": "hidden-in-the-depths",
  "The End": "the-end",
  "Sky is the Limit": "sky-is-the-limit"
};

const planCategories = [
  {
    id: "vanilla",
    name: "PLAY VANILLA",
    description: "Ideal for groups looking to run a small server with a few plugins.",
    color: "bg-blue-800",
    textColor: "text-blue-400",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    gradient: "from-blue-900/70 to-blue-800/60",
    plans: [
      {
        name: "Getting Woods",
        price: 149,
        features: [
          "2GB RAM",
          "100% CPU",
          "10GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Oak Log",
        players: "10+ Players",
        popular: false
      },
      {
        name: "Getting an Upgrade",
        price: 339,
        features: [
          "4GB RAM",
          "200% CPU",
          "15GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Stone Pickaxe",
        players: "20+ Players",
        popular: false,
      },
      {
        name: "Stone Age",
        price: 529,
        features: [
          "6GB RAM",
          "250% CPU",
          "20GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Cobblestone",
        players: "30+ Players",
        popular: true,
        mostPopular: true,
      },
      {
        name: "Acquire Hardware",
        price: 699,
        features: [
          "8GB RAM",
          "300% CPU",
          "25GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Iron Pickaxe",
        players: "45+ Players",
        popular: false,
      },
    ],
    included: [
      "24/7 Support",
      "DDoS Protection",
      "Free Subdomain"
    ]
  },
  {
    id: "modpacks",
    name: "PLAY WITH MODPACKS",
    description: "Recommended plans to play a Minecraft Modpack.",
    color: "bg-red-900",
    textColor: "text-red-500",
    buttonColor: "bg-red-500 hover:bg-red-600",
    gradient: "from-red-900/70 to-red-800/60",
    plans: [
      {
        name: "Isn't It Iron Pick?",
        price: 859,
        features: [
          "10GB RAM",
          "350% CPU",
          "30GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Iron Ore",
        players: "60+ Players",
        popular: false,
      },
      {
        name: "Diamonds",
        price: 1029,
        features: [
          "12GB RAM",
          "400% CPU",
          "35GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Diamond",
        players: "75+ Players",
        popular: true,
        mostPopular: true,
      },
      {
        name: "Ice Bucket Challenge",
        price: 1399,
        features: [
          "16GB RAM",
          "450% CPU",
          "40GB SSD",
          "1Gbps Bandwidth",
        ],
        icon: "Ice Block",
        players: "90+ Players",
        popular: false,
      },
    ],
    included: [
      "Premium Support",
      "DDoS Protection",
      "Server Performance Monitor"
    ]
  },
  {
    id: "community",
    name: "COMMUNITY SERVERS",
    description: "For large servers with many plugins.",
    color: "bg-green-900",
    textColor: "text-green-500",
    buttonColor: "bg-green-500 hover:bg-green-600",
    gradient: "from-green-900/70 to-green-800/60",
    plans: [
      {
        name: "We Need to Go Deeper",
        price: 1699,
        features: [
          "20GB RAM",
          "450% CPU",
          "45GB SSD",
          "1Gbps Bandwidth",
          "1 Cloud Backup",
        ],
        icon: "Obsidian",
        players: "120+ Players",
        popular: false,
      },
      {
        name: "Hidden in the Depths",
        price: 2119,
        features: [
          "24GB RAM",
          "500% CPU",
          "50GB SSD",
          "1Gbps Bandwidth",
          "1 Cloud Backup",
        ],
        icon: "Ancient Debris",
        players: "150+ Players",
        popular: false,
      },
      {
        name: "The End",
        price: 2899,
        features: [
          "32GB RAM",
          "600% CPU",
          "80GB SSD",
          "Unmetered Bandwidth",
          "2 Cloud Backups",
        ],
        icon: "End Portal Frame",
        players: "200+ Players",
        popular: true,
        mostPopular: true,
      },
      {
        name: "Sky is the Limit",
        price: 3399,
        features: [
          "64GB RAM",
          "800% CPU",
          "100GB SSD",
          "Unmetered Bandwidth",
          "2 Cloud Backups",
        ],
        icon: "Elytra",
        players: "300+ Players",
        popular: false,
      },
    ],
    included: [
      "Priority Support",
      "Advanced DDoS Protection",
      "Free World Transfers",
      "Community Management Tools"
    ]
  }
];

export default function Pricing() {
  const [isMonthlyBilling, setIsMonthlyBilling] = useState(false);
  
  const getFeatureIcon = (feature: string) => {
    if (feature.includes("RAM")) return <Gauge className="w-5 h-5 flex-shrink-0" />;
    if (feature.includes("CPU")) return <Cpu className="w-5 h-5 flex-shrink-0" />;
    if (feature.includes("SSD")) return <HardDrive className="w-5 h-5 flex-shrink-0" />;
    if (feature.includes("Bandwidth")) return <Signal className="w-5 h-5 flex-shrink-0" />;
    if (feature.includes("Backup")) return <Cloud className="w-5 h-5 flex-shrink-0" />;
    return <Check className="w-5 h-5 flex-shrink-0" />;
  };
  
  const getPlanPrice = (originalPrice: number) => {
    return isMonthlyBilling 
      ? Math.round(originalPrice * 1.25) 
      : originalPrice;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-minecraft-dark to-black relative z-10" id="pricing">
      <div 
        className="absolute inset-0 grid-background"
        style={{ 
          zIndex: 0,
          opacity: 0.06,
          backgroundSize: "35px 35px"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Choose Your Plan
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:border-minecraft-secondary/50 transition-all duration-300 w-28 justify-center">
              <img 
                src="/lovable-uploads/54053dab-497e-4eee-9a19-ba23d9b0be19.png" 
                alt="Indian Flag" 
                className="w-4 h-4 rounded-sm object-cover"
              />
              <span className="text-xs font-medium text-white">India</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/10 shadow-lg hover:border-minecraft-secondary/50 transition-all duration-300 w-28 justify-center">
              <Signal className="w-3.5 h-3.5 text-minecraft-secondary" />
              <span className="text-xs font-medium text-white">20-60ms</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6 max-w-sm mx-auto">
            <div className="flex w-full bg-black/40 rounded-lg border border-white/10 p-1">
              <button
                onClick={() => setIsMonthlyBilling(true)}
                className={`relative flex-1 py-1.5 px-3 rounded-md transition-all duration-300 ${
                  isMonthlyBilling 
                    ? "" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {isMonthlyBilling && (
                  <div className="absolute inset-0 bg-minecraft-secondary rounded-md transition-transform duration-300 ease-in-out" />
                )}
                <span className="relative block text-sm">1 Month</span>
                <span className={`relative text-xs ${isMonthlyBilling ? "text-white/80" : "text-gray-500"}`}>
                  Standard Plan
                </span>
              </button>
              
              <button
                onClick={() => setIsMonthlyBilling(false)}
                className={`relative flex-1 py-1.5 px-3 rounded-md transition-all duration-300 ${
                  !isMonthlyBilling 
                    ? "" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {!isMonthlyBilling && (
                  <div className="absolute inset-0 bg-minecraft-secondary rounded-md transition-transform duration-300 ease-in-out" />
                )}
                <span className="relative block text-sm">3 Months</span>
                <span className={`relative text-xs ${!isMonthlyBilling ? "text-white/80" : "text-gray-500"}`}>
                  Standard Price
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-24">
          {planCategories.map((category) => (
            <div key={category.id} className={`rounded-3xl overflow-hidden relative`}>
              <div className={`p-8 ${category.color} bg-opacity-20`} 
                   style={{backgroundImage: `linear-gradient(to right, ${category.gradient})`}}>
                <h3 className="flex items-center gap-2">
                  <span className={`text-2xl font-bold ${category.textColor}`}>{category.name}</span>
                </h3>
                <p className="text-white/80 mt-2">{category.description}</p>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(category.plans.length, 4)} gap-4 p-4 bg-black/50 backdrop-blur-sm`}>
                {category.plans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative rounded-xl p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(94,66,227,0.3)] overflow-hidden ${
                      plan.mostPopular
                        ? "border-2 border-opacity-50 shadow-lg"
                        : "border border-white/10"
                    }`}
                    style={{
                      borderColor: plan.mostPopular ? (category.textColor.includes('blue') ? '#3B82F6' : 
                                                      category.textColor.includes('red') ? '#EF4444' : 
                                                      '#10B981') : 'rgba(255,255,255,0.1)',
                      backgroundColor: plan.mostPopular ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)'
                    }}
                  >
                    {minecraftItems[plan.icon] && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-end overflow-hidden">
                        <div 
                          className="w-[90%] h-[90%]"
                          style={{
                            position: 'relative',
                            transform: "rotate(10deg) translate(15%, -5%)",
                          }}
                          aria-hidden="true"
                        >
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%)`,
                              transform: 'scale(1.2)',
                              zIndex: 0
                            }}
                          />
                          <img 
                            src={minecraftItems[plan.icon]} 
                            alt="" 
                            className="w-full h-full object-contain opacity-[0.3]"
                          />
                        </div>
                      </div>
                    )}
                    
                    {plan.mostPopular && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gradient-to-r from-minecraft-primary to-minecraft-secondary text-white text-xs font-bold px-3 py-1 rounded-md shadow-lg">
                          MOST POPULAR
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-2 relative z-10">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-sm text-white/80">{plan.players}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-white relative z-10">{plan.name}</h3>
                    
                    <div className="flex items-baseline mb-4 relative z-10">
                      <IndianRupee className="w-4 h-4 text-white/70 mr-0.5" />
                      <span className="text-3xl font-bold text-white">{getPlanPrice(plan.price)}</span>
                      <span className="text-white/70 ml-1">
                        {isMonthlyBilling 
                          ? '/month' 
                          : '/month × 3'}
                      </span>
                    </div>
                    
                    <ul className="space-y-3 mb-6 relative z-10">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          {getFeatureIcon(feature)}
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      to={`/purchase?plan=${planIdMap[plan.name]}`}
                      state={{ isMonthlyBilling }}
                      className="relative z-10 block"
                    >
                      <Button
                        className={`w-full py-5 font-medium flex items-center justify-center gap-2 transition-all duration-300 
                          ${itemButtonColors[plan.icon] || category.buttonColor} hover:scale-105`}
                        variant="minecraft"
                      >
                        Buy Now
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
              
              <div className="px-8 py-4 bg-black/70 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <div className="text-white/90 font-medium">INCLUDED ON ALL SERVERS:</div>
                  {category.included.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70">
                      <Check className="w-4 h-4" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
