import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import PlaceholderPage from "./components/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/verify" element={<Verify />} />
              <Route 
                path="/about" 
                element={
                  <PlaceholderPage 
                    title="About CertifyChain" 
                    description="Learn more about our blockchain-powered certificate verification platform and how we're revolutionizing credential authentication."
                  />
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <PlaceholderPage 
                    title="Contact Us" 
                    description="Get in touch with our team for support, partnerships, or general inquiries about CertifyChain."
                  />
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
