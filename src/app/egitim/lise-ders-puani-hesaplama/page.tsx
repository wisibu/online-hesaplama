import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Lise Ders Puanı Hesaplama | OnlineHesaplama",
  description: "Lise ders puanınızı, yazılı, proje ve performans notlarınızı girerek MEB yönetmeliğine uygun şekilde hesaplayın. Dönem sonu ders puanınızı öğrenin.",
  keywords: ["lise ders puanı", "lise not ortalaması", "dönem puanı hesaplama", "lise yazılı ortalaması"],
  calculator: {
    title: "Lise Ders Puanı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Bir derse ait tüm yazılı, performans ve proje notlarınızı girerek dönem sonu puanınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'note1', label: '1. Yazılı', type: 'number', placeholder: '70' },
      { id: 'note2', label: '2. Yazılı', type: 'number', placeholder: '85' },
      { id: 'note3', label: '1. Performans', type: 'number', placeholder: '90' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const notes = Object.values(inputs)
          .map(val => Number(val))
          .filter(note => !isNaN(note) && note >= 0 && note <= 100);

        if (notes.length === 0) return null;
        
        const average = notes.reduce((sum, note) => sum + note, 0) / notes.length;

        const summary: CalculationResult['summary'] = {
            noteCount: { type: 'result', label: 'Değerlendirilen Not Sayısı', value: notes.length.toString() },
            average: { type: 'result', label: 'Ders Dönem Puanı', value: formatNumber(average), isHighlighted: true },
            status: { type: 'result', label: 'Durum', value: average >= 50 ? 'Başarılı' : 'Başarısız' },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Lise Ders Puanı Nasıl Hesaplanır?",
        content: (
          <p>
            Lisede bir dersin dönem puanı, o döneme ait tüm sınav puanları ile proje, performans çalışması ve ders içi etkinliklere katılım gibi değerlendirmelerden alınan puanların aritmetik ortalaması alınarak hesaplanır. Kısacası, dersten alınan tüm notlar toplanır ve not sayısına bölünür. Bu puan, karne notunuzu ve yıl sonu başarı puanınızı doğrudan etkiler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Proje ödevleri ortalamayı nasıl etkiler?",
        answer: "Proje ödevleri de diğer sınavlar gibi ortalamaya katılır. Eğer bir dersten proje ödevi aldıysanız, bu ödevden aldığınız not da diğer yazılı ve performans notları gibi ortalamaya dahil edilir."
      },
      {
        question: "Ders puanının 50'nin altında olması ne anlama gelir?",
        answer: "Bir dersin dönem puanının 50'nin altında olması, o dersten başarısız olduğunuz anlamına gelir. Yıl sonu ortalamanız 50 ve üzerinde olsa bile, zayıf ders sayınıza göre sınıf tekrarı gibi durumlar söz konusu olabilir. Yönetmelik detayları için okul idarenize danışmanız en doğrusudur."
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
        resultTitle="Lise Ders Puanı Sonucu"
        dynamicFieldsConfig={{
          type: 'single',
          buttonLabel: 'Not Alanı Ekle',
          fieldLabel: 'Not',
          fieldPrefix: 'note'
        }}
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}