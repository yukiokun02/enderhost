
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import PurchaseForm from "@/pages/PurchaseForm";
import Troubleshooting from "@/pages/Troubleshooting";
import QRCodePayment from "@/pages/QRCodePayment";
import AdminLogin from "@/pages/AdminLogin";
import AdminToolbar from "@/components/admin/AdminToolbar";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

// Wrapper component to handle AnimatePresence with useLocation
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          } 
        />
        <Route 
          path="/terms-of-service" 
          element={
            <PageTransition>
              <TermsOfService />
            </PageTransition>
          } 
        />
        <Route 
          path="/privacy-policy" 
          element={
            <PageTransition>
              <PrivacyPolicy />
            </PageTransition>
          } 
        />
        <Route 
          path="/refund-policy" 
          element={
            <PageTransition>
              <RefundPolicy />
            </PageTransition>
          } 
        />
        <Route 
          path="/purchase" 
          element={
            <PageTransition>
              <PurchaseForm />
            </PageTransition>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PageTransition>
              <QRCodePayment />
            </PageTransition>
          } 
        />
        <Route 
          path="/troubleshooting" 
          element={
            <PageTransition>
              <Troubleshooting />
            </PageTransition>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          } 
        />
        <Route 
          path="*" 
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
        <AdminToolbar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
