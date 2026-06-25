import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Flame, 
  CheckCircle, 
  Gift, 
  TrendingUp, 
  PiggyBank, 
  Link2Off, 
  Lock, 
  ChevronRight, 
  Star,
  Compass,
  ShoppingBag,
  Sparkles,
  Heart,
  Shield,
  ArrowUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Quest } from '../types';

interface QuestsViewProps {
  xp: number;
  level: number;
  streak: number;
  quests: Quest[];
  onCompleteQuest: (id: string) => void;
  onAddXp: (amount: number, questId?: string) => void;
  dailyRewardCollected: boolean;
  onCollectDailyReward: () => void;
  gems: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  hearts: number;
  setHearts: React.Dispatch<React.SetStateAction<number>>;
  activeBadge: string;
  setActiveBadge: (badge: string) => void;
}

// Sound effects synth
const playSuccessSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
};

export default function QuestsView({
  xp,
  level,
  streak,
  quests,
  onCompleteQuest,
  onAddXp,
  dailyRewardCollected,
  onCollectDailyReward,
  gems,
  setGems,
  hearts,
  setHearts,
  activeBadge,
  setActiveBadge
}: QuestsViewProps) {
  
  const [chestOpen, setChestOpen] = useState(dailyRewardCollected);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState<string | null>(null);

  const xpNeeded = level * 500;
  const xpPercentage = Math.min((xp / xpNeeded) * 100, 100);

  const handleOpenChest = () => {
    if (!dailyRewardCollected) {
      setChestOpen(true);
      onCollectDailyReward();
      onAddXp(120, "q5"); // Give 120 XP as daily treasure
      setGems(prev => prev + 35); // Give 35 gems
      playSuccessSound();
    }
  };

  // Buy heart potion
  const buyHeartPotion = () => {
    if (gems >= 50) {
      if (hearts === 3) {
        alert("Canınız zaten tamamen dolu! ❤️❤️❤️");
        return;
      }
      setGems(prev => prev - 50);
      setHearts(3);
      playSuccessSound();
      showSuccessBanner("Can iksiri başarıyla satın alındı ve canınız dolduruldu! ❤️");
    } else {
      alert("Yetersiz Elmas! Görevleri tamamlayarak veya Bilgi Kartları okuyarak elmas toplayabilirsiniz.");
    }
  };

  // Buy streak freeze
  const buyStreakFreeze = () => {
    if (gems >= 100) {
      setGems(prev => prev - 100);
      playSuccessSound();
      showSuccessBanner("Seri Dondurucu aktif edildi! Yarın pratik yapmasanız bile seriniz korunacak. ❄️🔥");
    } else {
      alert("Yetersiz Elmas!");
    }
  };

  // Buy golden badge
  const buyGoldenBadge = () => {
    if (gems >= 200) {
      setGems(prev => prev - 200);
      setActiveBadge("SÜDEV Altın Rozeti");
      playSuccessSound();
      showSuccessBanner("SÜDEV Altın Rozeti unvanı alındı! Üst barda gururla taşınacak. 🏆✨");
    } else {
      alert("Yetersiz Elmas!");
    }
  };

  const showSuccessBanner = (msg: string) => {
    setPurchaseSuccessMsg(msg);
    setTimeout(() => {
      setPurchaseSuccessMsg(null);
    }, 4500);
  };

  // Simulated Leaderboard League
  const initialLeagueData = [
    { name: "Mert_Duo99", xp: 1200, avatar: "🦁", rank: 1, isUser: false },
    { name: "SÜDEV Takımı (Siz)", xp: xp, avatar: "🦉", rank: 2, isUser: true },
    { name: "BilginBaykus_Fan", xp: 850, avatar: "🦊", rank: 3, isUser: false },
    { name: "Ece_Yatirimci", xp: 740, avatar: "🐼", rank: 4, isUser: false },
    { name: "Can_Bütçeci", xp: 520, avatar: "🐨", rank: 5, isUser: false },
    { name: "Elif_Finans", xp: 310, avatar: "🐱", rank: 6, isUser: false }
  ];

  // Dynamically sort league data based on live user XP
  const sortedLeague = [...initialLeagueData].map(player => {
    if (player.isUser) {
      return { ...player, xp: xp };
    }
    return player;
  }).sort((a, b) => b.xp - a.xp).map((player, idx) => ({
    ...player,
    rank: idx + 1
  }));

  const userRank = sortedLeague.find(p => p.isUser)?.rank || 2;

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 pb-12 animate-fade-in animate-scale-up" id="quests-container">
      
      {/* Banner message */}
      {purchaseSuccessMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs md:text-sm border-b-4 border-emerald-700 animate-slide-down">
          <span>🎉</span>
          <p>{purchaseSuccessMsg}</p>
        </div>
      )}

      {/* STATS HEADER */}
      <div className="bg-[#0f172a] border border-blue-500/10 rounded-3xl p-6 md:p-8 relative overflow-hidden" id="level-card">
        {/* Decorative background sparks */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#fccb2f] to-amber-300 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 relative group">
              <Star className="w-4 h-4 text-slate-950 absolute -top-1 -right-1 fill-slate-950" />
              {level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-[#fccb2f] uppercase bg-amber-500/10 px-2 py-0.5 rounded-md">SEVİYE {level}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-bold">Rütbe: Finansal Duo Kaşifi</span>
              </div>
              <h3 className="text-sm md:text-base font-black font-display text-white mt-1">SÜDEV Takımı Üyesi</h3>
            </div>
          </div>

          {/* Flame streak */}
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500/10 animate-bounce" />
            <span className="text-xs font-black text-orange-400 font-display">{streak} GÜNLÜK SERİ</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Gelişim: <strong className="text-white">{xp} / {xpNeeded} XP</strong></span>
            <span className="text-[#fccb2f] font-black">Yeni Seviyeye {xpNeeded - xp} XP</span>
          </div>
          <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-850 p-1">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* League Rank Notification */}
        <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <p>
              Haftalık <strong>Altın Ligde</strong> şu an <strong className="text-amber-400">{userRank}. sıradasın</strong>!
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500">Lig bitişi: 2 gün</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT: LEAGUE LEADERBOARD & SHOP (8 COLUMNS) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* DUOLINGO LEAGUE LEADERBOARD */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 space-y-5" id="league-leaderboard-box">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#fccb2f] uppercase bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-block">Haftalık Lig</span>
              <h3 className="text-base font-black font-display text-white mt-2 flex items-center gap-1.5">
                <span>🏆</span> Altın Lig Tablosu
              </h3>
              <p className="text-xs text-slate-400">XP kazandıkça SÜDEV Takımı olarak tablodaki sıranız otomatik güncellenir.</p>
            </div>

            <div className="space-y-2.5">
              {sortedLeague.map((player) => (
                <div 
                  key={player.name}
                  id={`leaderboard-${player.name}`}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-all ${
                    player.isUser 
                      ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/10 border-2 border-blue-500/30' 
                      : 'bg-slate-900/40 border border-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Number */}
                    <span className={`w-6 text-center font-mono font-black text-xs ${
                      player.rank === 1 ? 'text-[#fccb2f]' : player.rank === 2 ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      #{player.rank}
                    </span>
                    {/* Avatar */}
                    <span className="text-xl">{player.avatar}</span>
                    {/* Username */}
                    <span className={`text-xs font-bold ${player.isUser ? 'text-blue-300' : 'text-slate-200'}`}>
                      {player.name}
                    </span>
                    {player.isUser && (
                      <span className="text-[8px] font-extrabold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase">Siz</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black text-slate-300">{player.xp} XP</span>
                    {player.rank <= 3 && (
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DUOLINGO SHOP (MARKETPLACE) */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 space-y-5" id="duo-shop-box">
            <div>
              <span className="text-[10px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 inline-block">Mağaza</span>
              <h3 className="text-base font-black font-display text-white mt-2 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                Duo Elmas Mağazası
              </h3>
              <p className="text-xs text-slate-400">Kazandığınız elmasları harcayarak can yenileyin veya unvan satın alın.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Item 1: Can Potion */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center text-xl shadow-inner animate-pulse">
                    ❤️
                  </div>
                  <h4 className="text-xs font-black text-white">Can İksiri</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Tüm canlarınızı anında yeniler ve derslere devam etmenizi sağlar.
                  </p>
                </div>
                <button
                  id="btn-buy-potion"
                  onClick={buyHeartPotion}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-black text-[10px] rounded-xl transition-all cursor-pointer text-center"
                >
                  Satın Al (50 💎)
                </button>
              </div>

              {/* Item 2: Streak Freeze */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center text-xl shadow-inner">
                    ❄️
                  </div>
                  <h4 className="text-xs font-black text-white">Seri Koruyucu</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Yarın pratik yapmayı unutursanız serinizi dondurur ve korur.
                  </p>
                </div>
                <button
                  id="btn-buy-freeze"
                  onClick={buyStreakFreeze}
                  className="w-full py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-black text-[10px] rounded-xl transition-all cursor-pointer text-center"
                >
                  Satın Al (100 💎)
                </button>
              </div>

              {/* Item 3: Golden Badge */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center text-xl shadow-inner">
                    🏆
                  </div>
                  <h4 className="text-xs font-black text-white">SÜDEV Altın Rozeti</h4>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Üst bardaki profilinizin yanına parıldayan altın bir takı rozeti ekler.
                  </p>
                </div>
                <button
                  id="btn-buy-badge"
                  onClick={buyGoldenBadge}
                  className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-black text-[10px] rounded-xl transition-all cursor-pointer text-center"
                >
                  Satın Al (200 💎)
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT: DAILY REWARDS & CHEST & COMPLETED TASKS (4 COLUMNS) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* CHEST GIFT MODULE */}
          <div className="bg-[#0f172a] border border-slate-900 rounded-3xl p-6 text-center space-y-4" id="daily-chest-card">
            <span className="text-[8px] font-extrabold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded uppercase">
              Günlük Seri Sandığı
            </span>
            
            <div className="relative w-20 h-20 bg-slate-950 rounded-2xl border border-slate-850 flex items-center justify-center overflow-hidden mx-auto">
              {chestOpen ? (
                <span className="text-4xl animate-bounce">🎁</span>
              ) : (
                <span className="text-4xl hover:scale-110 transition-transform cursor-pointer" onClick={handleOpenChest}>📦</span>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black text-white">Birikim Hazine Kutusu</h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                {dailyRewardCollected 
                  ? "Bugünkü ödülü topladın! Yarın yeni elmaslar seni bekliyor." 
                  : "Bugün seriyi koruduğun için sandıktan 120 XP ve 35 💎 toplayabilirsin!"}
              </p>
            </div>

            <button
              id="btn-collect-chest"
              disabled={dailyRewardCollected}
              onClick={handleOpenChest}
              className={`w-full py-3 rounded-xl text-[10px] font-black transition-all shadow-md text-center uppercase tracking-wider ${
                dailyRewardCollected
                  ? 'bg-slate-900 text-slate-600 border border-slate-950 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-440 text-slate-950 cursor-pointer hover:scale-[1.02]'
              }`}
            >
              {dailyRewardCollected ? "Toplandı" : "Sandığı Aç!"}
            </button>
          </div>

          {/* ACTIVE GOALS CONTAINER (COMPLETED LISTS) */}
          <div className="bg-[#0f172a] border border-slate-900 rounded-3xl p-5 space-y-4" id="active-goals-sidebar">
            <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Duo Günlük Görevler</h4>
            
            <div className="space-y-3.5">
              {quests.map(quest => (
                <div key={quest.id} className="space-y-1.5" id={`quest-progress-${quest.id}`}>
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[11px] font-extrabold leading-snug ${quest.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {quest.title}
                    </span>
                    <span className="text-[9px] font-mono font-black text-amber-400 shrink-0">+{quest.xpReward} XP</span>
                  </div>
                  
                  {/* Progress bar representer */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                      <div 
                        className={`h-full ${quest.completed ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                        style={{ width: quest.completed ? '100%' : '20%' }}
                      />
                    </div>
                    
                    {quest.completed ? (
                      <span className="text-[10px] text-emerald-400 font-bold shrink-0">Bitti</span>
                    ) : (
                      <button 
                        onClick={() => {
                          onCompleteQuest(quest.id);
                          playSuccessSound();
                        }}
                        className="text-[9px] font-black text-blue-400 hover:text-blue-300 cursor-pointer shrink-0 uppercase"
                      >
                        Tamamla
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
