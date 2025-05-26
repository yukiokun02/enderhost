
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Privacy Policy</h1>
          
          <div className="text-gray-300 space-y-8">
            {/* Introduction */}
            <div>
              <p className="mb-6 text-lg">
                At EnderHOST, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. 
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access our services.
              </p>
            </div>
            
            {/* Section 1 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>When you create an account, we collect personal information such as your name, email address, and payment information. This information is necessary to set up and manage your hosting services.</li>
                <li>We collect server usage data, including CPU usage, RAM usage, storage space, and bandwidth consumption to ensure optimal service performance and appropriate billing.</li>
                <li>We may collect information about your device and internet connection, including IP address, browser type, operating system, and the pages you visit on our website to improve our services and security measures.</li>
                <li>If you contact our support team, we collect and store the communications and information provided during these interactions to assist with any ongoing issues and to improve our customer service.</li>
                <li>We use cookies and similar technologies to enhance your experience on our website, analyze usage patterns, and store certain preferences. You can control cookie settings through your browser preferences.</li>
              </ul>
            </div>
            
            {/* Section 2 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>We use your personal information to create and manage your account, process payments, and provide the hosting services you've purchased.</li>
                <li>Your contact information is used to communicate with you about your account, send service updates, technical notices, security alerts, and support messages.</li>
                <li>We analyze usage data to monitor and improve the performance, reliability, and security of our hosting infrastructure.</li>
                <li>We may use aggregated, anonymized data for internal research and analytics to understand how our services are used and to make improvements to our offerings.</li>
                <li>In some cases, we may use your information to personalize your experience and to deliver content and product offerings relevant to your interests, including targeted offers through our website, email, or other communication channels (always with opt-out options).</li>
              </ul>
            </div>
            
            {/* Section 3 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">3. Information Sharing and Disclosure</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</li>
                <li>We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you, provided that these parties agree to keep this information confidential.</li>
                <li>We may share information with payment processors to complete transactions, but we do not store complete credit card information on our servers.</li>
                <li>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</li>
                <li>In the event of a merger, acquisition, or asset sale, your personal information may be transferred as a business asset. We will notify you before your personal information becomes subject to a different privacy policy.</li>
              </ul>
            </div>
            
            {/* Section 4 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>We implement a variety of security measures to maintain the safety of your personal information, including encryption, firewalls, and secure server infrastructure.</li>
                <li>While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</li>
                <li>Access to personal information is restricted to employees, contractors, and third-party service providers who need to know that information to operate, develop, or improve our services. These individuals are bound by confidentiality obligations.</li>
                <li>We regularly review our information collection, storage, and processing practices, including physical security measures, to prevent unauthorized access to our systems.</li>
                <li>In the event of a data breach that compromises your personal information, we will notify you and relevant authorities as required by applicable laws.</li>
              </ul>
            </div>
            
            {/* Section 5 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">5. Your Rights and Choices</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>You have the right to access, correct, or delete your personal information at any time by accessing your account settings or contacting our support team.</li>
                <li>You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails or by contacting us directly.</li>
                <li>You may disable cookies through your browser settings, though this may affect certain features of our website and services.</li>
                <li>If you are a resident of the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including the right to data portability and the right to restrict processing.</li>
                <li>California residents have certain rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and how it is used and shared.</li>
              </ul>
            </div>
            
            {/* Section 6 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">6. Children's Privacy</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>Our services are not intended for individuals under the age of 16, and we do not knowingly collect personal information from children under 16.</li>
                <li>If we learn that we have collected personal information from a child under 16, we will promptly take steps to delete that information from our servers.</li>
                <li>If you are a parent or guardian and believe your child has provided us with personal information, please contact us so that we can take appropriate action.</li>
                <li>We encourage parents and guardians to monitor their children's Internet usage and to help enforce our Privacy Policy by instructing their children never to provide personal information without their permission.</li>
                <li>In certain jurisdictions where there may be different age requirements, we comply with all applicable local laws regarding the protection of minors online.</li>
              </ul>
            </div>
            
            {/* Section 7 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">7. Changes to This Privacy Policy</h2>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</li>
                <li>For significant changes, we will provide a more prominent notice, which may include an email notification to the email address associated with your account.</li>
                <li>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</li>
                <li>Your continued use of our services after we post any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide by the modified policy.</li>
                <li>If you disagree with any changes to this Privacy Policy, you will need to stop using our services and deactivate your account.</li>
              </ul>
            </div>
            
            {/* Section 8 */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">8. Contact Us</h2>
              <p className="text-lg mb-3">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-lg">
                <li>Email: privacy@enderhost.com</li>
                <li>Through our support ticket system in your client area</li>
                <li>Via our Discord server where our support team can assist you</li>
                <li>For formal privacy inquiries or data requests, please send written correspondence to our registered business address</li>
                <li>Our Data Protection Officer can be reached directly at dpo@enderhost.com for specific privacy concerns or GDPR-related inquiries</li>
              </ul>
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
