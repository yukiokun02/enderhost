
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, 
  AlertTriangle, 
  Info, 
  MessageSquare, 
  Settings, 
  Search
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string | string[];
}

// Group FAQs by category
interface FAQCategory {
  name: string;
  icon: JSX.Element;
  faqs: FAQ[];
}

const Troubleshooting = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories: FAQCategory[] = [
    {
      name: "General",
      icon: <Info className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "What is Ender Host?",
          answer: "Ender Host is a Minecraft server hosting company that provides high-performance, affordable, and reliable game server hosting. We offer powerful hardware, DDoS protection, and easy-to-use control panels for a seamless gaming experience."
        },
        {
          question: "How do I purchase a Minecraft server?",
          answer: "You can purchase a server by visiting our website, selecting a plan that suits your needs, and completing the checkout process. Once payment is confirmed, your server will be set up automatically."
        },
        {
          question: "How long does it take for my server to be activated?",
          answer: "Most servers are activated instantly after payment. However, in rare cases, it may take up to 10-15 minutes. If your server is not activated after this period, please open a support ticket."
        },
      ]
    },
    {
      name: "Billing",
      icon: <MessageSquare className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "Do you offer free trials?",
          answer: "Currently, we do not offer free trials, but we do have affordable plans that you can try out."
        },
        {
          question: "Can I upgrade my plan later?",
          answer: "Yes! You can upgrade your server at any time from your client dashboard. Just select the new plan, and your server will be upgraded without losing any data."
        },
        {
          question: "What happens if I don't renew my server?",
          answer: "If you do not renew your server before the expiration date, it will be suspended. After a few days, it will be permanently deleted."
        }
      ]
    },
    {
      name: "Technical",
      icon: <Settings className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "What control panel do you provide?",
          answer: "We provide the Pterodactyl Panel, which allows you to manage your server, upload plugins, change settings, and much more."
        },
        {
          question: "Can I install custom plugins and mods?",
          answer: "Yes! We support modded Minecraft servers (e.g., Forge, Fabric) and plugin-based servers (e.g., Spigot, Paper). You can upload your own plugins and mods via the Pterodactyl Panel."
        },
        {
          question: "What versions of Minecraft do you support?",
          answer: "We support all Minecraft versions, including Java Edition and Bedrock Edition."
        },
        {
          question: "Do you provide DDoS protection?",
          answer: "Yes, all our servers come with DDoS protection to ensure smooth gameplay without interruptions."
        }
      ]
    }
  ];

  const troubleshootingCategories: FAQCategory[] = [
    {
      name: "Server Issues",
      icon: <AlertTriangle className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "My server is not starting. What should I do?",
          answer: [
            "Try the following steps:",
            "• Check the console in the Pterodactyl Panel for error messages.",
            "• Ensure you have selected the correct Minecraft version.",
            "• If you are using mods, check for mod conflicts.",
            "• Make sure your server has enough RAM allocated.",
            "• Restart your server and try again.",
            "• If the issue persists, contact support."
          ]
        },
        {
          question: "I can't connect to my server. What's wrong?",
          answer: [
            "• Ensure your server is online in the Pterodactyl Panel.",
            "• Check if you are using the correct IP address and port.",
            "• If you are using a custom domain, make sure your DNS records are set correctly.",
            "• Restart your router and try again.",
            "• Check if your firewall is blocking the connection."
          ]
        },
        {
          question: "My server is lagging. How can I fix it?",
          answer: [
            "• Reduce the number of plugins or mods running.",
            "• Lower the view distance in the server settings.",
            "• Allocate more RAM if possible.",
            "• Check if your internet connection is stable.",
            "• Upgrade to a higher performance plan if needed."
          ]
        },
      ]
    },
    {
      name: "Plugin & Mod Issues",
      icon: <AlertTriangle className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "I installed a mod/plugin, and my server crashed. What should I do?",
          answer: [
            "• Remove the mod/plugin and restart the server.",
            "• Check for compatibility with your Minecraft version.",
            "• Read the console log for any error messages.",
            "• Try installing the latest version of the mod/plugin."
          ]
        },
        {
          question: "My world got corrupted. Can I restore it?",
          answer: [
            "• If you have backups enabled, restore the latest backup from your panel.",
            "• If backups are not available, you may try using MCEdit or region fixer tools.",
            "• Regularly back up your world to avoid future issues."
          ]
        },
      ]
    },
    {
      name: "Access & Settings",
      icon: <HelpCircle className="w-5 h-5 text-minecraft-secondary" />,
      faqs: [
        {
          question: "I forgot my Pterodactyl Panel password. How can I reset it?",
          answer: "You can reset your password by clicking on the \"Forgot Password\" option on the login page and following the instructions sent to your email."
        },
        {
          question: "How do I change my server's settings (difficulty, gamemode, etc.)?",
          answer: [
            "• Log in to your Pterodactyl Panel.",
            "• Open your server's settings.",
            "• Edit the server.properties file.",
            "• Save changes and restart the server."
          ]
        },
        {
          question: "My server is stuck on \"Starting...\" What do I do?",
          answer: [
            "• Wait a few minutes, as it may take time to load.",
            "• Check for any console errors.",
            "• Ensure that all plugins and mods are correctly installed.",
            "• If the issue persists, contact support."
          ]
        },
        {
          question: "How do I install a custom world?",
          answer: [
            "• Upload your world folder via the Pterodactyl Panel's file manager or use an SFTP client.",
            "• Edit the server.properties file and set the level-name to your world folder's name.",
            "• Restart the server to apply the changes."
          ]
        },
        {
          question: "My players are getting \"You are not whitelisted\" error. How do I fix this?",
          answer: [
            "• Log in to your Pterodactyl Panel.",
            "• Go to the console and type: whitelist add <playername>",
            "• If you want to disable whitelist, type: whitelist off"
          ]
        }
      ]
    }
  ];

  const renderAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) {
      return (
        <div className="mt-1 space-y-1">
          {answer.map((line, i) => (
            <p key={i} className="text-sm text-gray-200">{line}</p>
          ))}
        </div>
      );
    }
    return <p className="mt-1 text-sm text-gray-200">{answer}</p>;
  };

  const filterFaqs = (categories: FAQCategory[], query: string) => {
    if (!query) return categories;
    
    return categories.map(category => ({
      ...category,
      faqs: category.faqs.filter(faq => 
        faq.question.toLowerCase().includes(query.toLowerCase()) || 
        (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(query.toLowerCase()))
      )
    })).filter(category => category.faqs.length > 0);
  };

  const filteredFaqCategories = filterFaqs(faqCategories, searchQuery);
  const filteredTroubleshootingCategories = filterFaqs(troubleshootingCategories, searchQuery);

  return (
    <PageTransition>
      <div className="min-h-screen bg-black overflow-x-hidden relative">
        {/* Global Grid Pattern */}
        <div 
          className="fixed inset-0 grid-background"
          style={{ zIndex: 0 }}
        />
        
        <Navigation />
        
        <main className="container mx-auto px-4 py-20 relative z-10">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Support & Troubleshooting
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions and troubleshooting steps to resolve issues with your Minecraft server.
            </p>
            
            <div className="relative max-w-lg mx-auto mt-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-minecraft-secondary"
              />
            </div>
          </section>
          
          <AnimateOnScroll variant="fade-up">
            <div className="mb-20">
              <Tabs defaultValue="faq" className="max-w-4xl mx-auto">
                <TabsList className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-lg mb-6">
                  <TabsTrigger 
                    value="faq" 
                    className="flex-1 data-[state=active]:bg-minecraft-secondary data-[state=active]:text-white"
                  >
                    Frequently Asked Questions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="troubleshooting" 
                    className="flex-1 data-[state=active]:bg-minecraft-secondary data-[state=active]:text-white"
                  >
                    Troubleshooting
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="faq" className="space-y-8">
                  {filteredFaqCategories.length === 0 ? (
                    <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-300">No FAQ results found for "{searchQuery}"</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredFaqCategories.map((category, categoryIndex) => (
                      <Card key={categoryIndex} className="bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-minecraft-dark/60 flex items-center gap-3">
                          {category.icon}
                          <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                        </div>
                        <CardContent className="pt-4">
                          <Accordion type="single" collapsible className="w-full">
                            {category.faqs.map((faq, faqIndex) => (
                              <AccordionItem 
                                key={faqIndex} 
                                value={`${categoryIndex}-${faqIndex}`}
                                className="border-white/10"
                              >
                                <AccordionTrigger className="text-white text-left py-3 hover:no-underline">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-300">
                                  {renderAnswer(faq.answer)}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
                
                <TabsContent value="troubleshooting" className="space-y-8">
                  {filteredTroubleshootingCategories.length === 0 ? (
                    <Card className="bg-black/40 backdrop-blur-md border border-white/10">
                      <CardContent className="pt-6 text-center">
                        <p className="text-gray-300">No troubleshooting results found for "{searchQuery}"</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredTroubleshootingCategories.map((category, categoryIndex) => (
                      <Card key={categoryIndex} className="bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden">
                        <div className="px-6 py-4 bg-minecraft-dark/60 flex items-center gap-3">
                          {category.icon}
                          <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                        </div>
                        <CardContent className="pt-4">
                          <Accordion type="single" collapsible className="w-full">
                            {category.faqs.map((faq, faqIndex) => (
                              <AccordionItem 
                                key={faqIndex} 
                                value={`${categoryIndex}-${faqIndex}`}
                                className="border-white/10"
                              >
                                <AccordionTrigger className="text-white text-left py-3 hover:no-underline">
                                  {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-300">
                                  {renderAnswer(faq.answer)}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </AnimateOnScroll>
          
          <section className="max-w-4xl mx-auto text-center bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Still Need Help?</h2>
            <p className="text-gray-300 mb-6">
              If you couldn't find the answer to your question, our support team is ready to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://discord.gg/bsGPB9VpUY" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-minecraft-secondary hover:bg-minecraft-primary transition-colors rounded-lg text-white"
              >
                <img 
                  src="/lovable-uploads/45df2984-1b34-4b54-9443-638b349c655b.png" 
                  alt="Discord" 
                  className="w-5 h-5" 
                />
                Join Our Discord
              </a>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Troubleshooting;
