import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Tarih Ekleme ve Çıkarma Hesaplama | OnlineHesaplama",
  description: "Belirli bir tarihe gün, ay veya yıl ekleyerek ya da çıkararak yeni tarihi bulun. Proje bitiş tarihi, vade sonu veya yıldönümü hesaplamaları yapın.",
  keywords: ["tarih hesaplama", "tarih ekleme", "tarih çıkarma", "gün ekleme", "ay ekleme", "yıl ekleme"],
  calculator: {
    title: "Tarih Ekleme ve Çıkarma",
    description: (
      <p className="text-sm text-gray-600">
        Başlangıç tarihini seçin ve eklemek veya çıkarmak istediğiniz süreyi girin.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'Başlangıç Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'years', label: 'Yıl', type: 'number', placeholder: '0' },
      { id: 'months', label: 'Ay', type: 'number', placeholder: '0' },
      { id: 'days', label: 'Gün', type: 'number', placeholder: '0' },
      { id: 'operation', label: 'İşlem', type: 'select', options: [{value: 'add', label: 'Ekle'}, {value: 'subtract', label: 'Çıkar'}], defaultValue: 'add' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { startDate: startStr, years, months, days, operation } = inputs as { startDate: string, years: number, months: number, days: number, operation: 'add' | 'subtract' };

        if (!startStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen bir başlangıç tarihi girin.' } } };
        }
        
        const startDate = new Date(startStr);
        const sign = operation === 'add' ? 1 : -1;

        startDate.setFullYear(startDate.getFullYear() + (sign * years));
        startDate.setMonth(startDate.getMonth() + (sign * months));
        startDate.setDate(startDate.getDate() + (sign * days));
        
        const resultDate = startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

        const summary = {
            result: { label: 'Sonuç Tarih', value: resultDate },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Tarih Hesaplama Nasıl Çalışır?",
        content: (
          <p>
           Bu araç, girdiğiniz başlangıç tarihine, belirttiğiniz yıl, ay ve gün sayısını ekler veya çıkarır. Hesaplama, JavaScript'in standart tarih fonksiyonları kullanılarak yapılır ve bu fonksiyonlar takvimdeki düzensizlikleri (artık yıllar, ayların farklı gün sayıları vb.) otomatik olarak yönetir. Örneğin, 31 Ocak tarihine 1 ay eklendiğinde, sonuç Şubat ayının son günü (28 veya 29) olarak doğru bir şekilde hesaplanır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Projemin bitiş tarihini nasıl hesaplarım?",
        answer: "Projenizin başlangıç tarihini girin, proje süresini (örneğin 3 ay, 15 gün) ilgili alanlara yazın ve 'Ekle' seçeneğini işaretleyin. Hesaplayıcı size projenizin tahmini bitiş tarihini verecektir."
      },
      {
        question: "Geçmiş bir tarihi bulabilir miyim?",
        answer: "Evet. Örneğin, '6 ay önce hangi gündü?' diye merak ediyorsanız, başlangıç tarihini bugün olarak ayarlayın, ay alanına 6 girin ve işlem olarak 'Çıkar' seçeneğini seçin."
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
        resultTitle="Hesaplanan Tarih"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}