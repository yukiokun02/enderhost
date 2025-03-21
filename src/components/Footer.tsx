
import { GamepadIcon, CreditCard, Mail, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  simplified?: boolean;
}

export default function Footer({ simplified = false }: FooterProps) {
  return (
    <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 max-w-6xl mx-auto">
          {/* Company Info - Always shown */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png" 
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

          {/* Contact Us - Always shown */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-semibold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:mail@enderhost.in" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base">
                  <Mail className="w-5 h-5" />
                  mail@enderhost.in
                </a>
              </li>
              <li>
                <Link to="/troubleshooting" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base">
                  <HelpCircle className="w-5 h-5" />
                  FAQ's
                </Link>
              </li>
              <li className="text-gray-400 text-base">
                We're here to help with any questions you might have about our services.
              </li>
              <li className="text-gray-400 text-base">
                Response time: within 24 hours
              </li>
            </ul>
          </div>

          {/* Conditional sections - Only shown when not simplified */}
          {!simplified && (
            <>
              {/* Client Area */}
              <div className="mb-6 md:mb-0">
                <h3 className="text-xl font-semibold text-white mb-6">Client Area</h3>
                <ul className="space-y-4">
                  <li>
                    <a href="https://discord.gg/bsGPB9VpUY" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base" target="_blank" rel="noopener noreferrer">
                      <img 
                        src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" 
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
                    <Link to="/purchase" className="text-gray-400 hover:text-minecraft-secondary flex items-center gap-2 text-base">
                      <CreditCard className="w-5 h-5" />
                      Billing Area
                    </Link>
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
            </>
          )}

          {/* Copyright - Always shown */}
          <div className={`col-span-1 ${simplified ? 'md:col-span-2' : 'md:col-span-2 lg:col-span-4'} pt-10 border-t border-white/10 mt-6`}>
            <p className="text-gray-400 text-base">
              Copyright © {new Date().getFullYear()} EnderHOST. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
