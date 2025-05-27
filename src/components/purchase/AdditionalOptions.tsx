
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INR_TO_USD_RATE } from "@/config/purchaseFormConfig";
import { convertToUSD as convertToUSDUtil } from "@/utils/purchaseFormUtils";

interface AdditionalOptionsProps {
  additionalBackups: string;
  additionalPorts: string;
  onOptionChange: (name: string, value: string) => void;
}

const AdditionalOptions: React.FC<AdditionalOptionsProps> = ({
  additionalBackups,
  additionalPorts,
  onOptionChange,
}) => {
  const convertToUSD = (price: number) => convertToUSDUtil(price);

  return (
    <div className="bg-black/70 border border-white/10 rounded-md p-4 space-y-4">
      <h3 className="font-medium text-white">Additional Options</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/90">
          Additional Cloud Backups (₹19 each / ${convertToUSD(19)} each)
        </label>
        <Select
          name="additionalBackups"
          value={additionalBackups}
          onValueChange={(value) => onOptionChange("additionalBackups", value)}
        >
          <SelectTrigger className="w-full bg-black/70 border-white/10 text-white">
            <SelectValue placeholder="Select number of additional backups" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10 text-white">
            <SelectItem value="0">
              No additional backups
            </SelectItem>
            {[1,2,3,4,5].map(num =>
              <SelectItem key={num} value={String(num)}>
                {num} additional backup{num > 1 ? 's' : ''} (+₹{num*19} / +${convertToUSD(num*19)})
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-white/90">
          Additional Ports (₹9 each / ${convertToUSD(9)} each)
        </label>
        <Select
          name="additionalPorts"
          value={additionalPorts}
          onValueChange={(value) => onOptionChange("additionalPorts", value)}
        >
          <SelectTrigger className="w-full bg-black/70 border-white/10 text-white">
            <SelectValue placeholder="Select number of additional ports" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10 text-white">
            <SelectItem value="0">
              No additional ports
            </SelectItem>
            {[1,2,3,4,5].map(num =>
              <SelectItem key={num} value={String(num)}>
                {num} additional port{num > 1 ? 's' : ''} (+₹{num*9} / +${convertToUSD(num*9)})
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdditionalOptions;
