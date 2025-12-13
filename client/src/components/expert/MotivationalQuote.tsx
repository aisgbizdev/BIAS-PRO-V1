import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Button } from '@/components/ui/button';
import { Quote, RefreshCw } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", quoteId: "Satu-satunya cara melakukan pekerjaan hebat adalah mencintai apa yang kamu kerjakan." },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", quoteId: "Sukses bukanlah akhir, kegagalan bukanlah fatal: yang penting adalah keberanian untuk terus maju." },
  { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", quoteId: "Waktu terbaik menanam pohon adalah 20 tahun lalu. Waktu terbaik kedua adalah sekarang." },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", quoteId: "Jangan lihat jam; lakukan seperti yang dilakukannya. Terus bergerak." },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", quoteId: "Rahasia untuk maju adalah memulai." },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown", quoteId: "Batasanmu—hanyalah imajinasimu." },
  { quote: "Great things never come from comfort zones.", author: "Unknown", quoteId: "Hal-hal hebat tidak pernah datang dari zona nyaman." },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", quoteId: "Impikan. Inginkan. Lakukan." },
  { quote: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", quoteId: "Sukses biasanya datang kepada mereka yang terlalu sibuk untuk mencarinya." },
  { quote: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", quoteId: "Jangan takut melepas yang baik untuk meraih yang hebat." },
  { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", quoteId: "Semakin keras aku bekerja, semakin beruntung diriku." },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", quoteId: "Cara untuk memulai adalah berhenti bicara dan mulai melakukan." },
  { quote: "If you are not willing to risk the usual, you will have to settle for the ordinary.", author: "Jim Rohn", quoteId: "Jika kamu tidak mau ambil risiko yang biasa, kamu harus puas dengan yang biasa-biasa saja." },
  { quote: "Whether you think you can or think you can't, you're right.", author: "Henry Ford", quoteId: "Apakah kamu pikir bisa atau tidak bisa, kamu benar." },
  { quote: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", quoteId: "Satu-satunya tempat di mana sukses datang sebelum kerja adalah di kamus." },
  { quote: "It's not about having time. It's about making time.", author: "Unknown", quoteId: "Bukan soal punya waktu. Tapi soal membuat waktu." },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali", quoteId: "Jangan hitung hari, buat hari-harimu berarti." },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser", quoteId: "Peluang tidak terjadi begitu saja. Kamu yang menciptakannya." },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins", quoteId: "Perjalanan yang mustahil adalah yang tidak pernah kamu mulai." },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", quoteId: "Semua yang pernah kamu inginkan ada di sisi lain dari ketakutan." },
  { quote: "Hustle in silence and let your success make the noise.", author: "Unknown", quoteId: "Kerja keras dalam diam dan biarkan suksesmu yang bersuara." },
  { quote: "Small daily improvements are the key to staggering long-term results.", author: "Unknown", quoteId: "Perbaikan kecil setiap hari adalah kunci hasil luar biasa jangka panjang." },
  { quote: "What you do today can improve all your tomorrows.", author: "Ralph Marston", quoteId: "Apa yang kamu lakukan hari ini bisa memperbaiki semua hari esokmu." },
  { quote: "Be so good they can't ignore you.", author: "Steve Martin", quoteId: "Jadilah begitu baik sehingga mereka tidak bisa mengabaikanmu." },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", quoteId: "Masa depan milik mereka yang percaya pada keindahan impian mereka." },
  { quote: "Content is fire, social media is gasoline.", author: "Jay Baer", quoteId: "Konten adalah api, media sosial adalah bensinnya." },
  { quote: "Don't be afraid to get creative and experiment with your marketing.", author: "Mike Volpe", quoteId: "Jangan takut berkreasi dan bereksperimen dengan marketingmu." },
  { quote: "Your brand is what other people say about you when you're not in the room.", author: "Jeff Bezos", quoteId: "Brandmu adalah apa yang orang lain katakan tentangmu saat kamu tidak ada di ruangan." },
  { quote: "The best marketing doesn't feel like marketing.", author: "Tom Fishburne", quoteId: "Marketing terbaik tidak terasa seperti marketing." },
  { quote: "Stop selling. Start helping.", author: "Zig Ziglar", quoteId: "Berhenti menjual. Mulai membantu." },
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface MotivationalQuoteProps {
  variant?: 'pink' | 'purple' | 'cyan';
}

export function MotivationalQuote({ variant = 'purple' }: MotivationalQuoteProps) {
  const { t, language } = useLanguage();
  const [currentQuote, setCurrentQuote] = useState(() => getRandomItem(MOTIVATIONAL_QUOTES));
  
  const refreshQuote = () => {
    setCurrentQuote(getRandomItem(MOTIVATIONAL_QUOTES));
  };

  const gradients = {
    pink: 'from-pink-900/30 via-purple-900/20 to-cyan-900/30 border-pink-500/20',
    purple: 'from-purple-900/30 via-pink-900/20 to-cyan-900/30 border-purple-500/20',
    cyan: 'from-cyan-900/30 via-blue-900/20 to-purple-900/30 border-cyan-500/20',
  };

  const iconColors = {
    pink: 'text-pink-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
  };

  const authorColors = {
    pink: 'text-pink-300',
    purple: 'text-purple-300',
    cyan: 'text-cyan-300',
  };

  return (
    <div className={`mt-8 p-6 rounded-xl bg-gradient-to-br ${gradients[variant]} border`}>
      <div className="flex items-start gap-4">
        <Quote className={`w-8 h-8 ${iconColors[variant]} flex-shrink-0 mt-1`} />
        <div className="flex-1">
          <p className="text-lg text-white italic leading-relaxed">
            "{language === 'id' ? currentQuote.quoteId : currentQuote.quote}"
          </p>
          <div className="flex items-center justify-between mt-3">
            <p className={`text-sm ${authorColors[variant]}`}>— {currentQuote.author}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshQuote}
              className="text-gray-400 hover:text-white text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              {t('New Quote', 'Quote Baru')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
