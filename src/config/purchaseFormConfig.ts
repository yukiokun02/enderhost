
export interface PlanSpec {
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  backups: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  category: string;
  specs: PlanSpec;
  players: string;
}

export const allPlans: Plan[] = [
  // Vanilla plans
  {
    id: "getting-woods",
    name: "Getting Woods",
    price: 149,
    category: "PLAY VANILLA",
    specs: {
      ram: "2GB RAM",
      cpu: "100% CPU",
      storage: "10GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "10+ Players"
  },
  {
    id: "getting-an-upgrade",
    name: "Getting an Upgrade",
    price: 339,
    category: "PLAY VANILLA",
    specs: {
      ram: "4GB RAM",
      cpu: "200% CPU",
      storage: "15GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "20+ Players"
  },
  {
    id: "stone-age",
    name: "Stone Age",
    price: 529,
    category: "PLAY VANILLA",
    specs: {
      ram: "6GB RAM",
      cpu: "250% CPU",
      storage: "20GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "30+ Players"
  },
  {
    id: "acquire-hardware",
    name: "Acquire Hardware",
    price: 699,
    category: "PLAY VANILLA",
    specs: {
      ram: "8GB RAM",
      cpu: "300% CPU",
      storage: "25GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "45+ Players"
  },
  
  // Modpack plans
  {
    id: "isnt-it-iron-pick",
    name: "Isn't It Iron Pick?",
    price: 859,
    category: "PLAY WITH MODPACKS",
    specs: {
      ram: "10GB RAM",
      cpu: "350% CPU",
      storage: "30GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "60+ Players"
  },
  {
    id: "diamonds",
    name: "Diamonds",
    price: 1029,
    category: "PLAY WITH MODPACKS",
    specs: {
      ram: "12GB RAM",
      cpu: "400% CPU",
      storage: "35GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "75+ Players"
  },
  {
    id: "ice-bucket-challenge",
    name: "Ice Bucket Challenge",
    price: 1399,
    category: "PLAY WITH MODPACKS",
    specs: {
      ram: "16GB RAM",
      cpu: "450% CPU",
      storage: "40GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "",
    },
    players: "90+ Players"
  },
  
  // Community server plans
  {
    id: "we-need-to-go-deeper",
    name: "We Need to Go Deeper",
    price: 1699,
    category: "START A COMMUNITY SERVER",
    specs: {
      ram: "20GB RAM",
      cpu: "450% CPU",
      storage: "45GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "1 Cloud Backup",
    },
    players: "120+ Players"
  },
  {
    id: "hidden-in-the-depths",
    name: "Hidden in the Depths",
    price: 2119,
    category: "START A COMMUNITY SERVER",
    specs: {
      ram: "24GB RAM",
      cpu: "500% CPU",
      storage: "50GB SSD",
      bandwidth: "1Gbps Bandwidth",
      backups: "1 Cloud Backup",
    },
    players: "150+ Players"
  },
  {
    id: "the-end",
    name: "The End",
    price: 2899,
    category: "START A COMMUNITY SERVER",
    specs: {
      ram: "32GB RAM",
      cpu: "600% CPU",
      storage: "80GB SSD",
      bandwidth: "Unmetered Bandwidth",
      backups: "2 Cloud Backups",
    },
    players: "200+ Players"
  },
  {
    id: "sky-is-the-limit",
    name: "Sky is the Limit",
    price: 3399,
    category: "START A COMMUNITY SERVER",
    specs: {
      ram: "64GB RAM",
      cpu: "800% CPU",
      storage: "100GB SSD",
      bandwidth: "Unmetered Bandwidth",
      backups: "2 Cloud Backups",
    },
    players: "300+ Players"
  },
];

export const API_BASE_URL = '/api';
export const INR_TO_USD_RATE = 83; // 1 USD = ₹83

