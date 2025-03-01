
import { GamepadIcon, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 max-w-6xl mx-auto">
          {/* Company Info */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/d5ae654c-f14d-4d97-b527-ca032ca18666.png" 
                alt="EnderHOST Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold">
                <span className="text-white">Ender</span>
                <span className="text-minecraft-secondary">HOST</span>
              </span>
            </div>
            <p className="text-gray-400 text-base mb-6 max-w-md">
              Premium Minecraft server hosting with 24/7 support, instant setup, and powerful hardware.
            </p>
          </div>

          {/* Client Area */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold text-white mb-6">Client Area</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://discord.gg/bsGPB9VpUY" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
                    alt="Discord" 
                    className="w-5 h-5" 
                  />
                  Support
                </a>
              </li>
              <li>
                <a href="https://panel.enderhost.in" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base" target="_blank" rel="noopener noreferrer">
                  <GamepadIcon className="w-5 h-5" />
                  Game Panel
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base">
                  <CreditCard className="w-5 h-5" />
                  Billing Area
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-minecraft-secondary text-base">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-minecraft-secondary text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-400 hover:text-minecraft-secondary text-base">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 pt-10 border-t border-white/10 mt-6">
            <p className="text-gray-400 text-base">
              Copyright © {new Date().getFullYear()} EnderHOST. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
