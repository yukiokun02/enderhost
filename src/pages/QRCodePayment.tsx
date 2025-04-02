import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Static QR code path from config
const PAYMENT_QR_CODE = "/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png";

// UPI ID
const UPI_ID = "mail.enderhost@okhdfcbank";

// Plan display names
const planNames: Record<string, string> = {
  "getting-woods": "Getting Woods",
  "getting-an-upgrade": "Getting an Upgrade",
  "stone-age": "Stone Age",
  "acquire-hardware": "Acquire Hardware",
  "isnt-it-iron-pick": "Isn't It Iron Pick?",
  "diamonds": "Diamonds",
  "ice-bucket-challenge": "Ice Bucket Challenge",
  "we-need-to-go-deeper": "We Need to Go Deeper",
  "hidden-in-the-depths": "Hidden in the Depths",
  "the-end": "The End",
  "sky-is-the-limit": "Sky is the Limit"
};

// Base plan prices
const planPrices: Record<string, number> = {
  "getting-woods": 149,
  "getting-an-upgrade": 339,
  "stone-age": 529,
  "acquire-hardware": 699,
  "isnt-it-iron-pick": 859,
  "diamonds": 1029,
  "ice-bucket-challenge": 1399,
  "we-need-to-go-deeper": 1699,
  "hidden-in-the-depths": 2119,
  "the-end": 2899,
  "sky-is-the-limit": 3399
};

const QRCodePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [additionalBackups, setAdditionalBackups] = useState<number>(0);
  const [additionalPorts, setAdditionalPorts] = useState<number>(0);
  
  // Email sending function - Updated to include all necessary details
  const sendOrderNotification = async (details: any, plan: string, totalPrice: number) => {
    try {
      const response = await fetch('/api/send-order-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: details.name,
          customerEmail: details.email,
          customerPhone: details.phone || 'Not provided',
          discordUsername: details.discordUsername || 'Not provided',
          serverName: details.serverName,
          plan: planNames[plan] || plan,
          basePlanPrice: planPrices[plan] || 0,
          additionalBackups: details.additionalBackups || 0,
          additionalPorts: details.additionalPorts || 0,
          totalPrice: totalPrice,
          orderDate: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Order notification email sent successfully', data);
        // Store order ID if returned from API
        if (data.order_id) {
          sessionStorage.setItem('enderhost_order_id', data.order_id);
        }
        return true;
      } else {
        console.error('Failed to send order notification email', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  };
  
  useEffect(() => {
    // Get state passed from purchase form
    if (location.state) {
      const { plan, additionalBackups, additionalPorts, totalPrice, ...details } = location.state;
      
      setPlanId(plan);
      setCustomerDetails(details);
      setAdditionalBackups(parseInt(additionalBackups) || 0);
      setAdditionalPorts(parseInt(additionalPorts) || 0);
      
      // Calculate total price if not provided directly
      if (totalPrice) {
        setTotalPrice(totalPrice);
      } else {
        // Calculate from components
        const basePrice = planPrices[plan] || 0;
        const backupCost = (parseInt(additionalBackups) || 0) * 19;
        const portCost = (parseInt(additionalPorts) || 0) * 9;
        setTotalPrice(basePrice + backupCost + portCost);
      }
      
      // Send email with customer details
      if (!emailSent && details) {
        const finalTotalPrice = totalPrice || (planPrices[plan] + (parseInt(additionalBackups) || 0) * 19 + (parseInt(additionalPorts) || 0) * 9);
        
        sendOrderNotification(
          { ...details, additionalBackups, additionalPorts }, 
          plan, 
          finalTotalPrice
        ).then(success => {
          if (success) {
            setEmailSent(true);
            toast.success("Your order details have been sent to our team!", {
              duration: 5000,
            });
          } else {
            toast.error("We received your order, but there was an issue sending the confirmation email. Please contact support if needed.", {
              duration: 7000,
            });
          }
        });
      }
    } else {
      // If no state is passed, redirect to purchase form
      navigate("/purchase");
    }
  }, [location, navigate, emailSent]);
  
  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied to clipboard!");
  };
  
  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white mb-4">Invalid plan selected or QR code not found.</p>
          <Button onClick={() => navigate("/purchase")}>
            Return to Purchase Form
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate price breakdowns
  const basePlanPrice = planPrices[planId] || 0;
  const backupsCost = additionalBackups * 19;
  const portsCost = additionalPorts * 9;
  const hasAddons = additionalBackups > 0 || additionalPorts > 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f13] bg-gradient-to-b from-black to-[#0f0f13]">
      {/* Logo Header - Updated with EnderHOST logo */}
      <header className="w-full bg-black/80 backdrop-blur-sm py-6 text-center shadow-md border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-center">
          <img
            src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png"
            alt="Ender Host Logo"
            className="h-16"
          />
          <h1 className="text-3xl ml-4 font-bold text-gray-100">Ender<span className="text-minecraft-secondary">HOST</span></h1>
        </div>
      </header>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8 left-8 text-gray-200 hover:text-white hover:bg-gray-800/60"
        onClick={() => navigate("/purchase")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Form
      </Button>

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* QR Code Section */}
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">
                {planNames[planId]} Plan
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                Scan the QR code below to make your payment
              </p>
              
              {/* Centered QR code display - Updated with new QR code */}
              <div className="mb-6 bg-white mx-auto p-4 rounded-lg w-64 h-64 flex items-center justify-center">
                <img
                  src={PAYMENT_QR_CODE}
                  alt="Payment QR Code"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              <div className="mb-6 space-y-4">
                <div className="text-left bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm font-medium text-gray-400">UPI ID</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-mono text-gray-100">{UPI_ID}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUpiId}
                      className="ml-2 h-8 border-gray-700 hover:bg-gray-800 text-gray-200"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="text-left bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  {hasAddons ? (
                    <>
                      <p className="text-sm font-medium text-gray-400 mb-2">Order Summary</p>
                      <div className="space-y-1 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Base Plan:</span>
                          <span className="text-gray-300">₹{basePlanPrice.toLocaleString()}</span>
                        </div>
                        
                        {additionalBackups > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Additional Backups ({additionalBackups}):</span>
                            <span className="text-gray-300">₹{backupsCost.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {additionalPorts > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-300">Additional Ports ({additionalPorts}):</span>
                            <span className="text-gray-300">₹{portsCost.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium">
                          <span className="text-white">Total:</span>
                          <span className="text-white">₹{totalPrice.toLocaleString()}.00</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-400">Amount</p>
                      <p className="font-mono text-gray-100 text-xl font-bold">
                        ₹{totalPrice.toLocaleString()}.00
                      </p>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-center text-gray-400 mb-4">
                Scan to pay with any UPI app
              </p>
            </div>
            
            {/* Instructions - Enhanced visibility */}
            <div className="bg-minecraft-accent/10 p-6 border-t border-gray-800">
              <h3 className="font-bold text-white mb-4 text-lg">After Payment:</h3>
              
              {/* Highlighted instructions box with better styling */}
              <div className="bg-gradient-to-r from-minecraft-secondary/20 to-minecraft-secondary/10 p-5 rounded-lg border-2 border-minecraft-secondary/50 mb-6 shadow-[0_0_15px_rgba(0,200,83,0.15)]">
                <ol className="list-decimal list-inside space-y-3 text-gray-200">
                  <li>Take a screenshot of your payment confirmation</li>
                  <li className="font-semibold text-white">
                    Join our Discord server and create a ticket
                  </li>
                  <li>Share the screenshot with your order details</li>
                  <li>Our team will set up your server and provide access details</li>
                </ol>
                
                {/* Call-to-action button for Discord - Centered and enhanced */}
                <Button
                  className="w-full mt-6 bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white font-medium shadow-lg shadow-minecraft-secondary/20 py-6 button-texture"
                  size="lg"
                >
                  <Link 
                    to="https://discord.gg/bsGPB9VpUY"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full"
                  >
                    <img 
                      src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" 
                      alt="Discord" 
                      className="w-5 h-5 mr-2" 
                    />
                    Join Our Discord Server
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-md">
                <p className="text-sm text-blue-300 flex items-start">
                  <span className="font-bold mr-2">Note:</span>
                  Your server will be set up within 24 hours after payment verification. 
                  For immediate assistance, please contact us on Discord.
                </p>
              </div>
              
              {/* Refund Policy Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="mt-4 text-gray-400 hover:text-minecraft-secondary">
                    View Refund Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Refund Policy</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className="text-gray-300">
                    <p className="mb-2">- All payments are non-refundable unless the service cannot be provided.</p>
                    <p className="mb-2">- Refund requests for server issues must be made within 24 hours of payment.</p>
                    <p>- For any refund inquiries, please create a ticket on our Discord server.</p>
                  </DialogDescription>
                  <DialogFooter>
                    <Button 
                      className="bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white button-texture"
                      onClick={() => window.open("/refund-policy", "_blank")}
                    >
                      View Full Policy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>
      
      {/* Simplified footer - copyright only */}
      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} EnderHOST. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default QRCodePayment;
