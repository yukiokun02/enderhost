
import React from "react";
import { Plan, INR_TO_USD_RATE } from "@/config/purchaseFormConfig";
import { getSpecIcon as getSpecIconUtil, convertToUSD as convertToUSDUtil } from "@/utils/purchaseFormUtils";

interface SelectedPlanDetailsProps {
  selectedPlan: Plan;
  additionalBackups: string;
  additionalPorts: string;
  isRedeemCodeValid: boolean | null;
  redeemCodeDiscount: { amount: number; type: 'percent' | 'fixed' } | null;
  totalPrice: number;
  totalUSD: string;
}

const SelectedPlanDetails: React.FC<SelectedPlanDetailsProps> = ({
  selectedPlan,
  additionalBackups,
  additionalPorts,
  isRedeemCodeValid,
  redeemCodeDiscount,
  totalPrice,
  totalUSD,
}) => {
  const getSpecIcon = (spec: string) => getSpecIconUtil(spec);
  const convertToUSD = (price: number) => convertToUSDUtil(price);
  
  const numAdditionalBackups = parseInt(additionalBackups);
  const numAdditionalPorts = parseInt(additionalPorts);

  return (
    <div className="space-y-3 bg-black/70 border border-white/10 rounded-md p-4 mt-4 backdrop-blur-sm">
      <h3 className="font-medium text-white flex items-center gap-2">
        <span>{selectedPlan.name}</span>
        <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/70">
          {selectedPlan.players}
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          {getSpecIcon(selectedPlan.specs.ram)}
          <span className="text-sm text-white/80">{selectedPlan.specs.ram}</span>
        </div>
        <div className="flex items-center gap-2">
          {getSpecIcon(selectedPlan.specs.cpu)}
          <span className="text-sm text-white/80">{selectedPlan.specs.cpu}</span>
        </div>
        <div className="flex items-center gap-2">
          {getSpecIcon(selectedPlan.specs.storage)}
          <span className="text-sm text-white/80">{selectedPlan.specs.storage}</span>
        </div>
        <div className="flex items-center gap-2">
          {getSpecIcon(selectedPlan.specs.bandwidth)}
          <span className="text-sm text-white/80">{selectedPlan.specs.bandwidth}</span>
        </div>
        {selectedPlan.specs.backups && (
          <div className="flex items-center gap-2">
            {getSpecIcon(selectedPlan.specs.backups)}
            <span className="text-sm text-white/80">{selectedPlan.specs.backups}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="p-3 bg-minecraft-accent/10 rounded-md border border-minecraft-accent/20">
          <div className="flex justify-between text-white">
            <span>Monthly price:</span>
            <span>
              ₹{selectedPlan.price}/month
              <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle">
                (${convertToUSD(selectedPlan.price)})
              </span>
            </span>
          </div>
          
          {numAdditionalBackups > 0 && (
            <div className="flex justify-between text-white">
              <span>Additional backups ({numAdditionalBackups}):</span>
              <span>
                +₹{numAdditionalBackups * 19}
                <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle">
                  (${convertToUSD(numAdditionalBackups * 19)})
                </span>
              </span>
            </div>
          )}
          
          {numAdditionalPorts > 0 && (
            <div className="flex justify-between text-white">
              <span>Additional ports ({numAdditionalPorts}):</span>
              <span>
                +₹{numAdditionalPorts * 9}
                <span className="ml-2 text-cyan-200 bg-cyan-900/40 px-2 py-0.5 rounded text-xs align-middle">
                  (${convertToUSD(numAdditionalPorts * 9)})
                </span>
              </span>
            </div>
          )}
          
          {isRedeemCodeValid && redeemCodeDiscount && (
            <div className="flex justify-between text-green-400 font-medium">
              <span>Discount:</span>
              <span>
                {redeemCodeDiscount.type === 'percent'
                  ? `-${redeemCodeDiscount.amount}%`
                  : `-₹${redeemCodeDiscount.amount}`}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-white font-bold mt-2 pt-2 border-t border-white/20">
            <span>Total price:</span>
            <div className="flex flex-col items-end">
              <span>
                ₹{totalPrice}
                <span className="ml-2 bg-cyan-900/40 text-cyan-200 px-2 py-0.5 rounded text-base align-middle font-bold">
                  (${totalUSD})
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedPlanDetails;
