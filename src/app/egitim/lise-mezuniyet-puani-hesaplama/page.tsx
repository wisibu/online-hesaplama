import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Lise Mezuniyet Puanı Hesaplama (Diploma Notu) | OnlineHesaplama",
  description: "9, 10, 11 ve 12. sınıf yıl sonu başarı puanlarınızı girerek lise diploma notunuzu ve mezuniyet puanınızı kolayca hesaplayın.",
  keywords: ["lise mezuniyet puanı hesaplama", "diploma notu hesaplama", "obp hesaplama", "yıl sonu başarı puanı", "ysbp"],
  calculator: {
    title: "Lise Mezuniyet Puanı / Diploma Notu Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Tüm lise yıllarınıza ait yıl sonu başarı puanlarınızı (YSBP) girerek mezuniyet puanınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'grade9', label: '9. Sınıf Yıl Sonu Başarı Puanı', type: 'number', placeholder: '85.50' },
      { id: 'grade10', label: '10. Sınıf Yıl Sonu Başarı Puanı', type: 'number', placeholder: '78.20' },
      { id: 'grade11', label: '11. Sınıf Yıl Sonu Başarı Puanı', type: 'number', placeholder: '92.00' },
      { id: 'grade12', label: '12. Sınıf Yıl Sonu Başarı Puanı', type: 'number', placeholder: '88.75' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const grades = [
            Number(inputs.grade9),
            Number(inputs.grade10),
            Number(inputs.grade11),
            Number(inputs.grade12),
        ];

        if (grades.some(g => isNaN(g) || g < 0 || g > 100)) {
            return null;
        }

        const diplomaScore = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        
        // OBP = Diploma Puanı * 5
        const obp = diplomaScore * 5;

        const summary = {
            diplomaScore: { label: 'Lise Mezuniyet Puanı (Diploma Notu)', value: formatNumber(diplomaScore) },
            obp: { label: 'Ortaöğretim Başarı Puanı (OBP)', value: formatNumber(obp) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Lise Mezuniyet Puanı (Diploma Notu) Nedir ve Nasıl Hesaplanır?",
        content: (
          <p>
            Lise mezuniyet puanı veya diploma notu, lise hayatınız boyunca gösterdiğiniz akademik başarının bir özetidir. 9., 10., 11. ve 12. sınıflardaki Yıl Sonu Başarı Puanlarınızın (YSBP) aritmetik ortalaması alınarak hesaplanır. Bu puan, lise diplomanızda yer alır ve üniversiteye giriş sınavlarında kullanılan Ortaöğretim Başarı Puanı'nın (OBP) temelini oluşturur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ortaöğretim Başarı Puanı (OBP) nedir?",
        answer: "OBP, lise diploma notunuzun 5 ile çarpılmasıyla elde edilen puandır. En düşüğü 250 (50 x 5), en yükseği ise 500 (100 x 5) olabilir. Bu puan, YKS (Yükseköğretim Kurumları Sınavı) yerleştirme puanınıza eklenerek üniversiteye giriş şansınızı doğrudan etkiler."
      },
      {
        question: "Yıl Sonu Başarı Puanımı (YSBP) nereden öğrenebilirim?",
        answer: "Her sınıf düzeyindeki yıl sonu başarı puanınızı e-Okul sisteminden veya lise karnelerinizden öğrenebilirsiniz. Bu puan, o yılki tüm derslerinizin ağırlıklı ortalamasıdır."
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
        resultTitle="Lise Mezuniyet Puanı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}