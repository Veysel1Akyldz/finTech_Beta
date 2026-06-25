export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number; // percentage change, e.g. 2.45 or -1.40
}

export interface PortfolioItem {
  symbol: string;
  shares: number;
  avgBuyPrice: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Market' | 'Kira' | 'Fatura' | 'Ulaşım' | 'Eğlence' | 'Diğer';
  date: string;
}

export interface Flashcard {
  id: string;
  category: 'Bütçe' | 'Tasarruf' | 'Yatırım' | 'Risk Yönetimi';
  question: string;
  answer: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'Bütçe' | 'Yatırım' | 'Tasarruf' | 'Genel';
  xpReward: number;
  completed: boolean;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  description: string;
  minLabel: string;
  maxLabel: string;
  iconName: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: string;
}
