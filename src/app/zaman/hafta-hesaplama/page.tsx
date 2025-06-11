import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const getWeekNumber = (d: Date): [number, number] => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return [date.getUTCFullYear(), weekNo];
};

const getDateOfISOWeek = (w: number, y: number): { startDate: Date, endDate: Date } => {
    const simple = new Date(Date.UTC(y, 0, 1 + (w - 1) * 7));
    const dow = simple.getUTCDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setUTCDate(simple.getUTCDate() - simple.getUTCDay() + 1);
    else
        ISOweekStart.setUTCDate(simple.getUTCDate() + 8 - simple.getUTCDay());
    
    const ISOweekEnd = new Date(ISOweekStart);
    ISOweekEnd.setUTCDate(ISOweekStart.getUTCDate() + 6);

    return { startDate: ISOweekStart, endDate: ISOweekEnd };
}

const formatDate = (d: Date): string => {
    return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'UTC' }).format(d);
}

const pageConfig = {
  title: "Hafta Hesaplama Aracı | Tarihe ve Haftaya Göre Bulma",
  description: "Bir tarihin yılın kaçıncı haftası olduğunu bulun veya belirli bir haftanın başlangıç ve bitiş tarihlerini öğrenin. ISO 8601 standardına göre doğru hesaplama.",
  keywords: ["hafta hesaplama", "hafta numarası", "yılın haftası", "tarihten hafta bulma", "iso 8601"],
  calculator: {
    title: "Hafta Numarası Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama türünü seçin ve ilgili bilgileri girerek hafta numarasını veya haftanın tarihlerini öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'calculationType', label: 'Hesaplama Türü', type: 'select', options: [
        { value: 'dateToWeek', label: 'Tarihten Hafta Numarası Bul' },
        { value: 'weekToDate', label: 'Hafta Numarasından Tarih Bul' },
      ]},
      { id: 'inputDate', label: 'Tarih', type: 'date', defaultValue: new Date().toISOString().split('T')[0], displayCondition: { field: 'calculationType', value: 'dateToWeek' } },
      { id: 'year', label: 'Yıl', type: 'number', defaultValue: new Date().getFullYear(), displayCondition: { field: 'calculationType', value: 'weekToDate' }, props: { min: "1970", max: "2100" } },
      { id: 'weekNumber', label: 'Hafta Numarası', type: 'number', defaultValue: getWeekNumber(new Date())[1], displayCondition: { field: 'calculationType', value: 'weekToDate' }, props: { min: "1", max: "53" } },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { calculationType, inputDate, year, weekNumber } = inputs;

        if (calculationType === 'dateToWeek') {
            if (!inputDate) return { summary: { error: { label: 'Hata', value: 'Lütfen bir tarih girin.' } } };
            const date = new Date(`${inputDate}T12:00:00Z`);
            const [weekYear, weekNo] = getWeekNumber(date);
            return {
                summary: {
                    weekYear: { label: 'Haftanın Yılı', value: `${weekYear}` },
                    weekNo: { label: 'Hafta Numarası', value: `${weekNo}. Hafta`, isHighlighted: true },
                }
            };
        } else { // weekToDate
            const yearNum = Number(year);
            const weekNum = Number(weekNumber);
            if (!yearNum || !weekNum || weekNum < 1 || weekNum > 53) {
                return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir yıl (1970-2100) ve hafta numarası (1-53) girin.' } } };
            }
            const { startDate, endDate } = getDateOfISOWeek(weekNum, yearNum);
            return {
                summary: {
                    weekRange: { label: `${yearNum} Yılı, ${weekNum}. Hafta Tarih Aralığı`, value: `${formatDate(startDate)} - ${formatDate(endDate)}`, isHighlighted: true },
                    start: { label: 'Hafta Başlangıcı (Pazartesi)', value: formatDate(startDate) },
                    end: { label: 'Hafta Bitişi (Pazar)', value: formatDate(endDate) },
                }
            };
        }
    },
  },
  content: {
    sections: [
      {
        title: "Hafta Numarası ve ISO 8601 Standardı",
        content: (
          <p>
            Hafta numarası, bir yıl içindeki belirli bir haftayı tanımlamak için kullanılır. Ancak farklı sistemler haftaları farklı şekillerde numaralandırabilir. Uluslararası tutarlılığı sağlamak için bu hesaplayıcı, <strong>ISO 8601</strong> standardını kullanır. Bu standarda göre:
            <br/>- Haftalar Pazartesi günü başlar.
            <br/>- Bir yılın ilk haftası (1. Hafta), o yılın ilk Perşembe gününü içeren haftadır. Bu aynı zamanda 4 Ocak gününü içeren hafta olarak da düşünülebilir.
            <br/>- Bu kurallar nedeniyle bir yıl 52 veya 53 hafta olabilir ve bir tarihin hafta numarası, ait olduğu takvim yılından farklı bir yıla ait olabilir (örneğin 2 Ocak 2027, 2026'nın 52. haftasıdır).
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bir yılda neden 53 hafta olabilir?",
        answer: "Normal bir yıl 365 gün, yani 52 hafta ve 1 gündür. Artık yıllar ise 52 hafta ve 2 gündür. Bu ekstra günler birikerek, yaklaşık olarak her 5-6 yılda bir, yılın 53 hafta sürmesine neden olur. Bu durum, yılın Perşembe günü başlaması veya artık yılın Çarşamba günü başlaması gibi durumlarda ortaya çıkar."
      },
      {
        question: "Bu hesaplayıcı hangi alanlarda faydalıdır?",
        answer: "Hafta numarası, özellikle proje yönetimi, üretim planlaması, kurumsal raporlama ve akademik takvimlerde yaygın olarak kullanılır. Haftalık hedefler belirlemek, tekrarlayan etkinlikleri planlamak veya belirli bir haftadaki verileri analiz etmek için çok kullanışlıdır."
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
        resultTitle="Hafta Bilgisi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}