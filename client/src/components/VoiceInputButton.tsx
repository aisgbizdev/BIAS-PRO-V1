import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { voiceInput } from '@/lib/voiceInput';
import { useLanguage } from '@/lib/languageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onTranscript: (text: string, append?: boolean) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export function VoiceInputButton({ 
  onTranscript, 
  className,
  size = 'icon',
  variant = 'outline'
}: VoiceInputButtonProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');

  const isSupported = voiceInput.isSupported();

  const handleToggleVoice = useCallback(() => {
    if (!isSupported) {
      toast({
        title: t('Not Supported', 'Tidak Didukung'),
        description: t(
          'Voice input is not supported in this browser. Try Chrome or Edge.',
          'Input suara tidak didukung di browser ini. Coba Chrome atau Edge.'
        ),
        variant: 'destructive',
      });
      return;
    }

    const started = voiceInput.toggle({
      language: language === 'id' ? 'id-ID' : 'en-US',
      continuous: false,
      interimResults: true,
      onStart: () => {
        setIsListening(true);
        setInterimText('');
        toast({
          title: t('Listening...', 'Mendengarkan...'),
          description: t('Speak now', 'Bicara sekarang'),
        });
      },
      onEnd: () => {
        setIsListening(false);
        setInterimText('');
      },
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          onTranscript(transcript, true);
          setInterimText('');
        } else {
          setInterimText(transcript);
        }
      },
      onError: (error) => {
        setIsListening(false);
        setInterimText('');
        
        const errorMessages: Record<string, { en: string; id: string }> = {
          'Microphone access denied. Please enable microphone.': {
            en: 'Microphone access denied. Please enable microphone.',
            id: 'Akses mikrofon ditolak. Silakan izinkan mikrofon.',
          },
          'No speech detected. Please try again.': {
            en: 'No speech detected. Please try again.',
            id: 'Tidak ada suara terdeteksi. Silakan coba lagi.',
          },
        };
        
        const translatedError = errorMessages[error];
        toast({
          title: t('Voice Error', 'Error Suara'),
          description: translatedError ? t(translatedError.en, translatedError.id) : error,
          variant: 'destructive',
        });
      },
    });
  }, [isSupported, language, onTranscript, t, toast]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant={variant}
        size={size}
        onClick={handleToggleVoice}
        className={cn(
          'transition-all duration-200',
          isListening && 'bg-red-500 hover:bg-red-600 border-red-500 text-white animate-pulse',
          className
        )}
        title={isListening ? t('Stop recording', 'Berhenti merekam') : t('Voice input', 'Input suara')}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      {isListening && interimText && (
        <div className="absolute top-full mt-2 left-0 right-0 min-w-[200px] p-2 bg-gray-900 border border-pink-500/50 rounded-lg text-sm text-gray-300 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin text-pink-500" />
            <span className="truncate">{interimText}</span>
          </div>
        </div>
      )}
    </div>
  );
}
