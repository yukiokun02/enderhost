
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { 
  Server, 
  Settings, 
  Database, 
  Shield, 
  Globe, 
  Code, 
  HelpCircle,
  Book, 
  User,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Award,
  Mail
} from "lucide-react";

const PanelHosting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-black overflow-hidden relative">
        {/* Global Grid Pattern */}
        <div 
          className="fixed inset-0 grid-background"
          style={{ zIndex: 0 }}
        />
        
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 overflow-hidden">
          <div className="container mx-auto text-center relative z-10">
            <AnimateOnScroll variant="fade-up">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Host Your Own Minecraft Panel with Confidence
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Learn to install, manage, and troubleshoot the Pterodactyl Panel on your VPS — or let us do the full setup for you.
              </p>
              <Button 
                size="lg" 
                className="bg-minecraft-secondary hover:bg-minecraft-primary text-white px-8 py-6 text-lg"
              >
                Get Help Now
              </Button>
            </AnimateOnScroll>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent pointer-events-none"></div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 bg-gradient-to-b from-black to-minecraft-dark/70">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                What We Offer
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Everything you need to set up your own Minecraft hosting panel
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/50 border border-white/10 hover:border-minecraft-secondary/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-minecraft-primary/10 to-minecraft-secondary/10">
                        <service.icon className="w-6 h-6 text-minecraft-secondary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{service.title}</h3>
                      <p className="text-gray-400 text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                How It Works
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Simple process to get your panel up and running
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="text-center relative"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-minecraft-primary/20 to-minecraft-secondary/20 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-minecraft-secondary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                    
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden lg:block absolute top-8 -right-3 text-minecraft-secondary/50" />
                    )}
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gradient-to-b from-black to-minecraft-dark/70">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                Pricing Options
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Flexible options to suit your needs and budget
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pricingOptions.map((option, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/50 border border-white/10 hover:border-minecraft-secondary/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-white">{option.title}</h3>
                      <div className="text-2xl font-bold text-minecraft-secondary mb-4">
                        {option.price}
                      </div>
                      <p className="text-gray-400 text-sm mb-6">{option.description}</p>
                      <Button 
                        className="w-full bg-minecraft-secondary hover:bg-minecraft-primary text-white"
                      >
                        Choose Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-8 p-4 bg-minecraft-dark/30 border border-white/10 rounded-lg max-w-2xl mx-auto">
                <p className="text-gray-300 text-sm italic">
                  We believe in helping the community — affordable and flexible pricing always.
                  <br />
                  <span className="text-minecraft-secondary">
                    Students and hobbyists can use our "Pay What You Can" option.
                  </span>
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                Why Choose Us
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Expertise you can trust for your Pterodactyl setup
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {whyChooseUs.map((reason, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-4 bg-black/50 border border-white/10 rounded-lg"
                  >
                    <CheckCircle className="w-6 h-6 text-minecraft-secondary mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">{reason.title}</h3>
                      <p className="text-gray-400 text-sm">{reason.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-b from-black to-minecraft-dark/70">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                Get In Touch
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Need help? Let's talk. Get started today!
              </p>

              <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-white mb-2">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white mb-2">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white mb-2">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-black/50 border border-white/20 text-white min-h-[120px]"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-minecraft-secondary hover:bg-minecraft-primary text-white"
                    >
                      Send Message
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1 border-minecraft-secondary text-minecraft-secondary hover:bg-minecraft-secondary/20"
                      onClick={() => window.open("https://wa.me/+91XXXXXXXXXX", "_blank")}
                    >
                      WhatsApp Us
                    </Button>
                  </div>
                </form>

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span>contact@example.com</span>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <AnimateOnScroll variant="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center">
                Coming Soon: Expert Guides
              </h2>
              <p className="text-gray-400 mb-12 text-center max-w-2xl mx-auto">
                Deep dive into panel setup and management
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {blogPosts.map((post, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/50 border border-white/10 hover:border-minecraft-secondary/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 text-minecraft-secondary/70 text-sm">Coming Soon</div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{post.title}</h3>
                      <p className="text-gray-400 text-sm">{post.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-white mb-6">Want to get notified when new guides drop? Join our community.</p>
                <Button 
                  className="bg-minecraft-secondary hover:bg-minecraft-primary text-white"
                >
                  Join Community
                </Button>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

// Services data
const services = [
  {
    icon: Server,
    title: "Full VPS Setup",
    description: "Complete setup from scratch on Ubuntu/Debian with all optimizations and security measures."
  },
  {
    icon: Settings,
    title: "Pterodactyl Panel Installation",
    description: "Professional installation and configuration of the Pterodactyl panel with all recommended settings."
  },
  {
    icon: Database,
    title: "Dependencies Setup",
    description: "Installing and configuring Docker, Nginx, PHP, MariaDB and all required dependencies."
  },
  {
    icon: Server,
    title: "Wings Daemon Setup",
    description: "Setting up the Wings daemon and linking it to your panel for seamless server management."
  },
  {
    icon: Shield,
    title: "Security Configuration",
    description: "Securing your server with SSL certificates and proper firewall (UFW) configuration."
  },
  {
    icon: Globe,
    title: "Domain & DNS Setup",
    description: "Pointing domain with DNS and setting up subdomains like panel.yourdomain.com."
  },
  {
    icon: Server,
    title: "Minecraft Server Hosting",
    description: "Configure Paper, Purpur, or other Minecraft server types through your panel."
  },
  {
    icon: Code,
    title: "Custom Egg Installation",
    description: "Node.js, Java, Bots, and other custom egg installations to expand your panel."
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Expert troubleshooting for installation issues, 500 errors, daemon errors, and more."
  },
  {
    icon: Book,
    title: "Panel Management Training",
    description: "Learn how to manage your panel, create servers, edit startup commands, and more."
  },
  {
    icon: User,
    title: "Full Setup Service",
    description: "Optional: We set everything up for you — fully configured and ready to use."
  },
  {
    icon: Shield,
    title: "Ongoing Support",
    description: "Get help whenever you need it with our responsive support system."
  }
];

// How it works steps
const steps = [
  {
    icon: MessageSquare,
    title: "Reach Out",
    description: "Contact us with your VPS or hosting idea and requirements."
  },
  {
    icon: CheckCircle,
    title: "Planning",
    description: "We understand your goal: self-host or get full setup service."
  },
  {
    icon: ArrowRight,
    title: "Implementation",
    description: "We guide you step-by-step or handle everything for you."
  },
  {
    icon: Award,
    title: "Completion",
    description: "You get a complete working panel + ongoing support."
  }
];

// Pricing options
const pricingOptions = [
  {
    title: "Full Panel Setup",
    price: "₹999 – ₹1,999",
    description: "Complete Pterodactyl Panel installation and configuration on your VPS, ready to use."
  },
  {
    title: "VPS Basic Setup",
    price: "₹499",
    description: "Ubuntu + Docker + Nginx setup only, perfect if you want to handle the panel yourself."
  },
  {
    title: "Troubleshooting Help",
    price: "From ₹199",
    description: "Expert help resolving specific issues with your existing panel setup."
  },
  {
    title: "1-on-1 Teaching",
    price: "₹299 per session",
    description: "Learn how to manage and optimize your panel with personalized training."
  },
  {
    title: "Full Training Course",
    price: "₹999",
    description: "Complete course covering panel setup, management, and troubleshooting."
  },
  {
    title: "Pay What You Can",
    price: "Flexible",
    description: "Special option for students and hobbyists with limited budget."
  }
];

// Why choose us
const whyChooseUs = [
  {
    title: "Real Experience",
    description: "We've deployed and managed Pterodactyl on multiple production servers."
  },
  {
    title: "Proven Track Record",
    description: "Successfully hosted multiple Minecraft networks with optimized configuration."
  },
  {
    title: "Education-Focused",
    description: "We don't just set it up — we teach you how to manage it yourself."
  },
  {
    title: "Responsive Support",
    description: "Fast response times, real human support, and straightforward solutions."
  }
];

// Blog posts
const blogPosts = [
  {
    title: "Installing Pterodactyl Panel from Scratch",
    description: "A comprehensive guide to setting up Pterodactyl Panel on Ubuntu/Debian VPS."
  },
  {
    title: "Fixing Common Wings Daemon Errors",
    description: "Troubleshooting solutions for the most frequent daemon connection issues."
  },
  {
    title: "Best VPS Providers for Minecraft",
    description: "Comparing top VPS options for hosting your own Minecraft network with Pterodactyl."
  }
];

export default PanelHosting;
