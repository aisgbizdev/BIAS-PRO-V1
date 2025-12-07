import { useState } from 'react';
import { useLanguage } from '@/lib/languageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Radio, Clock, Users, ChevronRight, ChevronLeft, 
  Check, Copy, Lightbulb, MessageSquare, Target, Zap,
  Gift, AlertTriangle, RotateCcw, Swords, UserPlus, Sparkles
} from 'lucide-react';

interface LiveType {
  id: string;
  labelEn: string;
  labelId: string;
  icon: any;
  color: string;
  descriptionEn: string;
  descriptionId: string;
}

interface DurationOption {
  minutes: number;
  labelEn: string;
  labelId: string;
  recommendedFor: string;
}

interface TopicOption {
  id: string;
  labelEn: string;
  labelId: string;
  icon: string;
}

interface TimelineItem {
  time: string;
  actionEn: string;
  actionId: string;
  tipsEn: string;
  tipsId: string;
  type: 'hook' | 'content' | 'engagement' | 'closing';
}

const liveTypes: LiveType[] = [
  { 
    id: 'solo', 
    labelEn: 'Solo Live', 
    labelId: 'Live Sendiri', 
    icon: Radio,
    color: 'from-pink-500 to-rose-500',
    descriptionEn: 'Just you and your audience. Best for Q&A, chatting, tutorials.',
    descriptionId: 'Cuma kamu dan audiens. Cocok untuk Q&A, ngobrol, tutorial.'
  },
  { 
    id: 'pk', 
    labelEn: 'PK Battle', 
    labelId: 'PK Battle', 
    icon: Swords,
    color: 'from-orange-500 to-red-500',
    descriptionEn: 'Compete with another creator. High engagement potential!',
    descriptionId: 'Kompetisi dengan creator lain. Potensi engagement tinggi!'
  },
  { 
    id: 'multi', 
    labelEn: 'Multi-Guest', 
    labelId: 'Multi-Guest', 
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    descriptionEn: 'Invite guests to join your live. Great for collabs & discussions.',
    descriptionId: 'Undang tamu ke live kamu. Bagus untuk kolaborasi & diskusi.'
  },
];

const durations: DurationOption[] = [
  { minutes: 15, labelEn: '15 minutes', labelId: '15 menit', recommendedFor: 'Pemula, Q&A cepat' },
  { minutes: 30, labelEn: '30 minutes', labelId: '30 menit', recommendedFor: 'Standard live, tutorial' },
  { minutes: 60, labelEn: '60 minutes', labelId: '60 menit', recommendedFor: 'Deep content, PK' },
  { minutes: 90, labelEn: '90 minutes', labelId: '90 menit', recommendedFor: 'Event khusus, maraton' },
];

const topics: TopicOption[] = [
  { id: 'qa', labelEn: 'Q&A Session', labelId: 'Sesi Q&A', icon: '❓' },
  { id: 'chat', labelEn: 'Casual Chat', labelId: 'Ngobrol Santai', icon: '💬' },
  { id: 'tutorial', labelEn: 'Tutorial/Teaching', labelId: 'Tutorial/Mengajar', icon: '📚' },
  { id: 'gaming', labelEn: 'Gaming', labelId: 'Gaming', icon: '🎮' },
  { id: 'music', labelEn: 'Music/Performance', labelId: 'Musik/Perform', icon: '🎵' },
  { id: 'cooking', labelEn: 'Cooking/Recipe', labelId: 'Masak/Resep', icon: '🍳' },
  { id: 'beauty', labelEn: 'Beauty/Fashion', labelId: 'Kecantikan/Fashion', icon: '💄' },
  { id: 'fitness', labelEn: 'Workout/Fitness', labelId: 'Olahraga/Fitness', icon: '💪' },
  { id: 'review', labelEn: 'Product Review', labelId: 'Review Produk', icon: '📦' },
  { id: 'talent', labelEn: 'Talent Show', labelId: 'Unjuk Bakat', icon: '⭐' },
];

