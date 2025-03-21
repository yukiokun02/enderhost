
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import ServerTypes from "@/components/ServerTypes";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PromoOffer from "@/components/PromoOffer";
import UptimeStats from "@/components/UptimeStats";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { useEffect } from "react";

const Index = () => {
  // Apply smooth scrolling behavior to the html element
  useEffect(() => {
    // Ensure smooth scrolling is applied
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-hidden pt-16 relative">
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
      
      <Footer />
    </div>
  );
};

export default Index;
