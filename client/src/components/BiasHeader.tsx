import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/languageContext';
import { useSession } from '@/lib/sessionContext';
import { Coins, Globe, BookOpen, Home, Mic, Briefcase, Zap, Sparkles, ExternalLink } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { Link, useLocation } from 'wouter';
import biasLogo from '@assets/bias logo_1762016709581.jpg';

export function BiasHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const { session } = useSession();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-3 md:px-6 gap-2 md:gap-4">
        {/* Logo + Brand Name */}
        <div className="flex items-center gap-2 shrink-0">
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

        {/* Navigation Menu - Reordered: Social Pro First */}
        <div className="flex items-center gap-0.5 md:gap-1 flex-1 justify-center overflow-x-auto scrollbar-hide">
          <Link href="/">
            <Button
              variant={location === '/' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-home"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Home', 'Beranda')}</span>
            </Button>
          </Link>
          <Link href="/social-media-pro">
            <Button
              variant={location === '/social-media-pro' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-social-pro"
            >
              <SiTiktok className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Social Pro', 'Social Pro')}</span>
            </Button>
          </Link>
          <Link href="/creator">
            <Button
              variant={location === '/creator' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-creator"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Communication', 'Komunikasi')}</span>
            </Button>
          </Link>
          <Link href="/academic">
            <Button
              variant={location === '/academic' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-academic"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Academic', 'Akademik')}</span>
            </Button>
          </Link>
          <Link href="/hybrid">
            <Button
              variant={location === '/hybrid' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-hybrid"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Hybrid', 'Hybrid')}</span>
            </Button>
          </Link>
          <Link href="/library">
            <Button
              variant={location === '/library' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8 px-2 md:px-3"
              data-testid="button-nav-library"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-xs">{t('Library', 'Library')}</span>
            </Button>
          </Link>
        </div>

        {/* Right Side: ChatGPT + Language */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
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