const generateTimeline = (type: string, duration: number, topic: string): TimelineItem[] => {
  const timelines: Record<string, Record<number, TimelineItem[]>> = {
    solo: {
      15: [
        { time: '0:00-1:00', actionEn: 'Hook & Welcome', actionId: 'Hook & Sambutan', tipsEn: 'Greet viewers energetically, announce topic, ask them to share', tipsId: 'Sapa penonton dengan energik, umumkan topik, minta share', type: 'hook' },
        { time: '1:00-3:00', actionEn: 'Warm-Up', actionId: 'Pemanasan', tipsEn: 'Ask where viewers are from, simple question to get chat going', tipsId: 'Tanya asal penonton, pertanyaan simpel untuk chat berjalan', type: 'engagement' },
        { time: '3:00-11:00', actionEn: 'Main Content', actionId: 'Konten Utama', tipsEn: 'Deliver your main topic, respond to comments, keep energy high', tipsId: 'Sampaikan topik utama, respond komen, jaga energi tinggi', type: 'content' },
        { time: '11:00-13:00', actionEn: 'Engagement Push', actionId: 'Push Engagement', tipsEn: 'Ask viewers to invite friends, remind to follow, acknowledge gifts', tipsId: 'Minta penonton undang teman, ingatkan follow, acknowledge gifts', type: 'engagement' },
        { time: '13:00-15:00', actionEn: 'Closing', actionId: 'Penutupan', tipsEn: 'Thank everyone, announce next live, end with positive energy', tipsId: 'Terima kasih semua, umumkan live berikutnya, akhiri dengan energi positif', type: 'closing' },
      ],
      30: [
        { time: '0:00-2:00', actionEn: 'Hook & Welcome', actionId: 'Hook & Sambutan', tipsEn: 'Exciting greeting, announce what we\'ll cover today', tipsId: 'Sapaan exciting, umumkan apa yang akan dibahas hari ini', type: 'hook' },
        { time: '2:00-5:00', actionEn: 'Ice Breaker', actionId: 'Ice Breaker', tipsEn: 'Fun question, poll, or trending topic discussion', tipsId: 'Pertanyaan fun, poll, atau diskusi topik trending', type: 'engagement' },
        { time: '5:00-12:00', actionEn: 'Main Content Part 1', actionId: 'Konten Utama Bagian 1', tipsEn: 'First segment of your main topic', tipsId: 'Segmen pertama topik utamamu', type: 'content' },
        { time: '12:00-14:00', actionEn: 'Engagement Check', actionId: 'Cek Engagement', tipsEn: 'Read comments, answer questions, acknowledge regular viewers', tipsId: 'Baca komen, jawab pertanyaan, acknowledge penonton setia', type: 'engagement' },
        { time: '14:00-22:00', actionEn: 'Main Content Part 2', actionId: 'Konten Utama Bagian 2', tipsEn: 'Second segment, deeper into topic', tipsId: 'Segmen kedua, lebih dalam ke topik', type: 'content' },
        { time: '22:00-25:00', actionEn: 'Q&A Time', actionId: 'Waktu Q&A', tipsEn: 'Dedicated time to answer viewer questions', tipsId: 'Waktu khusus jawab pertanyaan penonton', type: 'engagement' },
        { time: '25:00-28:00', actionEn: 'Gift Goals & Push', actionId: 'Target Gift & Push', tipsEn: 'Set gift goals, remind about follow, encourage shares', tipsId: 'Set target gift, ingatkan follow, dorong share', type: 'engagement' },
        { time: '28:00-30:00', actionEn: 'Closing', actionId: 'Penutupan', tipsEn: 'Summary, thanks, tease next live', tipsId: 'Ringkasan, terima kasih, teaser live berikutnya', type: 'closing' },
      ],
      60: [
        { time: '0:00-3:00', actionEn: 'Grand Opening', actionId: 'Pembukaan Besar', tipsEn: 'High energy intro, welcome everyone, share live agenda', tipsId: 'Intro energi tinggi, sambut semua, share agenda live', type: 'hook' },
        { time: '3:00-8:00', actionEn: 'Warm-Up & Chat', actionId: 'Pemanasan & Ngobrol', tipsEn: 'Casual conversation, ask about viewers\' day, build rapport', tipsId: 'Percakapan santai, tanya tentang hari penonton, bangun rapport', type: 'engagement' },
        { time: '8:00-20:00', actionEn: 'Content Block 1', actionId: 'Blok Konten 1', tipsEn: 'First major topic segment', tipsId: 'Segmen topik utama pertama', type: 'content' },
        { time: '20:00-25:00', actionEn: 'Break & Engagement', actionId: 'Break & Engagement', tipsEn: 'Mini games, shoutouts, gift acknowledgment', tipsId: 'Mini games, shoutouts, acknowledge gifts', type: 'engagement' },
        { time: '25:00-40:00', actionEn: 'Content Block 2', actionId: 'Blok Konten 2', tipsEn: 'Second major topic segment or Q&A deep dive', tipsId: 'Segmen topik utama kedua atau deep dive Q&A', type: 'content' },
        { time: '40:00-45:00', actionEn: 'Special Segment', actionId: 'Segmen Spesial', tipsEn: 'Surprise, giveaway teaser, or exclusive content', tipsId: 'Surprise, teaser giveaway, atau konten eksklusif', type: 'content' },
        { time: '45:00-52:00', actionEn: 'Open Q&A', actionId: 'Q&A Terbuka', tipsEn: 'Answer any questions from chat', tipsId: 'Jawab pertanyaan apa saja dari chat', type: 'engagement' },
        { time: '52:00-57:00', actionEn: 'Final Push', actionId: 'Push Terakhir', tipsEn: 'Gift goals, follower push, share reminders', tipsId: 'Target gift, push follower, ingatkan share', type: 'engagement' },
        { time: '57:00-60:00', actionEn: 'Grand Closing', actionId: 'Penutupan Besar', tipsEn: 'Heartfelt thanks, next live preview, memorable goodbye', tipsId: 'Terima kasih tulus, preview live berikutnya, goodbye memorable', type: 'closing' },
      ],
      90: [
        { time: '0:00-5:00', actionEn: 'Epic Opening', actionId: 'Pembukaan Epic', tipsEn: 'Build excitement, share agenda, set expectations', tipsId: 'Bangun excitement, share agenda, set ekspektasi', type: 'hook' },
        { time: '5:00-15:00', actionEn: 'Warm-Up Session', actionId: 'Sesi Pemanasan', tipsEn: 'Extended chat, get to know viewers, build community vibe', tipsId: 'Ngobrol extended, kenali penonton, bangun vibe komunitas', type: 'engagement' },
        { time: '15:00-35:00', actionEn: 'Content Block 1', actionId: 'Blok Konten 1', tipsEn: 'Major topic segment with depth', tipsId: 'Segmen topik utama dengan kedalaman', type: 'content' },
        { time: '35:00-45:00', actionEn: 'Mini Break', actionId: 'Break Mini', tipsEn: 'Games, shoutouts, gift battle, fun activities', tipsId: 'Games, shoutouts, gift battle, aktivitas fun', type: 'engagement' },
        { time: '45:00-65:00', actionEn: 'Content Block 2', actionId: 'Blok Konten 2', tipsEn: 'Second major segment or audience participation', tipsId: 'Segmen utama kedua atau partisipasi audiens', type: 'content' },
        { time: '65:00-75:00', actionEn: 'Special Feature', actionId: 'Fitur Spesial', tipsEn: 'Exclusive content, surprise guest, or giveaway', tipsId: 'Konten eksklusif, tamu kejutan, atau giveaway', type: 'content' },
        { time: '75:00-82:00', actionEn: 'Extended Q&A', actionId: 'Q&A Extended', tipsEn: 'Deep dive into viewer questions', tipsId: 'Deep dive pertanyaan penonton', type: 'engagement' },
        { time: '82:00-88:00', actionEn: 'Final Push', actionId: 'Push Final', tipsEn: 'Last call for gifts, follows, shares', tipsId: 'Panggilan terakhir untuk gift, follow, share', type: 'engagement' },
        { time: '88:00-90:00', actionEn: 'Epic Closing', actionId: 'Penutupan Epic', tipsEn: 'Memorable farewell, community appreciation, next event tease', tipsId: 'Perpisahan memorable, apresiasi komunitas, teaser event berikutnya', type: 'closing' },
      ],
    },
    pk: {
      15: [
        { time: '0:00-1:00', actionEn: 'Quick Intro', actionId: 'Intro Cepat', tipsEn: 'Introduce yourself and the battle, hype up!', tipsId: 'Perkenalkan diri dan battle, hype up!', type: 'hook' },
        { time: '1:00-2:00', actionEn: 'Meet Opponent', actionId: 'Kenalan Lawan', tipsEn: 'Quick intro of PK partner, build excitement', tipsId: 'Intro cepat partner PK, bangun excitement', type: 'content' },
        { time: '2:00-12:00', actionEn: 'Battle Time!', actionId: 'Waktu Battle!', tipsEn: 'Engage your audience, encourage gifts, stay entertaining', tipsId: 'Engage audiens, dorong gift, tetap entertaining', type: 'engagement' },
        { time: '12:00-14:00', actionEn: 'Final Push', actionId: 'Push Terakhir', tipsEn: 'Last 2 minutes push, thank supporters', tipsId: 'Push 2 menit terakhir, terima kasih pendukung', type: 'engagement' },
        { time: '14:00-15:00', actionEn: 'Result & Thanks', actionId: 'Hasil & Terima Kasih', tipsEn: 'Announce winner, thank everyone, good sportsmanship', tipsId: 'Umumkan pemenang, terima kasih semua, sportivitas', type: 'closing' },
      ],
      30: [
        { time: '0:00-3:00', actionEn: 'Hype Intro', actionId: 'Intro Hype', tipsEn: 'Build massive excitement, introduce the battle', tipsId: 'Bangun excitement besar, perkenalkan battle', type: 'hook' },
        { time: '3:00-5:00', actionEn: 'Meet Your Opponent', actionId: 'Kenalan Lawan', tipsEn: 'Both introduce each other, playful banter', tipsId: 'Saling perkenalkan, banter playful', type: 'content' },
        { time: '5:00-8:00', actionEn: 'Round 1 Warm-Up', actionId: 'Pemanasan Round 1', tipsEn: 'Easy start, get audiences engaged', tipsId: 'Mulai santai, engage audiens', type: 'engagement' },
        { time: '8:00-18:00', actionEn: 'Main Battle', actionId: 'Battle Utama', tipsEn: 'Peak competition time, entertain and engage', tipsId: 'Waktu kompetisi puncak, entertain dan engage', type: 'engagement' },
        { time: '18:00-22:00', actionEn: 'Comeback/Secure Lead', actionId: 'Comeback/Amankan Lead', tipsEn: 'Strategic push phase, acknowledge all supporters', tipsId: 'Fase push strategis, acknowledge semua pendukung', type: 'engagement' },
        { time: '22:00-27:00', actionEn: 'Final Showdown', actionId: 'Showdown Final', tipsEn: 'Last push, maximum hype, encourage audience', tipsId: 'Push terakhir, hype maksimum, semangati audiens', type: 'engagement' },
        { time: '27:00-30:00', actionEn: 'Victory/Defeat Grace', actionId: 'Menang/Kalah dengan Anggun', tipsEn: 'Thank everyone, good sportsmanship, plan rematch?', tipsId: 'Terima kasih semua, sportivitas, rematch?', type: 'closing' },
      ],
      60: [
        { time: '0:00-5:00', actionEn: 'Epic Battle Intro', actionId: 'Intro Battle Epic', tipsEn: 'Maximum hype, set the stakes, introduce battle', tipsId: 'Hype maksimum, set taruhannya, perkenalkan battle', type: 'hook' },
        { time: '5:00-10:00', actionEn: 'Opponent Introduction', actionId: 'Perkenalan Lawan', tipsEn: 'Both creators introduce each other, banter', tipsId: 'Kedua creator saling perkenalkan, banter', type: 'content' },
        { time: '10:00-15:00', actionEn: 'Pre-Battle Chat', actionId: 'Chat Pra-Battle', tipsEn: 'Warm up audiences, joint Q&A', tipsId: 'Panaskan audiens, Q&A bersama', type: 'engagement' },
        { time: '15:00-25:00', actionEn: 'Round 1', actionId: 'Round 1', tipsEn: 'First competitive segment', tipsId: 'Segmen kompetitif pertama', type: 'engagement' },
        { time: '25:00-30:00', actionEn: 'Mid-Battle Break', actionId: 'Break Mid-Battle', tipsEn: 'Quick chat, acknowledge supporters, build tension', tipsId: 'Chat cepat, acknowledge pendukung, bangun ketegangan', type: 'content' },
        { time: '30:00-45:00', actionEn: 'Round 2', actionId: 'Round 2', tipsEn: 'Intensified competition', tipsId: 'Kompetisi makin intens', type: 'engagement' },
        { time: '45:00-50:00', actionEn: 'Comeback Zone', actionId: 'Zona Comeback', tipsEn: 'If losing - rally troops. If winning - secure lead', tipsId: 'Kalau kalah - kerahkan pasukan. Kalau menang - amankan lead', type: 'engagement' },
        { time: '50:00-57:00', actionEn: 'Final Round', actionId: 'Round Final', tipsEn: 'All out push, maximum entertainment', tipsId: 'Push all out, entertainment maksimum', type: 'engagement' },
        { time: '57:00-60:00', actionEn: 'Victory Celebration', actionId: 'Rayakan Kemenangan', tipsEn: 'Results, thanks, good sportsmanship, future plans', tipsId: 'Hasil, terima kasih, sportivitas, rencana selanjutnya', type: 'closing' },
      ],
      90: [
        { time: '0:00-10:00', actionEn: 'Grand Battle Opening', actionId: 'Pembukaan Battle Besar', tipsEn: 'Epic intro, build massive hype, introduce stakes', tipsId: 'Intro epic, bangun hype besar, perkenalkan taruhan', type: 'hook' },
        { time: '10:00-20:00', actionEn: 'Pre-Battle Show', actionId: 'Show Pra-Battle', tipsEn: 'Joint content, audience warm-up, banter', tipsId: 'Konten bersama, pemanasan audiens, banter', type: 'content' },
        { time: '20:00-35:00', actionEn: 'Round 1', actionId: 'Round 1', tipsEn: 'First major battle segment', tipsId: 'Segmen battle utama pertama', type: 'engagement' },
        { time: '35:00-45:00', actionEn: 'Halftime Show', actionId: 'Show Paruh Waktu', tipsEn: 'Entertainment break, joint activities', tipsId: 'Break entertainment, aktivitas bersama', type: 'content' },
        { time: '45:00-65:00', actionEn: 'Round 2', actionId: 'Round 2', tipsEn: 'Second major battle segment', tipsId: 'Segmen battle utama kedua', type: 'engagement' },
        { time: '65:00-75:00', actionEn: 'Audience Appreciation', actionId: 'Apresiasi Audiens', tipsEn: 'Thank supporters, shoutouts, acknowledge gifts', tipsId: 'Terima kasih pendukung, shoutouts, acknowledge gifts', type: 'engagement' },
        { time: '75:00-85:00', actionEn: 'Final Round', actionId: 'Round Final', tipsEn: 'Ultimate showdown, maximum push', tipsId: 'Showdown ultimate, push maksimum', type: 'engagement' },
        { time: '85:00-90:00', actionEn: 'Grand Finale', actionId: 'Grand Finale', tipsEn: 'Results, epic thanks, future collab teaser', tipsId: 'Hasil, terima kasih epic, teaser kolaborasi selanjutnya', type: 'closing' },
      ],
    },
    multi: {
      15: [
        { time: '0:00-2:00', actionEn: 'Welcome & Intro', actionId: 'Sambutan & Intro', tipsEn: 'Introduce yourself and guests quickly', tipsId: 'Perkenalkan diri dan tamu dengan cepat', type: 'hook' },
        { time: '2:00-4:00', actionEn: 'Guest Spotlights', actionId: 'Spotlight Tamu', tipsEn: 'Each guest briefly introduces themselves', tipsId: 'Tiap tamu perkenalkan diri singkat', type: 'content' },
        { time: '4:00-12:00', actionEn: 'Discussion/Activity', actionId: 'Diskusi/Aktivitas', tipsEn: 'Main content with all guests participating', tipsId: 'Konten utama dengan semua tamu berpartisipasi', type: 'content' },
        { time: '12:00-14:00', actionEn: 'Audience Questions', actionId: 'Pertanyaan Audiens', tipsEn: 'Quick Q&A from viewers to guests', tipsId: 'Q&A cepat dari penonton ke tamu', type: 'engagement' },
        { time: '14:00-15:00', actionEn: 'Wrap Up', actionId: 'Penutup', tipsEn: 'Thank guests, promote their pages, closing', tipsId: 'Terima kasih tamu, promosikan page mereka, penutup', type: 'closing' },
      ],
      30: [
        { time: '0:00-3:00', actionEn: 'Host Opening', actionId: 'Pembukaan Host', tipsEn: 'Welcome, tease guests, build anticipation', tipsId: 'Sambutan, teaser tamu, bangun antisipasi', type: 'hook' },
        { time: '3:00-8:00', actionEn: 'Guest Introductions', actionId: 'Perkenalan Tamu', tipsEn: 'Each guest introduces themselves and their expertise', tipsId: 'Tiap tamu perkenalkan diri dan expertise mereka', type: 'content' },
        { time: '8:00-18:00', actionEn: 'Main Discussion', actionId: 'Diskusi Utama', tipsEn: 'Topic discussion with all guests contributing', tipsId: 'Diskusi topik dengan semua tamu berkontribusi', type: 'content' },
        { time: '18:00-22:00', actionEn: 'Audience Interaction', actionId: 'Interaksi Audiens', tipsEn: 'Q&A from chat, audience votes/polls', tipsId: 'Q&A dari chat, vote/poll audiens', type: 'engagement' },
        { time: '22:00-25:00', actionEn: 'Guest Highlights', actionId: 'Highlight Tamu', tipsEn: 'Each guest shares their key message/promo', tipsId: 'Tiap tamu share pesan kunci/promo mereka', type: 'content' },
        { time: '25:00-28:00', actionEn: 'Final Thanks', actionId: 'Terima Kasih Final', tipsEn: 'Acknowledge everyone, promote guest pages', tipsId: 'Acknowledge semua, promosikan page tamu', type: 'engagement' },
        { time: '28:00-30:00', actionEn: 'Group Closing', actionId: 'Penutupan Bersama', tipsEn: 'Goodbye from all, tease future collabs', tipsId: 'Goodbye dari semua, teaser kolaborasi selanjutnya', type: 'closing' },
      ],
      60: [
        { time: '0:00-5:00', actionEn: 'Grand Opening', actionId: 'Pembukaan Besar', tipsEn: 'Host welcomes, builds excitement for guests', tipsId: 'Host sambut, bangun excitement untuk tamu', type: 'hook' },
        { time: '5:00-12:00', actionEn: 'Guest Introductions', actionId: 'Perkenalan Tamu', tipsEn: 'Deep introductions, fun facts, expertise', tipsId: 'Perkenalan mendalam, fun facts, expertise', type: 'content' },
        { time: '12:00-15:00', actionEn: 'Icebreaker Activity', actionId: 'Aktivitas Icebreaker', tipsEn: 'Fun game or rapid fire questions', tipsId: 'Game fun atau pertanyaan rapid fire', type: 'engagement' },
        { time: '15:00-30:00', actionEn: 'Main Topic Discussion', actionId: 'Diskusi Topik Utama', tipsEn: 'Deep dive into topic with all perspectives', tipsId: 'Deep dive topik dengan semua perspektif', type: 'content' },
        { time: '30:00-35:00', actionEn: 'Audience Break', actionId: 'Break Audiens', tipsEn: 'Read comments, shoutouts, quick breaks', tipsId: 'Baca komen, shoutouts, break cepat', type: 'engagement' },
        { time: '35:00-45:00', actionEn: 'Topic Part 2 / Debate', actionId: 'Topik Part 2 / Debat', tipsEn: 'Continue discussion or friendly debate', tipsId: 'Lanjut diskusi atau debat friendly', type: 'content' },
        { time: '45:00-52:00', actionEn: 'Open Q&A', actionId: 'Q&A Terbuka', tipsEn: 'Audience questions to any guest', tipsId: 'Pertanyaan audiens ke tamu mana saja', type: 'engagement' },
        { time: '52:00-57:00', actionEn: 'Guest Takeaways', actionId: 'Takeaway Tamu', tipsEn: 'Each guest shares final wisdom/promo', tipsId: 'Tiap tamu share wisdom/promo terakhir', type: 'content' },
        { time: '57:00-60:00', actionEn: 'Group Finale', actionId: 'Finale Bersama', tipsEn: 'Group thank you, future plans, goodbye', tipsId: 'Terima kasih bersama, rencana depan, goodbye', type: 'closing' },
      ],
      90: [
        { time: '0:00-8:00', actionEn: 'Epic Panel Opening', actionId: 'Pembukaan Panel Epic', tipsEn: 'Grand introduction, set the stage', tipsId: 'Perkenalan besar, set the stage', type: 'hook' },
        { time: '8:00-18:00', actionEn: 'Guest Deep Dives', actionId: 'Deep Dive Tamu', tipsEn: 'Each guest gets extended intro time', tipsId: 'Tiap tamu dapat waktu intro extended', type: 'content' },
        { time: '18:00-25:00', actionEn: 'Group Icebreaker', actionId: 'Icebreaker Bersama', tipsEn: 'Fun activities to warm up the panel', tipsId: 'Aktivitas fun untuk panaskan panel', type: 'engagement' },
        { time: '25:00-45:00', actionEn: 'Main Discussion Block 1', actionId: 'Blok Diskusi Utama 1', tipsEn: 'First major topic with all guests', tipsId: 'Topik utama pertama dengan semua tamu', type: 'content' },
        { time: '45:00-55:00', actionEn: 'Audience Engagement', actionId: 'Engagement Audiens', tipsEn: 'Extended Q&A, polls, comments', tipsId: 'Q&A extended, poll, komen', type: 'engagement' },
        { time: '55:00-70:00', actionEn: 'Discussion Block 2', actionId: 'Blok Diskusi 2', tipsEn: 'Second topic or debate format', tipsId: 'Topik kedua atau format debat', type: 'content' },
        { time: '70:00-78:00', actionEn: 'Special Segment', actionId: 'Segmen Spesial', tipsEn: 'Games, challenges, or surprise content', tipsId: 'Games, tantangan, atau konten kejutan', type: 'content' },
        { time: '78:00-85:00', actionEn: 'Final Thoughts', actionId: 'Pemikiran Terakhir', tipsEn: 'Each guest shares key takeaway', tipsId: 'Tiap tamu share takeaway kunci', type: 'content' },
        { time: '85:00-90:00', actionEn: 'Grand Finale', actionId: 'Grand Finale', tipsEn: 'Epic group goodbye, future collabs, thanks', tipsId: 'Goodbye group epic, kolaborasi depan, terima kasih', type: 'closing' },
      ],
    },
  };

  return timelines[type]?.[duration] || timelines.solo[30];
};

