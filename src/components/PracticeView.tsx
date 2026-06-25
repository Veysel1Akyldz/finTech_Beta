import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  ShoppingCart,
  Info, 
  Sparkles, 
  Calendar,
  X,
  Shuffle,
  Percent,
  Check,
  Building,
  Home,
  Lightbulb,
  Car,
  Wine,
  HelpCircle,
  Zap,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Stock, PortfolioItem, Expense } from '../types';
import { HISTORICAL_STOCKS_2023, MONTHS_2023 } from '../data';

interface PracticeViewProps {
  stocks: Stock[];
  portfolio: PortfolioItem[];
  expenses: Expense[];
  monthlyBudget: number;
  borsaNakit: number;
  integratedSystem: boolean;
  onSetIntegratedSystem: (val: boolean) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onRemoveExpense: (id: string) => void;
  onBuyStock: (symbol: string, shares: number, price: number) => boolean;
  onSellStock: (symbol: string, shares: number, price: number) => boolean;
  onAddXp: (amount: number, questId?: string) => void;
  simulationMode: 'live' | 'historical';
  onSetSimulationMode: (mode: 'live' | 'historical') => void;
  activeMonth2023: number;
  onSetActiveMonth2023: (monthIdx: number) => void;
}

function StockSparkline({ symbol, prices }: { symbol: string; prices: number[] }) {
  if (!prices || prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  const width = 80;
  const height = 24;
  const padding = 2;
  
  const points = prices.map((price, idx) => {
    const x = (idx / (prices.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((price - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  const isUp = prices[prices.length - 1] >= prices[0];
  const strokeColor = isUp ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} className="opacity-80 group-hover:opacity-100 transition-opacity">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

function StockAreaChart({ 
  symbol, 
  prices, 
  activeIndex 
}: { 
  symbol: string; 
  prices: number[]; 
  activeIndex: number;
}) {
  if (!prices || prices.length === 0) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  
  const width = 340;
  const height = 140;
  const paddingLeft = 30;
  const paddingRight = 10;
  const paddingTop = 15;
  const paddingBottom = 20;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const points = prices.map((price, idx) => {
    const x = paddingLeft + (idx / (prices.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((price - min) / range) * chartHeight;
    return { x, y, price, month: MONTHS_2023[idx] };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const isUp = prices[prices.length - 1] >= prices[0];
  const strokeColor = isUp ? '#10b981' : '#f43f5e';
  const gradStart = isUp ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)';
  const gradEnd = isUp ? 'rgba(16,185,129,0.0)' : 'rgba(244,63,94,0.0)';

  return (
    <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-2xl space-y-2">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase px-1">
        <span>2023 Fiyat Hareketi (Aylık)</span>
        <span className="text-slate-400 font-mono">Yıllık Getiri: <strong className={isUp ? 'text-emerald-400 font-black' : 'text-rose-400 font-black'}>{(((prices[11] - prices[0]) / prices[0]) * 100).toFixed(0)}%</strong></span>
      </div>
      
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`chart-grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradStart} />
            <stop offset="100%" stopColor={gradEnd} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingTop + ratio * chartHeight;
          const val = max - ratio * range;
          return (
            <g key={idx} className="opacity-25">
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="#475569" 
                strokeWidth="0.75" 
                strokeDasharray="2 2" 
              />
              <text 
                x={paddingLeft - 6} 
                y={y + 3} 
                fill="#94a3b8" 
                fontSize="8" 
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="end"
              >
                {val.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#chart-grad-${symbol})`} />

        {/* Line stroke */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Active Month vertical highlight & point */}
        {points[activeIndex] && (
          <g>
            <line 
              x1={points[activeIndex].x} 
              y1={paddingTop} 
              x2={points[activeIndex].x} 
              y2={paddingTop + chartHeight} 
              stroke="#3b82f6" 
              strokeWidth="1" 
              strokeDasharray="2 2"
              className="opacity-50"
            />
            <circle 
              cx={points[activeIndex].x} 
              cy={points[activeIndex].y} 
              r="4" 
              fill="#3b82f6" 
              stroke="#0f172a" 
              strokeWidth="1"
              className="animate-pulse"
            />
          </g>
        )}

        {/* X-axis labels */}
        {points.map((p, idx) => {
          const abbrev = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
          const isActive = idx === activeIndex;
          return (
            <text 
              key={idx}
              x={p.x} 
              y={height - 4} 
              fill={isActive ? '#3b82f6' : '#64748b'} 
              fontSize="8" 
              fontWeight={isActive ? "bold" : "normal"}
              textAnchor="middle"
            >
              {abbrev[idx]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  Market: ShoppingBag,
  Kira: Home,
  Fatura: Lightbulb,
  Ulaşım: Car,
  Eğlence: Wine,
  Diğer: HelpCircle
};

export default function PracticeView({
  stocks,
  portfolio,
  expenses,
  monthlyBudget,
  borsaNakit,
  integratedSystem,
  onSetIntegratedSystem,
  onAddExpense,
  onRemoveExpense,
  onBuyStock,
  onSellStock,
  onAddXp,
  simulationMode,
  onSetSimulationMode,
  activeMonth2023,
  onSetActiveMonth2023
}: PracticeViewProps) {
  // Modal states
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [tradeModalStock, setTradeModalStock] = useState<Stock | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('');

  // Form states for adding expense
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'Market' | 'Kira' | 'Fatura' | 'Ulaşım' | 'Eğlence' | 'Diğer'>('Market');

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const kalanLimit = Math.max(monthlyBudget - totalSpent, 0);
  const spentPercentage = Math.min(Math.round((totalSpent / monthlyBudget) * 100), 100);

  // Determine budget progress bar color
  const getProgressBarColor = (pct: number) => {
    if (pct < 50) return 'bg-emerald-500';
    if (pct < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getProgressBarBgColor = (pct: number) => {
    if (pct < 50) return 'bg-emerald-500/10 text-emerald-400';
    if (pct < 80) return 'bg-amber-500/10 text-amber-400';
    return 'bg-red-500/10 text-red-400';
  };

  // Portfolio total valuation
  const portfolioValuation = portfolio.reduce((total, pItem) => {
    const liveStock = stocks.find(s => s.symbol === pItem.symbol);
    return total + pItem.shares * (liveStock ? liveStock.price : pItem.avgBuyPrice);
  }, 0);

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (!expenseTitle || isNaN(amount) || amount <= 0) {
      triggerNotification("Lütfen geçerli bir başlık ve tutar giriniz.", "error");
      return;
    }

    onAddExpense({
      title: expenseTitle,
      amount,
      category: expenseCategory
    });

    triggerNotification("Harcama simülasyonu başarıyla eklendi.");
    onAddXp(100, "q2"); // Complete "Bütçe Planı Oluştur" quest on first expense
    setExpenseTitle('');
    setExpenseAmount('');
    setExpenseModalOpen(false);
  };

  const handleTradeSubmit = (type: 'AL' | 'SAT') => {
    if (!tradeModalStock) return;
    const qty = parseInt(tradeAmount, 10);
    if (isNaN(qty) || qty <= 0) {
      triggerNotification("Lütfen geçerli bir pay miktarı giriniz.", "error");
      return;
    }

    const price = tradeModalStock.price;
    const totalCost = qty * price;

    if (type === 'AL') {
      const success = onBuyStock(tradeModalStock.symbol, qty, price);
      if (success) {
        triggerNotification(`${qty} adet ${tradeModalStock.symbol} başarıyla satın alındı.`);
        onAddXp(250, "q3"); // "İlk Hisse Senedi Alımı" Quest
        if (integratedSystem) {
          onAddXp(100, "q4"); // "Entegre Sistemi Keşfet" Quest
        }
        setTradeModalStock(null);
        setTradeAmount('');
      } else {
        triggerNotification("Yetersiz bakiye! Nakit limitinizi kontrol edin.", "error");
      }
    } else {
      const success = onSellStock(tradeModalStock.symbol, qty, price);
      if (success) {
        triggerNotification(`${qty} adet ${tradeModalStock.symbol} başarıyla satıldı.`);
        setTradeModalStock(null);
        setTradeAmount('');
      } else {
        triggerNotification("Portföyünüzde yeterli pay bulunmuyor!", "error");
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 pb-12 animate-fade-in" id="practice-container">
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border shadow-xl flex items-center gap-3 animate-slide-in text-xs font-semibold ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
          id="toast-notification"
        >
          <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {notification.message}
        </div>
      )}

      {/* Header Cards: Budget and Portfolio Overview */}
      <div className="space-y-6" id="dashboard-practice-header">
        <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-400" />
          Bütçe & Harcama Yönetimi
        </h3>

        {/* Budget Manager Panel */}
        <div className="bg-[#0f172a] border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_25px_rgba(59,130,246,0.1)] relative" id="budget-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Integration Switch */}
            <div className="flex items-center gap-3">
              <button
                id="btn-integrated-system"
                onClick={() => onSetIntegratedSystem(!integratedSystem)}
                className={`px-4 py-2 rounded-full text-[10px] font-extrabold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  integratedSystem 
                    ? 'bg-blue-600/10 border border-blue-500/30 text-blue-400' 
                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5" />
                Entegre Bütçe-Borsa Sistemi
              </button>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-500 hover:text-slate-400 cursor-pointer" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-xl text-[10px] text-slate-400 leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-40">
                  Entegre Sistem açıkken, borsa alımlarınız borsa nakiti yetmediğinde doğrudan kalan bütçenizden çekilir ve borsa kârınız bütçenizi artırır!
                </div>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${getProgressBarBgColor(spentPercentage)}`}>
              %{spentPercentage} Harcandı
            </div>
          </div>

          {/* New High Fidelity Layout: Gauge + Left and Right metrics side by side! */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8" id="budget-gauge-grid">
            
            {/* Left Column: Monthly Budget and Portfolio metrics */}
            <div className="space-y-4 text-center md:text-left order-2 md:order-1">
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AYLIK BÜTÇE</span>
                <p className="text-2xl font-black text-blue-400 font-display mt-1">{monthlyBudget} TL</p>
              </div>
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">BORSA NAKİTİ</span>
                <p className="text-2xl font-black text-emerald-400 font-display mt-1">{borsaNakit.toFixed(2)} TL</p>
              </div>
            </div>

            {/* Center Column: Semicircular Gauge */}
            <div className="flex flex-col items-center justify-center order-1 md:order-2">
              <div className="relative flex flex-col items-center justify-center h-32 w-48">
                <svg className="w-48 h-24" viewBox="0 0 100 50">
                  {/* Background Arc */}
                  <path
                    d="M 10 45 A 35 35 0 0 1 90 45"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* Progress Arc with Blue Glow */}
                  <path
                    d="M 10 45 A 35 35 0 0 1 90 45"
                    fill="none"
                    stroke="url(#gauge-grad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="110"
                    strokeDashoffset={110 - (110 * (spentPercentage / 100))}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: "drop-shadow(0px 0px 8px rgba(59, 130, 246, 0.6))"
                    }}
                  />
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="60%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Centered Values inside the Arc */}
                <div className="absolute bottom-1 flex flex-col items-center text-center">
                  <span className="text-lg font-black text-white font-display tracking-tight">
                    {spentPercentage}%
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    Harcandı
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Remaining Budget limit and progress details */}
            <div className="space-y-4 text-center md:text-right order-3">
              <div className="bg-slate-950/40 border border-blue-500/10 p-4 rounded-2xl shadow-inner">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KALAN LİMİT</span>
                <p className="text-2xl font-black text-cyan-400 font-display mt-1">{kalanLimit} TL</p>
              </div>
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">TOPLAM HARCAMA</span>
                <p className="text-2xl font-black text-rose-500 font-display mt-1">{totalSpent} TL</p>
              </div>
            </div>

          </div>

          <button
            id="btn-add-expense-modal"
            onClick={() => setExpenseModalOpen(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-550 active:bg-blue-700 text-white font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] cursor-pointer hover:-translate-y-0.5 duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Sanal Harcama Ekle
          </button>
        </div>
      </div>

      {/* Harcama Geçmişi (Expense History) list */}
      <div className="space-y-4" id="expense-history-box">
        <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Harcama Geçmişi</h4>
        
        {expenses.length === 0 ? (
          <div className="bg-[#0f172a]/50 border border-slate-850 rounded-2xl py-8 px-4 text-center text-xs text-slate-500">
            Henüz harcama simülasyonu bulunmuyor. Birikim durumunu görmek için harcama ekleyin!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3" id="expenses-list">
            {expenses.map(exp => {
              const IconComp = categoryIcons[exp.category] || HelpCircle;
              return (
                <div 
                  key={exp.id}
                  id={`expense-row-${exp.id}`}
                  className="bg-[#0f172a] border border-slate-850 hover:border-slate-800 rounded-2xl p-4 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center">
                      <IconComp className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{exp.title}</h5>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {exp.category} • {exp.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-rose-400 font-mono">
                      -{exp.amount.toFixed(0)} TL
                    </span>
                    <button
                      id={`btn-delete-expense-${exp.id}`}
                      onClick={() => {
                        onRemoveExpense(exp.id);
                        triggerNotification("Harcama simülasyon kaydı silindi.");
                      }}
                      className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sanal Borsa Simülasyonu (Virtual Stock Market Simulation) */}
      <div className="space-y-4 pt-4" id="stock-market-box">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black font-display text-white">Sanal Borsa Simülasyonu</h3>
            <p className="text-xs text-slate-400">Piyasa dalgalanmalarına göre anlık işlem yapın</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-400 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {simulationMode === 'historical' ? '2023 Tarihsel Veri' : 'Canlı Akış'}
          </div>
        </div>

        {/* Simulation Controls Card */}
        <div className="bg-[#0f172a] border border-blue-500/10 rounded-2xl p-5 space-y-4" id="sim-controls-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
            <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Simülasyon Veri Modu</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850">
              <button
                id="btn-mode-historical"
                onClick={() => onSetSimulationMode('historical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  simulationMode === 'historical'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                2023 Tarihsel
              </button>
              <button
                id="btn-mode-live"
                onClick={() => onSetSimulationMode('live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  simulationMode === 'live'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Rastgele Canlı
              </button>
            </div>
          </div>

          {simulationMode === 'historical' ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950/50 p-3 rounded-xl border border-slate-900" id="hist-controls-box">
              <div className="space-y-1 text-center md:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#fccb2f] uppercase bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">2023 PİYASASI</span>
                  <span className="text-xs text-white font-black font-display">{MONTHS_2023[activeMonth2023]} 2023</span>
                </div>
                <p className="text-[10px] text-slate-500">2023 yılındaki gerçek finansal hareketler ve trendler simüle edilir.</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {activeMonth2023 > 0 && (
                  <button
                    id="btn-prev-month"
                    onClick={() => {
                      onSetActiveMonth2023(activeMonth2023 - 1);
                      triggerNotification(`Simülasyon ${MONTHS_2023[activeMonth2023 - 1]} ayına geri alındı.`);
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Önceki Ay
                  </button>
                )}
                {activeMonth2023 < 11 ? (
                  <button
                    id="btn-next-month"
                    onClick={() => {
                      onSetActiveMonth2023(activeMonth2023 + 1);
                      triggerNotification(`Simülasyon ${MONTHS_2023[activeMonth2023 + 1]} ayına ilerletildi!`);
                      onAddXp(50);
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-550 hover:to-indigo-550 text-white font-black rounded-xl text-xs transition-all shadow-md shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-1 hover:-translate-y-0.5 duration-150"
                  >
                    Sonraki Ay
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id="btn-restart-year"
                    onClick={() => {
                      onSetActiveMonth2023(0);
                      triggerNotification(`Simülasyon Ocak 2023 tarihinden yeniden başlatıldı.`);
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Baştan Başla
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-900/50 flex items-center gap-2.5 text-[11px] text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              <span>Canlı modda hisseler her 5 saniyede bir rastgele dalgalanır. Gerçekçi 2023 verileri ve grafikleri görmek için <strong>2023 Tarihsel</strong> modunu seçin.</span>
            </div>
          )}
        </div>

        {/* Live Stocks List - High Fidelity 2-Column Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="stocks-list">
          {stocks.map(stk => {
            const portfolioHolding = portfolio.find(p => p.symbol === stk.symbol);
            const isUp = stk.change >= 0;
            return (
              <div
                key={stk.symbol}
                id={`stock-row-${stk.symbol}`}
                onClick={() => setTradeModalStock(stk)}
                className="bg-[#0f172a] hover:bg-slate-900 border border-blue-500/10 hover:border-blue-500/30 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer group shadow-[0_0_12px_rgba(59,130,246,0.03)] hover:shadow-[0_0_15px_rgba(59,130,246,0.12)] duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-xs text-blue-400">
                    {stk.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-white group-hover:text-blue-400 transition-colors">
                        {stk.symbol}
                      </h4>
                      {portfolioHolding && portfolioHolding.shares > 0 && (
                        <span className="text-[9px] font-extrabold tracking-wider bg-blue-600/20 border border-blue-500/30 text-blue-400 px-1.5 py-0.5 rounded-md">
                          {portfolioHolding.shares} Adet
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{stk.name}</p>
                  </div>
                </div>

                {/* Sparkling SVG 2023 Trend Sparkline */}
                <div className="hidden xs:block">
                  <StockSparkline symbol={stk.symbol} prices={HISTORICAL_STOCKS_2023[stk.symbol]} />
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-white">
                    {stk.price.toFixed(2)} TL
                  </span>
                  <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? '+' : ''}{stk.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portfolio Valuation Summary widget */}
        {portfolio.length > 0 && (
          <div className="bg-slate-900/40 border border-blue-500/10 rounded-2xl p-5 flex justify-between items-center mt-6 shadow-[0_0_15px_rgba(59,130,246,0.05)]" id="portfolio-val-card">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sanal Portföy Değeri</span>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                {portfolioValuation.toFixed(2)} TL
              </p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Hisseleriniz</span>
              <p className="text-xs font-mono text-slate-300">
                {portfolio.filter(p => p.shares > 0).map(p => `${p.symbol} (${p.shares})`).join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sanal Harcama Ekle Modal */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="expense-modal">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative">
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold font-display text-white">Harcama Simüle Et</h3>
                <button
                  id="btn-close-expense-modal"
                  onClick={() => setExpenseModalOpen(false)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleExpenseSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Harcama Başlığı</label>
                  <input 
                    type="text" 
                    placeholder="Örn: Market Harcaması, Kira" 
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Harcama Tutarı (TL)</label>
                  <input 
                    type="number" 
                    placeholder="Tutar girin" 
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Kategori</label>
                  <select 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors"
                  >
                    <option value="Market">Market</option>
                    <option value="Kira">Kira</option>
                    <option value="Fatura">Fatura</option>
                    <option value="Ulaşım">Ulaşım</option>
                    <option value="Eğlence">Eğlence</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    id="btn-cancel-expense"
                    onClick={() => setExpenseModalOpen(false)}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-slate-400 font-semibold rounded-xl text-xs border border-slate-800 transition-all cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    id="btn-save-expense"
                    className="flex-[2] py-3 bg-blue-600 hover:bg-blue-550 active:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stock Transaction Modal */}
      {tradeModalStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="trade-modal">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative animate-scale-up">
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold font-display text-white">{tradeModalStock.symbol} İşlemi</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tradeModalStock.name}</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-mono font-bold text-blue-400">{tradeModalStock.price.toFixed(2)} TL</span>
                </div>
              </div>

              {/* Dynamic 2023 Area Chart */}
              <StockAreaChart 
                symbol={tradeModalStock.symbol} 
                prices={HISTORICAL_STOCKS_2023[tradeModalStock.symbol]} 
                activeIndex={simulationMode === 'historical' ? activeMonth2023 : 11} 
              />

              <hr className="border-slate-850" />

              <div className="space-y-2 text-xs text-slate-400" id="trade-holding-info">
                <div className="flex justify-between">
                  <span>Borsa Nakit:</span>
                  <span className="text-white font-semibold">{borsaNakit.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Harcayabilir Limit (Kalan Bütçe):</span>
                  <span className="text-white font-semibold">{kalanLimit} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Portföyünüzde:</span>
                  <span className="text-blue-400 font-bold">
                    {portfolio.find(p => p.symbol === tradeModalStock.symbol)?.shares || 0} Adet
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">Miktar (Adet)</label>
                <input 
                  type="number" 
                  min="1" 
                  placeholder="Satın alınacak/satılacak miktar" 
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 outline-none transition-colors"
                  required
                />
              </div>

              {/* Total Calculation */}
              {tradeAmount && !isNaN(parseInt(tradeAmount, 10)) && parseInt(tradeAmount, 10) > 0 && (
                <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex justify-between items-center" id="trade-total-display">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Toplam Tutar:</span>
                  <span className="text-sm font-extrabold text-yellow-500 font-display">
                    {(parseInt(tradeAmount, 10) * tradeModalStock.price).toFixed(2)} TL
                  </span>
                </div>
              )}

              {/* Form Action Controls */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  id="btn-cancel-trade"
                  onClick={() => {
                    setTradeModalStock(null);
                    setTradeAmount('');
                  }}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-400 font-semibold rounded-xl text-xs border border-slate-800 transition-all cursor-pointer text-center"
                >
                  İptal
                </button>
                <button
                  type="button"
                  id="btn-sell-stock"
                  onClick={() => handleTradeSubmit('SAT')}
                  className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-755 text-red-400 font-bold rounded-xl text-xs transition-all border border-red-500/10 cursor-pointer text-center"
                >
                  SAT
                </button>
                <button
                  type="button"
                  id="btn-buy-stock"
                  onClick={() => handleTradeSubmit('AL')}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-550 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/10 cursor-pointer text-center"
                >
                  AL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
