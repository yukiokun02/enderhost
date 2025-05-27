import { useState } from "react";
import { usePurchaseForm } from "@/hooks/usePurchaseForm";
import DiscordPopup from "@/components/DiscordPopup";

import FormLayout from "@/components/purchase/FormLayout";
import PurchaseFormHeader from "@/components/purchase/PurchaseFormHeader";
import PurchaseFormFields from "@/components/purchase/PurchaseFormFields";
import PlanSelector from "@/components/purchase/PlanSelector";
import RedeemCodeInput from "@/components/purchase/RedeemCodeInput";
import SelectedPlanDetails from "@/components/purchase/SelectedPlanDetails";
import AdditionalOptions from "@/components/purchase/AdditionalOptions";
import PurchaseFormActions from "@/components/purchase/PurchaseFormActions";

const PurchaseForm = () => {
  const [isDiscordPopupOpen, setIsDiscordPopupOpen] = useState(false);
  const {
    formData,
    handleChange,
    handleSelectChange,
    handleEmailBlur,
    emailError,
    isEmailValid,
    emailTouched,
    isVerifyingEmail,
    emailSuggestion,
    selectedPlan,
    validateRedeemCode,
    isCheckingCode,
    isRedeemCodeValid,
    redeemCodeDiscount,
    totalPrice,
    totalUSD,
    isSubmitting,
    handleSubmit,
  } = usePurchaseForm();

  return (
    <FormLayout>
      <PurchaseFormHeader setIsDiscordPopupOpen={setIsDiscordPopupOpen} />

      <div className="bg-black/50 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <PurchaseFormFields
            formData={formData}
            handleChange={handleChange}
            handleEmailBlur={handleEmailBlur}
            emailError={emailError}
            isEmailValid={isEmailValid}
            emailTouched={emailTouched}
            isVerifyingEmail={isVerifyingEmail}
            emailSuggestion={emailSuggestion}
          />

          <PlanSelector
            currentPlanId={formData.plan}
            onPlanChange={(planId) => handleSelectChange("plan", planId)}
          />

          <RedeemCodeInput
            redeemCodeValue={formData.redeemCode}
            onRedeemCodeChange={handleChange}
            onApplyRedeemCode={validateRedeemCode}
            isCheckingCode={isCheckingCode}
            isRedeemCodeValid={isRedeemCodeValid}
            redeemCodeDiscount={redeemCodeDiscount}
          />

          {selectedPlan && (
            <>
              <SelectedPlanDetails
                selectedPlan={selectedPlan}
                additionalBackups={formData.additionalBackups}
                additionalPorts={formData.additionalPorts}
                isRedeemCodeValid={isRedeemCodeValid}
                redeemCodeDiscount={redeemCodeDiscount}
                totalPrice={totalPrice}
                totalUSD={totalUSD}
              />
              <AdditionalOptions
                additionalBackups={formData.additionalBackups}
                additionalPorts={formData.additionalPorts}
                onOptionChange={handleSelectChange}
              />
            </>
          )}

          <PurchaseFormActions isSubmitting={isSubmitting} />
        </form>
      </div>
      
      <DiscordPopup 
        isOpen={isDiscordPopupOpen} 
        onClose={() => setIsDiscordPopupOpen(false)} 
      />
    </FormLayout>
  );
};

export default PurchaseForm;
