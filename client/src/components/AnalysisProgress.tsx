import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Brain, Sparkles, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
  duration?: number;
  steps?: string[];
}

const defaultSteps = [
  'Mengumpulkan data...',
  'Menganalisis pola...',
  'Menerapkan framework BIAS...',
  'Mengevaluasi metrik...',
  'Menyusun rekomendasi...',
  'Finalisasi hasil...',
];

export function AnalysisProgress({ 
  isAnalyzing, 
  onComplete,
  duration = 8000,
  steps = defaultSteps 
}: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const wasAnalyzingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (isAnalyzing) {
      clearAllTimers();
      
      setIsVisible(true);
      setIsComplete(false);
      setProgress(0);
      setCurrentStep(0);
      wasAnalyzingRef.current = true;
      progressRef.current = 0;
      
      const intervalTime = 50;
      const progressPerInterval = 95 / (duration / intervalTime);
      
      intervalRef.current = setInterval(() => {
        progressRef.current += progressPerInterval;
        
        if (progressRef.current >= 95) {
          progressRef.current = 95;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        
        setProgress(progressRef.current);
        
        const stepIndex = Math.min(
          Math.floor(progressRef.current / (100 / steps.length)),
          steps.length - 1
        );
        setCurrentStep(stepIndex);
      }, intervalTime);

      return () => {
        clearAllTimers();
      };
    } else if (wasAnalyzingRef.current) {
      wasAnalyzingRef.current = false;
      clearAllTimers();
      
      setProgress(100);
      setCurrentStep(steps.length - 1);
      setIsComplete(true);
      onComplete?.();
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
        setCurrentStep(0);
        setIsComplete(false);
        progressRef.current = 0;
      }, 1500);
    }
  }, [isAnalyzing, duration, steps.length, onComplete]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full space-y-4 py-8"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-[2px]"
              >
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Brain className="w-8 h-8 text-pink-500" />
                </div>
              </motion.div>
            )}
            
            {!isComplete && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </motion.div>
            )}
          </div>

          <div className="text-center space-y-2">
            <motion.div
              key={progress}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
            >
              {Math.round(progress)}%
            </motion.div>
            
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted-foreground text-sm flex items-center gap-2"
            >
              {!isComplete && <Loader2 className="w-4 h-4 animate-spin" />}
              {isComplete ? 'Analisis selesai!' : steps[currentStep]}
            </motion.p>
          </div>

          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex gap-2 mt-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500' 
                    : 'bg-muted'
                }`}
                animate={index === currentStep ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5, repeat: index === currentStep ? Infinity : 0 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function AnalysisProgressInline({ 
  isAnalyzing,
  size = 'default'
}: { 
  isAnalyzing: boolean;
  size?: 'small' | 'default';
}) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const wasAnalyzingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    if (isAnalyzing) {
      clearAllTimers();
      
      setIsVisible(true);
      setProgress(0);
      wasAnalyzingRef.current = true;
      progressRef.current = 0;

      intervalRef.current = setInterval(() => {
        progressRef.current += Math.random() * 8 + 2;
        if (progressRef.current >= 95) {
          progressRef.current = 95;
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
        setProgress(progressRef.current);
      }, 200);

      return () => {
        clearAllTimers();
      };
    } else if (wasAnalyzingRef.current) {
      wasAnalyzingRef.current = false;
      clearAllTimers();
      
      setProgress(100);
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
        progressRef.current = 0;
      }, 500);
    }
  }, [isAnalyzing]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <span className={`inline-flex items-center gap-2 ${size === 'small' ? 'text-sm' : ''}`}>
      <Loader2 className={`animate-spin ${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'}`} />
      <span className="font-medium">{Math.round(progress)}%</span>
    </span>
  );
}
