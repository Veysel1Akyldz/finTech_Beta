import { AssessmentQuestion, Flashcard, Quest, Stock, Article } from './types';

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: "Aylık Gelir Seviyeniz Nedir?",
    description: "Aylık ortalama gelir durumunuzu en iyi hangisi tanımlar?",
    minLabel: "Asgari / Düşük",
    maxLabel: "Çok Yüksek",
    iconName: "Wallet"
  },
  {
    id: 2,
    question: "Harcama Disiplininiz Nasıl?",
    description: "Bütçe planlamanıza sadık kalabiliyor musunuz?",
    minLabel: "Plansız / Dürtüsel",
    maxLabel: "Çok Disiplinli",
    iconName: "ShoppingBag"
  },
  {
    id: 3,
    question: "Tasarruf Alışkanlığınız Nedir?",
    description: "Gelirinizden düzenli olarak birikim yapıyor musunuz?",
    minLabel: "Hiç Yapamıyorum",
    maxLabel: "Düzenli & Hedefli",
    iconName: "PiggyBank"
  },
  {
    id: 4,
    question: "Mevcut Borç Yükünüz Nedir?",
    description: "Gelirinize kıyasla borç ödeme dengeniz ne durumda?",
    minLabel: "Çok Yüksek Borç",
    maxLabel: "Borcum Yok",
    iconName: "TrendingDown"
  },
  {
    id: 5,
    question: "Yatırım Risk İştahınız Nasıl?",
    description: "Kaybetme olasılığına karşı getiri beklentiniz hangisine uygun?",
    minLabel: "Çok Temkinli (Düşük)",
    maxLabel: "Agresif (Yüksek)",
    iconName: "TrendingUp"
  },
  {
    id: 6,
    question: "Finansal Bilgi Düzeyiniz Nedir?",
    description: "Yatırım araçları ve finans dünyasını ne kadar biliyorsunuz?",
    minLabel: "Başlangıç Seviyesi",
    maxLabel: "Uzman Seviyesi",
    iconName: "Brain"
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: "f1",
    category: "Bütçe",
    question: "Acil Durum Fonu Nedir?",
    answer: "Beklenmedik giderler (iş kaybı, sağlık, acil tadilat) için kenarda saklanan, genellikle 3-6 aylık temel giderlerinizi karşılayacak büyüklükteki nakit birikimidir."
  },
  {
    id: "f2",
    category: "Bütçe",
    question: "50/30/20 Bütçe Kuralı Nedir?",
    answer: "Gelirinizin %50'sini ihtiyaçlara (kira, faturalar), %30'unu isteklere (tatil, eğlence) ve %20'sini birikim veya borç kapatmaya ayırma yöntemidir."
  },
  {
    id: "f3",
    category: "Tasarruf",
    question: "Enflasyona Karşı Nasıl Korunulur?",
    answer: "Nakit parayı doğrudan tutmak yerine altın, hisse senedi, gayrimenkul veya yatırım fonları gibi değerini koruyan veya artıran varlıklara yönlendirerek korunabilirsiniz."
  },
  {
    id: "f4",
    category: "Yatırım",
    question: "Bileşik Getiri Nedir?",
    answer: "Yatırımınızdan kazandığınız kârın da tekrar yatırıma eklenerek zamanla katlanarak büyümesidir. Einstein bunu 'Dünyanın Sekizinci Harikası' olarak tanımlamıştır."
  },
  {
    id: "f5",
    category: "Risk Yönetimi",
    question: "Çeşitlendirme (Diversifikasyon) Nedir?",
    answer: "'Tüm yumurtaları aynı sepete koymamak' ilkesidir. Yatırımları farklı hisselere, sektörlere veya varlık türlerine bölerek toplam riski minimize etmektir."
  },
  {
    id: "f6",
    category: "Yatırım",
    question: "Hisse Senedi Nedir?",
    answer: "Bir şirketin mülkiyet payını temsil eden kıymetli evraktır. Satın aldığınızda şirketin kârına, büyümesine ve geleceğine ortak olursunuz."
  }
];

