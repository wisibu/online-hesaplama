import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "İki Tarih Arası Hafta, Gün, Ay, Yıl Hesaplama | Fark Bulucu",
  description: "İki tarih arasındaki toplam hafta, gün, ay ve yıl farkını kolayca hesaplayın. Süre hesaplama aracımızla geçen zamanı anında öğrenin.",
  keywords: ["iki tarih arası hesaplama", "hafta hesaplama", "tarih farkı", "gün hesaplama", "geçen süre hesaplama"],
  calculator: {
    title: "İki Tarih Arası Süre Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Başlangıç ve bitiş tarihlerini seçerek aradaki zaman farkını gün, ay ve yıl olarak anında görün.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'Başlangıç Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'endDate', label: 'Bitiş Tarihi', type: 'date', defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0] },
      { id: 'includeEndDate', label: 'Bitiş gününü de say', type: 'checkbox', defaultChecked: false },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { startDate, endDate, includeEndDate } = inputs;

        if (!startDate || !endDate) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen başlangıç ve bitiş tarihlerini seçin.' } } };
        }
        
        // Add time to avoid timezone issues making dates off by one day
        const start = new Date(`${startDate}T12:00:00Z`);
        const end = new Date(`${endDate}T12:00:00Z`);

        if (start > end) {
             return { summary: { error: { label: 'Hata', value: 'Başlangıç tarihi, bitiş tarihinden sonra olamaz.' } } };
        }

        let dayDifference = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (includeEndDate) {
            dayDifference += 1;
        }

        if(dayDifference < 0) dayDifference = 0;

        let years = end.getUTCFullYear() - start.getUTCFullYear();
        let months = end.getUTCMonth() - start.getUTCMonth();
        let days = end.getUTCDate() - start.getUTCDate();

        if (includeEndDate) {
            days += 1;
        }

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(end.getUTCFullYear(), end.getUTCMonth(), 0);
            days += lastMonth.getUTCDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }
        
        const summary = {
            totalDays: { label: 'Toplam Gün Farkı', value: `${formatNumber(dayDifference)} gün`, isHighlighted: true },
            totalWeeks: { label: 'Toplam Hafta Farkı', value: `${formatNumber(Math.floor(dayDifference / 7))} hafta, ${dayDifference % 7} gün` },
            detailedDifference: { label: 'Yıl, Ay, Gün Farkı', value: `${years} yıl, ${months} ay, ${days} gün` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Tarihler Arası Süre Nasıl Hesaplanır?",
        content: (
          <p>
            İki tarih arasındaki süreyi hesaplamak, göründüğünden daha karmaşık olabilir. Bunun nedeni, her ayın farklı gün sayısına sahip olması ve artık yılların (4 yılda bir gelen 366 günlük yıllar) hesaba katılması gerekliliğidir. Hesaplama aracımız, bu karmaşıklığı sizin için yönetir. Başlangıç ve bitiş tarihlerini girdiğinizde, seçiminize göre bitiş gününü dahil ederek veya etmeyerek, aradaki toplam gün sayısını ve bu sürenin yıl, ay ve gün cinsinden dökümünü doğru bir şekilde bulur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "'Bitiş gününü de say' seçeneği ne işe yarar?",
        answer: "Bu seçenek işaretlendiğinde, hesaplama bitiş tarihini de süreye dahil eder. Örneğin, 1 Ocak ve 3 Ocak arasını hesaplarken bu seçenek işaretli değilse sonuç 2 gün olur. İşaretli ise, 3 Ocak da sayılarak sonuç 3 gün olarak bulunur. Bu, özellikle 'dahil' konseptinin önemli olduğu izin günü veya proje süresi hesaplamalarında kullanışlıdır."
      },
      {
        question: "Artık yıllar hesaplamayı etkiler mi?",
        answer: "Evet, kesinlikle. Aracımız, seçtiğiniz tarih aralığına denk gelen artık yılları (örneğin 2024, 2028) otomatik olarak tanır ve 29 Şubat gününü hesaplamaya dahil ederek en doğru sonucu verir."
      },
       {
        question: "Bu hesaplayıcı hangi alanlarda kullanılabilir?",
        answer: "Proje teslim tarihlerini belirlemede, iki olay arasında ne kadar zaman geçtiğini öğrenmede, doğum günü veya evlilik yıldönümü gibi özel günler için geri sayımda, kredi veya borç vade sürelerini hesaplamada ve daha birçok alanda bu aracı kullanabilirsiniz."
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
        resultTitle="Hesaplanan Süre"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
