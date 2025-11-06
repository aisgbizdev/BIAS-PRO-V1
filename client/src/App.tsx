import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/languageContext";
import { SessionProvider, useSession } from "@/lib/sessionContext";
import { BiasHeader } from "@/components/BiasHeader";
import { ChatBubble } from "@/components/ChatBubble";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import SocialMediaPro from "@/pages/social-media-pro";
import CreatorAnalysis from "@/pages/creator-analysis";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // ✅ FIX: Scroll to top (0,0) whenever route changes
    // Use 'auto' (standards-compliant) instead of 'instant'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/social-pro" component={SocialMediaPro} />
        <Route path="/creator" component={CreatorAnalysis} />
        <Route path="/library" component={Library} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { hasAnalysis } = useSession();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BiasHeader />
      <main className="flex-1 overflow-auto">
        <Router />
      </main>
      <ChatBubble hasAnalysis={hasAnalysis} />
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>
          BiAS<sup className="text-[0.6em]">23</sup> Pro • Behavioral Intelligence Audit System •{' '}
          <span className="font-medium">
            Powered by 8-Layer Framework
          </span>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <SessionProvider>
            <AppContent />
            <Toaster />
          </SessionProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
