import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, Clock, FileText, Sparkles, ChevronRight, ChevronLeft, 
  Check, Copy, Lightbulb, MessageSquare, Target, Zap, Film,
  Music, Camera, Mic, Play, RotateCcw
} from 'lucide-react';

interface NicheOption {
  id: string;
  labelEn: string;
  labelId: string;
  icon: string;
  color: string;
}

interface DurationOption {
  seconds: number;
  labelEn: string;
  labelId: string;
  description: string;
  bestFor: string;
}

interface ScriptSuggestion {
  hookEn: string;
  hookId: string;
  mainEn: string;
  mainId: string;
  ctaEn: string;
  ctaId: string;
  tipsEn: string[];
  tipsId: string[];
}

const niches: NicheOption[] = [
  { id: 'education', labelEn: 'Education & Tips', labelId: 'Edukasi & Tips', icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { id: 'comedy', labelEn: 'Comedy & Entertainment', labelId: 'Komedi & Hiburan', icon: '😂', color: 'from-yellow-500 to-orange-500' },
  { id: 'lifestyle', labelEn: 'Lifestyle & Daily Life', labelId: 'Lifestyle & Kehidupan', icon: '✨', color: 'from-pink-500 to-rose-500' },
  { id: 'food', labelEn: 'Food & Cooking', labelId: 'Makanan & Masak', icon: '🍳', color: 'from-orange-500 to-red-500' },
  { id: 'beauty', labelEn: 'Beauty & Fashion', labelId: 'Kecantikan & Fashion', icon: '💄', color: 'from-purple-500 to-pink-500' },
  { id: 'fitness', labelEn: 'Fitness & Health', labelId: 'Fitness & Kesehatan', icon: '💪', color: 'from-green-500 to-emerald-500' },
  { id: 'gaming', labelEn: 'Gaming & Tech', labelId: 'Gaming & Teknologi', icon: '🎮', color: 'from-violet-500 to-purple-500' },
  { id: 'motivation', labelEn: 'Motivation & Mindset', labelId: 'Motivasi & Mindset', icon: '🔥', color: 'from-red-500 to-orange-500' },
  { id: 'review', labelEn: 'Product Review', labelId: 'Review Produk', icon: '📦', color: 'from-teal-500 to-cyan-500' },
  { id: 'story', labelEn: 'Storytelling & Experience', labelId: 'Cerita & Pengalaman', icon: '📖', color: 'from-indigo-500 to-blue-500' },
];

const durations: DurationOption[] = [
  { seconds: 15, labelEn: '15 seconds', labelId: '15 detik', description: 'Quick hook, one point only', bestFor: 'Trends, quick tips, reactions' },
  { seconds: 30, labelEn: '30 seconds', labelId: '30 detik', description: 'Hook + 1-2 points + CTA', bestFor: 'Tips, mini tutorials, comedy' },
  { seconds: 60, labelEn: '60 seconds', labelId: '60 detik', description: 'Full story structure', bestFor: 'Storytelling, tutorials, reviews' },
  { seconds: 90, labelEn: '90 seconds', labelId: '90 detik', description: 'Detailed content', bestFor: 'Deep tutorials, vlogs, recipes' },
];

const scriptTemplates: Record<string, Record<number, ScriptSuggestion>> = {
  education: {
    15: {
      hookEn: '"Stop! You\'ve been doing [topic] wrong this whole time!"',
      hookId: '"Stop! Kamu salah [topik] selama ini!"',
      mainEn: 'Here\'s the correct way: [one key point]. Try it now!',
      mainId: 'Ini cara benarnya: [satu poin utama]. Coba sekarang!',
      ctaEn: 'Follow for more tips like this!',
      ctaId: 'Follow untuk tips lainnya!',
      tipsEn: ['Use trending sound', 'Text overlay for key point', 'Quick cut transitions'],
      tipsId: ['Pakai sound trending', 'Text overlay untuk poin utama', 'Transisi cut cepat'],
    },
    30: {
      hookEn: '"3 things about [topic] that nobody tells you..."',
      hookId: '"3 hal tentang [topik] yang gak ada yang kasih tau..."',
      mainEn: '1. [Point 1 - shocking fact]\n2. [Point 2 - practical tip]\n3. [Point 3 - bonus insight]',
      mainId: '1. [Poin 1 - fakta mengejutkan]\n2. [Poin 2 - tips praktis]\n3. [Poin 3 - bonus insight]',
      ctaEn: 'Save this for later! Which one surprised you? Comment below!',
      ctaId: 'Save untuk nanti! Mana yang paling mengejutkan? Komen di bawah!',
      tipsEn: ['Number each point clearly', 'Use hand gestures', 'Pause briefly between points'],
      tipsId: ['Nomori setiap poin dengan jelas', 'Pakai gestur tangan', 'Jeda sebentar antar poin'],
    },
    60: {
      hookEn: '"I discovered this [topic] secret after [X] years, and it changed everything..."',
      hookId: '"Aku temukan rahasia [topik] ini setelah [X] tahun, dan semuanya berubah..."',
      mainEn: 'Context: [Your situation before]\nProblem: [What wasn\'t working]\nDiscovery: [The aha moment]\nSolution: [Step-by-step how-to]\nResult: [What changed]',
      mainId: 'Konteks: [Situasi kamu sebelumnya]\nMasalah: [Apa yang gak work]\nPenemuan: [Momen aha]\nSolusi: [Step-by-step caranya]\nHasil: [Apa yang berubah]',
      ctaEn: 'Want the full guide? Follow and comment "GUIDE" - I\'ll send it to you!',
      ctaId: 'Mau panduan lengkap? Follow dan komen "GUIDE" - aku kirim!',
      tipsEn: ['Start with strong emotion', 'Use B-roll footage', 'Add background music', 'Include text highlights'],
      tipsId: ['Mulai dengan emosi kuat', 'Pakai B-roll footage', 'Tambah musik latar', 'Include highlight teks'],
    },
    90: {
      hookEn: '"This is the complete guide to [topic] that took me [X] months to learn..."',
      hookId: '"Ini panduan lengkap [topik] yang butuh [X] bulan untuk aku pelajari..."',
      mainEn: 'Intro: Why this matters (10s)\nStep 1: [Foundation] (20s)\nStep 2: [Core technique] (25s)\nStep 3: [Advanced tip] (20s)\nResults & proof (10s)\nCTA (5s)',
      mainId: 'Intro: Kenapa ini penting (10s)\nStep 1: [Fondasi] (20s)\nStep 2: [Teknik inti] (25s)\nStep 3: [Tips lanjutan] (20s)\nHasil & bukti (10s)\nCTA (5s)',
      ctaEn: 'This took hours to make. If it helped, please share with someone who needs it!',
      ctaId: 'Ini butuh waktu lama bikinnya. Kalau membantu, share ke yang butuh!',
      tipsEn: ['Divide into clear chapters', 'Use captions throughout', 'Add progress indicator', 'Include real examples'],
      tipsId: ['Bagi ke chapter jelas', 'Pakai caption sepanjang video', 'Tambah indikator progress', 'Include contoh nyata'],
    },
  },
  comedy: {
    15: {
      hookEn: '"POV: [relatable situation]"',
      hookId: '"POV: [situasi relatable]"',
      mainEn: '[Act out the scenario with exaggeration]',
      mainId: '[Perankan skenario dengan berlebihan]',
      ctaEn: 'Tag someone who does this!',
      ctaId: 'Tag yang suka gini!',
      tipsEn: ['Exaggerate expressions', 'Use popular sound', 'Quick punchline'],
      tipsId: ['Lebih-lebihkan ekspresi', 'Pakai sound populer', 'Punchline cepat'],
    },
    30: {
      hookEn: '"When [situation] happens and you just..."',
      hookId: '"Ketika [situasi] terjadi dan kamu cuma..."',
      mainEn: 'Setup: [Normal expectation]\nTwist: [Unexpected reaction]\nPayoff: [Funny conclusion]',
      mainId: 'Setup: [Ekspektasi normal]\nTwist: [Reaksi tak terduga]\nPayoff: [Kesimpulan lucu]',
      ctaEn: 'Part 2? Like if you want more!',
      ctaId: 'Part 2? Like kalau mau lanjut!',
      tipsEn: ['Timing is everything', 'Break the fourth wall', 'Use text for inner thoughts'],
      tipsId: ['Timing adalah segalanya', 'Break the fourth wall', 'Pakai text untuk inner thoughts'],
    },
    60: {
      hookEn: '"The stages of [common experience]..."',
      hookId: '"Tahap-tahap [pengalaman umum]..."',
      mainEn: 'Stage 1: Denial - [act it out]\nStage 2: Anger - [act it out]\nStage 3: Bargaining - [act it out]\nStage 4: Acceptance - [act it out]\nBonus: Reality - [plot twist]',
      mainId: 'Tahap 1: Denial - [perankan]\nTahap 2: Marah - [perankan]\nTahap 3: Negosiasi - [perankan]\nTahap 4: Menerima - [perankan]\nBonus: Realita - [plot twist]',
      ctaEn: 'Which stage are you stuck at? Comment below!',
      ctaId: 'Kamu stuck di tahap mana? Komen!',
      tipsEn: ['Costume changes add variety', 'Each stage = different energy', 'Save biggest laugh for end'],
      tipsId: ['Ganti kostum tambah variasi', 'Tiap tahap = energi berbeda', 'Simpan tawa terbesar untuk akhir'],
    },
    90: {
      hookEn: '"A day in my life but make it [genre]..."',
      hookId: '"Sehari di hidupku tapi ala [genre]..."',
      mainEn: 'Morning routine (overly dramatic)\nWork/school (action movie style)\nLunch (cooking show parody)\nAfternoon (documentary)\nEvening (horror movie vibes)\nNight (romance movie ending)',
      mainId: 'Rutinitas pagi (over dramatic)\nKerja/sekolah (gaya film aksi)\nMakan siang (parodi cooking show)\nSore (dokumenter)\nMalam (vibes film horor)\nMalam akhir (ending film romance)',
      ctaEn: 'What genre should I do next? Comment your ideas!',
      ctaId: 'Genre apa selanjutnya? Komen idenya!',
      tipsEn: ['Match music to each genre', 'Use color grading', 'Props enhance the parody', 'Commit to each character'],
      tipsId: ['Cocokkan musik tiap genre', 'Pakai color grading', 'Props tingkatkan parodi', 'Commit ke tiap karakter'],
    },
  },
  lifestyle: {
    15: {
      hookEn: '"This changed my morning/night/life..."',
      hookId: '"Ini mengubah pagi/malam/hidup aku..."',
      mainEn: '[Show the one thing] + [Quick result]',
      mainId: '[Tunjukkan satu hal] + [Hasil cepat]',
      ctaEn: 'Try it and let me know!',
      ctaId: 'Coba dan kasih tau aku!',
      tipsEn: ['Aesthetic shots', 'Soft lighting', 'Calm music'],
      tipsId: ['Shot estetik', 'Cahaya lembut', 'Musik tenang'],
    },
    30: {
      hookEn: '"5 things in my [space] under [price]..."',
      hookId: '"5 barang di [tempat] ku di bawah [harga]..."',
      mainEn: '1. [Item + quick benefit]\n2. [Item + quick benefit]\n3. [Item + quick benefit]\n4. [Item + quick benefit]\n5. [Item + quick benefit]',
      mainId: '1. [Barang + manfaat cepat]\n2. [Barang + manfaat cepat]\n3. [Barang + manfaat cepat]\n4. [Barang + manfaat cepat]\n5. [Barang + manfaat cepat]',
      ctaEn: 'Which one do you need? Comment the number!',
      ctaId: 'Mana yang kamu butuhkan? Komen nomornya!',
      tipsEn: ['Clean background', 'Good product lighting', 'Smooth transitions'],
      tipsId: ['Background bersih', 'Pencahayaan produk bagus', 'Transisi halus'],
    },
    60: {
      hookEn: '"My realistic [morning/night/weekly] routine that actually works..."',
      hookId: '"Rutinitas [pagi/malam/mingguan] realistis yang beneran work..."',
      mainEn: 'Wake up time + mindset\nStep 1: [Activity + why]\nStep 2: [Activity + why]\nStep 3: [Activity + why]\nHow I feel after',
      mainId: 'Jam bangun + mindset\nStep 1: [Aktivitas + alasan]\nStep 2: [Aktivitas + alasan]\nStep 3: [Aktivitas + alasan]\nPerasaan setelahnya',
      ctaEn: 'What\'s your non-negotiable routine? Share below!',
      ctaId: 'Apa rutinitas wajib kamu? Share di bawah!',
      tipsEn: ['Time-lapse parts', 'ASMR sounds work well', 'Be authentic, not perfect'],
      tipsId: ['Time-lapse bagian tertentu', 'ASMR sounds work well', 'Authentic, bukan sempurna'],
    },
    90: {
      hookEn: '"How I transformed my [life area] in [timeframe]..."',
      hookId: '"Cara aku transform [area hidup] dalam [waktu]..."',
      mainEn: 'Before: [Show/describe the problem]\nWhy I decided to change\nWeek 1-2: [What I did]\nWeek 3-4: [Adjustments]\nAfter: [Results + feelings]\nKey lessons learned',
      mainId: 'Sebelum: [Tunjukkan/deskripsikan masalah]\nKenapa aku memutuskan berubah\nMinggu 1-2: [Apa yang aku lakukan]\nMinggu 3-4: [Penyesuaian]\nSetelah: [Hasil + perasaan]\nPelajaran kunci',
      ctaEn: 'If you\'re starting your own journey, let me know - I\'ll cheer you on!',
      ctaId: 'Kalau kamu mulai journey sendiri, kasih tau - aku support!',
      tipsEn: ['Before/after visuals', 'Real footage > stock', 'Emotional honesty connects'],
      tipsId: ['Visual before/after', 'Footage asli > stock', 'Kejujuran emosional connect'],
    },
  },
  food: {
    15: {
      hookEn: '"The easiest [dish] ever - just 3 steps!"',
      hookId: '"[Masakan] paling gampang - cuma 3 langkah!"',
      mainEn: '[Step 1] → [Step 2] → [Step 3] → [Delicious result shot]',
      mainId: '[Langkah 1] → [Langkah 2] → [Langkah 3] → [Shot hasil lezat]',
      ctaEn: 'Save this for later!',
      ctaId: 'Save untuk nanti!',
      tipsEn: ['Top-down shots', 'Sizzle sounds', 'Quick cuts'],
      tipsId: ['Shot dari atas', 'Suara sizzle', 'Cut cepat'],
    },
    30: {
      hookEn: '"You only need [X] ingredients for this..."',
      hookId: '"Kamu cuma butuh [X] bahan untuk ini..."',
      mainEn: 'Show ingredients\nQuick prep montage\nCooking process highlights\nFinal reveal + taste reaction',
      mainId: 'Tunjukkan bahan\nMontase prep cepat\nHighlight proses masak\nReveal akhir + reaksi rasa',
      ctaEn: 'Would you try this? Comment yes or no!',
      ctaId: 'Mau coba? Komen iya atau tidak!',
      tipsEn: ['ASMR cooking sounds', 'Steam/sizzle close-ups', 'Happy eating face'],
      tipsId: ['ASMR suara masak', 'Close-up uap/sizzle', 'Wajah makan senang'],
    },
    60: {
      hookEn: '"Restaurant quality [dish] at home - full recipe!"',
      hookId: '"[Masakan] kualitas restoran di rumah - resep lengkap!"',
      mainEn: 'Ingredients list (on screen)\nPrep: [Cutting, measuring]\nCook: [Step by step with timing]\nPlating tips\nTaste test + reaction',
      mainId: 'Daftar bahan (di layar)\nPrep: [Potong, ukur]\nMasak: [Step by step dengan timing]\nTips plating\nTaste test + reaksi',
      ctaEn: 'Full recipe in comments! Follow for more easy recipes!',
      ctaId: 'Resep lengkap di komen! Follow untuk resep mudah lainnya!',
      tipsEn: ['Include measurements on screen', 'Show texture close-ups', 'End with money shot'],
      tipsId: ['Include ukuran di layar', 'Tunjukkan close-up tekstur', 'Akhiri dengan money shot'],
    },
    90: {
      hookEn: '"I tested [X] viral recipes - here\'s the truth..."',
      hookId: '"Aku coba [X] resep viral - ini kebenarannya..."',
      mainEn: 'Recipe 1: [Name] - Process + honest review\nRecipe 2: [Name] - Process + honest review\nRecipe 3: [Name] - Process + honest review\nFinal ranking + recommendation',
      mainId: 'Resep 1: [Nama] - Proses + review jujur\nResep 2: [Nama] - Proses + review jujur\nResep 3: [Nama] - Proses + review jujur\nRanking final + rekomendasi',
      ctaEn: 'Which one should I try next? Drop your suggestions!',
      ctaId: 'Mana yang harus aku coba selanjutnya? Drop saran!',
      tipsEn: ['Side-by-side comparisons', 'Be genuinely honest', 'Show both successes and fails'],
      tipsId: ['Perbandingan side-by-side', 'Jujur sebenar-benarnya', 'Tunjukkan sukses dan gagal'],
    },
  },
  story: {
    15: {
      hookEn: '"I can\'t believe this happened to me..."',
      hookId: '"Aku gak percaya ini terjadi ke aku..."',
      mainEn: '[The shocking moment in one sentence] + [Your reaction]',
      mainId: '[Momen mengejutkan dalam satu kalimat] + [Reaksimu]',
      ctaEn: 'Part 2? Let me know!',
      ctaId: 'Part 2? Kasih tau!',
      tipsEn: ['Emotion on face', 'Cliffhanger ending', 'Mysterious vibe'],
      tipsId: ['Emosi di wajah', 'Cliffhanger ending', 'Vibe misterius'],
    },
    30: {
      hookEn: '"The time I [shocking/funny/heartwarming thing]..."',
      hookId: '"Waktu aku [hal mengejutkan/lucu/menyentuh]..."',
      mainEn: 'Setup: Where and when\nEvent: What happened\nTwist: The unexpected part\nReaction: How you felt',
      mainId: 'Setup: Di mana dan kapan\nEvent: Apa yang terjadi\nTwist: Bagian tak terduga\nReaksi: Bagaimana perasaanmu',
      ctaEn: 'Has this ever happened to you? Tell me!',
      ctaId: 'Pernah terjadi ke kamu? Ceritain!',
      tipsEn: ['Vary your expressions', 'Use pauses for drama', 'End with cliffhanger or lesson'],
      tipsId: ['Variasikan ekspresimu', 'Pakai jeda untuk drama', 'Akhiri dengan cliffhanger atau pelajaran'],
    },
    60: {
      hookEn: '"This story still gives me chills..."',
      hookId: '"Cerita ini masih bikin aku merinding..."',
      mainEn: 'Context: [Set the scene - 10s]\nBuildup: [Rising tension - 20s]\nClimax: [The main event - 15s]\nResolution: [What happened after - 10s]\nReflection: [What I learned - 5s]',
      mainId: 'Konteks: [Set the scene - 10s]\nBuildup: [Ketegangan naik - 20s]\nKlimax: [Event utama - 15s]\nResolusi: [Apa yang terjadi setelah - 10s]\nRefleksi: [Apa yang aku pelajari - 5s]',
      ctaEn: 'If you want more storytime, follow and turn on notifications!',
      ctaId: 'Kalau mau storytime lagi, follow dan nyalakan notifikasi!',
      tipsEn: ['Use visual aids', 'Match music to mood', 'Make eye contact with camera', 'Authentic emotion wins'],
      tipsId: ['Pakai visual aids', 'Cocokkan musik dengan mood', 'Kontak mata dengan kamera', 'Emosi authentic menang'],
    },
    90: {
      hookEn: '"I\'ve never told anyone this story before..."',
      hookId: '"Aku belum pernah ceritain ini ke siapapun..."',
      mainEn: 'Intro: Why I\'m sharing now (10s)\nPart 1: The beginning (20s)\nPart 2: Things escalate (25s)\nPart 3: The turning point (20s)\nPart 4: Resolution & lesson (15s)',
      mainId: 'Intro: Kenapa aku share sekarang (10s)\nPart 1: Awalnya (20s)\nPart 2: Eskalasi (25s)\nPart 3: Titik balik (20s)\nPart 4: Resolusi & pelajaran (15s)',
      ctaEn: 'Thank you for listening. If this helped you, please share with someone who needs it.',
      ctaId: 'Terima kasih sudah mendengarkan. Kalau ini membantu, share ke yang butuh.',
      tipsEn: ['Vulnerability connects', 'Speak from the heart', 'B-roll can illustrate points', 'Take your time with emotion'],
      tipsId: ['Kerentanan connect', 'Bicara dari hati', 'B-roll bisa ilustrasikan poin', 'Take your time dengan emosi'],
    },
  },
  beauty: {
    15: {
      hookEn: '"The one product that changed my [skin/hair/makeup]..."',
      hookId: '"Satu produk yang mengubah [kulit/rambut/makeup] aku..."',
      mainEn: '[Show product] → [Quick application] → [Result]',
      mainId: '[Tunjukkan produk] → [Aplikasi cepat] → [Hasil]',
      ctaEn: 'Have you tried this? Comment!',
      ctaId: 'Udah coba? Komen!',
      tipsEn: ['Good lighting essential', 'Show before/after', 'Close-up shots'],
      tipsId: ['Pencahayaan bagus wajib', 'Tunjukkan before/after', 'Shot close-up'],
    },
    30: {
      hookEn: '"3 [beauty topic] mistakes you\'re probably making..."',
      hookId: '"3 kesalahan [topik beauty] yang mungkin kamu buat..."',
      mainEn: 'Mistake 1: [What + Why it\'s wrong + Fix]\nMistake 2: [What + Why it\'s wrong + Fix]\nMistake 3: [What + Why it\'s wrong + Fix]',
      mainId: 'Kesalahan 1: [Apa + Kenapa salah + Solusi]\nKesalahan 2: [Apa + Kenapa salah + Solusi]\nKesalahan 3: [Apa + Kenapa salah + Solusi]',
      ctaEn: 'Which mistake were you making? Be honest!',
      ctaId: 'Kesalahan mana yang kamu buat? Jujur!',
      tipsEn: ['Split screen for wrong vs right', 'Demonstrate each fix', 'Natural lighting'],
      tipsId: ['Split screen salah vs benar', 'Demonstrasikan tiap solusi', 'Pencahayaan natural'],
    },
    60: {
      hookEn: '"My go-to [makeup look/skincare routine] for [occasion]..."',
      hookId: '"[Look makeup/rutinitas skincare] andalan aku untuk [kesempatan]..."',
      mainEn: 'Products I\'m using (quick overview)\nStep 1: [Base/Prep]\nStep 2: [Main steps]\nStep 3: [Finishing touches]\nFinal look reveal',
      mainId: 'Produk yang aku pakai (overview cepat)\nStep 1: [Base/Prep]\nStep 2: [Langkah utama]\nStep 3: [Sentuhan akhir]\nReveal look final',
      ctaEn: 'All products linked in bio! Want a tutorial for any step?',
      ctaId: 'Semua produk di bio! Mau tutorial untuk step mana?',
      tipsEn: ['Use ring light', 'Show product names on screen', 'Time-lapse repetitive parts'],
      tipsId: ['Pakai ring light', 'Tunjukkan nama produk di layar', 'Time-lapse bagian repetitif'],
    },
    90: {
      hookEn: '"Complete [beginner/everyday/glam] guide - everything you need to know!"',
      hookId: '"Panduan lengkap [pemula/sehari-hari/glam] - semua yang perlu kamu tau!"',
      mainEn: 'Intro: What we\'re creating (5s)\nPrep: Skincare/primer (15s)\nBase: Foundation/concealer (20s)\nFeatures: Eyes/lips/cheeks (30s)\nSetting: Powder/spray (10s)\nFinal reveal + tips (10s)',
      mainId: 'Intro: Apa yang kita buat (5s)\nPrep: Skincare/primer (15s)\nBase: Foundation/concealer (20s)\nFitur: Mata/bibir/pipi (30s)\nSetting: Powder/spray (10s)\nReveal final + tips (10s)',
      ctaEn: 'Save this for your next [occasion]! Drop a 💄 if you\'ll try it!',
      ctaId: 'Save untuk [kesempatan] berikutnya! Drop 💄 kalau mau coba!',
      tipsEn: ['Steady camera/tripod', 'Show blending techniques', 'Talk through each step', 'Good audio for voiceover'],
      tipsId: ['Kamera stabil/tripod', 'Tunjukkan teknik blend', 'Jelaskan tiap langkah', 'Audio bagus untuk voiceover'],
    },
  },
  fitness: {
    15: {
      hookEn: '"Try this move for [body part/goal]!"',
      hookId: '"Coba gerakan ini untuk [bagian tubuh/goal]!"',
      mainEn: '[Demonstrate the exercise] + [Count reps or duration]',
      mainId: '[Demonstrasikan gerakan] + [Hitung rep atau durasi]',
      ctaEn: 'Did you feel the burn? Follow for more!',
      ctaId: 'Berasa bakarnya? Follow untuk lebih!',
      tipsEn: ['Clear form demonstration', 'Text overlay for reps', 'Energetic vibe'],
      tipsId: ['Demonstrasi form jelas', 'Text overlay untuk rep', 'Vibe energik'],
    },
    30: {
      hookEn: '"Quick [5 min/no equipment] workout you can do anywhere!"',
      hookId: '"Workout cepat [5 menit/tanpa alat] yang bisa dilakukan di mana saja!"',
      mainEn: 'Exercise 1: [Name] - 30 sec\nExercise 2: [Name] - 30 sec\nExercise 3: [Name] - 30 sec\nExercise 4: [Name] - 30 sec',
      mainId: 'Gerakan 1: [Nama] - 30 detik\nGerakan 2: [Nama] - 30 detik\nGerakan 3: [Nama] - 30 detik\nGerakan 4: [Nama] - 30 detik',
      ctaEn: 'Do this every day for a week! Comment your results!',
      ctaId: 'Lakukan ini setiap hari selama seminggu! Komen hasilnya!',
      tipsEn: ['Countdown timer on screen', 'Upbeat music', 'Show modifications'],
      tipsId: ['Countdown timer di layar', 'Musik upbeat', 'Tunjukkan modifikasi'],
    },
    60: {
      hookEn: '"The only [abs/legs/arms] workout you need - complete routine!"',
      hookId: '"Satu-satunya workout [abs/kaki/tangan] yang kamu butuhkan - rutinitas lengkap!"',
      mainEn: 'Warm up (10s)\nExercise 1: [Demo + form tips]\nExercise 2: [Demo + form tips]\nExercise 3: [Demo + form tips]\nCool down mention\nResults preview',
      mainId: 'Pemanasan (10s)\nGerakan 1: [Demo + tips form]\nGerakan 2: [Demo + tips form]\nGerakan 3: [Demo + tips form]\nMention pendinginan\nPreview hasil',
      ctaEn: 'Screenshot and save! Tag me when you try it!',
      ctaId: 'Screenshot dan save! Tag aku kalau udah coba!',
      tipsEn: ['Show correct vs incorrect form', 'Include breathing cues', 'Motivational energy'],
      tipsId: ['Tunjukkan form benar vs salah', 'Include isyarat napas', 'Energi motivasional'],
    },
    90: {
      hookEn: '"Full [body part] workout - no gym needed, guaranteed results!"',
      hookId: '"Workout [bagian tubuh] lengkap - tanpa gym, hasil dijamin!"',
      mainEn: 'Intro & what to expect (10s)\nWarm up routine (15s)\nMain workout - 5 exercises (45s)\nBonfire exercise for max burn (10s)\nCool down & stretch (10s)',
      mainId: 'Intro & apa yang diharapkan (10s)\nRutinitas pemanasan (15s)\nWorkout utama - 5 gerakan (45s)\nGerakan bonus untuk max burn (10s)\nPendinginan & stretching (10s)',
      ctaEn: 'Who\'s committing to this for 30 days? Comment "I\'M IN"!',
      ctaId: 'Siapa yang komit lakukan ini 30 hari? Komen "AKU IKUT"!',
      tipsEn: ['Multiple camera angles', 'Include rep counts', 'Show modification options', 'End with encouragement'],
      tipsId: ['Multiple angle kamera', 'Include hitungan rep', 'Tunjukkan opsi modifikasi', 'Akhiri dengan semangat'],
    },
  },
  gaming: {
    15: {
      hookEn: '"This trick in [game] is broken..."',
      hookId: '"Trik di [game] ini broken..."',
      mainEn: '[Show the gameplay clip with the trick]',
      mainId: '[Tunjukkan clip gameplay dengan triknya]',
      ctaEn: 'Did you know this? Follow for more tips!',
      ctaId: 'Udah tau ini? Follow untuk tips lainnya!',
      tipsEn: ['High quality gameplay capture', 'Zoom on key moments', 'Use game audio'],
      tipsId: ['Capture gameplay kualitas tinggi', 'Zoom di momen penting', 'Pakai audio game'],
    },
    30: {
      hookEn: '"3 mistakes [game] players always make..."',
      hookId: '"3 kesalahan yang selalu dibuat player [game]..."',
      mainEn: 'Mistake 1: [Show + explain + fix]\nMistake 2: [Show + explain + fix]\nMistake 3: [Show + explain + fix]',
      mainId: 'Kesalahan 1: [Tunjukkan + jelaskan + solusi]\nKesalahan 2: [Tunjukkan + jelaskan + solusi]\nKesalahan 3: [Tunjukkan + jelaskan + solusi]',
      ctaEn: 'Which one were you doing? Be honest in comments!',
      ctaId: 'Mana yang sering kamu lakukan? Jujur di komen!',
      tipsEn: ['Clear gameplay examples', 'Facecam optional but adds personality', 'Overlay text for key points'],
      tipsId: ['Contoh gameplay jelas', 'Facecam opsional tapi tambah personality', 'Overlay text untuk poin penting'],
    },
    60: {
      hookEn: '"How to actually get better at [game] - pro tips!"',
      hookId: '"Cara beneran jadi lebih jago di [game] - tips pro!"',
      mainEn: 'Intro: Your credentials/rank (5s)\nTip 1: [Fundamental skill + demo]\nTip 2: [Strategy/positioning + demo]\nTip 3: [Advanced technique + demo]\nQuick recap',
      mainId: 'Intro: Kredensial/rank kamu (5s)\nTip 1: [Skill fundamental + demo]\nTip 2: [Strategi/positioning + demo]\nTip 3: [Teknik advanced + demo]\nRekap cepat',
      ctaEn: 'What rank are you trying to reach? Comment your goal!',
      ctaId: 'Rank apa yang kamu targetkan? Komen goalmu!',
      tipsEn: ['Show before/after gameplay', 'Use slow-mo for techniques', 'Compare to pro players'],
      tipsId: ['Tunjukkan gameplay before/after', 'Pakai slow-mo untuk teknik', 'Bandingkan dengan pro player'],
    },
    90: {
      hookEn: '"The complete [game] guide for beginners to pro - everything!"',
      hookId: '"Panduan lengkap [game] dari pemula sampai pro - segalanya!"',
      mainEn: 'Part 1: Basics every beginner needs (20s)\nPart 2: Intermediate strategies (25s)\nPart 3: Advanced mechanics (25s)\nPart 4: Pro mindset (15s)\nClosing + your next steps (5s)',
      mainId: 'Part 1: Dasar yang setiap pemula butuhkan (20s)\nPart 2: Strategi intermediate (25s)\nPart 3: Mekanik advanced (25s)\nPart 4: Mindset pro (15s)\nPenutup + langkah selanjutnya (5s)',
      ctaEn: 'Save this and practice! Share with your squad!',
      ctaId: 'Save dan latihan! Share ke squad kamu!',
      tipsEn: ['Organize with clear sections', 'Use timestamps in comments', 'Include your progression clips'],
      tipsId: ['Organisasi dengan section jelas', 'Pakai timestamp di komen', 'Include clip perkembanganmu'],
    },
  },
  motivation: {
    15: {
      hookEn: '"You need to hear this today..."',
      hookId: '"Kamu perlu dengar ini hari ini..."',
      mainEn: '[One powerful statement] + [Brief why it matters]',
      mainId: '[Satu pernyataan powerful] + [Kenapa itu penting singkat]',
      ctaEn: 'Share if you needed this.',
      ctaId: 'Share kalau kamu butuh ini.',
      tipsEn: ['Look directly at camera', 'Speak with conviction', 'Impactful background music'],
      tipsId: ['Lihat langsung ke kamera', 'Bicara dengan keyakinan', 'Musik latar impactful'],
    },
    30: {
      hookEn: '"I used to [struggle], until I realized this..."',
      hookId: '"Aku dulu [berjuang], sampai aku sadar ini..."',
      mainEn: 'The old belief I had\nThe moment everything changed\nThe new mindset\nHow it transformed my results',
      mainId: 'Keyakinan lama yang aku punya\nMomen segalanya berubah\nMindset baru\nBagaimana itu transform hasilku',
      ctaEn: 'What\'s holding you back? Tell me in comments.',
      ctaId: 'Apa yang menahan kamu? Ceritain di komen.',
      tipsEn: ['Raw, authentic energy', 'Pause for emphasis', 'End with encouragement'],
      tipsId: ['Energi raw, authentic', 'Jeda untuk penekanan', 'Akhiri dengan semangat'],
    },
    60: {
      hookEn: '"The truth nobody tells you about [success/failure/growth]..."',
      hookId: '"Kebenaran yang gak ada yang bilang tentang [sukses/gagal/pertumbuhan]..."',
      mainEn: 'The common belief (what people think)\nThe hidden reality (what actually happens)\nMy personal experience with this\nThe lesson that changed everything\nWhat you should do instead',
      mainId: 'Keyakinan umum (yang orang kira)\nRealita tersembunyi (yang beneran terjadi)\nPengalaman pribadiku dengan ini\nPelajaran yang mengubah segalanya\nApa yang harus kamu lakukan',
      ctaEn: 'If this resonated, share with someone who needs it.',
      ctaId: 'Kalau ini resonansi, share ke yang butuh.',
      tipsEn: ['Build emotional arc', 'Vulnerability creates connection', 'End with actionable hope'],
      tipsId: ['Bangun emotional arc', 'Kerentanan ciptakan koneksi', 'Akhiri dengan harapan actionable'],
    },
    90: {
      hookEn: '"My [X] year journey from [start] to [where I am now]..."',
      hookId: '"Perjalanan [X] tahun ku dari [awal] ke [sekarang]..."',
      mainEn: 'Where I started (lowest point)\nFirst attempt & failure\nWhat I learned\nThe breakthrough moment\nWhere I am now\nMessage to you watching this',
      mainId: 'Di mana aku mulai (titik terendah)\nPercobaan pertama & kegagalan\nApa yang aku pelajari\nMomen breakthrough\nDi mana aku sekarang\nPesan untuk kamu yang nonton ini',
      ctaEn: 'Your story isn\'t over. Keep going. Follow for more motivation.',
      ctaId: 'Ceritamu belum selesai. Terus maju. Follow untuk motivasi lainnya.',
      tipsEn: ['Use real footage if available', 'Music that builds emotion', 'Speak from genuine experience', 'End with direct message to viewer'],
      tipsId: ['Pakai footage asli kalau ada', 'Musik yang bangun emosi', 'Bicara dari pengalaman genuine', 'Akhiri dengan pesan langsung ke penonton'],
    },
  },
  review: {
    15: {
      hookEn: '"Is [product] worth it? Quick verdict..."',
      hookId: '"[Produk] worth it gak? Verdict cepat..."',
      mainEn: '[Show product] + [One main pro] + [One main con] + [Final score/recommendation]',
      mainId: '[Tunjukkan produk] + [Satu kelebihan utama] + [Satu kekurangan utama] + [Skor/rekomendasi final]',
      ctaEn: 'Want the full review? Comment "FULL"!',
      ctaId: 'Mau review lengkap? Komen "FULL"!',
      tipsEn: ['Show product clearly', 'Be honest', 'Quick and decisive'],
      tipsId: ['Tunjukkan produk jelas', 'Jujur', 'Cepat dan decisive'],
    },
    30: {
      hookEn: '"Honest review: [product] after [time] of use..."',
      hookId: '"Review jujur: [produk] setelah [waktu] pemakaian..."',
      mainEn: 'What it is (brief)\nPros: [2-3 points]\nCons: [1-2 points]\nVerdict: [Recommend or not]',
      mainId: 'Apa itu (singkat)\nKelebihan: [2-3 poin]\nKekurangan: [1-2 poin]\nVerdict: [Rekomen atau tidak]',
      ctaEn: 'Have you tried this? Drop your thoughts!',
      ctaId: 'Udah coba? Drop pendapatmu!',
      tipsEn: ['Show actual usage', 'Be specific with pros/cons', 'Genuine opinion matters'],
      tipsId: ['Tunjukkan penggunaan aktual', 'Spesifik dengan pro/cons', 'Opini genuine yang penting'],
    },
    60: {
      hookEn: '"I tested [product] for [time] - here\'s my honest review..."',
      hookId: '"Aku test [produk] selama [waktu] - ini review jujurku..."',
      mainEn: 'Intro: What it is & price\nUnboxing/first impressions\nActual usage & testing\nPros (detailed)\nCons (honest)\nWho should buy this\nFinal verdict & score',
      mainId: 'Intro: Apa itu & harga\nUnboxing/kesan pertama\nPenggunaan & testing aktual\nKelebihan (detail)\nKekurangan (jujur)\nSiapa yang harus beli ini\nVerdict final & skor',
      ctaEn: 'What should I review next? Comment below!',
      ctaId: 'Apa yang harus aku review selanjutnya? Komen di bawah!',
      tipsEn: ['Compare to alternatives', 'Include price-to-value opinion', 'Show results/proof'],
      tipsId: ['Bandingkan dengan alternatif', 'Include opini harga-vs-nilai', 'Tunjukkan hasil/bukti'],
    },
    90: {
      hookEn: '"[Product A] vs [Product B] - which one is actually better?"',
      hookId: '"[Produk A] vs [Produk B] - mana yang beneran lebih bagus?"',
      mainEn: 'Intro: Why this comparison matters\nProduct A overview (15s)\nProduct B overview (15s)\nHead-to-head comparison (30s)\n- Design/Quality\n- Performance\n- Value for money\nFinal winner & why (15s)\nWho should pick which',
      mainId: 'Intro: Kenapa perbandingan ini penting\nOverview Produk A (15s)\nOverview Produk B (15s)\nPerbandingan langsung (30s)\n- Desain/Kualitas\n- Performa\n- Value for money\nPemenang final & kenapa (15s)\nSiapa yang harus pilih mana',
      ctaEn: 'Team A or Team B? Vote in comments!',
      ctaId: 'Tim A atau Tim B? Vote di komen!',
      tipsEn: ['Side-by-side visuals', 'Objective criteria', 'Clear winner but fair to both'],
      tipsId: ['Visual side-by-side', 'Kriteria objektif', 'Pemenang jelas tapi fair ke keduanya'],
    },
  },
};

const getDefaultScript = (duration: number): ScriptSuggestion => ({
  hookEn: '"Wait, you need to see this..."',
  hookId: '"Tunggu, kamu harus lihat ini..."',
  mainEn: 'Share your main content here with clear structure.',
  mainId: 'Bagikan konten utamamu di sini dengan struktur jelas.',
  ctaEn: 'Follow for more content like this!',
  ctaId: 'Follow untuk konten seperti ini!',
  tipsEn: ['Be authentic', 'Good lighting', 'Clear audio', 'Engaging energy'],
  tipsId: ['Jadilah authentic', 'Pencahayaan bagus', 'Audio jelas', 'Energi engaging'],
});

export function VideoCreatorWizard() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const selectedNicheData = niches.find(n => n.id === selectedNiche);
  const selectedDurationData = durations.find(d => d.seconds === selectedDuration);
  
  const scriptSuggestion: ScriptSuggestion = selectedNiche && selectedDuration
    ? (scriptTemplates[selectedNiche]?.[selectedDuration] || getDefaultScript(selectedDuration))
    : getDefaultScript(30);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedNiche(null);
    setSelectedDuration(null);
  };

  const canProceed = () => {
    if (step === 1) return selectedNiche !== null;
    if (step === 2) return selectedDuration !== null;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Video className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {t('Video Creator Wizard', 'Wizard Bikin Video')}
          </h2>
        </div>
        <p className="text-gray-400">
          {t('Step-by-step guide to create your TikTok video', 'Panduan step-by-step untuk bikin video TikTok kamu')}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{t('Step', 'Langkah')} {step} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-400" />
            {t('What\'s your video about?', 'Video kamu tentang apa?')}
          </h3>
          <p className="text-gray-400 text-sm">
            {t('Choose a niche that matches your content', 'Pilih niche yang sesuai dengan konten kamu')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {niches.map((niche) => (
              <button
                key={niche.id}
                onClick={() => setSelectedNiche(niche.id)}
                className={`p-4 rounded-xl border transition-all text-center ${
                  selectedNiche === niche.id
                    ? `bg-gradient-to-r ${niche.color} border-transparent text-white`
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 text-gray-300'
                }`}
              >
                <span className="text-2xl block mb-1">{niche.icon}</span>
                <span className="text-xs font-medium">
                  {language === 'id' ? niche.labelId : niche.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            {t('How long is your video?', 'Berapa lama video kamu?')}
          </h3>
          <p className="text-gray-400 text-sm">
            {t('Shorter videos often perform better for beginners', 'Video pendek biasanya perform lebih baik untuk pemula')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {durations.map((duration) => (
              <button
                key={duration.seconds}
                onClick={() => setSelectedDuration(duration.seconds)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedDuration === duration.seconds
                    ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {duration.seconds}s
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'id' ? duration.labelId : duration.labelEn}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {duration.description}
                </div>
              </button>
            ))}
          </div>
          
          {selectedDuration && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-blue-300">
                {t('Best for:', 'Paling cocok untuk:')} {durations.find(d => d.seconds === selectedDuration)?.bestFor}
              </span>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            {t('Your Script Template', 'Template Script Kamu')}
          </h3>
          
          <div className="bg-gray-800/30 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Badge className={`bg-gradient-to-r ${selectedNicheData?.color || 'from-gray-500 to-gray-600'}`}>
                {selectedNicheData?.icon} {language === 'id' ? selectedNicheData?.labelId : selectedNicheData?.labelEn}
              </Badge>
              <Badge variant="outline">{selectedDuration}s</Badge>
            </div>

            <div className="space-y-4">
              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    HOOK (0-3 {t('seconds', 'detik')})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-medium">
                    {language === 'id' ? scriptSuggestion.hookId : scriptSuggestion.hookEn}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => copyToClipboard(
                      language === 'id' ? scriptSuggestion.hookId : scriptSuggestion.hookEn,
                      'hook'
                    )}
                  >
                    {copiedSection === 'hook' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedSection === 'hook' ? t('Copied!', 'Disalin!') : t('Copy', 'Salin')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                    <MessageSquare className="w-4 h-4" />
                    {t('MAIN CONTENT', 'KONTEN UTAMA')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-white whitespace-pre-wrap text-sm font-sans">
                    {language === 'id' ? scriptSuggestion.mainId : scriptSuggestion.mainEn}
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => copyToClipboard(
                      language === 'id' ? scriptSuggestion.mainId : scriptSuggestion.mainEn,
                      'main'
                    )}
                  >
                    {copiedSection === 'main' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedSection === 'main' ? t('Copied!', 'Disalin!') : t('Copy', 'Salin')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-400">
                    <Target className="w-4 h-4" />
                    CTA ({t('Call to Action', 'Ajakan Bertindak')})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white font-medium">
                    {language === 'id' ? scriptSuggestion.ctaId : scriptSuggestion.ctaEn}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => copyToClipboard(
                      language === 'id' ? scriptSuggestion.ctaId : scriptSuggestion.ctaEn,
                      'cta'
                    )}
                  >
                    {copiedSection === 'cta' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedSection === 'cta' ? t('Copied!', 'Disalin!') : t('Copy', 'Salin')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            {t('Production Tips', 'Tips Produksi')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-pink-400">
                  <Lightbulb className="w-4 h-4" />
                  {t('Tips for This Video', 'Tips untuk Video Ini')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(language === 'id' ? scriptSuggestion.tipsId : scriptSuggestion.tipsEn).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-cyan-400">
                  <Camera className="w-4 h-4" />
                  {t('Equipment Checklist', 'Checklist Perlengkapan')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <Camera className="w-4 h-4 text-gray-500 mt-0.5" />
                    {t('Smartphone with good camera', 'Smartphone dengan kamera bagus')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <Mic className="w-4 h-4 text-gray-500 mt-0.5" />
                    {t('Quiet environment or external mic', 'Lingkungan tenang atau mic eksternal')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <Lightbulb className="w-4 h-4 text-gray-500 mt-0.5" />
                    {t('Good lighting (natural or ring light)', 'Pencahayaan bagus (natural atau ring light)')}
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <Music className="w-4 h-4 text-gray-500 mt-0.5" />
                    {t('Trending sound ready', 'Sound trending siap')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Play className="w-8 h-8 text-pink-400" />
                <div>
                  <h4 className="font-semibold text-white">
                    {t('You\'re Ready!', 'Kamu Siap!')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('All the pieces are in place. Time to record!', 'Semua sudah siap. Waktunya rekam!')}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge className={`bg-gradient-to-r ${selectedNicheData?.color}`}>
                    {selectedNicheData?.icon} {language === 'id' ? selectedNicheData?.labelId : selectedNicheData?.labelEn}
                  </Badge>
                  <Badge variant="outline">{selectedDuration} {t('seconds', 'detik')}</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {t('Remember: Your first videos don\'t need to be perfect. Just start creating!', 
                     'Ingat: Video pertamamu gak harus sempurna. Mulai aja dulu!')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-800">
        <Button
          variant="outline"
          onClick={() => step === 1 ? resetWizard() : setStep(step - 1)}
          disabled={step === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('Back', 'Kembali')}
        </Button>

        {step < totalSteps ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600"
          >
            {t('Next', 'Lanjut')}
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={resetWizard}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            <RotateCcw className="w-4 h-4" />
            {t('Create Another', 'Buat Lagi')}
          </Button>
        )}
      </div>
    </div>
  );
}
