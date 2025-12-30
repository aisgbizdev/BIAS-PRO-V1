import { Switch, Route, useLocation, Redirect, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/languageContext";
import { BrandProvider, useBrand } from "@/lib/brandContext";
import { SessionProvider } from "@/lib/sessionContext";
import { SettingsProvider } from "@/lib/settingsContext";
import { BiasHeader } from "@/components/BiasHeader";
import { FloatingChatGPT } from "@/components/FloatingChatGPT";
import { OnboardingModal } from "@/components/OnboardingModal";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import SocialMediaPro from "@/pages/social-media-pro";
import CreatorAnalysis from "@/pages/creator-analysis";
import Premium from "@/pages/Premium";
import Help from "@/pages/Help";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
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
        <Route path="/premium" component={Premium} />
        <Route path="/help" component={Help} />
        <Route path="/about" component={About} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        
        {/* Redirect malformed admin URLs like /admin/newsmaker to /newsmaker/admin */}
        <Route path="/admin/:brand">
          {(params) => {
            const reservedPaths = ['social-pro', 'creator', 'library', 'admin', 'api', 'premium', 'help'];
            if (reservedPaths.includes(params.brand?.toLowerCase() || '')) {
              return <NotFound />;
            }
            return <Redirect to={`/${params.brand}/admin`} />;
          }}
        </Route>
        
        {/* Brand-prefixed routes (e.g., /newsmaker, /newsmaker/social-pro) */}
        <Route path="/:brand" component={Dashboard} />
        <Route path="/:brand/social-pro" component={SocialMediaPro} />
        <Route path="/:brand/creator" component={CreatorAnalysis} />
        <Route path="/:brand/library" component={Library} />
        <Route path="/:brand/admin" component={Library} />
        <Route path="/:brand/premium" component={Premium} />
        <Route path="/:brand/help" component={Help} />
        <Route path="/:brand/about" component={About} />
        <Route path="/:brand/privacy" component={Privacy} />
        <Route path="/:brand/terms" component={Terms} />
        
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { brand } = useBrand();
  
  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-x">
      <BiasHeader />
      <main className="flex-1 overflow-auto">
        <Router />
      </main>
      <FloatingChatGPT />
      <OnboardingModal />
      <footer className="border-t border-zinc-800 py-4 text-center text-sm text-muted-foreground safe-area-bottom">
        <p className="mb-2">
          {brand.shortName} • Behavioral Intelligence Audit System •{' '}
          <span className="font-medium">
            Powered by 8-Layer Framework
          </span>
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <Link href="/privacy" className="hover:text-pink-400 transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-pink-400 transition-colors">
            Terms of Service
          </Link>
        </div>
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
            <SettingsProvider>
              <SessionProvider>
                <AppContent />
                <Toaster />
              </SessionProvider>
            </SettingsProvider>
          </BrandProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
