import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const weekDays = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

const pageConfig = {
  title: "Hangi Gün Hesaplama | Tarih Hangi Güne Denk Geliyor? | OnlineHesaplama",
  description: "Geçmiş veya gelecek bir tarihin haftanın hangi gününe (Pazartesi, Salı, vb.) denk geldiğini anında öğrenin. Doğum günü, yıldönümü veya özel gün planlaması yapın.",
  keywords: ["hangi gün hesaplama", "tarih hangi gün", "gün bulma", "doğum günü hesaplama", "haftanın günü"],
  calculator: {
    title: "Tarih Hangi Güne Denk Geliyor?",
    description: (
      <p className="text-sm text-gray-600">
        Haftanın hangi gününe denk geldiğini merak ettiğiniz tarihi seçin.
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
        // Adjust for timezone offset to prevent off-by-one day errors
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userTimezoneOffset);

        const dayOfWeek = weekDays[correctedDate.getDay()];
        const formattedDate = correctedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

        const summary = {
            result: { label: `${formattedDate} tarihi`, value: dayOfWeek },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Tarihten Gün Bulma Nasıl Çalışır?",
        content: (
          <p>
            Bu hesaplayıcı, modern takvim sistemlerinin (Gregoryen takvimi) matematiksel kurallarına dayalı olarak çalışır. Girdiğiniz herhangi bir tarih için, bilgisayarların dahili saat ve takvim fonksiyonlarını kullanarak o tarihin haftanın hangi gününe karşılık geldiğini hatasız bir şekilde belirler. Bu, özellikle uzak bir gelecekteki veya geçmişteki bir tarihin gününü merak ettiğinizde oldukça kullanışlıdır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Doğum günüm hangi güne denk geliyor?",
        answer: "Doğum tarihinizi seçerek o yıl hangi günde doğduğunuzu veya önümüzdeki yıllarda doğum gününüzün hangi güne denk geleceğini kolayca öğrenebilirsiniz. Bu, parti veya kutlama planlamak için harika bir yoldur."
      },
      {
        question: "Bu hesaplayıcı artık yılları dikkate alıyor mu?",
        answer: "Evet, hesaplama algoritması 4 yılda bir gelen artık yılları (Şubat ayının 29 gün çektiği yıllar) otomatik olarak dikkate alır ve sonucu buna göre doğru bir şekilde hesaplar. Bu sayede, uzun dönemli hesaplamalarda bile hata payı olmaz."
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
        resultTitle="Tarih Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}