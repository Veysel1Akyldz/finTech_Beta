import React, { useState } from 'react';
import { 
  Wallet, 
  ShoppingBag, 
  PiggyBank, 
  TrendingDown, 
  TrendingUp, 
  Brain, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Sparkles, 
  Award,
  ChevronRight,
  Clock,
  HeartPulse,
  Info,
  Heart,
  X,
  Flame,
  Volume2,
  VolumeX,
  Trophy,
  Lock,
  Compass
} from 'lucide-react';
import { AssessmentQuestion, Flashcard, Article } from '../types';
import { ASSESSMENT_QUESTIONS, FLASHCARDS, ARTICLES } from '../data';

interface AssessmentViewProps {
  onAssessmentCompleted: (score: number) => void;
  savedScore: number | null;
  onAddXp: (amount: number, questId?: string) => void;
  gems: number;
  setGems: React.Dispatch<React.SetStateAction<number>>;
  hearts: number;
  setHearts: React.Dispatch<React.SetStateAction<number>>;
  completedLessons: string[];
  setCompletedLessons: React.Dispatch<React.SetStateAction<string[]>>;
  level: number;
  streak: number;
}

interface LessonNode {
  id: string;
  title: string;
  shortDesc: string;
  category: 'Bütçe' | 'Tasarruf' | 'Yatırım' | 'Risk Yönetimi';
  icon: any;
  colorClass: string;
  unit: number;
  questions: {
    question: string;
    options: string[];
    correctIdx: number;
    tip: string;
    explanation: string;
  }[];
}

