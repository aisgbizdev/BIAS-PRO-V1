import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink } from 'lucide-react';
import { openExternalLink } from '@/lib/external-link-handler';
import { useLanguage } from '@/lib/languageContext';

/**
 * Floating ChatGPT Button - Bottom Right Position
 * Replaces internal Chat BIAS with external BiAS Custom GPT
 * 
 * Gradient styling: pink→purple→cyan (matches brand)
 * Opens external ChatGPT in system browser (Cordova-aware)
 * 
 * HIDDEN: Set to true to hide the button (still keep code for future use)
 * To show again, change HIDDEN_CHATGPT_BUTTON to false
 */
const HIDDEN_CHATGPT_BUTTON = true; // Toggle this to show/hide

export function FloatingChatGPT() {
  const { t } = useLanguage();

  // Hidden by config - return null to hide button
  if (HIDDEN_CHATGPT_BUTTON) {
    return null;
  }

  const handleClick = () => {
    openExternalLink(
      'https://chatgpt.com/g/g-68f512b32ef88191985d7e15f828ae7d-bias-pro-behavioral-intelligence-audit-system'
    );
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 sm:bottom-20 z-[9999] pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 flex justify-center sm:justify-end sm:pr-8">
        <Button
          onClick={handleClick}
          className="h-11 sm:h-12 rounded-full shadow-lg gap-2 px-5 sm:px-6 pointer-events-auto bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white border-0 hover:shadow-xl transition-all transform hover:scale-105"
          data-testid="button-floating-chatgpt"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
            {t('Chat with BiAS GPT', 'Chat dengan BiAS GPT')}
          </span>
          <ExternalLink className="w-4 h-4 flex-shrink-0 hidden sm:inline" />
        </Button>
      </div>
    </div>
  );
}
