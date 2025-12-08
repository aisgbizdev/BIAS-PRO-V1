interface VoiceInputOptions {
  language?: 'id-ID' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

class VoiceInputManager {
  private recognition: any = null;
  private isListening = false;
  private options: VoiceInputOptions = {};

  isSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  start(options: VoiceInputOptions = {}): boolean {
    if (!this.isSupported()) {
      options.onError?.('Voice input is not supported in this browser');
      return false;
    }

    if (this.isListening) {
      this.stop();
      return false;
    }

    this.options = options;

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionAPI();

    this.recognition.lang = options.language || 'id-ID';
    this.recognition.continuous = options.continuous ?? false;
    this.recognition.interimResults = options.interimResults ?? true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      options.onStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      options.onEnd?.();
    };

    this.recognition.onresult = (event: any) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;

      options.onResult?.(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not accessible. Please check permissions.',
        'not-allowed': 'Microphone access denied. Please enable microphone.',
        'network': 'Network error occurred. Please check your connection.',
        'aborted': 'Recording was aborted.',
        'language-not-supported': 'Language not supported.',
      };

      const message = errorMessages[event.error] || `Voice error: ${event.error}`;
      options.onError?.(message);
      this.isListening = false;
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      options.onError?.('Failed to start voice recognition');
      return false;
    }
  }

  stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
      }
      this.isListening = false;
    }
  }

  toggle(options: VoiceInputOptions = {}): boolean {
    if (this.isListening) {
      this.stop();
      return false;
    } else {
      return this.start(options);
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceInput = new VoiceInputManager();
