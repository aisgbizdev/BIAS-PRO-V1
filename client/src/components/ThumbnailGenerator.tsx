import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Image, Loader2, Sparkles, Download, Palette, Wand2 } from 'lucide-react';
import { trackFeatureUsage } from '@/lib/analytics';

type ThumbnailStyle = 'viral' | 'professional' | 'minimalist' | 'bold' | 'aesthetic';
type AspectRatio = '16:9' | '9:16' | '1:1';

const STYLE_PROMPTS: Record<ThumbnailStyle, { en: string; id: string }> = {
  viral: {
    en: 'eye-catching viral YouTube thumbnail style with bright colors, expressive face, bold text overlay space',
    id: 'style thumbnail YouTube viral dengan warna cerah, ekspresi wajah ekspresif, area untuk teks tebal'
  },
  professional: {
    en: 'professional corporate thumbnail with clean design, subtle gradients, business aesthetic',
    id: 'thumbnail profesional dengan desain bersih, gradien halus, estetika bisnis'
  },
  minimalist: {
    en: 'minimalist clean thumbnail with simple design, white space, modern aesthetic',
    id: 'thumbnail minimalis dengan desain simpel, ruang kosong, estetika modern'
  },
  bold: {
    en: 'bold dramatic thumbnail with high contrast colors, dynamic composition, attention-grabbing',
    id: 'thumbnail bold dramatis dengan kontras tinggi, komposisi dinamis, menarik perhatian'
  },
  aesthetic: {
    en: 'aesthetic soft thumbnail with pastel colors, dreamy vibe, trendy instagram style',
    id: 'thumbnail estetik dengan warna pastel, vibe dreamy, gaya instagram trendy'
  }
};

interface GeneratedThumbnail {
  url: string;
  prompt: string;
  style: ThumbnailStyle;
}

export function ThumbnailGenerator() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>('viral');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnails, setGeneratedThumbnails] = useState<GeneratedThumbnail[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: t('Topic required', 'Topik diperlukan'),
        description: t('Please enter a video topic', 'Masukkan topik video'),
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const stylePrompt = STYLE_PROMPTS[style][language === 'id' ? 'id' : 'en'];
      const fullPrompt = `Create a ${aspectRatio} thumbnail image for: "${topic}". Style: ${stylePrompt}. ${additionalDetails}. High quality, visually striking, suitable for social media thumbnail.`;

      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          style,
          aspectRatio,
          additionalDetails,
          prompt: fullPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(t('Failed to generate thumbnail', 'Gagal membuat thumbnail'));
      }

      const data = await response.json();
      setGeneratedThumbnails(prev => [{
        url: data.imageUrl,
        prompt: fullPrompt,
        style,
      }, ...prev].slice(0, 6));

      toast({
        title: t('Concept Preview Created!', 'Preview Konsep Dibuat!'),
        description: t('Use this as reference for your thumbnail design', 'Gunakan ini sebagai referensi untuk desain thumbnail'),
      });

      trackFeatureUsage('video-upload', 'tiktok', { action: 'thumbnail-generate', style });

    } catch (error: any) {
      toast({
        title: t('Generation Failed', 'Gagal Generate'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail_${style}_${index + 1}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Wand2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {t('Ai Thumbnail Generator', 'Generator Thumbnail Ai')}
              </CardTitle>
              <CardDescription>
                {t('Create eye-catching thumbnails for your videos', 'Buat thumbnail menarik untuk video kamu')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('Video Topic', 'Topik Video')}</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t(
                'e.g., "5 Tips to Go Viral on TikTok"',
                'contoh: "5 Tips Viral di TikTok"'
              )}
              className="bg-gray-900/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('Style', 'Gaya')}</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as ThumbnailStyle)}>
                <SelectTrigger className="bg-gray-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viral">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      {t('Viral', 'Viral')}
                    </div>
                  </SelectItem>
                  <SelectItem value="professional">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-500" />
                      {t('Professional', 'Profesional')}
                    </div>
                  </SelectItem>
                  <SelectItem value="minimalist">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-400" />
                      {t('Minimalist', 'Minimalis')}
                    </div>
                  </SelectItem>
                  <SelectItem value="bold">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      {t('Bold', 'Bold')}
                    </div>
                  </SelectItem>
                  <SelectItem value="aesthetic">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-400" />
                      {t('Aesthetic', 'Estetik')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('Aspect Ratio', 'Rasio')}</Label>
              <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as AspectRatio)}>
                <SelectTrigger className="bg-gray-900/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (YouTube)</SelectItem>
                  <SelectItem value="9:16">9:16 (TikTok/Reels)</SelectItem>
                  <SelectItem value="1:1">1:1 (Instagram)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('Additional Details (Optional)', 'Detail Tambahan (Opsional)')}</Label>
            <Textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder={t(
                'Colors, mood, elements you want to include...',
                'Warna, mood, elemen yang ingin ditampilkan...'
              )}
              className="bg-gray-900/50 min-h-20"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('Generating...', 'Membuat...')}
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                {t('Generate Thumbnail', 'Buat Thumbnail')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedThumbnails.length > 0 && (
        <Card className="border-pink-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Image className="w-5 h-5 text-pink-400" />
              {t('Generated Thumbnails', 'Thumbnail yang Dibuat')}
              <Badge variant="secondary">{generatedThumbnails.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedThumbnails.map((thumb, idx) => (
                <div 
                  key={idx} 
                  className="relative group rounded-lg overflow-hidden border border-gray-800 bg-gray-900/50"
                >
                  <img
                    src={thumb.url}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDownload(thumb.url, idx)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      {t('Download', 'Unduh')}
                    </Button>
                  </div>
                  <Badge 
                    className="absolute bottom-2 left-2 bg-black/70"
                    variant="outline"
                  >
                    {thumb.style}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
