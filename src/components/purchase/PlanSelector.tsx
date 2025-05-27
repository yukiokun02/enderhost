
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allPlans, Plan, INR_TO_USD_RATE } from "@/config/purchaseFormConfig";
import { convertToUSD as convertToUSDUtil } from "@/utils/purchaseFormUtils";

interface PlanSelectorProps {
  currentPlanId: string;
  onPlanChange: (planId: string) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ currentPlanId, onPlanChange }) => {
  const convertToUSD = (price: number) => convertToUSDUtil(price);

  return (
    <div className="space-y-2">
      <label htmlFor="plan" className="text-sm font-medium text-white/90">Select a Plan</label>
      <Select
        name="plan"
        onValueChange={onPlanChange}
        value={currentPlanId}
      >
        <SelectTrigger
          id="plan"
          className="w-full bg-black/70 border-white/10 text-white"
        >
          <SelectValue placeholder="Select a Plan" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-white/10 text-white max-h-80">
          <div className="p-1 text-xs uppercase text-white/50 font-medium">PLAY VANILLA</div>
          {allPlans.filter(p => p.category === "PLAY VANILLA").map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} - ₹{plan.price}/month (${convertToUSD(plan.price)})
            </SelectItem>
          ))}
          
          <div className="p-1 mt-2 text-xs uppercase text-white/50 font-medium">PLAY WITH MODPACKS</div>
          {allPlans.filter(p => p.category === "PLAY WITH MODPACKS").map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} - ₹{plan.price}/month (${convertToUSD(plan.price)})
            </SelectItem>
          ))}
          
          <div className="p-1 mt-2 text-xs uppercase text-white/50 font-medium">COMMUNITY SERVERS</div>
          {allPlans.filter(p => p.category === "START A COMMUNITY SERVER").map((plan) => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} - ₹{plan.price}/month (${convertToUSD(plan.price)})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlanSelector;
