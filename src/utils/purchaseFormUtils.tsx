
import React from 'react'; // Added React import for JSX
import { Cpu, HardDrive, Gauge, Signal, Cloud } from "lucide-react";
import { INR_TO_USD_RATE } from "@/config/purchaseFormConfig";

export const convertToUSD = (inrAmount: number) => {
  return (inrAmount / INR_TO_USD_RATE).toFixed(2);
};

export const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  return emailRegex.test(String(email).toLowerCase());
};

export const getSpecIcon = (spec: string): React.ReactNode => { // Added React.ReactNode as return type
  if (spec.includes("RAM")) return <Gauge className="w-5 h-5 flex-shrink-0 text-minecraft-secondary" />;
  if (spec.includes("CPU")) return <Cpu className="w-5 h-5 flex-shrink-0 text-minecraft-secondary" />;
  if (spec.includes("SSD") || spec.includes("storage")) return <HardDrive className="w-5 h-5 flex-shrink-0 text-minecraft-secondary" />;
  if (spec.includes("Bandwidth")) return <Signal className="w-5 h-5 flex-shrink-0 text-minecraft-secondary" />;
  if (spec.includes("Backup")) return <Cloud className="w-5 h-5 flex-shrink-0 text-minecraft-secondary" />;
  return null;
};

