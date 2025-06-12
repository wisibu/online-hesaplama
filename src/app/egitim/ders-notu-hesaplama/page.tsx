import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const getLetterGrade = (score: number): string => {
    if (score >= 90) return "AA";
    if (score >= 85) return "BA";
    if (score >= 80) return "BB";
    if (score >= 75) return "CB";
    if (score >= 70) return "CC";
    if (score >= 65) return "DC";
    if (score >= 60) return "DD";
    if (score >= 50) return "FD";
    return "FF";
};

const pageConfig = {
  title: "Ders Notu Ortalaması Hesaplama | OnlineHesaplama",
  description: "Sınav, vize, final, ve proje notlarınızı ve ağırlık oranlarını girerek ders sonu not ortalamanızı ve harf notunuzu kolayca hesaplayın.",
  keywords: ["ders notu hesaplama", "ders ortalaması hesaplama", "harf notu hesaplama", "vize final ortalama", "geçme notu hesaplama"],
  calculator: {
    title: "Ders Notu Ortalaması Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Notlarınızı ve ağırlıklarını girerek dönem sonu ders ortalamanızı ve harf notunuzu öğrenin. Dinamik olarak yeni not alanları ekleyebilirsiniz.
      </p>
    ),
    // We will handle dynamic fields in the UI component logic, starting with a base set
    inputFields: [
      { id: 'note1', label: 'Not 1', type: 'number', placeholder: '80' },
      { id: 'weight1', label: 'Ağırlık 1 (%)', type: 'number', placeholder: '40' },
      { id: 'note2', label: 'Not 2', type: 'number', placeholder: '70' },
      { id: 'weight2', label: 'Ağırlık 2 (%)', type: 'number', placeholder: '60' },
    ] as InputField[],
    // This calculator needs a more complex state management for dynamic fields, 
    // which is better handled inside the component. 
    // The 'calculate' function here will be adapted to receive a list of notes and weights.
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const notes: { note: number, weight: number }[] = [];
        const inputKeys = Object.keys(inputs);
        
        for (let i = 1; ; i++) {
            const noteKey = `note${i}`;
            const weightKey = `weight${i}`;
            if (inputKeys.includes(noteKey) && inputKeys.includes(weightKey)) {
                const note = Number(inputs[noteKey]);
                const weight = Number(inputs[weightKey]);
                if (isNaN(note) || isNaN(weight) || note < 0 || note > 100 || weight <= 0) {
                    // Skip invalid entries silently or handle error
                    continue;
                }
                notes.push({ note, weight });
            } else {
                break; // No more notes
            }
        }

        if (notes.length === 0) return null;
        
        const totalWeight = notes.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight !== 100) {
            // alert is client side, we can't do it here. We should reflect this in the result.
            // For now, we'll return a specific message.
             return {
                summary: {
                    error: { type: 'error', label: 'Hata', value: `Ağırlıkların toplamı 100 olmalıdır. Mevcut toplam: ${totalWeight}%` },
                }
            };
        }

        const weightedAverage = notes.reduce((sum, item) => sum + item.note * (item.weight / 100), 0);
        const letterGrade = getLetterGrade(weightedAverage);

        const summary: CalculationResult['summary'] = {
            weightedAverage: { type: 'result', label: 'Ağırlıklı Ortalama', value: formatNumber(weightedAverage), isHighlighted: true },
            letterGrade: { type: 'result', label: 'Harf Notu', value: letterGrade },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Ders Geçme Notu ve Ortalama Nasıl Hesaplanır?",
        content: (
          <p>
            Bir dersteki başarınız, vize, final, ödev, proje gibi farklı değerlendirme kalemlerinden aldığınız notların, o kalemlerin ağırlıklarıyla çarpılıp toplanmasıyla elde edilen ağırlıklı ortalamaya göre belirlenir. Her üniversitenin veya lisenin kendi not sistemi (çan eğrisi, mutlak değerlendirme) ve harf notu karşılıkları olabilir. Bu araç, girdiğiniz not ve ağırlıklara göre genel bir ağırlıklı ortalama ve yaygın olarak kullanılan bir sisteme göre harf notu tahmini sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ağırlıkların toplamı neden 100 olmalı?",
        answer: "Bir dersin notunu oluşturan tüm bileşenlerin (vize, final vb.) toplam etki payı %100'ü temsil eder. Ağırlıkların toplamının 100 olması, hesaplamanın doğru ve adil bir şekilde yapılmasını sağlar."
      },
      {
        question: "Harf notu neye göre belirlenir?",
        answer: "Harf notu, hesaplanan sayısal not ortalamanızın, üniversitenizin veya okulunuzun belirlediği not aralıklarına göre hangi harfe denk geldiğini gösterir. Örneğin, 70-74.99 arası CC, 85-89.99 arası BA olabilir. Bu aralıklar kurumdan kuruma değişiklik gösterebilir."
      }
    ]
  }
} as const;

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: [...pageConfig.keywords],
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
        resultTitle="Ders Notu Sonuçları"
        dynamicFieldsConfig={{
          type: 'paired',
          buttonLabel: 'Not Alanı Ekle',
          fieldLabel: 'Not',
          fieldPrefix: 'note',
          pairedFieldLabel: 'Ağırlık',
          pairedFieldPrefix: 'weight',
        }}
      />
      <RichContent sections={[...pageConfig.content.sections]} faqs={[...pageConfig.content.faqs]} />
    </>
  );
}