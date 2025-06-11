import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const pageConfig = {
  title: "Yılın Kaçıncı Günü Hesaplama | OnlineHesaplama",
  description: "Seçtiğiniz bir tarihin, yılın kaçıncı günü olduğunu ve yılın bitmesine kaç gün kaldığını anında öğrenin. Artık yılları dikkate alan hassas hesaplama.",
  keywords: ["yılın kaçıncı günü", "gün hesaplama", "tarih hesaplama", "yılın bitmesine kaç gün var"],
  calculator: {
    title: "Yılın Günü Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kaçıncı günde olduğunu öğrenmek istediğiniz tarihi seçin.
      </p>
    ),
    inputFields: [
      { id: 'date', label: 'Tarih', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const dateStr = inputs.date as string;
        if (!dateStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tarih girin.' } } };
        }
        
        const date = new Date(dateStr);
        const dayOfYear = getDayOfYear(date);
        const year = date.getFullYear();
        const daysInYear = isLeapYear(year) ? 366 : 365;
        const daysRemaining = daysInYear - dayOfYear;
        
        const summary = {
            dayOfYear: { label: 'Yılın Günü', value: `${formatNumber(dayOfYear)}. gün` },
            daysRemaining: { label: 'Yılın Bitmesine Kalan Süre', value: `${formatNumber(daysRemaining)} gün` },
            yearInfo: { label: 'Yıl Bilgisi', value: `${year} (${daysInYear} gün, ${isLeapYear(year) ? 'Artık Yıl' : 'Normal Yıl'})` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yılın Günü Nasıl Hesaplanır?",
        content: (
          <p>
           Bu hesaplama, seçtiğiniz tarihin, o yılın 1 Ocak'ından itibaren kaçıncı güne denk geldiğini bulur. Hesaplama yapılırken, o yılın artık yıl olup olmadığı dikkate alınır. Artık yıllar, Şubat ayının 29 gün çektiği ve toplamda 366 günden oluşan yıllardır. Bu durum, 4'e tam bölünen ancak 100'e tam bölünmeyen (örneğin 2024) veya 400'e tam bölünen (örneğin 2000) yıllarda gerçekleşir. Bu hassas hesaplama sayesinde, yıl içindeki konumunuzu net bir şekilde görebilirsiniz.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu bilgi ne işe yarar?",
        answer: "Yılın günü bilgisi, proje planlamasında belirli bir günü referans almak (örneğin, 'projenin 150. gününde teslim edilecek'), istatistiksel analizlerde veya sadece kişisel merak için kullanılabilir."
      },
      {
        question: "Julian Date (Jülyen Tarihi) ile aynı şey mi?",
        answer: "Hayır, tam olarak aynı değildir. Bu hesaplayıcı, bir yıl içindeki gün sırasını (ordinal date) verir. Jülyen tarihi ise, M.Ö. 4713 yılının 1 Ocak gününden bu yana geçen toplam gün sayısını ifade eden daha kapsamlı bir astronomik zaman ölçüm sistemidir."
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
        resultTitle="Yıl Günü Bilgisi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}