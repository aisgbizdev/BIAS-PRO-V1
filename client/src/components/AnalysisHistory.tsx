import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  getAnalysisHistory, 
  deleteAnalysisFromHistory, 
  clearAnalysisHistory,
  type AnalysisHistoryItem 
} from '@/lib/analysisHistory';
import { History, Trash2, Eye, Video, FileText, Link, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { BiasAnalysisResult } from '@shared/schema';

interface AnalysisHistoryProps {
  onSelectAnalysis: (result: BiasAnalysisResult) => void;
  refreshTrigger?: number;
}

export function AnalysisHistory({ onSelectAnalysis, refreshTrigger }: AnalysisHistoryProps) {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(() => {
    setIsLoading(true);
    const items = getAnalysisHistory();
    setHistory(items);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory, refreshTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      loadHistory();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bias-history-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bias-history-updated', handleStorageChange);
    };
  }, [loadHistory]);

  const handleDelete = (id: string) => {
    const success = deleteAnalysisFromHistory(id);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: t('Deleted', 'Terhapus'),
        description: t('Analysis removed from history', 'Analisis dihapus dari riwayat'),
      });
    }
  };

  const handleClearAll = () => {
    clearAnalysisHistory();
    setHistory([]);
    toast({
      title: t('History Cleared', 'Riwayat Dihapus'),
      description: t('All analysis history has been removed', 'Semua riwayat analisis telah dihapus'),
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-3.5 h-3.5" />;
      case 'url': return <Link className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-white/10">
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="py-8 text-center">
          <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            {t('No analysis history yet', 'Belum ada riwayat analisis')}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            {t('Your analyses will appear here', 'Analisis kamu akan muncul di sini')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-base">
              {t('Analysis History', 'Riwayat Analisis')}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {history.length}
            </Badge>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  {t('Clear All History?', 'Hapus Semua Riwayat?')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    'This will permanently delete all your analysis history. This action cannot be undone.',
                    'Ini akan menghapus semua riwayat analisis secara permanen. Tindakan ini tidak dapat dibatalkan.'
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel', 'Batal')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive hover:bg-destructive/90">
                  {t('Delete All', 'Hapus Semua')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="text-xs">
          {t('Click to view past analyses', 'Klik untuk lihat analisis sebelumnya')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          item.mode === 'tiktok' 
                            ? 'border-pink-500/50 text-pink-400' 
                            : 'border-cyan-500/50 text-cyan-400'
                        }`}
                      >
                        {item.mode === 'tiktok' ? 'TikTok Pro' : 'Marketing Pro'}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getInputIcon(item.inputType)}
                      </span>
                    </div>
                    <p className="text-sm truncate text-gray-300">{item.inputPreview}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</span>
                      <span className={`text-xs font-medium ${
                        item.result.overallScore >= 7 ? 'text-green-400' : 
                        item.result.overallScore >= 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        Score: {item.result.overallScore}/10
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSelectAnalysis(item.result)}
                      className="h-8 px-2"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 px-2 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
