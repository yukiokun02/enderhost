
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Radio, RadioGroup, RadioIndicator, RadioItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle, CreditCard, ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define the form schema with Zod
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  discordUsername: z.string().min(2, { message: "Discord username must be at least 2 characters." }),
  plan: z.string().min(1, { message: "Please select a hosting plan." }),
  paymentMethod: z.string().min(1, { message: "Please select a payment method." }),
  additionalNotes: z.string().optional(),
  // Additional fields for UPI payment
  upiId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PurchaseForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      discordUsername: "",
      plan: "",
      paymentMethod: "upi",
      additionalNotes: "",
      upiId: "",
    },
  });

  // Watch for payment method changes to conditionally render fields
  const paymentMethod = form.watch("paymentMethod");
  const selectedPlan = form.watch("plan");

  // Calculate pricing based on selected plan
  const calculatePrice = (plan: string) => {
    const planPrices = {
      "basic": 149,
      "standard": 249,
      "premium": 449,
      "ultimate": 649,
    };
    
    return planPrices[plan as keyof typeof planPrices] || 0;
  };

  // Calculate price with 25% discount
  const basePrice = calculatePrice(selectedPlan);
  const discountPrice = basePrice * 0.75; // 25% off

  // Apply smooth scrolling behavior to the html element
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API request with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Assuming success, store form data in sessionStorage for next page
      sessionStorage.setItem('purchaseFormData', JSON.stringify({
        ...data,
        amount: discountPrice,
        planName: selectedPlan,
        orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
      }));
      
      // Redirect to payment page
      navigate('/payment');
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem with your purchase. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Your Purchase</h1>
            <p className="text-gray-400">Fill out this form to purchase your EnderHOST Minecraft server</p>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden p-6 mb-8">
            <div className="flex items-center gap-2 mb-4 bg-yellow-500/10 text-yellow-400 p-3 rounded-lg">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Opening Offer: Get 25% OFF on all plans for a limited time!</p>
            </div>
            
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
                          <Input placeholder="Enter your full name" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="discordUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Discord username" {...field} />
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
                      <FormLabel>Select Hosting Plan</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hosting plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Plan - ₹149/month</SelectItem>
                            <SelectItem value="standard">Standard Plan - ₹249/month</SelectItem>
                            <SelectItem value="premium">Premium Plan - ₹449/month</SelectItem>
                            <SelectItem value="ultimate">Ultimate Plan - ₹649/month</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedPlan && (
                  <Card className="border border-white/10 bg-black/40">
                    <CardHeader>
                      <CardTitle className="text-white">Order Summary</CardTitle>
                      <CardDescription>Details of your selected plan</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Selected Plan:</span>
                        <span className="text-white font-medium capitalize">{selectedPlan} Plan</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Original Price:</span>
                        <span className="text-gray-400 line-through">₹{basePrice}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Discounted Price (25% OFF):</span>
                        <span className="text-minecraft-secondary font-bold">₹{discountPrice}/month</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-white">Total Amount:</span>
                        <span className="text-white font-bold">₹{discountPrice}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioItem value="upi" id="upi">
                              <RadioIndicator />
                            </RadioItem>
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
                
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requests or information we should know?"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Complete Purchase
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-white font-medium">Secure Payment</h3>
              <p className="text-gray-400 text-sm">Your payment information is processed securely. We do not store credit card details.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer simplified={true} />
    </div>
  );
};

export default PurchaseForm;
