import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DiscordPopup from "@/components/DiscordPopup";

const PAYMENT_QR_CODE = "/lovable-uploads/50fc961d-b5d5-493d-ab69-e4be0c7f1c90.png";
const UPI_ID = "mail.enderhost@okhdfcbank";
const SUPPORT_EMAIL = "mail@enderhost.in";
const INR_TO_USD = 83;

const planNames: Record<string, string> = {
  "getting-woods": "Getting Woods",
  "getting-an-upgrade": "Getting an Upgrade",
  "stone-age": "Stone Age",
  "acquire-hardware": "Acquire Hardware",
  "isnt-it-iron-pick": "Isn't It Iron Pick?",
  diamonds: "Diamonds",
  "ice-bucket-challenge": "Ice Bucket Challenge",
  "we-need-to-go-deeper": "We Need to Go Deeper",
  "hidden-in-the-depths": "Hidden in the Depths",
  "the-end": "The End",
  "sky-is-the-limit": "Sky is the Limit",
};

const planPrices: Record<string, number> = {
  "getting-woods": 149,
  "getting-an-upgrade": 339,
  "stone-age": 529,
  "acquire-hardware": 699,
  "isnt-it-iron-pick": 859,
  diamonds: 1029,
  "ice-bucket-challenge": 1399,
  "we-need-to-go-deeper": 1699,
  "hidden-in-the-depths": 2119,
  "the-end": 2899,
  "sky-is-the-limit": 3399,
};

const QRCodePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [planId, setPlanId] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [additionalBackups, setAdditionalBackups] = useState<number>(0);
  const [additionalPorts, setAdditionalPorts] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingCycle, setBillingCycle] = useState<number>(3);
  const [isDiscordPopupOpen, setIsDiscordPopupOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState<{
    code: string;
    amount: number;
    type: 'percent' | 'fixed';
  } | null>(null);

  const generateOrderIdentifier = (details: any, plan: string): string => {
    return `${details.email}-${plan}-${details.serverName}-${new Date().toDateString()}`;
  };

  const sendOrderNotification = async (details: any, plan: string, totalPrice: number) => {
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    setEmailError(false);
    
    try {
      const response = await fetch('/api/send-order-email.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: details.name,
          customerEmail: details.email,
          customerPassword: details.password,
          customerPhone: details.phone || 'Not provided',
          discordUsername: details.discordUsername || 'Not provided',
          serverName: details.serverName,
          plan: planNames[plan] || plan,
          basePlanPrice: planPrices[plan] || 0,
          additionalBackups: details.additionalBackups || 0,
          additionalPorts: details.additionalPorts || 0,
          totalPrice: totalPrice,
          orderDate: new Date().toISOString(),
          billingCycle: 1,
          discountApplied: discountApplied
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        setEmailError(true);
        setIsSubmitting(false);
        return false;
      }
      
      if (response.ok && data && data.success) {
        console.log('Order notification email sent successfully', data);
        if (data.order_id) {
          sessionStorage.setItem('enderhost_order_id', data.order_id);
        }
        setIsSubmitting(false);
        return true;
      } else {
        console.error('Failed to send order notification email', data?.message || 'No error message provided');
        setEmailError(true);
        setIsSubmitting(false);
        return false;
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      setEmailError(true);
      setIsSubmitting(false);
      return false;
    }
  };

  const retryEmailSending = () => {
    if (customerDetails && planId) {
      toast.info("Retrying to send notification email...");
      
      sendOrderNotification(
        customerDetails, 
        planId, 
        totalPrice
      ).then(success => {
        if (success) {
          setEmailSent(true);
          setEmailError(false);
          if (customerDetails) {
            const orderIdentifier = generateOrderIdentifier(customerDetails, planId);
            sessionStorage.setItem(`email_sent_${orderIdentifier}`, 'true');
          }
          toast.success("Your order details have been sent successfully!", {
            duration: 5000,
          });
        } else {
          toast.error("Still unable to send confirmation email. Please contact us on Discord.", {
            duration: 7000,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (location.state) {
      const { 
        plan, 
        additionalBackups, 
        additionalPorts, 
        totalPrice, 
        billingCycle: cycle, 
        discountApplied,
        ...details 
      } = location.state;
      
      setPlanId(plan);
      setCustomerDetails(details);
      setAdditionalBackups(parseInt(additionalBackups) || 0);
      setAdditionalPorts(parseInt(additionalPorts) || 0);
      setBillingCycle(cycle || 1);
      setDiscountApplied(discountApplied || null);
      
      if (totalPrice) {
        setTotalPrice(totalPrice);
      } else {
        const basePrice = planPrices[plan] || 0;
        const backupCost = (parseInt(additionalBackups) || 0) * 19;
        const portCost = (parseInt(additionalPorts) || 0) * 9;
        setTotalPrice(Math.round(basePrice + backupCost + portCost));
      }
      
      const orderIdentifier = generateOrderIdentifier(details, plan);
      const alreadySentEmail = sessionStorage.getItem(`email_sent_${orderIdentifier}`);
      
      if (!alreadySentEmail && details) {
        const finalTotalPrice = totalPrice || (planPrices[plan] + (parseInt(additionalBackups) || 0) * 19 + (parseInt(additionalPorts) || 0) * 9);
        
        sendOrderNotification(
          { ...details, additionalBackups, additionalPorts }, 
          plan, 
          finalTotalPrice
        ).then(success => {
          if (success) {
            setEmailSent(true);
            sessionStorage.setItem(`email_sent_${orderIdentifier}`, 'true');
            toast.success("Your order details have been sent to our team!", {
              duration: 5000,
            });
          } else {
            setEmailError(true);
            toast.error("We received your order, but there was an issue sending the confirmation email.", {
              duration: 7000,
            });
          }
        });
      } else if (alreadySentEmail) {
        setEmailSent(true);
        console.log("Email already sent for this order, not sending duplicate");
      }
    } else {
      navigate("/purchase");
    }
  }, [location, navigate]);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied to clipboard!");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    toast.success("Email address copied to clipboard!");
  };

  if (!planId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white mb-4">Invalid plan selected or QR code not found.</p>
          <Button onClick={() => navigate("/purchase")}>Return to Purchase Form</Button>
        </div>
      </div>
    );
  }

  const basePlanPrice = planPrices[planId] || 0;
  const backupsCost = additionalBackups * 19;
  const portsCost = additionalPorts * 9;
  const usdBasePlanPrice = (basePlanPrice / INR_TO_USD).toFixed(2);
  const usdBackupsCost = (backupsCost / INR_TO_USD).toFixed(2);
  const usdPortsCost = (portsCost / INR_TO_USD).toFixed(2);
  const usdTotalPrice = (totalPrice / INR_TO_USD).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f13] bg-gradient-to-b from-black to-[#0f0f13]">
      <header className="w-full bg-black/80 backdrop-blur-sm py-6 text-center shadow-md border-b border-gray-800">
        <div className="container mx-auto flex items-center justify-center">
          <img
            src="/lovable-uploads/e1341b42-612c-4eb3-b5f9-d6ac7e41acf3.png"
            alt="Ender Host Logo"
            className="h-16"
          />
          <h1 className="text-3xl ml-4 font-bold text-gray-100">
            Ender<span className="text-minecraft-secondary">HOST</span>
          </h1>
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
          {emailError && (
            <div className="max-w-md mx-auto mb-6 bg-red-900/50 text-white p-4 rounded-lg border border-red-800 flex flex-col items-center">
              <p className="mb-3 text-center">
                <span className="font-bold">Notice:</span> We received your order, but there was an issue sending the confirmation email. 
              </p>
              <Button 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/20"
                onClick={retryEmailSending}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Retrying..." : "Retry Sending Email"}
              </Button>
            </div>
          )}
          
          <div className="max-w-md mx-auto bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">{planNames[planId]} Plan</h2>
              <p className="text-sm text-gray-400 mb-6">Scan the QR code below to make your payment</p>
              <div className="mb-6 flex flex-col gap-3 items-center justify-center bg-white mx-auto p-4 rounded-lg w-64 h-auto">
                <img
                  src={PAYMENT_QR_CODE}
                  alt="Payment QR Code"
                  className="max-w-full max-h-full object-contain"
                />
                <a
                  href="https://www.paypal.com/paypalme/TanumoyMaity11?v=1&utm_source=unp&utm_medium=email&utm_campaign=RT000481&utm_unptid=efe5e861-1e64-11f0-8f3c-f92b756e43a6&ppid=RT000481&cnac=IN&rsta=en_GB%28en-IN%29&cust=3ER7BYTW5RDBL&unptid=efe5e861-1e64-11f0-8f3c-f92b756e43a6&calc=1889953fc8849&unp_tpcid=ppme-social-business-profile-created&page=main%3Aemail%3ART000481&pgrp=main%3Aemail&e=cl&mchn=em&s=ci&mail=sys&appVersion=1.324.0&tenant_name=PAYPAL&xt=145585%2C154413%2C104038&link_ref=paypalme_tanumoymaity11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center mt-2 gap-2 font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 border-b-2 border-blue-700 shadow-lg outline-none transition-all focus:ring-2 py-2 px-5"
                  style={{
                    fontSize: "1.14rem",
                    letterSpacing: "0.03em",
                    minHeight: "2.5rem",
                  }}
                >
                  <img
                    src="/lovable-uploads/3d565ca5-bc33-4a00-8030-d329cf4c98e7.png"
                    alt="PayPal"
                    className="w-6 h-6"
                  />
                  Pay with PayPal
                </a>
              </div>
              
              <div className="mb-6 space-y-4">
                <div className="text-left bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <p className="text-sm font-medium text-gray-400 mb-2">Order Summary</p>
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Plan:</span>
                      <span className="text-gray-300 flex items-center gap-2">
                        ₹{basePlanPrice}/month
                        <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle font-medium">
                          (${usdBasePlanPrice})
                        </span>
                      </span>
                    </div>
                    {additionalBackups > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Additional Backups ({additionalBackups}):</span>
                        <span className="text-gray-300 flex items-center gap-2">
                          +₹{backupsCost}
                          <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle font-medium">
                            (${usdBackupsCost})
                          </span>
                        </span>
                      </div>
                    )}
                    {additionalPorts > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Additional Ports ({additionalPorts}):</span>
                        <span className="text-gray-300 flex items-center gap-2">
                          +₹{portsCost}
                          <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle font-medium">
                            (${usdPortsCost})
                          </span>
                        </span>
                      </div>
                    )}
                    {discountApplied && (
                      <div className="flex justify-between text-green-400 font-medium">
                        <span>Discount ({discountApplied.code}):</span>
                        <span>
                          {discountApplied.type === 'percent'
                            ? `-${discountApplied.amount}%`
                            : `-₹${discountApplied.amount}`}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between font-medium">
                      <span className="text-white">Total price:</span>
                      <span className="text-white flex items-center gap-2">
                        ₹{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-base align-middle font-bold">
                          (${usdTotalPrice})
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-left bg-blue-900/30 p-4 rounded-lg border border-blue-800">
                  <h3 className="text-sm font-medium text-blue-300 mb-2">Server Login Information</h3>
                  <p className="text-xs text-gray-300">
                    Your server login credentials will be the same email and password you provided in the purchase form.
                    Keep your credentials safe as they will be needed to access your Minecraft server control panel.
                  </p>
                </div>
              </div>
              <p className="text-center text-gray-400 mb-4">
                Scan to pay with any UPI app
              </p>
            </div>
            
            <div className="bg-minecraft-accent/10 p-6 border-t border-gray-800">
              <h3 className="font-bold text-white mb-4 text-lg">After Payment:</h3>
              
              <div className="bg-gradient-to-r from-minecraft-secondary/20 to-minecraft-secondary/10 p-5 rounded-lg border-2 border-minecraft-secondary/50 mb-6 shadow-[0_0_15px_rgba(0,200,83,0.15)]">
                <ol className="list-decimal list-inside space-y-3 text-gray-200">
                  <li>Take a screenshot of your payment confirmation</li>
                  <li className="font-semibold text-white">
                    Join our Discord server and create a ticket
                  </li>
                  <li>Share the screenshot with your order details</li>
                  <li>Our team will set up your server and provide access details</li>
                </ol>
                
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={() => setIsDiscordPopupOpen(true)}
                    className="w-full bg-minecraft-secondary hover:bg-minecraft-secondary/80 text-white font-medium shadow-lg shadow-minecraft-secondary/20 py-6 button-texture flex items-center justify-center"
                    size="lg"
                  >
                    <img 
                      src="/lovable-uploads/6b690be5-a7fe-4753-805d-0441a00e0182.png" 
                      alt="Discord" 
                      className="w-5 h-5 mr-2" 
                    />
                    Discord
                  </Button>
                  
                  <a 
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="flex items-center justify-center w-full rounded-md px-4 py-6 bg-blue-600/30 hover:bg-blue-600/40 text-white border border-blue-500/30 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-md">
                <p className="text-sm text-blue-300 flex items-start">
                  <span className="font-bold mr-2">Note:</span>
                  Your server will be set up within 24 hours after payment verification. 
                  For immediate assistance, please contact us via Discord or email.
                </p>
              </div>
              
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

      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} EnderHOST. All rights reserved.
          </p>
        </div>
      </footer>

      <DiscordPopup isOpen={isDiscordPopupOpen} onClose={() => setIsDiscordPopupOpen(false)} />
    </div>
  );
};

export default QRCodePayment;
