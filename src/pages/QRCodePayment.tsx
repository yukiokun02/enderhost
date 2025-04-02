import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface OrderData {
  fullName: string;
  email: string;
  discordTag: string;
  plan: string;
  paymentMethod: string;
  additionalNotes?: string;
  amount: number;
  planName: string;
  transactionId: string;
  timestamp: string;
}

interface PaymentState {
  success: boolean;
  processing: boolean;
  error: boolean;
}

const LoadingIndicator = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-48">
    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <span className="text-white">{message}</span>
  </div>
);

export default function QRCodePayment() {
  const [formData, setFormData] = useState<OrderData | null>(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  const [payment, setPayment] = useState<PaymentState>({
    success: false,
    processing: false,
    error: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load form data from session storage
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('purchaseFormData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
        console.log("Loaded form data:", parsedData);
      } else {
        console.error("No form data found in session storage");
        navigate('/purchase');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please complete the order form first."
        });
      }
    } catch (error) {
      console.error("Error loading form data:", error);
      navigate('/purchase');
    }
  }, [navigate, toast]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !payment.success) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !payment.success) {
      toast({
        variant: "destructive",
        title: "Payment Expired",
        description: "The payment session has expired. Please try again."
      });
      navigate('/purchase');
    }
  }, [countdown, payment.success, navigate, toast]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePaymentSuccess = () => {
    setPayment({ success: true, processing: false, error: false });
    
    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your server is being set up. You'll receive details soon.",
      variant: "default",
    });
    
    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: "Server details have been sent to your email address.",
        variant: "default",
      });
    }, 2000);
  };

  if (!formData) {
    return <LoadingIndicator message="Loading payment details..." />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/Image-elements/hero-background.png")',
          backgroundPosition: '50% 20%',
          opacity: 0.1,
          filter: 'blur(3px)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/90" />

      <div 
        className="fixed inset-0 opacity-10 mix-blend-soft-light"
        style={{ 
          backgroundImage: `linear-gradient(#8E9196 1px, transparent 1px), linear-gradient(to right, #8E9196 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <img 
                src="/Image-elements/enderhost-logo.png" 
                alt="EnderHOST" 
                className="h-10 mx-auto mb-4"
              />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Complete Your Payment</h1>
            <p className="text-gray-400 text-sm">Scan the QR code below to pay via UPI</p>
          </div>

          <Card className="border-white/10 bg-black/80 backdrop-blur-sm shadow-lg">
            {payment.success ? (
              <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-gray-300 mb-4">
                  Your Minecraft server is being set up and will be ready shortly.
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Transaction ID: <span className="font-mono">{formData.transactionId}</span>
                </p>
                <div className="space-y-3">
                  <Link to="/">
                    <Button className="w-full bg-minecraft-secondary hover:bg-minecraft-secondary/80">
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <CardHeader className="bg-gradient-to-r from-minecraft-dark/80 to-black border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white text-lg">Amount to Pay</CardTitle>
                      <CardDescription>Plan: {formData.planName}</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">₹{formData.amount}</p>
                      <p className="text-xs text-gray-400">Monthly subscription</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
                    <img 
                      src="/Image-elements/qr-payment.png" 
                      alt="UPI QR Code" 
                      className="w-56 h-56 object-contain"
                    />
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-400 mb-1">Time remaining to complete payment</div>
                    <div className="text-xl font-mono font-bold text-white">{formatTime(countdown)}</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-minecraft-dark/30 border border-white/10 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-2">Payment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{formData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID:</span>
                          <span className="text-white font-mono">{formData.transactionId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handlePaymentSuccess} 
                        className="bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white w-full"
                      >
                        I've Completed Payment
                      </Button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-400">
                      Having trouble? Contact our <a href="https://discord.gg/bsGPB9VpUY" target="_blank" rel="noopener noreferrer" className="text-minecraft-secondary hover:underline">Discord support</a>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
