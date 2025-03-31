
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// QR code images for each plan
const planQRCodes: Record<string, string> = {
  // Vanilla Plans
  "getting-woods": "/lovable-uploads/941ff633-d2ed-4b1f-bb49-a0b0658f8888.png",
  "getting-an-upgrade": "/lovable-uploads/78f5ca0a-a479-4a79-94f9-6f2dd3802172.png",
  "stone-age": "/lovable-uploads/f77c1651-4ada-4856-81cb-6497b4bf8b93.png",
  "acquire-hardware": "/lovable-uploads/6caffe8f-7b9d-4bdf-b7a9-24605e595ddb.png",
  
  // Modpack Plans
  "isnt-it-iron-pick": "/lovable-uploads/40a4d5ab-68ce-40fd-87bb-24cb80450dd6.png",
  "diamonds": "/lovable-uploads/983e3330-d444-4d20-a84b-5716d7e05033.png",
  "ice-bucket-challenge": "/lovable-uploads/918020ef-6f2d-4b7e-b7ba-28545f5cc074.png",
  
  // Community Server Plans
  "we-need-to-go-deeper": "/lovable-uploads/d5a73dcd-6235-4333-ab3b-a4d7a9747ca3.png",
  "hidden-in-the-depths": "/lovable-uploads/95cda4c0-20b2-410b-b002-0208a7f9b2c9.png",
  "the-end": "/lovable-uploads/d7a5e501-86ea-4acd-9184-823b6224e358.png",
  "sky-is-the-limit": "/lovable-uploads/8d4763e8-df42-4ec6-a7f9-f92036c9a2cf.png"
};

// UPI ID
const UPI_ID = "mail.enderhost@okhdfcbank";

// Plan prices
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

const QRCodePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  
  useEffect(() => {
    // Get state passed from purchase form
    if (location.state) {
      const { plan, ...details } = location.state;
      setPlanId(plan);
      setCustomerDetails(details);
      
      // Send email with customer details
      if (!emailSent && details) {
        // In a real implementation, you would send an API request here
        console.log("Sending email with customer details:", details);
        setEmailSent(true);
        
        // Show a toast notification that the order was received
        toast.success("Your order details have been sent to our team!", {
          duration: 5000,
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
  
  if (!planId || !planQRCodes[planId]) {
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
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f13] bg-gradient-to-b from-black to-[#0f0f13]">
      {/* Logo Header */}
      <header className="w-full bg-black/80 backdrop-blur-sm py-6 text-center shadow-md border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-center">
          <img
            src="/lovable-uploads/d0061f99-fbb0-48a4-917d-ea5a0d94dbda.png"
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
              
              {/* Fixed QR code display - not stretched */}
              <div className="mb-6 bg-white inline-block p-4 rounded-lg w-64 h-64 flex items-center justify-center">
                <img
                  src={planQRCodes[planId]}
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
                  <p className="text-sm font-medium text-gray-400">Amount</p>
                  <p className="font-mono text-gray-100 text-xl font-bold">
                    ₹{planPrices[planId].toLocaleString()}.00
                  </p>
                </div>
              </div>
              
              <p className="text-center text-gray-400 mb-4">
                Scan to pay with any UPI app
              </p>
            </div>
            
            {/* Instructions - Highlighted with stronger styling */}
            <div className="bg-minecraft-accent/10 p-6 border-t border-gray-800">
              <h3 className="font-bold text-white mb-4 text-lg">After Payment:</h3>
              
              {/* Highlighted instructions box */}
              <div className="bg-gradient-to-r from-minecraft-secondary/20 to-minecraft-secondary/10 p-5 rounded-lg border-2 border-minecraft-secondary/50 mb-6 shadow-[0_0_15px_rgba(0,200,83,0.15)]">
                <ol className="list-decimal list-inside space-y-3 text-gray-200">
                  <li>Take a screenshot of your payment confirmation</li>
                  <li className="font-semibold text-white">
                    Join our Discord server and create a ticket
                  </li>
                  <li>Share the screenshot with your order details</li>
                  <li>Our team will set up your server and provide access details</li>
                </ol>
                
                {/* Call-to-action button for Discord */}
                <Button
                  className="w-full mt-6 bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white font-medium shadow-lg shadow-minecraft-secondary/20 py-6"
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
                      className="bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white"
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
      
      <Footer simplified={true} />
    </div>
  );
};

export default QRCodePayment;
