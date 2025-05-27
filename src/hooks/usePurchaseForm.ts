import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { allPlans, API_BASE_URL, INR_TO_USD_RATE, Plan } from "@/config/purchaseFormConfig";
import { isValidEmailFormat } from "@/utils/purchaseFormUtils";

export interface FormDataState {
  serverName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  discordUsername: string;
  plan: string;
  additionalBackups: string;
  additionalPorts: string;
  redeemCode: string;
}

// Define a type for the backend verification response
interface EmailVerificationResponse {
  isValid: boolean;
  message?: string; // e.g., "Email is deliverable", "Email does not exist", "Bad syntax"
  suggestion?: string; // e.g., "Did you mean user@gmail.com?"
}

export const usePurchaseForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormDataState>({
    serverName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    discordUsername: "",
    plan: "",
    additionalBackups: "0",
    additionalPorts: "0",
    redeemCode: ""
  });
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedeemCodeValid, setIsRedeemCodeValid] = useState<boolean | null>(null);
  const [redeemCodeDiscount, setRedeemCodeDiscount] = useState<{
    amount: number;
    type: 'percent' | 'fixed';
  } | null>(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [checkedCodes, setCheckedCodes] = useState<string[]>([]);
  
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // New state for loading
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null); // New state for suggestions

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const planFromUrl = queryParams.get('plan');
    
    if (planFromUrl) {
      setFormData(prev => ({ ...prev, plan: planFromUrl }));
      const plan = allPlans.find(p => p.id === planFromUrl);
      setSelectedPlan(plan || null);
    }
  }, [location.search]);

  const calculateTotalPrice = useCallback(() => {
    if (!selectedPlan) return 0;
    let basePrice = selectedPlan.price;
    const backupPrice = parseInt(formData.additionalBackups) * 19;
    const portPrice = parseInt(formData.additionalPorts) * 9;
    let totalPrice = basePrice + backupPrice + portPrice;
    if (isRedeemCodeValid && redeemCodeDiscount) {
      if (redeemCodeDiscount.type === 'percent') {
        totalPrice = totalPrice * (1 - redeemCodeDiscount.amount / 100);
      } else {
        totalPrice = Math.max(0, totalPrice - redeemCodeDiscount.amount);
      }
    }
    return Math.round(totalPrice);
  }, [selectedPlan, formData.additionalBackups, formData.additionalPorts, isRedeemCodeValid, redeemCodeDiscount]);

  const totalPrice = calculateTotalPrice();
  const totalUSD = (totalPrice / INR_TO_USD_RATE).toFixed(2);

  const handleEmailValidation = useCallback(async (emailValue: string, isSubmitAttempt = false): Promise<boolean> => {
    const trimmedEmail = emailValue.trim();
    setEmailSuggestion(null); // Reset suggestion

    if (!trimmedEmail) {
      if (isSubmitAttempt || emailTouched) {
        setIsEmailValid(false);
        setEmailError("Email address is required.");
        setIsVerifyingEmail(false);
      } else {
        setIsEmailValid(null);
        setEmailError(null);
      }
      return false;
    }

    // Basic format check first
    if (!isValidEmailFormat(trimmedEmail)) {
      if (isSubmitAttempt || emailTouched) {
        setIsEmailValid(false);
        setEmailError("Please enter a valid email address format (e.g., user@example.com).");
        setIsVerifyingEmail(false);
      } else {
        setIsEmailValid(null);
        setEmailError(null);
      }
      return false;
    }

    // If format is okay, proceed to server-side validation
    setIsVerifyingEmail(true);
    setIsEmailValid(null); // Reset while verifying
    setEmailError(null);

    try {
      // IMPORTANT: Replace '/api/verify-email.php' with the actual URL of your backend endpoint on your VPS.
      // Your backend should expect a POST request with a JSON body like { email: "user@example.com" }
      // and return a JSON response like { isValid: true/false, message: "...", suggestion: "..." }
      const response = await fetch('/api/verify-email.php', { // <-- REPLACE THIS URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        // Handle HTTP errors from your backend (e.g., 500 Internal Server Error)
        const errorData = await response.json().catch(() => ({ message: "Verification request failed. Please try again." }));
        setIsEmailValid(false);
        setEmailError(errorData.message || "Email verification failed. Server error.");
        return false;
      }

      const data: EmailVerificationResponse = await response.json();

      setIsEmailValid(data.isValid);
      if (!data.isValid) {
        setEmailError(data.message || "This email address appears to be invalid or unreachable.");
      } else {
        setEmailError(null); // Clear error if valid
      }
      if (data.suggestion) {
        setEmailSuggestion(data.suggestion);
      }
      return data.isValid;

    } catch (error) {
      console.error("Email verification API call failed:", error);
      setIsEmailValid(false);
      setEmailError("Could not verify email. Please check your connection and try again.");
      return false;
    } finally {
      setIsVerifyingEmail(false);
    }
  }, [emailTouched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'redeemCode') {
      setIsRedeemCodeValid(null);
      setRedeemCodeDiscount(null);
    }

    if (name === 'email') {
      // Reset validation status on change, will re-validate on blur or submit
      setIsEmailValid(null);
      setEmailError(null);
      setEmailSuggestion(null);
      // No need to set emailTouched here, blur handles it.
    }
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (!emailTouched) {
      setEmailTouched(true);
    }
    // Don't await here, let it run in background. Form submission will await.
    handleEmailValidation(e.target.value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "plan") {
      const plan = allPlans.find(p => p.id === value);
      setSelectedPlan(plan || null);
    }
  };

  const validateRedeemCode = async () => {
    const code = formData.redeemCode.trim().toUpperCase();
     setFormData(prev => ({ ...prev, redeemCode: code }));

    if (!code) {
      setIsRedeemCodeValid(null);
      setRedeemCodeDiscount(null);
      return;
    }
    
    if (checkedCodes.includes(code) && !isRedeemCodeValid) { // Check against current isRedeemCodeValid
        const previouslyCheckedInvalid = checkedCodes.find(c => c === code);
        if (previouslyCheckedInvalid) {
            toast({
                title: "Invalid code",
                description: "This code has already been checked and found to be invalid, used, or expired.",
                variant: "destructive",
            });
            return;
        }
    }
    
    setIsCheckingCode(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/redeem/validate-code.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      
      if (data.success) {
        setIsRedeemCodeValid(true);
        setRedeemCodeDiscount({ amount: data.discountAmount, type: data.discountType });
        if (!checkedCodes.includes(code)) { // Add to checkedCodes only if it's a new valid check
            setCheckedCodes(prev => [...prev, code]);
        }
        toast({
          title: "Redeem code applied!",
          description: data.discountType === 'percent' ? 
            `You got a ${data.discountAmount}% discount` : 
            `You got ₹${data.discountAmount} off`,
        });
      } else {
        setIsRedeemCodeValid(false);
        setRedeemCodeDiscount(null);
        if (!checkedCodes.includes(code)) {
             setCheckedCodes(prev => [...prev, code]);
        }
        toast({
          title: "Invalid code",
          description: data.message || "This code is invalid, already used, or expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating code:", error);
      setIsRedeemCodeValid(false);
      toast({
        title: "Error",
        description: "Failed to validate redeem code",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailTouched) {
      setEmailTouched(true);
    }
    // Await the validation result before proceeding
    const isEmailCurrentlyValid = await handleEmailValidation(formData.email, true);

    if (!formData.serverName || !formData.name || !formData.password || !formData.plan) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (excluding optional ones).",
        variant: "destructive",
      });
      return;
    }

    if (!isEmailCurrentlyValid) {
      toast({
        title: "Invalid Email",
        description: emailError || "Please provide a valid and reachable email address.",
        variant: "destructive",
      });
      document.getElementById('email')?.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    const finalTotalPrice = calculateTotalPrice();
    
    if (isRedeemCodeValid && formData.redeemCode) {
      try {
        await fetch(`${API_BASE_URL}/redeem/mark-used.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: formData.redeemCode }),
        });
      } catch (error) {
        console.error("Error marking code as used:", error);
      }
    }
    
    navigate("/payment", { 
      state: {
        ...formData,
        totalPrice: finalTotalPrice,
        billingCycle: 1, // Assuming monthly billing cycle
        discountApplied: isRedeemCodeValid && redeemCodeDiscount ? {
          code: formData.redeemCode,
          ...redeemCodeDiscount
        } : null
      }
    });
    // setIsSubmitting(false); // Typically, navigation occurs, so unsetting might not be needed or done in a finally block if there was an async operation here
  };

  return {
    formData,
    handleChange,
    handleSelectChange,
    handleEmailBlur,
    emailError,
    isEmailValid,
    emailTouched,
    isVerifyingEmail, // Expose new state
    emailSuggestion, // Expose suggestion state
    selectedPlan,
    validateRedeemCode,
    isCheckingCode,
    isRedeemCodeValid,
    redeemCodeDiscount,
    totalPrice,
    totalUSD,
    isSubmitting,
    handleSubmit,
  };
};
