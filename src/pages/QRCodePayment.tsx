
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import LoadingIndicator from "@/components/LoadingIndicator";

const QRCodePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Get order details from location state
  const orderDetails = location.state;
  
  // Redirect to home if no order data
  useEffect(() => {
    if (!orderDetails || !orderDetails.order_id) {
      navigate('/');
      toast({
        title: "Invalid access",
        description: "Please complete the order form first.",
        variant: "destructive",
      });
    }
  }, [orderDetails, navigate, toast]);

  // Copy UPI ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText("mail.enderhost@okhdfcbank");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "UPI ID copied!",
      description: "UPI ID has been copied to clipboard."
    });
  };

  // Handle payment confirmation
  const handlePaymentComplete = async () => {
    if (isPaymentProcessing) return;
    
    setIsPaymentProcessing(true);
    
    // We would typically update payment status in the database here
    // Since this is a simple demo, we'll just redirect to success page
    try {
      // Here you would make an API call to update payment status in the database
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to payment success page with order details
      if (!hasNavigated) {
        setHasNavigated(true);
        navigate(`/payment-success.php?order=${orderDetails.order_id}`, {
          state: {
            order_id: orderDetails.order_id,
            email: orderDetails.email,
            serverName: orderDetails.serverName
          }
        });
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setIsPaymentProcessing(false);
      
      toast({
        title: "Error confirming payment",
        description: "There was a problem confirming your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!orderDetails) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/9de719a9-cca7-4faa-bc79-f87f3245bd99.png")',
          backgroundPosition: '50% 20%',
          zIndex: 0
        }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/85 to-black/70 z-0" />
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8 left-8 text-white z-20 md:top-8 md:left-8"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-12">
        <div className="max-w-lg w-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
            <p className="text-gray-400">
              Scan the QR code with your UPI app to pay
            </p>
          </div>
          
          <div className="mb-8 flex flex-col items-center">
            <div className="bg-white p-3 rounded-lg shadow-lg mb-4">
              <img 
                src="/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png"
                alt="UPI Payment QR Code" 
                className="w-64 h-64 object-contain"
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2 mb-4">
              <p className="text-white/90 font-medium">Amount: </p>
              <p className="text-minecraft-secondary font-bold text-xl">₹{orderDetails.totalPrice}</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between w-full max-w-xs">
              <span className="text-white/80">mail.enderhost@okhdfcbank</span>
              <button 
                className="text-minecraft-secondary hover:text-minecraft-primary transition-colors"
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="mt-4 text-center text-sm text-white/60">
              <p>Order ID: {orderDetails.order_id}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="text-center text-white/80 mb-2">
              <p>After making the payment, click the button below:</p>
            </div>
            
            <Button
              onClick={handlePaymentComplete}
              className="w-full py-5 bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(94,66,227,0.3)] button-texture"
              disabled={isPaymentProcessing}
            >
              {isPaymentProcessing ? (
                <LoadingIndicator className="h-5 w-5" />
              ) : (
                "I've Completed the Payment"
              )}
            </Button>
            
            <p className="text-sm text-white/60 text-center">
              Payment confirmation might take a few moments.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} EnderHOST<sup className="text-xs">®</sup>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QRCodePayment;
