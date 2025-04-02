
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

interface OrderData {
  orderId: string;
  amount: number;
  planName: string;
  fullName: string;
  email: string;
  discordUsername: string;
  timestamp: string;
}

const QRCodePayment = () => {
  const [upiId, setUpiId] = useState("mail.enderhost@okhdfcbank");
  const [copied, setCopied] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [isDataValid, setIsDataValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get order data from session storage
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('purchaseFormData');
      if (!storedData) {
        setIsDataValid(false);
        setIsLoading(false);
        return;
      }

      const parsedData = JSON.parse(storedData) as OrderData;
      
      // Basic validation
      if (!parsedData.orderId || !parsedData.amount || !parsedData.fullName) {
        setIsDataValid(false);
      } else {
        setOrderData(parsedData);
        setIsDataValid(true);
      }
    } catch (error) {
      console.error("Error parsing order data:", error);
      setIsDataValid(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        
        toast({
          title: "UPI ID Copied!",
          description: "The UPI ID has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Could not copy UPI ID. Please try again.",
        });
      });
  };

  const handleGoBack = () => {
    navigate('/purchase');
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    
    // Display success message
    toast({
      title: "Payment Marked as Completed",
      description: "We're processing your payment. You'll receive confirmation soon.",
      variant: "default",
    });
    
    // Simulate redirect to success page after delay
    setTimeout(() => {
      // In a real app, this would redirect to a success page or dashboard
      // For now, just show another toast
      toast({
        title: "Order Successfully Placed!",
        description: "Thank you for your purchase. Your server will be set up shortly.",
        variant: "default",
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin mr-2 h-8 w-8 border-4 border-minecraft-secondary border-t-transparent rounded-full"></div>
        <span className="text-white">Loading payment details...</span>
      </div>
    );
  }

  if (!isDataValid) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center px-4">
          <Card className="w-full max-w-md border-red-500/20 bg-black/60 backdrop-blur-md">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-2" />
                <h2 className="text-xl font-bold text-white">Invalid Order Data</h2>
                <p className="text-gray-400 mt-2">We couldn't find valid order information. Please return to the purchase page and try again.</p>
              </div>
              <Button 
                onClick={handleGoBack}
                className="w-full bg-minecraft-secondary hover:bg-minecraft-primary text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Purchase
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer copyrightOnly={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/Image-elements/9de719a9-cca7-4faa-bc79-f87f3245bd99.png")',
          backgroundPosition: '50% 20%',
          zIndex: 0
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-minecraft-dark/95 via-black/90 to-black/70" style={{ zIndex: 0 }} />
      
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-16 mt-16 relative z-10">
        <div className="max-w-md mx-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGoBack}
            className="mb-6 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Form
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Complete Your Payment</h1>
            <p className="text-gray-400">Scan the QR code or use the UPI ID to complete your payment</p>
          </div>
          
          <Card className="border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-white p-3 rounded-lg inline-block mb-4">
                  <img 
                    src="/Image-elements/qr-payment.png" 
                    alt="UPI Payment QR Code" 
                    className="w-full max-w-[220px] h-auto mx-auto"
                  />
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <div className="px-3 py-2 bg-white/5 rounded-lg flex items-center gap-2 border border-white/10">
                    <span className="text-white">{upiId}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={handleCopyUPI}
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">
                  Scan the QR code with any UPI app or copy the UPI ID to complete the payment
                </p>
              </div>
              
              <div className="border border-white/10 rounded-lg p-4 mb-6">
                <h3 className="text-white font-medium mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="text-white">{orderData?.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white capitalize">{orderData?.planName} Plan</span>
                  </div>
                  <Separator className="my-2 bg-white/10" />
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-minecraft-secondary">₹{orderData?.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                  onClick={handlePaymentSuccess}
                >
                  I've Made the Payment
                </Button>
                
                <div className="flex items-start gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <p>
                    After completing the payment, we'll verify your transaction and set up your Minecraft server
                    within 24 hours. You'll receive confirmation via email and Discord.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer copyrightOnly={true} />
    </div>
  );
};

export default QRCodePayment;