export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Yatırıma Başlarken Bilmeniz Gereken 3 Temel Kural",
    category: "Yatırım",
    readTime: "3 dk okuma",
    content: "Yatırım dünyasına girmeden önce kendinize sormanız gereken en önemli şey, acil bir durumda bu paraya ihtiyacınız olup olmayacağıdır. İlk kural, acil durum fonu kurmaktır. İkinci kural, yüksek faizli borçları temizlemektir çünkü hiçbir garanti getiri, borç faizinden yüksek olamaz. Üçüncü kural ise spekülasyon yerine düzenli, küçük miktarlarla uzun vadeli çeşitlendirilmiş yatırım yapmaktır."
  },
  {
    id: "a2",
    title: "Finansal Özgürlük Yolunda İlk Adım: Harcamaları Takip Etmek",
    category: "Bütçe",
    readTime: "4 dk okuma",
    content: "Nereye harcadığınızı bilmediğiniz parayı yönetemezsiniz. Finansal olarak başarılı insanların ortak özelliği, ufak harcamaları bile düzenli kaydetmeleridir. Günlük kahve, abonelikler ve dürtüsel alışverişler birikerek ay sonunda devasa bütçe deliklerine yol açar. Harcamalarınızı kategorize edip bütçe limitleri koyarak bu delikleri kapatabilirsiniz."
  },
  {
    id: "a3",
    title: "Risk ve Getiri Arasındaki Altın Denge",
    category: "Risk Yönetimi",
    readTime: "5 dk okuma",
    content: "Finans dünyasında yüksek getiri her zaman yüksek riski beraberinde getirir. Risksiz veya çok düşük riskli yatırımlar (mevduat, devlet tahvili) paranızı enflasyona karşı korumakta zorlanabilirken, çok yüksek riskli yatırımlar (kripto varlıklar, kaldıraçlı işlemler) anaparanızı tamamen kaybetmenize sebep olabilir. Önemli olan yaşınıza, hedeflerinize ve psikolojinize uygun risk iştahını belirleyip dengeli bir portföy kurmaktır."
  }
];

export const INITIAL_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 130.00, change: 0.0 },
  { symbol: "TSLA", name: "Tesla Motors", price: 110.00, change: 0.0 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 235.00, change: 0.0 },
  { symbol: "AMZN", name: "Amazon Inc.", price: 85.00, change: 0.0 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 145.00, change: 0.0 },
  { symbol: "GOOGL", name: "Google Inc.", price: 90.00, change: 0.0 },
  { symbol: "META", name: "Meta Platforms", price: 125.00, change: 0.0 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 290.00, change: 0.0 },
  { symbol: "THYAO", name: "Türk Hava Yolları", price: 140.00, change: 0.0 },
  { symbol: "EREGL", name: "Ereğli Demir Çelik", price: 38.00, change: 0.0 }
];

export const HISTORICAL_STOCKS_2023: Record<string, number[]> = {
  AAPL: [130.00, 145.00, 155.00, 162.00, 173.00, 184.00, 191.00, 178.00, 174.00, 170.00, 190.00, 192.00],
  TSLA: [110.00, 190.00, 195.00, 165.00, 193.00, 250.00, 265.00, 245.00, 240.00, 200.00, 235.00, 248.00],
  MSFT: [235.00, 250.00, 280.00, 300.00, 330.00, 340.00, 335.00, 325.00, 315.00, 338.00, 375.00, 376.00],
  AMZN: [85.00, 95.00, 103.00, 105.00, 120.00, 130.00, 132.00, 138.00, 127.00, 119.00, 146.00, 151.00],
  NVDA: [145.00, 230.00, 270.00, 280.00, 380.00, 420.00, 460.00, 485.00, 430.00, 410.00, 480.00, 495.00],
  GOOGL: [90.00, 95.00, 103.00, 108.00, 122.00, 120.00, 128.00, 135.00, 131.00, 123.00, 132.00, 139.00],
  META: [125.00, 170.00, 205.00, 240.00, 260.00, 285.00, 310.00, 300.00, 290.00, 302.00, 335.00, 353.00],
  NFLX: [290.00, 310.00, 330.00, 325.00, 360.00, 410.00, 435.00, 415.00, 385.00, 395.00, 465.00, 486.00],
  THYAO: [140.00, 145.00, 175.00, 185.00, 210.00, 240.00, 255.00, 260.00, 245.00, 230.00, 250.00, 262.00],
  EREGL: [38.00, 44.00, 42.00, 37.00, 39.00, 43.00, 48.00, 46.00, 43.00, 41.00, 45.00, 47.00]
};

export const MONTHS_2023 = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: "q1",
    title: "Finansal Sağlık Analizini Tamamla",
    description: "FinQuest Analiz testini doldurarak kişisel durumunu ve başlangıç skorunu belirle.",
    category: "Genel",
    xpReward: 150,
    completed: false
  },
  {
    id: "q2",
    title: "Bütçe Planı Oluştur",
    description: "Harcamalarını takip edebilmek için aylık bütçe hedefini gözden geçir ve ilk harcama kaydını simüle et.",
    category: "Bütçe",
    xpReward: 150,
    completed: false
  },
  {
    id: "q3",
    title: "İlk Hisse Senedi Alımı",
    description: "Sanal borsada dilediğin hisseden en az 1 adet satın alarak piyasalara ilk adımını at.",
    category: "Yatırım",
    xpReward: 250,
    completed: false
  },
  {
    id: "q4",
    title: "Entegre Sistemi Keşfet",
    description: "Bütçe-Borsa entegrasyonu açıkken bir hisse senedi işlemi gerçekleştir ve portföyün bütçenle ilişkisini gör.",
    category: "Genel",
    xpReward: 100,
    completed: false
  },
  {
    id: "q5",
    title: "Bir Bilgi Kartı Çevir",
    description: "Öğrenme sekmesinde yer alan bilgi kartlarından birini çevirerek finansal terimleri öğren.",
    category: "Tasarruf",
    xpReward: 50,
    completed: false
  }
];
