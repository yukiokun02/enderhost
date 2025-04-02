
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  discordTag: z.string().min(2, { message: "Discord username is required." }),
  plan: z.string().min(1, { message: "Please select a hosting plan." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
  additionalNotes: z.string().optional(),
  upiId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PurchaseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      discordTag: "",
      plan: "",
      paymentMethod: "upi",
      additionalNotes: "",
      upiId: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const selectedPlan = form.watch("plan");

  const calculatePrice = (plan: string) => {
    const planPrices = {
      "basic": 149,
      "standard": 339,
      "premium": 529,
      "pro": 859,
      "enterprise": 1699,
    };
    return planPrices[plan as keyof typeof planPrices] || 0;
  };

  const basePrice = calculatePrice(selectedPlan);
  const discountPrice = basePrice * 0.75;

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      sessionStorage.setItem('purchaseFormData', JSON.stringify({
        ...data,
        amount: discountPrice,
        planName: getPlanName(selectedPlan),
        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date().toISOString(),
      }));
      
      navigate('/payment');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your information."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("/Image-elements/hero-background.png")',
          backgroundPosition: '50% 20%',
          opacity: 0.15,
          filter: 'blur(3px)'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/80" />

      <div 
        className="fixed inset-0 opacity-10 mix-blend-soft-light"
        style={{ 
          backgroundImage: `linear-gradient(#8E9196 1px, transparent 1px), linear-gradient(to right, #8E9196 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container mx-auto px-4 py-12 flex-1 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Complete Your Purchase</h1>
            <p className="text-gray-400 mt-2">Fill in your details to get your Minecraft server up and running</p>
          </div>

          <Card className="border-white/10 bg-black/80 backdrop-blur-sm shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-minecraft-dark/80 to-black border-b border-white/10 space-y-1">
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                Order Details
              </CardTitle>
              <CardDescription>Complete the form below to finalize your server order</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="discordTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discord Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hosting Plan</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a plan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">Getting Woods (2GB) - ₹149/mo</SelectItem>
                              <SelectItem value="standard">Getting an Upgrade (4GB) - ₹339/mo</SelectItem>
                              <SelectItem value="premium">Stone Age (6GB) - ₹529/mo</SelectItem>
                              <SelectItem value="pro">Acquire Hardware (8GB) - ₹699/mo</SelectItem>
                              <SelectItem value="enterprise">We Need to Go Deeper (20GB) - ₹1699/mo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-4 bg-white/10" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-white">Payment Method</h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="upi" id="upi" />
                                <label htmlFor="upi" className="flex items-center gap-2 text-sm cursor-pointer font-medium">
                                  <img src="/Image-elements/upi-icon.png" alt="UPI" className="w-5 h-5" />
                                  UPI Payment
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {selectedPlan && (
                    <div className="rounded-lg bg-black/40 p-4 border border-white/10">
                      <h4 className="text-sm font-medium mb-2 text-white">Order Summary</h4>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Plan:</span>
                        <span className="text-white">{getPlanName(selectedPlan)}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Regular Price:</span>
                        <span className="text-white">₹{basePrice}/month</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Discount:</span>
                        <span className="text-green-500">-25%</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total:</span>
                        <span className="text-white">₹{discountPrice}/month</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>Limited Time Offer: 25% Off</span>
                      </div>
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requirements or questions..."
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-300">
                        After submitting, you'll be redirected to complete the payment. Your server will be
                        set up within 5 minutes of confirmed payment.
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="bg-black/50 border-t border-white/5 py-3 px-6">
              <p className="text-xs text-gray-400">
                By proceeding, you agree to our <a href="/terms-of-service" className="text-minecraft-secondary hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-minecraft-secondary hover:underline">Privacy Policy</a>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getPlanName(planId: string): string {
  const planNames: Record<string, string> = {
    "basic": "Getting Woods (2GB)",
    "standard": "Getting an Upgrade (4GB)",
    "premium": "Stone Age (6GB)",
    "pro": "Acquire Hardware (8GB)",
    "enterprise": "We Need to Go Deeper (20GB)"
  };
  
  return planNames[planId] || "Unknown Plan";
}
