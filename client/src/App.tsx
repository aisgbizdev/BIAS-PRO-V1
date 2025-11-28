import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/languageContext";
import { BrandProvider, useBrand } from "@/lib/brandContext";
import { SessionProvider } from "@/lib/sessionContext";
import { BiasHeader } from "@/components/BiasHeader";
import { FloatingChatGPT } from "@/components/FloatingChatGPT";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import SocialMediaPro from "@/pages/social-media-pro";
import CreatorAnalysis from "@/pages/creator-analysis";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    trackPageView(location);
  }, [location]);
  
  return null;
}

function Router() {
  const { brandSlug } = useBrand();
  const basePath = brandSlug ? `/${brandSlug}` : '';
  
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Default routes (no brand prefix) */}
        <Route path="/" component={Dashboard} />
        <Route path="/social-pro" component={SocialMediaPro} />
        <Route path="/creator" component={CreatorAnalysis} />
        <Route path="/library" component={Library} />
        <Route path="/admin" component={Library} />
        
        {/* Brand-prefixed routes (e.g., /newsmaker, /newsmaker/social-pro) */}
        <Route path="/:brand" component={Dashboard} />
        <Route path="/:brand/social-pro" component={SocialMediaPro} />
        <Route path="/:brand/creator" component={CreatorAnalysis} />
        <Route path="/:brand/library" component={Library} />
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { brand } = useBrand();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BiasHeader />
      <main className="flex-1 overflow-auto">
        <Router />
      </main>
      <FloatingChatGPT />
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>
          {brand.shortName} • Behavioral Intelligence Audit System •{' '}
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
          <BrandProvider>
            <SessionProvider>
              <AppContent />
              <Toaster />
            </SessionProvider>
          </BrandProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
