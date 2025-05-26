import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden pt-16 relative">
      {/* The old grid background div has been removed */}
      
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
        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-10 relative z-[1]"> {/* Added relative z-[1] to ensure content is above pseudo-elements if any overlap */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">Terms and Conditions</h1>
          
          <div className="text-gray-300 space-y-8">
            {/* Introduction */}
            <div>
              <p className="mb-6 text-lg">
                By accessing this website, you agree to be bound by these Terms and Conditions ("Terms") in a legally binding agreement between us ("EnderHOST" or "we" or "our") and you ("User" or "you" or "your"). Please read these Terms carefully before accessing or using the Website. If you do not agree to these Terms, you may not access the Platform. We reserve the right to update and change the Terms by posting updates to the Platform. You are advised to review the Terms periodically for any updates. If such amendments are not acceptable to you, please discontinue using the Platform immediately.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">1. Eligibility</h2>
              <p className="text-lg">
                You represent and warrant that you have the right, power, and authority to agree to these Terms and to perform your obligations hereunder.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>"Payment Instrument" includes credit card, debit card, bank account, UPI, IMPS, or any other payment methods that may be added by financial institutions from time to time.</li>
                <li>"Platform" refers to the website or service where EnderHOST offers its products or services and where Transactions may be initiated.</li>
                <li>"Transaction" refers to the order or request placed by the User to purchase products and/or services by paying the Transaction Amount to EnderHOST.</li>
                <li>"Transaction Amount" means the amount paid by the User for a Transaction.</li>
                <li>"User/Users" means any person availing the products and/or services offered on the Platform.</li>
                <li>"Website" shall mean www.enderhost.in.</li>
              </ul>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">3. EnderHOST's Rights</h2>
              <p className="text-lg">
                We may collect, store, and share information provided by you to deliver the products and/or services availed by you on our Platform and to contact you in relation to the same.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">4. User Responsibilities</h2>
              <p className="text-lg">
                You agree to provide true, complete, and up-to-date information about yourself for the purpose of completing Transactions. This includes personal details such as name, email address, phone number, and payment information required for the transaction.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">5. Prohibited Actions</h2>
              <p className="text-lg mb-3">
                As a User of the Platform, you agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Access or use the Platform for purposes other than those authorized by EnderHOST.</li>
                <li>Collect usernames, email addresses, or other information of users by electronic or other means without permission.</li>
                <li>Circumvent or interfere with security features of the Platform.</li>
                <li>Impersonate other users or use false information.</li>
                <li>Upload or transmit viruses, spam, or any material that disrupts the Platform's functionality.</li>
                <li>Use the Platform to harass, abuse, or harm others.</li>
                <li>Attempt to reverse-engineer any part of the Platform.</li>
                <li>Use the Platform in a manner inconsistent with applicable laws or regulations.</li>
              </ul>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
              <p className="text-lg">
                In the event of a defective product or service, the User's only recourse is to initiate a refund request, subject to our refund policy. EnderHOST disclaims any liability for losses, and the User agrees to indemnify and hold harmless EnderHOST and its representatives against any claims arising from a breach of these Terms by the User.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">7. Guidelines for Reviews</h2>
              <p className="text-lg mb-3">
                When posting a review, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-lg">
                <li>Have firsthand experience with the product or service being reviewed.</li>
                <li>Avoid offensive, abusive, or discriminatory language.</li>
                <li>Not be affiliated with competitors if posting negative reviews.</li>
                <li>Avoid posting false or misleading information.</li>
              </ul>
              <p className="mt-3 text-lg">
                EnderHOST reserves the right to accept, reject, or remove reviews at its sole discretion.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">8. Governing Laws & Dispute Resolution</h2>
              <p className="text-lg">
                These Terms are governed by the laws of India. Any disputes shall be resolved through arbitration in Bengaluru, in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be India, and proceedings shall be conducted in English. The decision of the arbitrator shall be final and binding.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">9. Grievance Redressal</h2>
              <p className="text-lg">
                If you have any questions or complaints regarding products or services, or issues related to Transactions, please reach out to our support team at support@enderhost.in.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">10. Disclaimer</h2>
              <p className="text-lg mb-3">
                By initiating a Transaction, you agree to provide accurate payment details and to use legitimate and legal sources of funds. EnderHOST disclaims any liability for unauthorized use of a User's Payment Instrument or for any losses arising directly or indirectly from declined Transactions, errors, or fraudulent activities.
              </p>
              <p className="text-lg">
                EnderHOST does not guarantee that the Platform will be secure or free from bugs or viruses. You are responsible for using adequate security measures and virus protection software.
              </p>
            </div>
            
            {/* Conclusion */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-lg font-medium text-white">
                By using our Platform, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
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