const giftStrategies: Record<string, { en: string[]; id: string[] }> = {
  solo: {
    en: [
      'Thank every gift by name - "Thank you [name] for the rose!"',
      'Create gift goals - "10 roses and I\'ll share a secret tip!"',
      'Acknowledge top gifters on your leaderboard',
      'React genuinely to larger gifts - show real excitement',
      'Mention what gifts mean to you (motivation, support)',
    ],
    id: [
      'Terima kasih setiap gift dengan nama - "Makasih [nama] untuk rose-nya!"',
      'Buat target gift - "10 roses dan aku kasih tips rahasia!"',
      'Acknowledge top gifters di leaderboard',
      'Reaksi genuine untuk gift besar - tunjukkan excitement asli',
      'Sebutkan arti gift untukmu (motivasi, dukungan)',
    ],
  },
  pk: {
    en: [
      'Create competition narrative - "Help me win this battle!"',
      'Promise special rewards at milestones',
      'Acknowledge your "army" - give them team identity',
      'React dramatically to gifts during close battles',
      'Thank supporters even if you lose - loyalty matters',
    ],
    id: [
      'Ciptakan narasi kompetisi - "Bantu aku menang battle ini!"',
      'Janjikan reward spesial di milestone',
      'Acknowledge "pasukan" kamu - beri mereka identitas tim',
      'Reaksi dramatis ke gift saat battle ketat',
      'Terima kasih pendukung meski kalah - loyalitas penting',
    ],
  },
  multi: {
    en: [
      'Acknowledge gifts for all guests, not just yourself',
      'Create shared goals - "Together we can hit this milestone!"',
      'Let guests thank their own supporters',
      'Celebrate gifts as a group achievement',
      'Redirect gift focus to content, not just asking',
    ],
    id: [
      'Acknowledge gifts untuk semua tamu, bukan hanya diri sendiri',
      'Buat goals bersama - "Bersama kita bisa capai milestone ini!"',
      'Biarkan tamu terima kasih pendukung mereka sendiri',
      'Rayakan gifts sebagai pencapaian grup',
      'Arahkan fokus gift ke konten, bukan hanya minta',
    ],
  },
};

