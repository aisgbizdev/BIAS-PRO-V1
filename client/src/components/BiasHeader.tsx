import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { useSettings } from '@/lib/settingsContext';
import { getActiveBrandLogo } from '@/config/brands';
import { getVideoUsageToday, getRemainingVideoAnalysis, getDailyLimit } from '@/lib/usageLimit';
import { Globe, BookOpen, Home, Mic, ExternalLink, Menu, HelpCircle, Zap, Info, Settings, ArrowLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SiTiktok } from 'react-icons/si';
import { Link, useLocation } from 'wouter';
import { useState, useEffect, useCallback } from 'react';
import { openExternalLink } from '@/lib/external-link-handler';
import { trackNavigation, trackButtonClick } from '@/lib/analytics';

export function BiasHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const { brand, getTagline } = useBrand();
  const { pricing } = useSettings();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandLogo = getActiveBrandLogo();
  
  const starterPlan = pricing.find(p => p.slug === 'gratis' || p.slug === 'starter');
  const serverLimit = starterPlan?.videoLimit || 10;
  
  const [remaining, setRemaining] = useState(() => getRemainingVideoAnalysis(serverLimit));
  const [dailyLimit, setDailyLimit] = useState(() => getDailyLimit(serverLimit));
  
  const refreshUsage = useCallback(() => {
    setRemaining(getRemainingVideoAnalysis(serverLimit));
    setDailyLimit(getDailyLimit(serverLimit));
  }, [serverLimit]);
  
  useEffect(() => {
    refreshUsage();
    
    const handleUsageUpdate = () => refreshUsage();
    window.addEventListener('bias-usage-updated', handleUsageUpdate);
    window.addEventListener('storage', handleUsageUpdate);
    
    const interval = setInterval(refreshUsage, 5000);
    
    return () => {
      window.removeEventListener('bias-usage-updated', handleUsageUpdate);
      window.removeEventListener('storage', handleUsageUpdate);
      clearInterval(interval);
    };
  }, [refreshUsage]);
  
  const isHomePage = location === '/' || location === '';
  
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const menuItems = [
    { href: '/', icon: Home, label: t('Home', 'Beranda') },
    { href: '/social-pro', icon: SiTiktok, label: t('TikTok Pro', 'TikTok Pro') },
    { href: '/creator', icon: Mic, label: t('Marketing Pro', 'Marketing Pro') },
    { href: '/library', icon: BookOpen, label: t('Library', 'Library') },
    { href: '/help', icon: HelpCircle, label: t('Help', 'Bantuan') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-top">
      <div className="flex h-16 items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
        {/* Back Button + Mobile Menu */}
        <div className="flex items-center gap-1">
          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 sm:h-8 sm:w-auto sm:px-3 px-0"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1.5">{t('Back', 'Kembali')}</span>
            </Button>
          )}
          
          {/* Mobile Menu (Hamburger) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 px-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-2 mt-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={location === item.href ? 'default' : 'ghost'}
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => {
                        trackNavigation(item.label, item.href);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}

              {/* TikTok Follow in Mobile Menu */}
              <Button
                onClick={() => {
                  trackButtonClick('TikTok Follow', 'mobile-menu');
                  openExternalLink(brand.social.tiktokUrl);
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full justify-start gap-3 h-12"
              >
                <SiTiktok className="w-4 h-4" />
                <span>{t('Follow on TikTok', 'Follow di TikTok')}</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>

              {/* Language Toggle in Mobile Menu */}
              <Button
                variant="outline"
                onClick={() => {
                  trackButtonClick('Language Toggle', 'mobile-menu', { from: language, to: language === 'en' ? 'id' : 'en' });
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-3 h-12 mt-2"
              >
                <Globe className="w-4 h-4" />
                <span>{t('Switch to Indonesian', 'Ganti ke Bahasa Inggris')}</span>
                <span className="ml-auto font-bold">{language.toUpperCase()}</span>
              </Button>

              {/* Admin Button in Mobile Menu */}
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 mt-2 border-zinc-700 text-zinc-400 hover:text-white"
                  onClick={() => {
                    trackNavigation('Admin', '/admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin</span>
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        </div>

        {/* Logo + Brand Name - Clickable to Home */}
        <Link href="/">
          <div className="flex items-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={brandLogo} 
              alt={`${brand.name} Logo`}
              className="h-8 md:h-10 w-auto object-contain rounded-lg"
            />
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center gap-0.5 md:gap-1 flex-1 justify-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className="gap-1 h-8 px-2 md:px-3"
                  data-testid={`button-nav-${item.href.replace('/', '') || 'home'}`}
                  onClick={() => trackNavigation(item.label, item.href)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side: Usage + TikTok + Language */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* Usage Indicator - Prominent with tooltip explanation */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/premium">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                    remaining <= 0 
                      ? 'bg-orange-500/20 border border-orange-500/50 hover:bg-orange-500/30' 
                      : remaining <= 2 
                        ? 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30' 
                        : 'bg-pink-500/20 border border-pink-500/50 hover:bg-pink-500/30'
                  }`}>
                    <Zap className={`w-4 h-4 ${
                      remaining <= 0 ? 'text-orange-400' : remaining <= 2 ? 'text-red-400' : 'text-pink-400'
                    }`} />
                    <span className={`text-sm font-bold ${
                      remaining <= 0 ? 'text-orange-400' : remaining <= 2 ? 'text-red-400' : 'text-pink-400'
                    }`}>
                      {remaining}/{dailyLimit}
                    </span>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[280px] p-3">
                <div className="space-y-2">
                  <p className="font-semibold text-sm">
                    {t('Ai Token Limit', 'Limit Token Ai')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {remaining > 0 
                      ? t(
                          `You have ${remaining} Ai-powered analyses remaining today.`,
                          `Kamu punya ${remaining} analisa Ai tersisa hari ini.`
                        )
                      : t(
                          'Ai token limit reached! Analysis still works using local knowledge base (without Ai enhancement).',
                          'Limit token Ai habis! Analisa tetap jalan pakai knowledge base lokal (tanpa Ai enhancement).'
                        )
                    }
                  </p>
                  {remaining <= 0 && (
                    <p className="text-xs text-orange-400 font-medium">
                      {t('Upgrade for more Ai analyses →', 'Upgrade untuk lebih banyak analisa Ai →')}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* TikTok Follow - Always Visible */}
          <Button
            onClick={() => {
              trackButtonClick('TikTok Follow', 'header');
              openExternalLink(brand.social.tiktokUrl);
            }}
            size="sm"
            variant="outline"
            data-testid="button-tiktok"
            className="gap-1.5 h-8 px-2 md:px-3"
            title={t('Follow on TikTok', 'Follow di TikTok')}
          >
            <SiTiktok className="w-3.5 h-3.5" />
            <span className="text-xs font-medium hidden lg:inline">{brand.social.tiktok}</span>
          </Button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              trackButtonClick('Language Toggle', 'header', { from: language, to: language === 'en' ? 'id' : 'en' });
              toggleLanguage();
            }}
            title={t('Switch to Indonesian', 'Ganti ke Bahasa Inggris')}
            data-testid="button-language-toggle"
            className="gap-1 h-8 px-2 md:px-3"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
