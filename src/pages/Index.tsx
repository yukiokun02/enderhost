
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import ServerTypes from "@/components/ServerTypes";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PromoOffer from "@/components/PromoOffer";
import UptimeStats from "@/components/UptimeStats";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import SelfHostingSection from "@/components/SelfHostingSection";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

const Index = () => {
  const isScrollApplied = useRef(false);

  // Apply smooth scrolling behavior to the html element, with debounce
  useEffect(() => {
    // Only apply once
    if (isScrollApplied.current) return;
    isScrollApplied.current = true;
    
    // Ensure smooth scrolling is applied
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = "";
      isScrollApplied.current = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Global Grid Pattern */}
      <div 
        className="fixed inset-0 grid-background"
        style={{ 
          zIndex: 0
        }}
      />
      
      <Navigation />
      <Hero />
      
      <AnimateOnScroll variant="fade-up">
        <PromoOffer />
      </AnimateOnScroll>
      
      <AnimateOnScroll variant="fade-up" delay={0.1}>
        <Pricing />
      </AnimateOnScroll>
      
      <AnimateOnScroll variant="fade-up" delay={0.2}>
        <UptimeStats />
      </AnimateOnScroll>
      
      <AnimateOnScroll variant="fade-up" delay={0.3}>
        <Features />
      </AnimateOnScroll>
      
      <AnimateOnScroll variant="fade-up" delay={0.4}>
        <ServerTypes />
      </AnimateOnScroll>
      
      <SelfHostingSection />
      
      {/* FAQ Button - Made slightly larger */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link 
          to="/troubleshooting"
          className="inline-flex items-center gap-2 bg-minecraft-secondary hover:bg-minecraft-primary text-white px-4 py-2.5 rounded-full transition-colors shadow-lg"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="font-medium text-sm">FAQ's</span>
        </Link>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
