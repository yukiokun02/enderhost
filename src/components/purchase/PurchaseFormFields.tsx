import React from "react";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { FormDataState } from "@/hooks/usePurchaseForm";

interface PurchaseFormFieldsProps {
  formData: FormDataState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  emailError: string | null;
  isEmailValid: boolean | null;
  emailTouched: boolean;
  isVerifyingEmail: boolean;
  emailSuggestion?: string | null;
}

const PurchaseFormFields: React.FC<PurchaseFormFieldsProps> = ({
  formData,
  handleChange,
  handleEmailBlur,
  emailError,
  isEmailValid,
  emailTouched,
  isVerifyingEmail,
  emailSuggestion,
}) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="serverName" className="text-sm font-medium text-white/90">Server Name</label>
        <Input
          id="serverName"
          name="serverName"
          placeholder="Enter your preferred server name"
          value={formData.serverName}
          onChange={handleChange}
          className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-white/90">Your Full Name</label>
        <Input
          id="name"
          name="name"
          placeholder="Your Full Name"
          value={formData.name}
          onChange={handleChange}
          className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white/90">Email Address</label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your Email Address"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className={`bg-black/70 border-white/10 text-white placeholder:text-gray-500 pr-10
              ${isEmailValid === false && emailTouched && !isVerifyingEmail ? 'border-red-500 focus:border-red-500 ring-red-500' : ''}
              ${isEmailValid === true && emailTouched && !isVerifyingEmail ? 'border-green-500 focus:border-green-500 ring-green-500' : ''}`}
            required
            aria-invalid={isEmailValid === false && emailTouched && !isVerifyingEmail}
            aria-describedby="email-error email-suggestion"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isVerifyingEmail ? (
              <Loader2 className="h-5 w-5 text-minecraft-secondary animate-spin" />
            ) : emailTouched && isEmailValid !== null ? (
              isEmailValid ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )
            ) : null}
          </div>
        </div>
        {emailError && emailTouched && !isVerifyingEmail && <p id="email-error" className="text-xs text-red-500 mt-1">{emailError}</p>}
        {emailSuggestion && !isVerifyingEmail && isEmailValid === false && (
          <p id="email-suggestion" className="text-xs text-yellow-400 mt-1">
            {emailSuggestion}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="discordUsername" className="text-sm font-medium text-white/90">Discord Username</label>
        <Input
          id="discordUsername"
          name="discordUsername"
          placeholder="Your Discord Username"
          value={formData.discordUsername}
          onChange={handleChange}
          className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-white/90">Phone Number (Optional)</label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-white/90">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a Password"
          value={formData.password}
          onChange={handleChange}
          className="bg-black/70 border-white/10 text-white placeholder:text-gray-500"
          required
        />
        <p className="text-xs text-gray-400">This will be your server login password.</p>
      </div>
    </>
  );
};

export default PurchaseFormFields;
