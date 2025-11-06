import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/lib/languageContext';
import { useSession } from '@/lib/sessionContext';
import { Coins, Globe, BookOpen, Home, Mic, Briefcase, Zap, Sparkles, ExternalLink, Menu } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link, useLocation } from 'wouter';
import biasLogo from '@assets/bias logo_1762016709581.jpg';
import { useState } from 'react';

export function BiasHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const { session } = useSession();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { href: '/', icon: Home, label: t('Home', 'Beranda') },
    { href: '/social-media-pro', icon: SiTiktok, label: t('Social Pro', 'Social Pro') },
    { href: '/creator', icon: Mic, label: t('Communication', 'Komunikasi') },
    { href: '/library', icon: BookOpen, label: t('Library', 'Library') },
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
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent font-bold">
                  BiAS²³ Pro
                </span>
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              
              {/* ChatGPT in Mobile Menu */}
              <Button
                onClick={() => {
                  window.open('https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-bias-pro-behavioral-intelligence-audit-system', '_blank', 'noopener,noreferrer');
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start gap-3 h-12 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white"
              >
                <Sparkles className="w-4 h-4" />
                <span>Chat GPT</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Button>

              {/* TikTok Follow in Mobile Menu */}
              <Button
                onClick={() => {
                  window.open('https://www.tiktok.com/@bias23_ai', '_blank', 'noopener,noreferrer');
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
              src={biasLogo} 
              alt="BiAS²³ Pro Logo" 
              className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm md:text-base font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                BiAS²³ Pro
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                {t('Bilingual', 'Bilingual')} • {t('Free', 'Gratis')}
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
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side: TikTok + ChatGPT + Language */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* TikTok Follow - Always Visible */}
          <Button
            onClick={() => window.open('https://www.tiktok.com/@bias23_ai', '_blank', 'noopener,noreferrer')}
            size="sm"
            variant="outline"
            data-testid="button-tiktok"
            className="gap-1.5 h-8 px-2 md:px-3"
            title={t('Follow on TikTok', 'Follow di TikTok')}
          >
            <SiTiktok className="w-3.5 h-3.5" />
            <span className="text-xs font-medium hidden lg:inline">@bias23_ai</span>
          </Button>

          {/* ChatGPT Button */}
          <Button
            onClick={() => window.open('https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-bias-pro-behavioral-intelligence-audit-system', '_blank', 'noopener,noreferrer')}
            size="sm"
            data-testid="button-chatgpt"
            className="gap-1 h-8 px-2 md:px-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white border-0 shadow-md hover:shadow-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden lg:inline font-medium text-xs">
              {language === 'id' ? 'Chat GPT' : 'Chat GPT'}
            </span>
            <ExternalLink className="w-3 h-3 hidden md:inline" />
          </Button>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
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