// Duolingo Lessons Configuration
const DUOLINGO_LESSONS: LessonNode[] = [
  {
    id: 'l1',
    title: 'Bütçe Nedir?',
    shortDesc: 'Gelir ve gider dengesini kurmayı öğrenin.',
    category: 'Bütçe',
    icon: Wallet,
    colorClass: 'bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-600',
    unit: 1,
    questions: [
      {
        question: "50/30/20 bütçe kuralında %30'luk dilim neyi temsil eder?",
        options: [
          "Zorunlu ihtiyaçlar (Kira, Faturalar, Gıda)",
          "İstekler ve Sosyal Giderler (Tatil, Eğlence, Hobi)",
          "Uzun vadeli birikim ve acil durum yatırımları"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Bu kural, bütçenizi esnek tutmanızı sağlar.",
        explanation: "%30'luk dilim isteklere ayrılır. %50 ihtiyaçlar, %20 ise birikimlerdir."
      },
      {
        question: "Gelirinizden daha fazla harcama yaptığınızda ne olur?",
        options: [
          "Finansal özgürlüğünüz anında artar",
          "Bütçe açığı oluşur ve borç sarmalına girersiniz",
          "Kredi notunuz otomatik olarak yükselir"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Sürekli eksi bakiye vermek bir alarm durumudur.",
        explanation: "Gelirden fazla harcamak bütçe açığına ve borç sarmalına sebep olur."
      },
      {
        question: "Bütçe yapmanın bir numaralı amacı nedir?",
        options: [
          "Tüm harcamaları sıfıra indirip hiç para harcamamak",
          "Paranın kontrolünü ele alıp nereye gideceğine önceden karar vermek",
          "En pahalı hisseleri hemen satın alabilmek"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Nereye harcandığını bilmediğiniz parayı yönetemezsiniz.",
        explanation: "Bütçe yapmak paranız üzerinde tam kontrol sağlar ve hedeflerinize ulaştırır."
      }
    ]
  },
  {
    id: 'l2',
    title: 'Acil Durum Fonu',
    shortDesc: 'Beklenmedik krizlere karşı finansal kalkan oluşturun.',
    category: 'Tasarruf',
    icon: PiggyBank,
    colorClass: 'bg-blue-500 text-white shadow-blue-500/30 border-blue-600',
    unit: 1,
    questions: [
      {
        question: "Acil durum fonu ideal olarak ne kadarlık bir birikim olmalıdır?",
        options: [
          "Yalnızca 1 haftalık market alışverişi kadar",
          "En az 3 ila 6 aylık temel yaşam giderleriniz kadar",
          "Yaklaşık 5 yıllık toplam maaşınız kadar"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: İş kaybı veya sağlık sorunlarında bu kalkan hayat kurtarır.",
        explanation: "3-6 aylık temel giderler, beklenmedik kriz durumları için güvenli limandır."
      },
      {
        question: "Hangisi acil durum fonu kullanılarak karşılanması uygun bir durumdur?",
        options: [
          "Yeni çıkan son model akıllı telefonu almak",
          "Beklenmedik acil diş ameliyatı masrafı",
          "Arkadaşınızın doğum gününde lüks bir hediye almak"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: İstekler ile acil ihtiyaçları karıştırmamalısınız.",
        explanation: "Sağlık, kaza ve iş kaybı gibi beklenmeyen durumlar acil durum fonu kapsamındadır."
      },
      {
        question: "Acil durum fonundaki nakit nerede saklanmalıdır?",
        options: [
          "Hızlıca ulaşılabilen, risksiz ve likit bir hesapta",
          "Borsada yüksek riskli, satılması günler sürecek hisselerde",
          "Kilitli altın kasalarında"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: İhtiyaç anında paraya erişim saniyeler sürmelidir.",
        explanation: "Likit ve risksiz bir hesapta tutulması, kriz anında nakde hızlı erişim sağlar."
      }
    ]
  },
  {
    id: 'l3',
    title: '50/30/20 Kuralı',
    shortDesc: 'Gelirinizi bilimsel oranlarla bölüştürün.',
    category: 'Bütçe',
    icon: ShoppingBag,
    colorClass: 'bg-amber-500 text-white shadow-amber-500/30 border-amber-600',
    unit: 1,
    questions: [
      {
        question: "50/30/20 kuralında %50'lik dilim hangi harcamaları kapsar?",
        options: [
          "Kira, faturalar ve temel gıda gibi kaçınılmaz ihtiyaçlar",
          "Yatırım fonları ve bireysel emeklilik ödemeleri",
          "Hafta sonu tatilleri ve dışarıda yemek"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: İhtiyaçlar, yaşamınızı idame ettirmeniz için zorunludur.",
        explanation: "%50'lik en büyük dilim barınma, fatura, temel gıda gibi zorunlu ihtiyaçlara gider."
      },
      {
        question: "Aylık 10.000 TL geliriniz varsa, bu kurala göre birikime (tasarruf) ne kadar ayırmalısınız?",
        options: [
          "5.000 TL (%50)",
          "3.000 TL (%30)",
          "2.000 TL (%20)"
        ],
        correctIdx: 2,
        tip: "Duo İpucu: %20'lik kısım gelecekteki sizi inşa eder.",
        explanation: "10.000 TL'nin %20'si olan 2.000 TL birikim, yatırım veya borç ödemeye gitmelidir."
      },
      {
        question: "Bütçe yaparken 'istekler' kısmını tamamen sıfırlamak neden önerilmez?",
        options: [
          "Psikolojik yorgunluğa sebep olur ve bütçe disiplinini bozabilir",
          "Devlet tarafından yasal olarak yasaklanmıştır",
          "Paranın değerini kaybetmesine sebep olur"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: Finansal diyet de normal diyet gibidir, katı olunca bozulur.",
        explanation: "Hayattan keyif almayı sıfırlamak bütçe motivasyonunu kırar. Önemli olan oranı %30'da sınırlamaktır."
      }
    ]
  },
  {
    id: 'l4',
    title: 'Bileşik Getiri',
    shortDesc: 'Paranızın sizin için kartopu gibi büyümesini izleyin.',
    category: 'Yatırım',
    icon: TrendingUp,
    colorClass: 'bg-purple-500 text-white shadow-purple-500/30 border-purple-600',
    unit: 2,
    questions: [
      {
        question: "Bileşik getiri tam olarak neyi ifade eder?",
        options: [
          "Yalnızca ana paranın getirdiği faiz kazancını",
          "Kazanılan kârın da ana paraya eklenerek tekrar kâr üretmesi",
          "Yatırımın her ay yarı yarıya değer kaybetmesini"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Kârın kârı! Kartopu etkisi gibidir.",
        explanation: "Kazanılan kârlar yatırıma geri dönüştürüldükçe, toplam bakiye geometrik hızla artar."
      },
      {
        question: "Albert Einstein bileşik getiri için hangi ünvanı layık görmüştür?",
        options: [
          "Dünyanın Sekizinci Harikası",
          "İnsanlığın En Büyük Hatası",
          "Matematiğin Kolay Oyunu"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: Onu anlayan kazanır, anlamayan bedelini öder.",
        explanation: "Einstein, bileşik getirinin inanılmaz geometrik gücünü 'Dünyanın Sekizinci Harikası' olarak adlandırmıştır."
      },
      {
        question: "Bileşik getirinin en büyük dostu aşağıdakilerden hangisidir?",
        options: [
          "Çok yüksek komisyon oranları",
          "Zaman ve Sabır (Uzun Vade)",
          "Günlük spekülatif al-sat işlemleri"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Süre ne kadar uzarsa kartopu o kadar büyür.",
        explanation: "Zaman bileşik getirinin yakıtıdır. Yıllar geçtikçe büyüme hızı katlanarak artar."
      }
    ]
  },
  {
    id: 'l5',
    title: 'Hisse Senedi Nedir?',
    shortDesc: 'Dev şirketlerin büyümesine nasıl ortak olursunuz?',
    category: 'Yatırım',
    icon: Brain,
    colorClass: 'bg-indigo-500 text-white shadow-indigo-500/30 border-indigo-600',
    unit: 2,
    questions: [
      {
        question: "Bir şirketin hisse senedini aldığınızda aslında ne yapmış olursunuz?",
        options: [
          "Şirkete geri ödenmek üzere borç para vermiş olursunuz",
          "Şirketin kârına ve geleceğine belli oranda ortak olursunuz",
          "Şirketin tüm yönetim haklarını tek başınıza devralırsınız"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Artık o markanın tabelasına 'ortak' gözüyle bakabilirsiniz.",
        explanation: "Hisse senedi, bir şirketin mülkiyet payını temsil eder; ortaklık hakkı verir."
      },
      {
        question: "Temettü (Kâr Payı) ne anlama gelir?",
        options: [
          "Şirketin kazandığı kârın bir kısmını hissedarlarına nakit ödemesi",
          "Hisse senedinin borsadan tamamen kaldırılması",
          "Yatırımcının devlete ödediği özel borsa vergisi"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: Düzenli temettü ödeyen şirketler pasif gelir üretir.",
        explanation: "Temettü, şirketlerin ürettikleri kârı ortaklarıyla nakit olarak paylaşmasıdır."
      },
      {
        question: "Tüm paranızla tek bir şirketin hissesini almak neden risklidir?",
        options: [
          "Şirket kötü giderse tüm birikiminizin büyük zarar görme ihtimali vardır",
          "Yasal olarak borsada tek bir hisse tutmak suçtur",
          "Hisse senedi transfer ücretleri çok yüksek olur"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: Tüm yumurtaları aynı sepete koymamalıyız.",
        explanation: "Tek hisseye yatırım yapmak risk yoğunlaşmasına sebep olur. Diversifikasyon (çeşitlendirme) riski dağıtır."
      }
    ]
  },
  {
    id: 'l6',
    title: 'Çeşitlendirme',
    shortDesc: 'Tüm yumurtaları aynı sepete koymamayı öğrenin.',
    category: 'Risk Yönetimi',
    icon: Compass,
    colorClass: 'bg-teal-500 text-white shadow-teal-500/30 border-teal-600',
    unit: 3,
    questions: [
      {
        question: "Çeşitlendirme (Diversifikasyon) yapmanın temel amacı nedir?",
        options: [
          "Bütün yatırım fırsatlarını tamamen engellemek",
          "Tek bir varlıktaki risk yoğunlaşmasını azaltarak portföyü korumak",
          "Borsa komisyon oranlarını sıfıra indirmek"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Tek bir hissenin düşüşü sizi batırmasın diye riski dağıtırız.",
        explanation: "Çeşitlendirme, yatırımları farklı varlık sınıflarına bölerek toplam riski azaltır."
      },
      {
        question: "Dengeli bir çeşitlendirilmiş sepet aşağıdakilerden hangisini içerebilir?",
        options: [
          "Yalnızca tek bir şirketin tüm vadeli opsiyonlarını",
          "Hisse senedi, altın, eurobond ve bir miktar nakit karışımı",
          "Farklı hesaplardan alınmış aynı şirketin hisselerini"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Farklı yatırım araçları farklı ekonomik koşullarda yükselir.",
        explanation: "Farklı korelasyona sahip varlıkları bir arada tutmak güvenli büyümeyi destekler."
      }
    ]
  },
  {
    id: 'l7',
    title: 'Risk ve Enflasyon',
    shortDesc: 'Enflasyona karşı birikimlerinizi nasıl korursunuz?',
    category: 'Risk Yönetimi',
    icon: HeartPulse,
    colorClass: 'bg-rose-500 text-white shadow-rose-500/30 border-rose-600',
    unit: 3,
    questions: [
      {
        question: "Enflasyonun yüksek olduğu bir ortamda nakit parayı doğrudan tutmak neye sebep olur?",
        options: [
          "Paranın satın alma gücünün zamanla erimesine",
          "Paranın değerinin kendiliğinden katlanarak artmasına",
          "Kredi kartı limitlerinin yükselmesine"
        ],
        correctIdx: 0,
        tip: "Duo İpucu: Fiyatlar artarken nakit para değer kaybeder.",
        explanation: "Yüksek enflasyon, paranın reel değerini düşürür. Bu yüzden yatırım araçları ile korumak gerekir."
      },
      {
        question: "Risk toleransı nedir?",
        options: [
          "Yatırım yaparken ödenen işlem vergisi oranıdır",
          "Bir yatırımcının kayıp ihtimalleri karşısında sergileyebileceği psikolojik ve finansal dayanıklılık sınırıdır",
          "Borsada kazanılan toplam kâr miktarıdır"
        ],
        correctIdx: 1,
        tip: "Duo İpucu: Yaşınız, geliriniz ve uyku düzeninizi bozmayacak kayıp seviyeniz bunu belirler.",
        explanation: "Risk toleransı, olası zararları karşılayabilme kapasiteniz ve bu konudaki soğukkanlılığınızdır."
      }
    ]
  }
];

// Units configuration representing different chapters
const UNITS = [
  {
    id: 1,
    title: "Temel Finans & Bütçeleme",
    desc: "Bütçe kavramı, bütçe bölüşümü ve acil durum fonu kurmayı kavrayın.",
    lessons: ['l1', 'l2', 'l3'],
    checkpointId: 'c1',
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    id: 2,
    title: "Birikim & Hisse Senetleri",
    desc: "Bileşik getiri mucizesi ve borsa yatırımlarının temellerini keşfedin.",
    lessons: ['l4', 'l5'],
    checkpointId: 'c2',
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: 3,
    title: "Portföy Yönetimi & Riskler",
    desc: "Çeşitlendirme, enflasyona karşı koruma ve risk yönetimi becerilerinizi geliştirin.",
    lessons: ['l6', 'l7'],
    checkpointId: 'c3',
    gradient: "from-purple-600 to-pink-600",
  }
];

// Checkpoint Questions for Unit 2 and Unit 3 Checkpoints
const UNIT_CHECKPOINT_QUESTIONS: Record<number, {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}[]> = {
  2: [
    {
      question: "Bileşik getiri gücünü en çok neyle birleştirirse mucize yaratır?",
      options: [
        "A) Sürekli al-sat komisyonları",
        "B) Uzun zaman ve sabır",
        "C) Çok yüksek kaldıraç"
      ],
      correctIdx: 1,
      explanation: "Zaman ve sabır, bileşik getirinin en büyük dostudur. Yıllar geçtikçe büyüme geometrik hız kazanır."
    },
    {
      question: "Borsada bir şirketin hisse senedini almak ne anlama gelir?",
      options: [
        "A) Şirket binasını kiralamak",
        "B) Şirketin kârına ve büyümesine ortak olmak",
        "C) Şirkete faizle borç vermek"
      ],
      correctIdx: 1,
      explanation: "Hisse senedi mülkiyet payını temsil eder. Satın aldığınızda şirkete doğrudan ortak olursunuz."
    },
    {
      question: "Şirketlerin kârlarını ortaklarıyla nakit paylaşmasına ne denir?",
      options: [
        "A) Temettü (Kâr Payı)",
        "B) Amortisman",
        "C) Borsa Vergisi"
      ],
      correctIdx: 0,
      explanation: "Temettü, şirketlerin ürettikleri kârın bir kısmını hissedarlarıyla nakit paylaşmasıdır."
    }
  ],
  3: [
    {
      question: "Tüm parayı tek bir yatırım aracına yatırmak yerine bölüştürmeye ne denir?",
      options: [
        "A) Kaldıraç",
        "B) Çeşitlendirme (Diversifikasyon)",
        "C) Spekülasyon"
      ],
      correctIdx: 1,
      explanation: "Riski dağıtmak için yatırımları farklı varlık türlerine veya sektörlere bölüştürmeye çeşitlendirme denir."
    },
    {
      question: "Nakit parayı enflasyona karşı korumanın en iyi yolu nedir?",
      options: [
        "A) Yastık altında saklamak",
        "B) Altın, hisse senedi veya fon gibi değerlenen varlıklara yönlendirmek",
        "C) Hemen lüks harcamalar yapmak"
      ],
      correctIdx: 1,
      explanation: "Enflasyon paranın değerini eritir. Bu yüzden korumak için değer kazanan varlıklara yatırım yapmak gerekir."
    },
    {
      question: "Risk toleransı belirlenirken hangisi dikkate alınmalıdır?",
      options: [
        "A) Yaş, gelir durumu ve kayıp anındaki psikolojik dayanıklılık",
        "B) Arkadaşların veya sosyal medyanın popüler tavsiyeleri",
        "C) Sadece en ucuz hisselerin fiyatı"
      ],
      correctIdx: 0,
      explanation: "Risk toleransı yaş, finansal hedefler ve olası zararlar karşısındaki soğukkanlılık düzeyinizdir."
    }
  ]
};

// Synth sounds for immersive Duolingo energy
const playSynthSound = (type: 'correct' | 'wrong' | 'complete' | 'click') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08); // C#5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.24); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } else if (type === 'complete') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.7);
      osc.start();
      osc.stop(ctx.currentTime + 0.75);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    // Fail silently if browser blocks sound
  }
};

export default function AssessmentView({ 
  onAssessmentCompleted, 
  savedScore, 
  onAddXp,
  gems,
  setGems,
  hearts,
  setHearts,
  completedLessons,
  setCompletedLessons,
  level,
  streak
}: AssessmentViewProps) {
  
  // Duolingo Layout states
  const [selectedNode, setSelectedNode] = useState<LessonNode | null>(null);
  const [activeNodeLesson, setActiveNodeLesson] = useState<LessonNode | null>(null);
  
  // Immersive Lesson active states
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lessonHearts, setLessonHearts] = useState(3);
  const [lessonXpEarned, setLessonXpEarned] = useState(0);
  const [showFailureScreen, setShowFailureScreen] = useState(false);
  const [showCelebrationScreen, setShowCelebrationScreen] = useState(false);

  // Mute option
  const [isMuted, setIsMuted] = useState(false);

  // Big Checkpoint (Castle exam) state
  const [isCastleExamActive, setIsCastleExamActive] = useState(false);
  const [activeCheckpointUnitId, setActiveCheckpointUnitId] = useState<number | null>(1);
  const [checkpointIdx, setCheckpointIdx] = useState(0);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, number>>({
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3
  });
  const [score, setScore] = useState<number | null>(savedScore);
  const [isCompleted, setIsCompleted] = useState<boolean>(savedScore !== null);

  // Sync prop changes (e.g. from backend load) to local states
  React.useEffect(() => {
    setScore(savedScore);
    setIsCompleted(savedScore !== null);
  }, [savedScore]);

  // Library tab
  const [activeCategory, setActiveCategory] = useState<string>('Bütçe');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const triggerSound = (type: 'correct' | 'wrong' | 'complete' | 'click') => {
    if (!isMuted) {
      playSynthSound(type);
    }
  };

  // Lesson Handler
  const startLesson = (node: LessonNode) => {
    triggerSound('click');
    if (hearts <= 0) {
      alert("Canınız bitti! Duolingo gibi canınızı yenilemek için Kazan sayfasından can iksiri satın alabilir veya baştan can yükleyebilirsiniz.");
      return;
    }
    setActiveNodeLesson(node);
    setActiveQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setLessonHearts(hearts);
    setLessonXpEarned(0);
    setShowFailureScreen(false);
    setShowCelebrationScreen(false);
    setSelectedNode(null);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    triggerSound('click');
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null || activeNodeLesson === null) return;
    
    const currentQ = activeNodeLesson.questions[activeQuestionIdx];
    const isCorrect = selectedOption === currentQ.correctIdx;
    
    setIsAnswerCorrect(isCorrect);
    setIsAnswerChecked(true);

    if (isCorrect) {
      triggerSound('correct');
      setLessonXpEarned(prev => prev + 35);
    } else {
      triggerSound('wrong');
      const newHearts = Math.max(lessonHearts - 1, 0);
      setLessonHearts(newHearts);
      setHearts(newHearts); // sync globally
      if (newHearts <= 0) {
        setTimeout(() => {
          setShowFailureScreen(true);
        }, 1200);
      }
    }
  };

  const nextQuestion = () => {
    if (!activeNodeLesson) return;
    triggerSound('click');
    setSelectedOption(null);
    setIsAnswerChecked(false);

    if (activeQuestionIdx < activeNodeLesson.questions.length - 1) {
      setActiveQuestionIdx(activeQuestionIdx + 1);
    } else {
      // Lesson Complete Success!
      triggerSound('complete');
      onAddXp(100);
      setGems(prev => prev + 25);
      
      // Save completed lesson
      if (!completedLessons.includes(activeNodeLesson.id)) {
        setCompletedLessons(prev => [...prev, activeNodeLesson.id]);
      }
      setShowCelebrationScreen(true);
    }
  };

  // Heart refill mechanism inside lesson
  const buyHeartWithGems = () => {
    if (gems >= 50) {
      setGems(prev => prev - 50);
      setHearts(3);
      setLessonHearts(3);
      setShowFailureScreen(false);
      triggerSound('complete');
    } else {
      alert("Yeterli elmasınız yok! Kazan sayfasından can yenilemesi yapabilirsiniz.");
    }
  };

  // Castle Exam scorers
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCheckpointAnswers(prev => ({
      ...prev,
      [ASSESSMENT_QUESTIONS[checkpointIdx].id]: val
    }));
  };

  const calculateScore = () => {
    let totalScorePoints = 0;
    ASSESSMENT_QUESTIONS.forEach(q => {
      totalScorePoints += checkpointAnswers[q.id] || 3;
    });

    const calculatedScore = Math.round(300 + (totalScorePoints - 6) * (550 / 24));
    setScore(calculatedScore);
    setIsCompleted(true);
    setIsCastleExamActive(false);
    onAssessmentCompleted(calculatedScore);
    onAddXp(150, "q1"); // Completes assessment quest
    
    // Add c1 to completed lessons to unlock Unit 2!
    if (!completedLessons.includes('c1')) {
      setCompletedLessons(prev => {
        if (prev.includes('c1')) return prev;
        return [...prev, 'c1'];
      });
    }

    triggerSound('complete');
    alert(`Tebrikler! 1. Ünite Şato Sınavını ve Finansal Analizi tamamladın!\n\nFinansal Sağlık Skorun: ${calculatedScore}\n\n+150 XP ve +50 💎 kazandın. 2. Ünite: "Birikim & Hisse Senetleri" kilidi açıldı!`);
  };

  const handleNextCheckpointQuestion = () => {
    triggerSound('click');
    const totalQuestions = activeCheckpointUnitId === 1 ? ASSESSMENT_QUESTIONS.length : 3;
    
    // Check if they answered
    const currentAnswerKey = activeCheckpointUnitId === 1 ? ASSESSMENT_QUESTIONS[checkpointIdx].id : checkpointIdx;
    const currentAnswer = checkpointAnswers[currentAnswerKey];
    if (currentAnswer === undefined || currentAnswer === null || currentAnswer === -1) {
      alert("Lütfen devam etmeden önce bir seçenek belirtin!");
      return;
    }

    if (checkpointIdx < totalQuestions - 1) {
      setCheckpointIdx(checkpointIdx + 1);
    } else {
      // Finish Exam!
      if (activeCheckpointUnitId === 1) {
        calculateScore();
      } else {
        // Evaluate Multiple Choice quiz for Unit 2 or Unit 3
        const questions = UNIT_CHECKPOINT_QUESTIONS[activeCheckpointUnitId || 2];
        let correctCount = 0;
        questions.forEach((q, idx) => {
          if (checkpointAnswers[idx] === q.correctIdx) {
            correctCount++;
          }
        });

        triggerSound('complete');
        onAddXp(150);
        setGems(prev => prev + 50);

        const checkpointId = activeCheckpointUnitId === 2 ? 'c2' : 'c3';
        if (!completedLessons.includes(checkpointId)) {
          setCompletedLessons(prev => {
            if (prev.includes(checkpointId)) return prev;
            return [...prev, checkpointId];
          });
        }

        setIsCastleExamActive(false);
        if (activeCheckpointUnitId === 2) {
          alert(`Tebrikler! Ünite 2 Şato Sınavını başarıyla tamamladın! (${correctCount}/${questions.length} Doğru)\n\n+150 XP ve +50 💎 kazandın!\n\n3. Ünite: "Portföy Yönetimi & Riskler" kilidi açıldı!`);
        } else {
          alert(`Harika İş! Ünite 3 Şato Sınavını başarıyla tamamladın! (${correctCount}/${questions.length} Doğru)\n\n+150 XP ve +50 💎 kazandın! Bütün bütçe ve yatırım müfredatını tamamlayarak finansal okuryazarlık kahramanı oldun! 🏆`);
        }
      }
    }
  };

  const handleResetExam = () => {
    setActiveCheckpointUnitId(1);
    setCheckpointIdx(0);
    setCheckpointAnswers({
      1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3
    });
    setScore(null);
    setIsCompleted(false);
    setIsCastleExamActive(true);
    triggerSound('click');
  };

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    onAddXp(30, "q5");
  };

  const getScoreDetails = (s: number) => {
    if (s < 550) {
      return {
        label: "GELİŞTİRİLMELİ 🔴",
        description: "Bütçe dengeniz ve finansal kalkanınız zayıf görünüyor. Duo Baykuşu bütçe derslerini tekrar etmenizi tavsiye ediyor!",
        color: "from-rose-500 to-orange-500",
        bg: "bg-red-550/10",
        text: "text-rose-400"
      };
    } else if (s < 720) {
      return {
        label: "GÜZEL SEVİYE 🟡",
        description: "Temelleriniz sağlam! Yatırımlarınızı çeşitlendirerek ve bileşik getiriyi kullanarak skoru Zirveye taşıyın.",
        color: "from-amber-400 to-yellow-500",
        bg: "bg-amber-500/10",
        text: "text-amber-400"
      };
    } else {
      return {
        label: "FİNANSAL DUO UZMANI 🟢",
        description: "Harika! Finansal bilinciniz ve birikim becerileriniz mükemmel düzeyde. Tam bir SÜDEV liderisiniz!",
        color: "from-emerald-400 to-teal-500",
        bg: "bg-emerald-500/10",
        text: "text-emerald-400"
      };
    }
  };

  const scoreDetails = score ? getScoreDetails(score) : null;
  const filteredCards = FLASHCARDS.filter(card => card.category === activeCategory);

  // Duolingo Speech Bubbles
  const duoQuotes = [
    "Merhaba! Ben Bilgin Baykuş. Bugün finansal zekanı geliştirmek için harika bir gün! 🦉",
    "Günde sadece 5 dakika pratik yaparak finansal kaderini değiştirebilirsin! ⚡",
    "Tasarruf etmek, gelecekteki özgürlüğünü satın almaktır. 💎",
    "Unutma: Tüm yumurtaları aynı sepete koyma! Çeşitlendirme dersine hemen başla! 🥚",
    "Bileşik getiri, sabredenlerin en büyük finansal silahıdır. 📈"
  ];

  const randomQuote = duoQuotes[level % duoQuotes.length];

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-2 pb-12 animate-fade-in" id="duo-learning-screen">
      
      {/* If immersive lesson is open, show standard Duolingo fullscreen lesson layout */}
      {activeNodeLesson && (
        <div className="fixed inset-0 z-50 bg-[#070b13] flex flex-col justify-between" id="immersive-lesson-container">
          
          {/* TOP BAR */}
          <div className="border-b border-slate-900 bg-slate-950/80 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => {
                triggerSound('click');
                setActiveNodeLesson(null);
              }}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Slider/Progress strip */}
            <div className="flex-1 mx-4 max-w-xl relative">
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-850 p-1 flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${((activeQuestionIdx) / activeNodeLesson.questions.length) * 100}%` }}
                >
                  <span className="absolute right-0 -top-2 text-base">🦉</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mute/Unmute */}
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-blue-400" />}
              </button>

              {/* Lesson hearts */}
              <div className="flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-xl border border-rose-500/20">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30 animate-pulse" />
                <span className="text-xs font-mono font-black text-rose-400">{lessonHearts}</span>
              </div>
            </div>
          </div>

          {/* MAIN QUESTION SECTION */}
          <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center">
            
            {!showCelebrationScreen && !showFailureScreen && (
              <div className="max-w-xl w-full space-y-6">
                
                {/* Duo Baykuş Advice Card */}
                <div className="bg-slate-950/50 border border-slate-900 p-4 rounded-2xl flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-xl shrink-0">
                    🦉
                  </div>
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">BİLGİN BAYKUŞ İPUCU</span>
                    <p className="text-xs text-slate-300 mt-0.5">{activeNodeLesson.questions[activeQuestionIdx].tip}</p>
                  </div>
                </div>

                {/* Question */}
                <div className="space-y-3 text-center">
                  <span className="text-[10px] font-extrabold tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block uppercase">
                    Soru {activeQuestionIdx + 1} / {activeNodeLesson.questions.length}
                  </span>
                  <h3 className="text-lg md:text-xl font-black font-display text-white px-2">
                    {activeNodeLesson.questions[activeQuestionIdx].question}
                  </h3>
                </div>

                {/* Options list styled exactly like Duolingo 3D active buttons */}
                <div className="space-y-3 pt-2">
                  {activeNodeLesson.questions[activeQuestionIdx].options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    return (
                      <button
                        key={oIdx}
                        disabled={isAnswerChecked}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-4 rounded-2xl text-left text-xs md:text-sm font-bold transition-all border-b-4 flex items-center gap-3 cursor-pointer select-none ${
                          isAnswerChecked
                            ? oIdx === activeNodeLesson.questions[activeQuestionIdx].correctIdx
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                              : isSelected
                                ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                                : 'bg-slate-950/40 border-slate-900 text-slate-500'
                            : isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-blue-300 scale-[1.01] shadow-lg shadow-blue-500/5'
                              : 'bg-slate-950 hover:bg-slate-900/60 border-slate-850 hover:border-slate-800 text-slate-200 active:translate-y-0.5 active:border-b-2'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="leading-tight">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CELEBRATION COMPLETED SCREEN */}
            {showCelebrationScreen && (
              <div className="max-w-md w-full text-center py-12 space-y-6 animate-scale-up" id="celebration-panel">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-500/20 border-4 border-yellow-300">
                    <Trophy className="w-12 h-12" />
                  </div>
                  {/* Glowing halo sparks */}
                  <div className="absolute inset-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl -z-10 mx-auto" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">DERS TAMAMLANDI!</span>
                  <h2 className="text-2xl md:text-3xl font-black font-display text-white">Harika Finansal Başarı!</h2>
                  <p className="text-xs text-slate-400 leading-relaxed px-4">
                    <strong>{activeNodeLesson.title}</strong> konusunu mükemmel bir şekilde kavradın. Duolingo zekası ve SÜDEV takımı seninle gurur duyuyor!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="bg-slate-950 border border-emerald-500/20 p-4 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase">Kazanılan XP</span>
                    <span className="text-xl font-black font-mono text-emerald-400">+100 XP</span>
                  </div>
                  <div className="bg-slate-950 border border-indigo-500/20 p-4 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase">Hediye Elmas</span>
                    <span className="text-xl font-black font-mono text-indigo-400">+25 💎</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    triggerSound('click');
                    setActiveNodeLesson(null);
                  }}
                  className="w-full max-w-xs py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-150"
                >
                  Yolculuğa Geri Dön
                </button>
              </div>
            )}

            {/* FAILURE OUT OF HEARTS SCREEN */}
            {showFailureScreen && (
              <div className="max-w-md w-full text-center py-12 space-y-6 animate-scale-up" id="failure-panel">
                <div className="w-20 h-20 bg-rose-500/15 border-2 border-rose-500/35 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-lg shadow-rose-500/5">
                  😢
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase bg-rose-500/10 px-3 py-1 rounded-full">CANLAR TÜKENDİ</span>
                  <h2 className="text-2xl font-black font-display text-white">Pratik Lazım!</h2>
                  <p className="text-xs text-slate-400 leading-relaxed px-6">
                    Hatalar öğrenmenin bir parçasıdır! Elmaslarını kullanarak hemen canını yenileyebilir veya derse tekrar başlamak üzere haritaya dönebilirsin.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 max-w-xs mx-auto">
                  <button
                    onClick={buyHeartWithGems}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-550 hover:to-blue-550 text-white font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Canı Fullle (50 💎)
                  </button>
                  <button
                    onClick={() => {
                      triggerSound('click');
                      setActiveNodeLesson(null);
                    }}
                    className="w-full py-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-2xl transition-all cursor-pointer text-xs"
                  >
                    Şimdilik Ayrıl
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM CONFIRMATION DRAWER */}
          {!showCelebrationScreen && !showFailureScreen && (
            <div className={`p-4 border-t transition-all duration-300 ${
              isAnswerChecked 
                ? isAnswerCorrect 
                  ? 'bg-emerald-950/90 border-emerald-800/60' 
                  : 'bg-rose-950/90 border-rose-800/60'
                : 'bg-slate-950 border-slate-900'
            }`}>
              <div className="max-w-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Feedback text layout */}
                {isAnswerChecked ? (
                  <div className="flex items-start gap-3 w-full md:w-auto">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isAnswerCorrect ? 'bg-emerald-500/25 text-emerald-400' : 'bg-rose-500/25 text-rose-400'
                    }`}>
                      {isAnswerCorrect ? '🎉' : '❌'}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black ${isAnswerCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isAnswerCorrect ? 'Harika İş! Doğru Cevap.' : 'Ah, Yakındı! Yanlış.'}
                      </h4>
                      <p className="text-[11px] text-slate-350 leading-snug mt-0.5">
                        {activeNodeLesson.questions[activeQuestionIdx].explanation}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-left hidden md:block">
                    <span className="text-xs text-slate-400">Cevabınızı seçin ve doğruluğunu kontrol edin.</span>
                  </div>
                )}

                {/* Action button */}
                <div className="w-full md:w-auto shrink-0">
                  {!isAnswerChecked ? (
                    <button
                      disabled={selectedOption === null}
                      onClick={checkAnswer}
                      className={`w-full md:w-44 py-4 px-6 rounded-2xl font-black text-center text-xs md:text-sm tracking-wider uppercase transition-all duration-150 border-b-4 ${
                        selectedOption === null
                          ? 'bg-slate-900 border-slate-950 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-600 active:translate-y-0.5 active:border-b-2 cursor-pointer'
                      }`}
                    >
                      Kontrol Et
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className={`w-full md:w-44 py-4 px-6 rounded-2xl font-black text-center text-xs md:text-sm tracking-wider uppercase transition-all border-b-4 ${
                        isAnswerCorrect
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-600 cursor-pointer'
                          : 'bg-rose-500 hover:bg-rose-400 text-white border-rose-600 cursor-pointer'
                      }`}
                    >
                      Devam Et
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* CASTLE EXAM (DIAGNOSTIC TEST & KNOWLEDGE CHECKS) FULLSCREEN MODAL */}
      {isCastleExamActive && (
        <div className="fixed inset-0 z-50 bg-[#070b13] flex flex-col justify-between" id="castle-exam-container">
          <div className="border-b border-slate-900 bg-slate-950/80 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => {
                triggerSound('click');
                setIsCastleExamActive(false);
              }}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
              👑 {activeCheckpointUnitId === 1 ? "ŞATO BÜYÜK SINAVI" : `ÜNİTE ${activeCheckpointUnitId} ŞATO SINAVI`}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Soru {checkpointIdx + 1} / {activeCheckpointUnitId === 1 ? ASSESSMENT_QUESTIONS.length : 3}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col items-center">
            <div className="max-w-xl w-full space-y-8 my-auto">
              
              {activeCheckpointUnitId === 1 ? (
                // Existing Unit 1 Diagnostic (Slider-based)
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center shadow-lg">
                      <Compass className="w-10 h-10 animate-spin-slow" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-white font-display">
                      {ASSESSMENT_QUESTIONS[checkpointIdx].question}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-sm">
                      {ASSESSMENT_QUESTIONS[checkpointIdx].description}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 relative">
                    <div className="flex justify-between text-[10px] font-black tracking-wider text-slate-400 uppercase mb-4">
                      <span>DÜŞÜK SEVİYE</span>
                      <span>YÜKSEK SEVİYE</span>
                    </div>

                    <div className="relative pt-6 pb-2">
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        step="1"
                        value={checkpointAnswers[ASSESSMENT_QUESTIONS[checkpointIdx].id] || 3} 
                        onChange={handleSliderChange}
                        className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      
                      <div className="flex justify-between px-1 mt-4">
                        {[1, 2, 3, 4, 5].map(dot => (
                          <div 
                            key={dot} 
                            onClick={() => {
                              triggerSound('click');
                              setCheckpointAnswers(prev => ({
                                ...prev,
                                [ASSESSMENT_QUESTIONS[checkpointIdx].id]: dot
                              }));
                            }}
                            className={`text-xs font-mono font-black w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer select-none ${
                              checkpointAnswers[ASSESSMENT_QUESTIONS[checkpointIdx].id] === dot
                                ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-lg shadow-blue-500/25'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                            }`}
                          >
                            {dot}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-[11px] font-black text-slate-400 mt-4 border-t border-slate-900 pt-3">
                      <span className="text-rose-400">{ASSESSMENT_QUESTIONS[checkpointIdx].minLabel}</span>
                      <span className="text-emerald-400">{ASSESSMENT_QUESTIONS[checkpointIdx].maxLabel}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Unit 2 & 3 Multiple Choice Checkpoint
                <div className="space-y-6">
                  {(() => {
                    const questions = UNIT_CHECKPOINT_QUESTIONS[activeCheckpointUnitId || 2];
                    const currentQ = questions[checkpointIdx];
                    if (!currentQ) return null;
                    const selectedAnsIdx = checkpointAnswers[checkpointIdx];

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-20 h-20 bg-amber-500/10 border-2 border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center shadow-lg">
                            <Trophy className="w-10 h-10 text-amber-400 animate-pulse" />
                          </div>
                          <span className="text-[10px] font-black tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 uppercase">
                            Ünite {activeCheckpointUnitId} Bilgi Sınavı
                          </span>
                          <h2 className="text-lg md:text-xl font-black text-white font-display px-4 text-center leading-relaxed">
                            {currentQ.question}
                          </h2>
                        </div>

                        <div className="space-y-3 pt-2">
                          {currentQ.options.map((opt, oIdx) => {
                            const isSelected = selectedAnsIdx === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  triggerSound('click');
                                  setCheckpointAnswers(prev => ({
                                    ...prev,
                                    [checkpointIdx]: oIdx
                                  }));
                                }}
                                className={`w-full p-4 rounded-2xl text-left text-xs md:text-sm font-bold transition-all border-b-4 flex items-center gap-3 cursor-pointer select-none ${
                                  isSelected
                                    ? 'bg-blue-600/15 border-blue-500 text-blue-300 scale-[1.01] shadow-lg shadow-blue-500/5'
                                    : 'bg-slate-950 hover:bg-slate-900/60 border-slate-850 hover:border-slate-800 text-slate-200 active:translate-y-0.5 active:border-b-2'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                                  isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                                <span className="leading-tight">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </div>

          <div className="p-4 bg-slate-950 border-t border-slate-900">
            <div className="max-w-xl mx-auto flex gap-3">
              {checkpointIdx > 0 && (
                <button
                  onClick={() => {
                    triggerSound('click');
                    setCheckpointIdx(checkpointIdx - 1);
                  }}
                  className="flex-1 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Geri
                </button>
              )}
              
              <button
                onClick={handleNextCheckpointQuestion}
                className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl transition-all shadow-md cursor-pointer text-center hover:from-blue-550 hover:to-indigo-550"
              >
                {checkpointIdx < (activeCheckpointUnitId === 1 ? ASSESSMENT_QUESTIONS.length - 1 : 2) ? "Sonraki Soru" : "Sınavı Bitir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GAMIFIED MAP LAYOUT (DUOLINGO PROGRESSION TREE) */}
      {!activeNodeLesson && !isCastleExamActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="duo-main-grid">
          
          {/* LEFT: DUOLINGO PROGRESS TRAIL (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-8" id="duo-left-panel">
            
            {/* UNITS ROAD MAP ENGINE */}
            {UNITS.map((unit) => {
              const isUnitUnlocked = unit.id === 1 || completedLessons.includes(UNITS[unit.id - 2].checkpointId);
              if (!isUnitUnlocked) return null;
              
              const unitLessons = DUOLINGO_LESSONS.filter(l => l.unit === unit.id);
              const isUnitCompleted = unit.lessons.every(lId => completedLessons.includes(lId));
              const isCheckpointCompleted = completedLessons.includes(unit.checkpointId);

              return (
                <div key={unit.id} className="space-y-6 w-full">
                  {/* Unit Header Card */}
                  <div className={`bg-gradient-to-r ${unit.gradient} rounded-3xl p-5 md:p-6 text-white space-y-3 shadow-lg relative overflow-hidden transition-all duration-300 ${!isUnitUnlocked ? 'opacity-40 saturate-50' : ''}`}>
                    {/* Abs decoration circles */}
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full" />
                    <div className="absolute -left-4 -top-4 w-16 h-16 bg-white/5 rounded-full" />

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">ÜNİTE {unit.id}</span>
                        <h2 className="text-xl font-black font-display">{unit.title}</h2>
                        <p className="text-xs text-white/90">{unit.desc}</p>
                      </div>
                      
                      {/* Badge status */}
                      <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 whitespace-nowrap">
                        {isCheckpointCompleted 
                          ? "✓ Tamamlandı" 
                          : isUnitUnlocked 
                            ? isUnitCompleted 
                              ? "⚡ Şato Sınavı Hazır" 
                              : "● Aktif" 
                            : "🔒 Kilitli"}
                      </span>
                    </div>

                    {/* Quick debug unlock actions (only for Unit 1) */}
                    {unit.id === 1 && (
                      <div className="flex flex-wrap gap-2 pt-1.5 relative z-10">
                        <button
                          id="btn-unlock-all-lessons"
                          onClick={() => {
                            triggerSound('complete');
                            setCompletedLessons(['l1', 'l2', 'l3', 'c1', 'l4', 'l5', 'c2', 'l6', 'l7', 'c3']);
                            alert("Tebrikler! Bütün ünitelerin, derslerin ve şato sınavlarının kilidi açıldı. Artık istediğin konuyu serbestçe çalışabilirsin!");
                          }}
                          className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          Yol Haritası Kilidini Aç
                        </button>

                        {completedLessons.length > 0 && (
                          <button
                            id="btn-lock-all-lessons"
                            onClick={() => {
                              triggerSound('click');
                              setCompletedLessons([]);
                              alert("Ders ilerlemesi sıfırlandı. Yol haritası tekrar kilitlendi!");
                            }}
                            className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/20 text-rose-300 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer"
                          >
                            Kilitleri Sıfırla
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* DUOLINGO CURVED ROAD MAP for this Unit */}
                  <div className={`bg-slate-950/40 border border-slate-900 rounded-3xl p-8 flex flex-col items-center space-y-12 relative overflow-hidden transition-all duration-300 ${!isUnitUnlocked ? 'opacity-30 pointer-events-none' : ''}`} id={`duo-map-road-u${unit.id}`}>
                    
                    {/* Dynamic Map Nodes of this Unit */}
                    {unitLessons.map((node, index) => {
                      const isCompleted = completedLessons.includes(node.id);
                      // Zig zag layout
                      const offsetClass = index % 3 === 0 
                        ? 'translate-x-0' 
                        : index % 3 === 1 
                          ? 'translate-x-12 sm:translate-x-20' 
                          : '-translate-x-12 sm:-translate-x-20';

                      const IconElement = node.icon;
                      // Locked if unit is locked, or if index > 0 and previous lesson is not completed
                      const isLocked = !isUnitUnlocked || (index > 0 && !completedLessons.includes(unitLessons[index - 1].id));

                      return (
                        <div key={node.id} className={`relative group ${offsetClass} transition-all`}>
                          
                          {/* Ring wrapper simulating Duolingo progress crown */}
                          <div className="relative">
                            
                            {/* Active/Completed glowing ring */}
                            <div className={`absolute -inset-2.5 rounded-full border-4 animate-pulse-slow ${
                              isCompleted 
                                ? 'border-emerald-500/40' 
                                : isLocked 
                                  ? 'border-slate-800' 
                                  : 'border-amber-400/50'
                            }`} />

                            {/* Lesson Circle Button */}
                            <button
                              id={`map-node-${node.id}`}
                              disabled={isLocked}
                              onClick={() => {
                                triggerSound('click');
                                setSelectedNode(selectedNode?.id === node.id ? null : node);
                              }}
                              className={`w-16 h-16 rounded-full border-b-4 active:border-b-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/15'
                                  : isLocked
                                    ? 'bg-slate-900 border-slate-950 text-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-tr from-amber-400 to-orange-500 border-amber-600 text-white shadow-lg shadow-amber-500/15'
                              } cursor-pointer`}
                            >
                              {isLocked ? <Lock className="w-6 h-6" /> : <IconElement className="w-7 h-7" />}
                            </button>

                            {/* Completed Badge Indicator */}
                            {isCompleted && (
                              <div className="absolute -top-1 -right-1 bg-yellow-400 border border-yellow-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-slate-950 font-black shadow-md">
                                ✓
                              </div>
                            )}
                          </div>

                          {/* Interactive Tooltip Card on click */}
                          {selectedNode?.id === node.id && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-30 w-56 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl text-center space-y-3 animate-scale-up" id="node-tooltip">
                              <div>
                                <span className="text-[9px] font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                                  {node.category}
                                </span>
                                <h4 className="text-sm font-black text-white mt-1.5 leading-snug">{node.title}</h4>
                                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{node.shortDesc}</p>
                              </div>
                              
                              <button
                                onClick={() => startLesson(node)}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wide border-b-2 border-emerald-600"
                              >
                                Derse Başla!
                              </button>
                              
                              {/* Little downward beak */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                            </div>
                          )}

                          {/* Floating label beneath node */}
                          <div className="text-center mt-3">
                            <span className={`text-[11px] font-bold block ${isLocked ? 'text-slate-600' : 'text-slate-350'}`}>
                              {node.title}
                            </span>
                          </div>

                        </div>
                      );
                    })}

                    {/* CASTLE CHECKPOINT NODE (BÜYÜK ŞATO SINAVI) for this Unit */}
                    <div className="relative pt-6 flex flex-col items-center">
                      
                      {/* Stars/Ring surrounding checkpoint button */}
                      <div className={`absolute -inset-3 rounded-3xl border-2 animate-pulse-slow ${
                        isCheckpointCompleted 
                          ? 'border-emerald-500/30 bg-emerald-500/5' 
                          : isUnitCompleted
                            ? 'border-amber-500/30 bg-amber-500/5'
                            : 'border-slate-800/20 bg-slate-950/20'
                      }`} />
                      
                      <button
                        id={`btn-castle-checkpoint-u${unit.id}`}
                        disabled={!isUnitCompleted}
                        onClick={() => {
                          triggerSound('click');
                          setActiveCheckpointUnitId(unit.id);
                          setIsCastleExamActive(true);
                          setCheckpointIdx(0);
                          // Initialize checkpoint answers
                          if (unit.id === 1) {
                            setCheckpointAnswers({ 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 });
                          } else {
                            setCheckpointAnswers({ 0: -1, 1: -1, 2: -1 }); // Multiple choice indices (unanswered)
                          }
                        }}
                        className={`w-20 h-20 rounded-3xl border-b-4 flex items-center justify-center shadow-xl transition-all ${
                          isCheckpointCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-600 text-white'
                            : isUnitCompleted
                              ? 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 border-amber-600 text-slate-950 hover:scale-105 active:scale-95 cursor-pointer'
                              : 'bg-slate-900 border-slate-950 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {isCheckpointCompleted ? (
                          <Award className="w-10 h-10 text-white" />
                        ) : (
                          <Trophy className={`w-10 h-10 ${isUnitCompleted ? 'animate-bounce text-slate-950' : 'text-slate-600'}`} />
                        )}
                      </button>

                      {/* Star Crown badge */}
                      <span className="absolute -top-3 -right-3 text-lg">👑</span>
                      
                      <div className="text-center mt-4 space-y-1">
                        <span className={`text-xs font-black block tracking-wide uppercase ${isUnitCompleted ? 'text-amber-400' : 'text-slate-500'}`}>
                          {unit.id}. ÜNİTE ŞATO SINAVI
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold block">
                          {isCheckpointCompleted 
                            ? "Tamamlandı!" 
                            : isUnitCompleted 
                              ? "Sınav Başlamaya Hazır!" 
                              : "Önce ünite derslerini tamamla!"}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* LIBRARY SECTION (EXPANDED COLLAPSIBLE ACCORDION FOR FLASHCARDS & ARTICLES) */}
            <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 space-y-6" id="duo-library-panel">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    Kütüphane & Pratik Salonu
                  </h3>
                  <p className="text-xs text-slate-400">Bonus XP kazanmak için bilgi kartlarını çevirin ve makaleleri okuyun</p>
                </div>

                {/* Subcategory selectors */}
                <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                  {['Bütçe', 'Tasarruf', 'Yatırım', 'Risk Yönetimi'].map(cat => (
                    <button
                      key={cat}
                      id={`library-chip-${cat}`}
                      onClick={() => {
                        triggerSound('click');
                        setActiveCategory(cat);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        activeCategory === cat 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flashcards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCards.map(card => {
                  const isFlipped = !!flippedCards[card.id];
                  return (
                    <div 
                      key={card.id}
                      id={`library-flashcard-${card.id}`}
                      onClick={() => toggleFlip(card.id)}
                      className="h-40 w-full cursor-pointer group perspective-1000"
                    >
                      <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
                        {/* Front of Card */}
                        <div className="absolute inset-0 h-full w-full bg-[#0d1221] border border-blue-500/10 rounded-2xl p-5 flex flex-col justify-between backface-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-extrabold tracking-widest text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded">
                              {card.category}
                            </span>
                            <Info className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                          </div>
                          <h4 className="text-xs md:text-sm font-black text-white leading-tight">
                            {card.question}
                          </h4>
                          <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-blue-500 animate-ping" />
                            Kartı çevirerek oku
                          </span>
                        </div>

                        {/* Back of Card */}
                        <div className="absolute inset-0 h-full w-full bg-slate-900 border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 shadow-xl">
                          <span className="text-[8px] font-extrabold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded self-start">
                            Cevap
                          </span>
                          <p className="text-[11px] text-slate-350 leading-relaxed font-medium">
                            {card.answer}
                          </p>
                          <span className="text-[9px] text-blue-400 font-extrabold self-end">
                            Öğrenildi! +30 XP
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Articles section */}
              <div className="pt-4 border-t border-slate-900 space-y-3">
                <span className="text-[10px] font-black tracking-wider text-slate-500 uppercase block">Kısa Bilgilendirici Makaleler</span>
                <div className="space-y-3">
                  {ARTICLES.map(art => (
                    <div 
                      key={art.id}
                      id={`library-art-${art.id}`}
                      onClick={() => {
                        triggerSound('click');
                        setSelectedArticle(art);
                      }}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-extrabold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-1.5 py-0.5 rounded">{art.category}</span>
                          <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.readTime}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors">
                          {art.title}
                        </h5>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-slate-850 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 transition-all shrink-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: MASCOT OWL & SCORE CARD (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-6" id="duo-right-panel">
            
            {/* Animated Baykuş Mascot Box */}
            <div className="bg-[#0f172a] border border-blue-500/10 rounded-3xl p-6 space-y-4 shadow-xl" id="mascot-box">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600/10 border-2 border-blue-500/30 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-blue-500/10 animate-bounce">
                  🦉
                </div>
                <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl relative w-full">
                  <span className="text-[8px] font-extrabold text-blue-400 uppercase tracking-widest">BİLGİN BAYKUŞ</span>
                  <p className="text-xs text-slate-300 leading-snug font-medium mt-1">
                    "{randomQuote}"
                  </p>
                  {/* Speech bubble triangle pointing left */}
                  <div className="absolute top-6 -left-2 border-4 border-transparent border-r-slate-950" />
                </div>
              </div>

              {/* Quick actions Refill Hearts */}
              {hearts < 3 && (
                <div className="bg-rose-500/5 border border-rose-500/15 p-3 rounded-2xl flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-rose-400 uppercase block">CANLAR EKSİK</span>
                    <p className="text-[10px] text-slate-400">Canınız az. İksir alarak tamamlayın.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (gems >= 50) {
                        setGems(prev => prev - 50);
                        setHearts(3);
                        triggerSound('complete');
                      } else {
                        alert("Yetersiz elmas! Kazan sayfasından can yenilemesi yapabilirsiniz.");
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-550 active:bg-rose-700 text-white text-[10px] font-black rounded-xl cursor-pointer shadow transition-all shrink-0"
                  >
                    Can Doldur (50 💎)
                  </button>
                </div>
              )}
            </div>

            {/* Diagnostic Score Card */}
            {score !== null ? (
              <div className="bg-slate-950/60 border border-slate-900 rounded-3xl p-6 space-y-4" id="score-sidebar-card">
                <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">FİNANSAL SAĞLIK SKORU</span>
                  <button 
                    onClick={handleResetExam}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Yeniden Çöz
                  </button>
                </div>

                {scoreDetails && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-2xl font-black text-white font-mono">{score}</span>
                      <span className="block text-xs font-black text-emerald-400">{scoreDetails.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {scoreDetails.description}
                    </p>
                    
                    {/* Concentric progress representation */}
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                        style={{ width: `${((score - 300) / 550) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-950/40 border border-slate-900/60 p-6 rounded-3xl text-center space-y-4" id="score-not-tested">
                <Compass className="w-10 h-10 text-amber-400 mx-auto animate-spin-slow" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white font-display">Henüz Test Çözülmedi</h4>
                  <p className="text-[10px] text-slate-500">Skorunu hesaplamak ve durumunu analiz etmek için haritadaki Şato Sınavını çözün!</p>
                </div>
                <button
                  onClick={() => {
                    triggerSound('click');
                    setIsCastleExamActive(true);
                    setCheckpointIdx(0);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  Şato Sınavına Başla
                </button>
              </div>
            )}

            {/* Flutter Beta Info Card */}
            <div className="bg-[#0f172a]/30 border border-slate-900 rounded-3xl p-5 space-y-2.5 text-center">
              <span className="text-[8px] font-extrabold tracking-widest text-[#fccb2f] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block uppercase">SÜDEV PROJE GRUBU</span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                Bu uygulama Flutter/Duolingo konsept tasarımı ile hazırlanmış bir bütçe ve sanal borsa simülasyonudur.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ARTICLE CONTENT READ MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in" id="article-modal">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="p-6 md:p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-base md:text-lg font-black font-display text-white mt-2 leading-snug">
                    {selectedArticle.title}
                  </h3>
                </div>
              </div>

              <hr className="border-slate-800" />

              <p className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-line text-justify">
                {selectedArticle.content}
              </p>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTime}
                </span>
                <button
                  id="btn-close-article"
                  onClick={() => {
                    setSelectedArticle(null);
                    onAddXp(80); // Give 80 XP for reading an article
                    setGems(prev => prev + 10); // Give 10 Gems for reading
                    triggerSound('complete');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-550 active:bg-blue-700 text-white font-black rounded-xl text-xs transition-all shadow-md cursor-pointer"
                >
                  Anladım ve Kapat (+80 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
