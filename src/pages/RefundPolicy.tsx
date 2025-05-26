
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black overflow-x-hidden pt-16 relative">
      {/* Global Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-10 mix-blend-soft-light pointer-events-none"
        style={{ 
          backgroundImage: `linear-gradient(#8E9196 0.5px, transparent 0.5px), linear-gradient(to right, #8E9196 0.5px, transparent 0.5px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Back button - repositioned for mobile */}
      <button 
        onClick={() => navigate("/")}
        className="absolute md:top-8 md:left-8 top-20 left-4 p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 z-10"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </button>
      
      <Navigation />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Refund Policy</h1>
          
          <div className="text-gray-300 space-y-8">
            {/* Introduction */}
            <div>
              <p className="mb-6 text-lg">
                At EnderHOST<sup className="text-xs">®</sup>, we aim to provide the highest quality Minecraft hosting services. We understand that sometimes 
                circumstances change, and you may need to request a refund. This policy outlines our guidelines for refunds and 
                cancellations to ensure transparency and fair treatment for all customers.
              </p>
            </div>
            
            {/* Section 1 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">1. Refund Eligibility</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>All new customers are eligible for a full refund within 24 hours of the initial purchase if the service does not meet the advertised specifications or experiences significant technical issues that our support team cannot resolve.</li>
                <li>Refund requests must be submitted through our official support channels and include your order details and the specific reason for the refund request.</li>
                <li>To qualify for a refund, you must demonstrate that the service is not functioning as advertised or that there are persistent technical issues that significantly impact your ability to use the service.</li>
                <li>Refunds will only be processed to the original payment method used for the purchase. We do not offer refunds in alternative forms such as store credit or transfers to other accounts.</li>
                <li>For annual plans, we offer a prorated refund within the first 7 days if you experience major, unresolvable technical issues. After this period, annual plans become non-refundable.</li>
              </ul>
            </div>
            
            {/* Section 2 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">2. Non-Refundable Services</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>Domain name registrations and transfers are non-refundable under any circumstances due to the immediate nature of these services.</li>
                <li>Add-on services such as dedicated IP addresses, premium support packages, or third-party software licenses cannot be refunded once activated.</li>
                <li>Custom development work, server migrations performed by our team, or any personalized services are non-refundable once the work has commenced.</li>
                <li>Accounts terminated due to violations of our Terms of Service, Acceptable Use Policy, or any illegal activities are not eligible for refunds.</li>
                <li>Refunds will not be issued for service interruptions caused by DDoS attacks, scheduled maintenance, or other circumstances beyond our reasonable control.</li>
              </ul>
            </div>
            
            {/* Section 3 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">3. Cancellation Process</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>To cancel your service, log in to your client area and follow the cancellation procedure under the "My Services" section. The system will confirm your cancellation request and provide an estimated processing time.</li>
                <li>Monthly plans can be canceled at any time, but we do not provide partial refunds for unused portions of the current billing period. Your service will remain active until the end of the current paid period.</li>
                <li>For annual plans, cancellation will stop future renewals, but the service will remain active until the end of the current paid term unless otherwise specified.</li>
                <li>Cancellations must be submitted at least 24 hours before the next billing cycle to avoid being charged for the upcoming period. We recommend processing cancellations at least 48 hours in advance to ensure timely handling.</li>
                <li>Upon cancellation, it is your responsibility to back up any data from your server. All data will be permanently deleted upon service termination in accordance with our data retention policies.</li>
              </ul>
            </div>
            
            {/* Section 4 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">4. Billing Disputes</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>If you believe you have been incorrectly charged or billed, please contact our billing department within 30 days of the charge. We will investigate all legitimate billing disputes and resolve them promptly.</li>
                <li>Customers who initiate chargebacks or payment disputes through their payment provider without first attempting to resolve the issue with our billing department may have their accounts suspended or terminated.</li>
                <li>In cases of billing errors on our part, we will issue a refund or account credit as appropriate, depending on the circumstances and customer preference.</li>
                <li>For subscription billing issues, we may offer a grace period to resolve payment problems before service suspension. Contact our billing team immediately if you anticipate payment difficulties.</li>
                <li>We maintain detailed billing logs and will provide transaction records upon request to help resolve any billing discrepancies.</li>
              </ul>
            </div>
            
            {/* Section 5 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">5. Special Circumstances</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>In cases of extended service outages (exceeding 24 consecutive hours) caused by our infrastructure, we may offer service credits or partial refunds at our discretion, even outside the standard refund eligibility period.</li>
                <li>Customers experiencing financial hardship may contact our customer service team to discuss potential options for service downgrades, payment plans, or special arrangements.</li>
                <li>For customers affected by natural disasters or other catastrophic events, we may extend special considerations regarding service continuity, payment deadlines, or cancellation terms. Contact our support team to discuss your situation.</li>
                <li>Bulk service purchases or enterprise customers may have custom refund and cancellation terms as specified in their service agreements, which take precedence over this general policy.</li>
                <li>EnderHOST<sup className="text-xs">®</sup> reserves the right to make exceptions to this policy on a case-by-case basis at its sole discretion. Any exceptions made will not constitute a waiver of our right to enforce these policies in the future.</li>
              </ul>
            </div>
            
            {/* New Section 6 - Transaction Agreement */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">6. Transaction Agreement</h2>
              <p className="text-lg">
                Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point the User may cancel the Transaction unless it has been specifically provided for on the Platform. In which case, the cancellation will be subject to the terms mentioned on the Platform. We shall retain the discretion in approving any cancellation requests and we may ask for additional details before approving any requests. Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform. Any request for refund must be submitted within three days from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days. A User may submit a claim for a refund for a purchase made, by raising a ticket here or contacting us on seller+403c489692c144209fffa693d3a801d7@instamojo.com and providing a clear and specific reason for the refund request, including the exact terms that have been violated, along with any proof, if required. Whether a refund will be provided will be determined by us, and we may ask for additional details before approving any requests.
              </p>
            </div>
            
            {/* Last updated */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-500 text-sm">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
