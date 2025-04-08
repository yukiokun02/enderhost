
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
import PageTransition from "./components/PageTransition";
import AdminLogin from "./pages/AdminLogin";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManagement from "./pages/admin/ContentManagement";
import ImageManagement from "./pages/admin/ImageManagement";
import PricingManagement from "./pages/admin/PricingManagement";
import ServerTypesManagement from "./pages/admin/ServerTypesManagement";
import StatisticsManagement from "./pages/admin/StatisticsManagement";
import UserManagement from "./pages/admin/UserManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";

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
            <Troubleshooting />
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/content" 
          element={
            <AdminRoute>
              <ContentManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/images" 
          element={
            <AdminRoute>
              <ImageManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/pricing" 
          element={
            <AdminRoute>
              <PricingManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/server-types" 
          element={
            <AdminRoute>
              <ServerTypesManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/stats" 
          element={
            <AdminRoute>
              <StatisticsManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminRoute>
              <SettingsManagement />
            </AdminRoute>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
