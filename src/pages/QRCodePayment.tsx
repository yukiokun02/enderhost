
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      {/* Logo Header */}
      <header className="w-full bg-white py-6 text-center shadow-sm">
        <div className="container mx-auto flex items-center justify-center">
          <img
            src="/lovable-uploads/d0061f99-fbb0-48a4-917d-ea5a0d94dbda.png"
            alt="Ender Host Logo"
            className="h-16"
          />
          <h1 className="text-3xl ml-4 font-bold text-gray-800">Ender Host</h1>
        </div>
      </header>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8 left-8 text-gray-700"
        onClick={() => navigate("/purchase")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Form
      </Button>

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* QR Code Section */}
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {planNames[planId]} Plan
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Scan the QR code below to make your payment
              </p>
              
              <div className="mb-6">
                <img
                  src={planQRCodes[planId]}
                  alt="Payment QR Code"
                  className="mx-auto w-64 h-64"
                />
              </div>
              
              <div className="mb-6 space-y-4">
                <div className="text-left bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">UPI ID</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-mono text-gray-800">{UPI_ID}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUpiId}
                      className="ml-2 h-8"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="text-left bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="font-mono text-gray-800 text-xl font-bold">
                    ₹{planPrices[planId].toLocaleString()}.00
                  </p>
                </div>
              </div>
              
              <p className="text-center text-gray-600 mb-4">
                Scan to pay with any UPI app
              </p>
            </div>
            
            {/* Instructions */}
            <div className="bg-[#EEF2F7] p-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-700 mb-2">After Payment:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                <li>Take a screenshot of your payment confirmation</li>
                <li>
                  Join our Discord server and create a ticket
                  <Link 
                    to="https://discord.gg/bsGPB9VpUY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-minecraft-primary hover:underline ml-1 inline-flex items-center"
                  >
                    Join Discord
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </li>
                <li>Share the screenshot with your order details</li>
                <li>Our team will set up your server and provide access details</li>
              </ol>
              
              <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> Your server will be set up within 24 hours after payment verification. 
                  For immediate assistance, please contact us on Discord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm opacity-80">
              Copyright © {new Date().getFullYear()} EnderHOST<sup className="text-xs">®</sup>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QRCodePayment;
