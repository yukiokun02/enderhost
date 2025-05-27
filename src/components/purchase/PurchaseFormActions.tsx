
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PurchaseFormActionsProps {
  isSubmitting: boolean;
}

const PurchaseFormActions: React.FC<PurchaseFormActionsProps> = ({ isSubmitting }) => {
  return (
    <>
      <Button
        type="submit"
        className="w-full py-6 mt-6 bg-gradient-to-r from-minecraft-primary to-minecraft-secondary hover:from-minecraft-primary/90 hover:to-minecraft-secondary/90 text-white font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(94,66,227,0.3)] button-texture"
        disabled={isSubmitting}
      >
        <span>Proceed to Payment</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>
          By proceeding, you agree to our{" "}
          <Link
            to="/terms-of-service"
            className="text-minecraft-secondary hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/refund-policy"
            className="text-minecraft-secondary hover:underline"
          >
            Refund Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
};

export default PurchaseFormActions;
