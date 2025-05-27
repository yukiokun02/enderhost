
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Check, X } from "lucide-react";

interface RedeemCodeInputProps {
  redeemCodeValue: string;
  onRedeemCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyRedeemCode: () => void;
  isCheckingCode: boolean;
  isRedeemCodeValid: boolean | null;
  redeemCodeDiscount: { amount: number; type: 'percent' | 'fixed' } | null;
}

const RedeemCodeInput: React.FC<RedeemCodeInputProps> = ({
  redeemCodeValue,
  onRedeemCodeChange,
  onApplyRedeemCode,
  isCheckingCode,
  isRedeemCodeValid,
  redeemCodeDiscount,
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="redeemCode"
        className="text-sm font-medium text-white/90 flex items-center gap-2"
      >
        <KeyRound className="h-4 w-4 text-minecraft-secondary" />
        Redeem Code (Optional)
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            id="redeemCode"
            name="redeemCode"
            placeholder="Enter your redeem code"
            value={redeemCodeValue}
            onChange={onRedeemCodeChange}
            className="bg-black/70 border-white/10 text-white placeholder:text-gray-500 pr-8 uppercase"
          />
          {isRedeemCodeValid !== null && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {isRedeemCodeValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={onApplyRedeemCode}
          disabled={isCheckingCode || !redeemCodeValue.trim()}
          className="bg-minecraft-secondary hover:bg-minecraft-primary text-white"
        >
          Apply
        </Button>
      </div>
      {isRedeemCodeValid === true && redeemCodeDiscount && (
        <p className="text-xs text-green-500">
          {redeemCodeDiscount.type === 'percent' 
            ? `${redeemCodeDiscount.amount}% discount applied` 
            : `₹${redeemCodeDiscount.amount} discount applied`}
        </p>
      )}
    </div>
  );
};

export default RedeemCodeInput;