const contingencyPlans: { en: string[]; id: string[] } = {
  en: [
    'If chat is slow: Ask a question, do a poll, share a story',
    'If trolls appear: Ignore, block, or kill with kindness',
    'If tech issues: Stay calm, acknowledge, improvise content',
    'If you run out of content: Open Q&A or share behind-the-scenes',
    'If energy drops: Take a breath, do a quick stretch, re-engage',
  ],
  id: [
    'Kalau chat lambat: Ajukan pertanyaan, buat poll, cerita',
    'Kalau ada troll: Abaikan, blokir, atau balas dengan kebaikan',
    'Kalau masalah teknis: Tetap tenang, acknowledge, improvisasi konten',
    'Kalau kehabisan konten: Buka Q&A atau share behind-the-scenes',
    'Kalau energi turun: Tarik napas, stretching cepat, engage lagi',
  ],
};

export function LiveStreamingWizard() {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const selectedTypeData = liveTypes.find(lt => lt.id === selectedType);
  const timeline = selectedType && selectedDuration 
    ? generateTimeline(selectedType, selectedDuration, selectedTopic || 'qa')
    : [];

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedType(null);
    setSelectedDuration(null);
    setSelectedTopic(null);
  };

  const canProceed = () => {
    if (step === 1) return selectedType !== null;
    if (step === 2) return selectedDuration !== null;
    if (step === 3) return selectedTopic !== null;
    return true;
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'hook': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'content': return 'border-blue-500/50 bg-blue-500/10';
      case 'engagement': return 'border-pink-500/50 bg-pink-500/10';
      case 'closing': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Radio className="w-6 h-6 text-pink-400" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            {t('Live Streaming Wizard', 'Wizard Live Streaming')}
          </h2>
        </div>
        <p className="text-gray-400">
          {t('Step-by-step guide for your TikTok Live', 'Panduan step-by-step untuk Live TikTok kamu')}
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
            <Radio className="w-5 h-5 text-pink-400" />
            {t('What type of live?', 'Tipe live apa?')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 rounded-xl border transition-all text-left ${
                    selectedType === type.id
                      ? `bg-gradient-to-r ${type.color} border-transparent text-white`
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 text-gray-300'
                  }`}
                >
                  <Icon className="w-8 h-8 mb-3" />
                  <div className="font-semibold text-lg mb-1">
                    {language === 'id' ? type.labelId : type.labelEn}
                  </div>
                  <div className="text-sm opacity-80">
                    {language === 'id' ? type.descriptionId : type.descriptionEn}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            {t('How long will you go live?', 'Berapa lama mau live?')}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {durations.map((duration) => (
              <button
                key={duration.minutes}
                onClick={() => setSelectedDuration(duration.minutes)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedDuration === duration.minutes
                    ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl font-bold text-white mb-1">
                  {duration.minutes}m
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {duration.recommendedFor}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            {t('What\'s the topic?', 'Topiknya apa?')}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-3 rounded-xl border transition-all text-center ${
                  selectedTopic === topic.id
                    ? 'bg-gradient-to-r from-pink-500/20 to-cyan-500/20 border-pink-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <span className="text-xl block mb-1">{topic.icon}</span>
                <span className="text-xs font-medium text-gray-300">
                  {language === 'id' ? topic.labelId : topic.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            {t('Your Live Timeline', 'Timeline Live Kamu')}
          </h3>

          <div className="bg-gray-800/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Badge className={`bg-gradient-to-r ${selectedTypeData?.color || 'from-gray-500 to-gray-600'}`}>
                {language === 'id' ? selectedTypeData?.labelId : selectedTypeData?.labelEn}
              </Badge>
              <Badge variant="outline">{selectedDuration} {t('minutes', 'menit')}</Badge>
              <Badge variant="secondary">
                {topics.find(t => t.id === selectedTopic)?.icon} {language === 'id' ? topics.find(t => t.id === selectedTopic)?.labelId : topics.find(t => t.id === selectedTopic)?.labelEn}
              </Badge>
            </div>

            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border ${getTypeColor(item.type)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.time}
                        </Badge>
                        <span className="font-semibold text-white">
                          {language === 'id' ? item.actionId : item.actionEn}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {language === 'id' ? item.tipsId : item.tipsEn}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(
                        `${item.time}: ${language === 'id' ? item.actionId : item.actionEn} - ${language === 'id' ? item.tipsId : item.tipsEn}`,
                        `timeline-${i}`
                      )}
                    >
                      {copiedSection === `timeline-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                const fullTimeline = timeline.map(item => 
                  `${item.time}: ${language === 'id' ? item.actionId : item.actionEn}\n→ ${language === 'id' ? item.tipsId : item.tipsEn}`
                ).join('\n\n');
                copyToClipboard(fullTimeline, 'full-timeline');
              }}
            >
              {copiedSection === 'full-timeline' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {t('Copy Full Timeline', 'Salin Semua Timeline')}
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            {t('Pro Tips & Strategies', 'Tips & Strategi Pro')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-pink-500/10 border-pink-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-pink-400">
                  <Gift className="w-4 h-4" />
                  {t('Gift Strategy', 'Strategi Gift')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(language === 'id' 
                    ? giftStrategies[selectedType || 'solo'].id 
                    : giftStrategies[selectedType || 'solo'].en
                  ).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-4 h-4" />
                  {t('Contingency Plans', 'Rencana Cadangan')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(language === 'id' ? contingencyPlans.id : contingencyPlans.en).map((plan, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Lightbulb className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      {plan}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Radio className="w-8 h-8 text-pink-400" />
                <div>
                  <h4 className="font-semibold text-white">
                    {t('You\'re Ready to Go Live!', 'Kamu Siap Live!')}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {t('Remember: Energy is contagious. Start strong!', 'Ingat: Energi itu menular. Mulai dengan kuat!')}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <Badge className={`bg-gradient-to-r ${selectedTypeData?.color}`}>
                    {language === 'id' ? selectedTypeData?.labelId : selectedTypeData?.labelEn}
                  </Badge>
                  <Badge variant="outline">{selectedDuration} {t('minutes', 'menit')}</Badge>
                  <Badge variant="secondary">
                    {topics.find(t => t.id === selectedTopic)?.icon}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {t('Checklist: Good lighting, stable internet, charged phone, water nearby, timeline printed/memorized', 
                     'Checklist: Pencahayaan bagus, internet stabil, HP terisi, air minum dekat, timeline diprint/dihapal')}
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
            {t('Plan Another Live', 'Rencanakan Live Lagi')}
          </Button>
        )}
      </div>
    </div>
  );
}
