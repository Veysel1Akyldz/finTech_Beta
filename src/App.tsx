import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RotateCw, 
  GraduationCap, 
  Trophy, 
  Building, 
  Sparkles, 
  CheckCircle, 
  X,
  Award,
  BookOpen,
  HelpCircle,
  Activity,
  Heart,
  Flame
} from 'lucide-react';
import { Stock, PortfolioItem, Expense, Quest } from './types';
import { INITIAL_STOCKS, INITIAL_QUESTS, HISTORICAL_STOCKS_2023, MONTHS_2023 } from './data';
import AssessmentView from './components/AssessmentView';
import QuestsView from './components/QuestsView';
import PracticeView from './components/PracticeView';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'Öğren' | 'Kazan' | 'Uygula'>('Öğren');

  // Core User State with safe localStorage recovery and backend sync
  const safeStorage = {
    getItem: (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.warn("Storage read failed, falling back to null:", e);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn("Storage write failed:", e);
      }
    }
  };

  const [backendLoading, setBackendLoading] = useState<boolean>(true);

  const [healthScore, setHealthScore] = useState<number | null>(() => {
    const saved = safeStorage.getItem('finquest_health_score');
    return saved ? parseInt(saved, 10) : null;
  });

  const [level, setLevel] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_streak');
    return saved ? parseInt(saved, 10) : 3; // Starts at 3 days streak as shown in screenshot
  });

  const [monthlyBudget, setMonthlyBudget] = useState<number>(6000); // 6000 TL from screenshot

  const [borsaNakit, setBorsaNakit] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_borsa_nakit');
    return saved ? parseFloat(saved) : 3000.00; // 3000 TL from screenshot
  });

  const [integratedSystem, setIntegratedSystem] = useState<boolean>(() => {
    const saved = safeStorage.getItem('finquest_integrated');
    return saved ? saved === 'true' : true;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = safeStorage.getItem('finquest_expenses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Initial seeded expenses from screenshot
    return [
      { id: 'e1', title: 'Kira Harcaması', amount: 500, category: 'Kira', date: 'Dün' },
      { id: 'e2', title: 'Market Harcaması', amount: 150, category: 'Market', date: 'Bugün' }
    ];
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = safeStorage.getItem('finquest_portfolio');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = safeStorage.getItem('finquest_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_QUESTS;
  });

  const [dailyRewardCollected, setDailyRewardCollected] = useState<boolean>(() => {
    const saved = safeStorage.getItem('finquest_daily_collected');
    return saved ? saved === 'true' : false;
  });

  const [stocks, setStocks] = useState<Stock[]>(() => {
    const saved = safeStorage.getItem('finquest_stocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_STOCKS;
  });

  const [gems, setGems] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_gems');
    return saved ? parseInt(saved, 10) : 150;
  });

  const [hearts, setHearts] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_hearts');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = safeStorage.getItem('finquest_completed_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [activeBadge, setActiveBadge] = useState<string>(() => {
    const saved = safeStorage.getItem('finquest_active_badge');
    return saved || 'Standart';
  });

  const [simulationMode, setSimulationMode] = useState<'live' | 'historical'>(() => {
    const saved = safeStorage.getItem('finquest_sim_mode');
    return (saved as 'live' | 'historical') || 'historical';
  });

  const [activeMonth2023, setActiveMonth2023] = useState<number>(() => {
    const saved = safeStorage.getItem('finquest_active_month');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Level-up notification
  const [levelUpAlert, setLevelUpAlert] = useState<number | null>(null);
  const [spinRefresh, setSpinRefresh] = useState(false);

  // Fetch initial state from backend on mount
  useEffect(() => {
    fetch('/api/state')
      .then(res => {
        if (!res.ok) throw new Error("Backend load failed");
        return res.json();
      })
      .then(data => {
        if (data) {
          if (data.healthScore !== undefined) setHealthScore(data.healthScore);
          if (data.level !== undefined) setLevel(data.level);
          if (data.xp !== undefined) setXp(data.xp);
          if (data.streak !== undefined) setStreak(data.streak);
          if (data.gems !== undefined) setGems(data.gems);
          if (data.hearts !== undefined) setHearts(data.hearts);
          if (data.completedLessons !== undefined) setCompletedLessons(data.completedLessons);
          if (data.expenses !== undefined) setExpenses(data.expenses);
          if (data.portfolio !== undefined) setPortfolio(data.portfolio);
          if (data.quests !== undefined) setQuests(data.quests);
          if (data.dailyRewardCollected !== undefined) setDailyRewardCollected(data.dailyRewardCollected);
          if (data.activeBadge !== undefined) setActiveBadge(data.activeBadge);
          if (data.simulationMode !== undefined) setSimulationMode(data.simulationMode);
          if (data.activeMonth2023 !== undefined) setActiveMonth2023(data.activeMonth2023);
          if (data.borsaNakit !== undefined) setBorsaNakit(data.borsaNakit);
          if (data.integratedSystem !== undefined) setIntegratedSystem(data.integratedSystem);
          if (data.stocks !== undefined) setStocks(data.stocks);
        }
        setBackendLoading(false);
      })
      .catch(err => {
        console.error("Could not load state from backend:", err);
        setBackendLoading(false);
      });
  }, []);

  // Sync state to localStorage & backend on modification
  useEffect(() => {
    if (backendLoading) return; // Guard: don't overwrite server state during initial load

    const stateToSave = {
      healthScore,
      level,
      xp,
      streak,
      gems,
      hearts,
      completedLessons,
      expenses,
      portfolio,
      quests,
      dailyRewardCollected,
      activeBadge,
      simulationMode,
      activeMonth2023,
      borsaNakit,
      integratedSystem,
      stocks
    };

    // Debounce save to backend
    const timeoutId = setTimeout(() => {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stateToSave)
      }).catch(err => console.error("Could not save state to backend:", err));
    }, 600);

    // Sync to local storage
    safeStorage.setItem('finquest_health_score', healthScore !== null ? healthScore.toString() : '');
    safeStorage.setItem('finquest_level', level.toString());
    safeStorage.setItem('finquest_xp', xp.toString());
    safeStorage.setItem('finquest_streak', streak.toString());
    safeStorage.setItem('finquest_borsa_nakit', borsaNakit.toString());
    safeStorage.setItem('finquest_integrated', integratedSystem.toString());
    safeStorage.setItem('finquest_expenses', JSON.stringify(expenses));
    safeStorage.setItem('finquest_portfolio', JSON.stringify(portfolio));
    safeStorage.setItem('finquest_quests', JSON.stringify(quests));
    safeStorage.setItem('finquest_daily_collected', dailyRewardCollected.toString());
    safeStorage.setItem('finquest_stocks', JSON.stringify(stocks));
    safeStorage.setItem('finquest_sim_mode', simulationMode);
    safeStorage.setItem('finquest_active_month', activeMonth2023.toString());
    safeStorage.setItem('finquest_gems', gems.toString());
    safeStorage.setItem('finquest_hearts', hearts.toString());
    safeStorage.setItem('finquest_completed_lessons', JSON.stringify(completedLessons));
    safeStorage.setItem('finquest_active_badge', activeBadge);

    return () => clearTimeout(timeoutId);
  }, [healthScore, level, xp, streak, borsaNakit, integratedSystem, expenses, portfolio, quests, dailyRewardCollected, stocks, simulationMode, activeMonth2023, gems, hearts, completedLessons, activeBadge, backendLoading]);

  // Update stock prices based on the selected mode / month
  useEffect(() => {
    if (simulationMode === 'historical') {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          const histPrices = HISTORICAL_STOCKS_2023[stock.symbol];
          if (!histPrices) return stock;
          const currentPrice = histPrices[activeMonth2023];
          
          let change = 0;
          if (activeMonth2023 > 0) {
            const prevPrice = histPrices[activeMonth2023 - 1];
            change = ((currentPrice - prevPrice) / prevPrice) * 100;
          } else {
            change = 0;
          }

          return {
            ...stock,
            price: currentPrice,
            change: parseFloat(change.toFixed(2))
          };
        });
      });
    }
  }, [simulationMode, activeMonth2023]);

  // Simulated Live stock fluctuation engine (every 5 seconds)
  useEffect(() => {
    if (simulationMode !== 'live') return;

    const interval = setInterval(() => {
      setStocks(prevStocks => {
        return prevStocks.map(stock => {
          // Fluctuates slightly between -2.5% and +2.5%
          const pct = (Math.random() * 5 - 2.5) / 100;
          const delta = stock.price * pct;
          const newPrice = Math.max(stock.price + delta, 1.00);
          
          // Accumulate daily change
          const newChange = stock.change + pct * 100;

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2))
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [simulationMode]);

  // XP addition function with Level Up progression logic
  const addXp = (amount: number, questId?: string) => {
    let questAlreadyCompleted = false;
    let updatedQuests = [...quests];

    if (questId) {
      updatedQuests = quests.map(q => {
        if (q.id === questId) {
          if (q.completed) {
            questAlreadyCompleted = true;
          }
          return { ...q, completed: true };
        }
        return q;
      });
    }

    if (questId && questAlreadyCompleted) return; // Do not reward duplicate XP

    if (questId) {
      setQuests(updatedQuests);
    }

    let tempXp = xp + amount;
    let tempLevel = level;
    let xpLimit = tempLevel * 500;

    while (tempXp >= xpLimit) {
      tempXp -= xpLimit;
      tempLevel += 1;
      setLevelUpAlert(tempLevel);
      xpLimit = tempLevel * 500;
    }

    setXp(tempXp);
    setLevel(tempLevel);
  };

  const handleManualPriceFluctuation = () => {
    setSpinRefresh(true);
    setTimeout(() => setSpinRefresh(false), 600);

    // Forces a manual stock market refresh
    setStocks(prevStocks => {
      return prevStocks.map(stock => {
        const pct = (Math.random() * 6 - 3.0) / 100;
        const delta = stock.price * pct;
        const newPrice = Math.max(stock.price + delta, 1.00);
        const newChange = stock.change + pct * 100;
        return {
          ...stock,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(newChange.toFixed(2))
        };
      });
    });
  };

  // Quest Completers
  const completeQuestInPool = (id: string) => {
    const q = quests.find(item => item.id === id);
    if (q && !q.completed) {
      addXp(q.xpReward, id);
    }
  };

  const collectDailyReward = () => {
    setDailyRewardCollected(true);
    setStreak(prev => prev + 1);
  };

  // Adding simulated cash expenses
  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      id: `e_${Date.now()}`,
      title: expenseData.title,
      amount: expenseData.amount,
      category: expenseData.category,
      date: 'Bugün'
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  // Stock trading engine
  const handleBuyStock = (symbol: string, shares: number, price: number): boolean => {
    const cost = shares * price;
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetLimit = monthlyBudget - totalSpent;

    if (integratedSystem) {
      // Draw from borsaNakit first, if insufficient, draw from monthlyBudget remaining limit
      if (borsaNakit >= cost) {
        setBorsaNakit(prev => prev - cost);
      } else if (borsaNakit + budgetLimit >= cost) {
        const remCost = cost - borsaNakit;
        setBorsaNakit(0);
        // Record as an external investment expense to deduct from monthly budget
        handleAddExpense({
          title: `${shares}x ${symbol} Hisse Yatırımı`,
          amount: remCost,
          category: 'Diğer'
        });
      } else {
        return false; // Insufficient cash + budget limits
      }
    } else {
      // Draw strictly from borsaNakit
      if (borsaNakit >= cost) {
        setBorsaNakit(prev => prev - cost);
      } else {
        return false;
      }
    }

    // Add to portfolio
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === symbol);
      if (existing) {
        const totalShares = existing.shares + shares;
        const avgBuy = (existing.shares * existing.avgBuyPrice + shares * price) / totalShares;
        return prev.map(p => p.symbol === symbol ? { ...p, shares: totalShares, avgBuyPrice: avgBuy } : p);
      }
      return [...prev, { symbol, shares, avgBuyPrice: price }];
    });

    return true;
  };

  const handleSellStock = (symbol: string, shares: number, price: number): boolean => {
    const existing = portfolio.find(p => p.symbol === symbol);
    if (!existing || existing.shares < shares) {
      return false; // Not enough shares
    }

    const revenue = shares * price;
    setBorsaNakit(prev => prev + revenue);

    // Update shares
    setPortfolio(prev => {
      return prev.map(p => {
        if (p.symbol === symbol) {
          return { ...p, shares: p.shares - shares };
        }
        return p;
      }).filter(p => p.shares > 0);
    });

    return true;
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans" id="app-root-container">
      
      {/* Header Panel with Duolingo-style Widgets */}
      <header className="sticky top-0 z-40 bg-[#070b13]/90 backdrop-blur-md border-b border-slate-900/60 py-3 px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-lg" id="app-header">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0">
              <Activity className="w-5 h-5 animate-pulse text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black font-display text-white tracking-tight leading-none">FinQuest</h1>
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black tracking-wide">
                  FLUTTER BETA
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">
                SÜDEV Takımı • ID: 925598
              </span>
            </div>
          </div>

          {/* Action refresh on mobile */}
          <button
            id="btn-global-refresh"
            onClick={handleManualPriceFluctuation}
            className="sm:hidden w-8 h-8 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fiyatları Güncelle"
          >
            <RotateCw className={`w-3.5 h-3.5 ${spinRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Duolingo Global Live Status Row */}
        <div className="flex items-center gap-3.5 bg-slate-950/60 border border-slate-850 px-4 py-1.5 rounded-2xl w-full sm:w-auto justify-around sm:justify-start" id="duo-header-status-row">
          {/* Level Badge */}
          <div className="flex items-center gap-1.5" title="Mevcut Seviyeniz">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-mono font-black text-amber-400">Lvl {level}</span>
          </div>

          {/* XP Progress Bar */}
          <div className="hidden xs:block w-16 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5" title="XP Seviye İlerlemesi">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((xp / (level * 500)) * 100, 100)}%` }}
            />
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1" title="Günlük Seri">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/10 animate-bounce" />
            <span className="text-[11px] font-mono font-black text-orange-400">{streak} Gün</span>
          </div>

          {/* Gems Wallet */}
          <div className="flex items-center gap-1" title="Mevcut Elmaslarınız">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-[11px] font-mono font-black text-indigo-300">{gems} 💎</span>
          </div>

          {/* Hearts / Lives */}
          <div className="flex items-center gap-1" title="Kalan Can">
            <Heart className={`w-4 h-4 ${hearts > 0 ? 'text-rose-500 fill-rose-500/20' : 'text-slate-600'}`} />
            <span className="text-[11px] font-mono font-black text-rose-400">{hearts}/3</span>
          </div>

          {/* Active Badge / Title */}
          {activeBadge !== 'Standart' && (
            <div className="hidden md:flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              <span className="text-[8px] font-extrabold text-amber-400 uppercase tracking-wider">{activeBadge}</span>
            </div>
          )}

          {/* Action refresh on desktop */}
          <button
            id="btn-global-refresh-desktop"
            onClick={handleManualPriceFluctuation}
            className="hidden sm:flex w-7 h-7 rounded-lg bg-slate-900/30 border border-slate-800/80 items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Fiyatları Güncelle"
          >
            <RotateCw className={`w-3.5 h-3.5 ${spinRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto py-6 px-2 overflow-y-auto" id="app-main-content">
        {activeTab === 'Öğren' && (
          <AssessmentView 
            onAssessmentCompleted={setHealthScore} 
            savedScore={healthScore}
            onAddXp={addXp}
            gems={gems}
            setGems={setGems}
            hearts={hearts}
            setHearts={setHearts}
            completedLessons={completedLessons}
            setCompletedLessons={setCompletedLessons}
            level={level}
            streak={streak}
          />
        )}
        {activeTab === 'Kazan' && (
          <QuestsView 
            xp={xp}
            level={level}
            streak={streak}
            quests={quests}
            onCompleteQuest={completeQuestInPool}
            onAddXp={addXp}
            dailyRewardCollected={dailyRewardCollected}
            onCollectDailyReward={collectDailyReward}
            gems={gems}
            setGems={setGems}
            hearts={hearts}
            setHearts={setHearts}
            activeBadge={activeBadge}
            setActiveBadge={setActiveBadge}
          />
        )}
        {activeTab === 'Uygula' && (
          <PracticeView 
            stocks={stocks}
            portfolio={portfolio}
            expenses={expenses}
            monthlyBudget={monthlyBudget}
            borsaNakit={borsaNakit}
            integratedSystem={integratedSystem}
            onSetIntegratedSystem={setIntegratedSystem}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
            onBuyStock={handleBuyStock}
            onSellStock={handleSellStock}
            onAddXp={addXp}
            simulationMode={simulationMode}
            onSetSimulationMode={setSimulationMode}
            activeMonth2023={activeMonth2023}
            onSetActiveMonth2023={setActiveMonth2023}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Bar */}
      <footer className="sticky bottom-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-850 py-2.5 px-6" id="app-footer-nav">
        <div className="max-w-md mx-auto flex justify-between items-center gap-1">
          {/* Tab 1: Öğren */}
          <button
            id="tab-btn-learn"
            onClick={() => setActiveTab('Öğren')}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'Öğren' 
                ? 'text-blue-400 font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <GraduationCap className={`w-5.5 h-5.5 ${activeTab === 'Öğren' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-wide font-medium">Öğren</span>
          </button>

          {/* Tab 2: Kazan */}
          <button
            id="tab-btn-earn"
            onClick={() => setActiveTab('Kazan')}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'Kazan' 
                ? 'text-amber-400 font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <Trophy className={`w-5.5 h-5.5 ${activeTab === 'Kazan' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-wide font-medium">Kazan</span>
          </button>

          {/* Tab 3: Uygula */}
          <button
            id="tab-btn-practice"
            onClick={() => setActiveTab('Uygula')}
            className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'Uygula' 
                ? 'text-emerald-400 font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            <Building className={`w-5.5 h-5.5 ${activeTab === 'Uygula' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-wide font-medium">Uygula</span>
          </button>
        </div>
      </footer>

      {/* Level-Up Modal Overlay */}
      {levelUpAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="levelup-alert-modal">
          <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl max-w-xs w-full overflow-hidden shadow-2xl relative text-center p-6 space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Sparkles className="w-8 h-8 animate-bounce" />
            </div>

            <span className="text-[9px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Tebrikler!
            </span>

            <h3 className="text-lg font-bold font-display text-white">
              Seviye Atladınız!
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Finansal okuryazarlık yolculuğunda yeni başarılar kazandınız. Artık rütbeniz <strong className="text-amber-400">Seviye {levelUpAlert}</strong>!
            </p>

            <button
              id="btn-close-levelup"
              onClick={() => setLevelUpAlert(null)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-550 active:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Keşfetmeye Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
