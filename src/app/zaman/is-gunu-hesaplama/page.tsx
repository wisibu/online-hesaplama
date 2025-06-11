import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// Official public holidays in Turkey for 2024 and 2025
const publicHolidays: string[] = [
  // 2024
  "2024-01-01", // Yılbaşı
  "2024-04-09", // Ramazan Bayramı Arifesi (yarım gün olsa da tam sayılıyor)
  "2024-04-10", // Ramazan Bayramı 1. Gün
  "2024-04-11", // Ramazan Bayramı 2. Gün
  "2024-04-12", // Ramazan Bayramı 3. Gün
  "2024-04-23", // Ulusal Egemenlik ve Çocuk Bayramı
  "2024-05-01", // Emek ve Dayanışma Günü
  "2024-05-19", // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  "2024-06-15", // Kurban Bayramı Arifesi (yarım gün olsa da tam sayılıyor)
  "2024-06-16", // Kurban Bayramı 1. Gün
  "2024-06-17", // Kurban Bayramı 2. Gün
  "2024-06-18", // Kurban Bayramı 3. Gün
  "2024-06-19", // Kurban Bayramı 4. Gün
  "2024-07-15", // Demokrasi ve Milli Birlik Günü
  "2024-08-30", // Zafer Bayramı
  "2024-10-28", // Cumhuriyet Bayramı Arifesi (yarım gün olsa da tam sayılıyor)
  "2024-10-29", // Cumhuriyet Bayramı
  // 2025
  "2025-01-01", // Yılbaşı
  "2025-03-29", // Ramazan Bayramı Arifesi
  "2025-03-30", // Ramazan Bayramı 1. Gün
  "2025-03-31", // Ramazan Bayramı 2. Gün
  "2025-04-01", // Ramazan Bayramı 3. Gün
  "2025-04-23", // Ulusal Egemenlik ve Çocuk Bayramı
  "2025-05-01", // Emek ve Dayanışma Günü
  "2025-05-19", // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  "2025-06-05", // Kurban Bayramı Arifesi
  "2025-06-06", // Kurban Bayramı 1. Gün
  "2025-06-07", // Kurban Bayramı 2. Gün
  "2025-06-08", // Kurban Bayramı 3. Gün
  "2025-06-09", // Kurban Bayramı 4. Gün
  "2025-07-15", // Demokrasi ve Milli Birlik Günü
  "2025-08-30", // Zafer Bayramı
  "2025-10-28", // Cumhuriyet Bayramı Arifesi
  "2025-10-29", // Cumhuriyet Bayramı
];

const pageConfig = {
  title: "İş Günü Hesaplama Aracı | Tarih Ekleme & Çıkarma",
  description: "Belirli bir tarihe iş günü ekleyip çıkararak ileri veya geri tarih hesaplaması yapın. Hafta sonları ve resmi tatiller otomatik olarak atlanır.",
  keywords: ["iş günü hesaplama", "iş günü sayacı", "tarihe gün ekleme", "mesai günü hesaplama", "tatil günü hesaplama"],
  calculator: {
    title: "İş Günü Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Başlangıç tarihini ve iş günü sayısını girerek hedef tarihi bulun. Hafta sonları (Cumartesi, Pazar) ve resmi tatiller hesaba katılmaz.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'Başlangıç Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'businessDays', label: 'Eklenecek/Çıkarılacak İş Günü', type: 'number', defaultValue: 10, props: { min: "1" } },
      { id: 'direction', label: 'Yön', type: 'select', options: [{value: 'add', label: 'İleri'}, {value: 'subtract', label: 'Geri'}] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { startDate, businessDays, direction } = inputs;
        let days = Number(businessDays);

        if (!startDate || isNaN(days) || days <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tarih ve pozitif bir gün sayısı girin.' } } };
        }
        
        const holidaySet = new Set(publicHolidays);
        const currentDate = new Date(`${startDate}T12:00:00Z`);
        const dir = direction === 'add' ? 1 : -1;
        let calendarDays = 0;

        while (days > 0) {
            currentDate.setDate(currentDate.getDate() + dir);
            calendarDays++;
            const dayOfWeek = currentDate.getUTCDay(); // Sunday = 0, Saturday = 6

            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // İş günü (Pzt-Cuma)
                const dateString = currentDate.toISOString().split('T')[0];
                if (!holidaySet.has(dateString)) {
                    days--;
                }
            }
        }
        
        const resultDate = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'full' }).format(currentDate);

        const summary = {
            resultDate: { label: 'Hedef Tarih', value: resultDate, isHighlighted: true },
            totalCalendarDays: { label: 'Geçen Takvim Günü', value: `${formatNumber(calendarDays)} gün` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "İş Günü Nedir ve Nasıl Hesaplanır?",
        content: (
          <p>
            İş günü, genel olarak hafta sonları (Cumartesi ve Pazar) ile resmi tatil günlerinin dışında kalan günleri ifade eder. Bu hesaplama aracı, bir başlangıç tarihine belirttiğiniz sayıda iş gününü ekleyerek veya çıkararak gelecekteki veya geçmişteki bir iş gününü bulmanızı sağlar. Proje teslim tarihlerini belirlemek, yasal süreleri hesaplamak veya teslimat zamanlarını tahmin etmek gibi birçok durumda son derece kullanışlıdır. Aracımız, 2024 ve 2025 yılları için Türkiye'deki tüm resmi tatilleri otomatik olarak tanır ve hesaplama dışı bırakır.
          </p>
        )
      },
      {
        title: "Hesaplamada Kullanılan 2024-2025 Resmi Tatilleri",
        content: (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {publicHolidays.map(holiday => (
              <li key={holiday}>{new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(holiday))}</li>
            ))}
          </ul>
        )
      }
    ],
    faqs: [
      {
        question: "Yarım gün olan arife günleri nasıl hesaplanıyor?",
        answer: "Hesaplamanın pratikliği ve genel iş dünyası uygulamaları göz önüne alınarak, Ramazan ve Kurban Bayramı arifeleri gibi yarım günlük tatiller tam gün tatil olarak kabul edilir ve iş günü hesaplamasına dahil edilmez."
      },
      {
        question: "Cumartesi günleri çalışan bir şirket için bu araç uygun mu?",
        answer: "Bu araç, standart iş haftası olan Pazartesi-Cuma düzenine göre çalışır ve Cumartesi günlerini hafta sonu tatili olarak sayar. Cumartesi günlerini iş günü olarak içeren özel bir hesaplama şu an için desteklenmemektedir."
      },
       {
        question: "Gelecek yıllar için de hesaplama yapabilir miyim?",
        answer: "Hesaplayıcı şu anda 2024 ve 2025 yılları için tanımlanmış resmi tatil listesini kullanmaktadır. Bu tarihler dışındaki yıllar için yapılan hesaplamalarda yalnızca hafta sonları dikkate alınır, o yıllara ait resmi tatiller atlanmaz."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
  openGraph: {
    title: pageConfig.title,
    description: pageConfig.description,
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}