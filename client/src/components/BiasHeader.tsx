import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/lib/languageContext';
import { useBrand } from '@/lib/brandContext';
import { getActiveBrandLogo } from '@/config/brands';
import { Globe, BookOpen, Home, Mic, ExternalLink, Menu, HelpCircle } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { openExternalLink } from '@/lib/external-link-handler';
import { trackNavigation, trackButtonClick } from '@/lib/analytics';

export function BiasHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const { brand, getTagline } = useBrand();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const brandLogo = getActiveBrandLogo();

  const menuItems = [
    { href: '/', icon: Home, label: t('Home', 'Beranda') },
    { href: '/social-pro', icon: SiTiktok, label: t('TikTok Pro', 'TikTok Pro') },
    { href: '/creator', icon: Mic, label: t('Marketing Pro', 'Marketing Pro') },
    { href: '/library', icon: BookOpen, label: t('Library', 'Library') },
    { href: '/help', icon: HelpCircle, label: t('Help', 'Bantuan') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
        {/* Mobile Menu (Hamburger) */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 px-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px]">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex flex-col">
                  <span className={`bg-gradient-to-r ${brand.colors.primary} bg-clip-text text-transparent font-bold`}>
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {getTagline()}
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
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
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo + Brand Name - Clickable to Home */}
        <Link href="/">
          <div className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
            <img 
              src={brandLogo} 
              alt={`${brand.name} Logo`}
              className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className={`text-sm md:text-base font-bold bg-gradient-to-r ${brand.colors.primary} bg-clip-text text-transparent`}>
                {brand.name}
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                {getTagline()}
              </span>
            </div>
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

        {/* Right Side: TikTok + Language */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
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
