import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Okula Başlama Yaşı Hesaplama (2024-2025) | MEB",
  description: "Çocuğunuzun doğum tarihini girerek 2024-2025 eğitim yılı için ilkokul 1. sınıfa veya ana sınıfına başlama durumunu MEB kriterlerine göre anında öğrenin.",
  keywords: ["okula başlama yaşı hesaplama", "ilkokul kayıt yaşı", "anaokulu yaşı hesaplama", "kayıt erteleme", "2024-2025 eğitim yılı"],
  calculator: {
    title: "Okula Başlama Yaşı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Çocuğunuzun doğum tarihini girerek hangi okula başlayabileceğini öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'birthDate', label: 'Çocuğun Doğum Tarihi', type: 'date', defaultValue: '2018-10-01' },
      { id: 'year', label: 'Eğitim-Öğretim Yılı', type: 'select', options: [
        { value: '2024', label: '2024-2025' },
        { value: '2025', label: '2025-2026' },
      ], defaultValue: '2024' }
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { birthDate: birthDateStr, year } = inputs as { birthDate: string, year: string };

        if (!birthDateStr) return null;

        const birthDate = new Date(birthDateStr);
        const targetDate = new Date(`${year}-09-30`);

        const ageInMonths = (targetDate.getFullYear() - birthDate.getFullYear()) * 12 + (targetDate.getMonth() - birthDate.getMonth());

        let resultText = "";
        let resultColor = "text-gray-800";

        if (ageInMonths >= 72) {
            resultText = "İlkokul 1. sınıfa kaydı zorunludur, ertelenemez.";
            resultColor = "text-red-600 font-bold";
        } else if (ageInMonths >= 69) {
            resultText = "İlkokul 1. sınıfa kayıtları zorunludur, ancak veli dilekçesiyle kayıtları bir yıl ertelenebilir.";
            resultColor = "text-orange-600 font-bold";
        } else if (ageInMonths >= 66) {
            resultText = "Veli isteğine bağlı olarak ilkokul 1. sınıfa kaydı yapılabilir.";
            resultColor = "text-blue-600 font-bold";
        } else if (ageInMonths >= 57) {
            resultText = "Ana sınıfına kayıt olabilirler.";
             resultColor = "text-green-600 font-bold";
        } else {
            resultText = "Okul öncesi eğitim için henüz yaş kriterini sağlamamaktadır.";
        }

        const summary: CalculationResult['summary'] = {
            age: { type: 'result', label: `Eylül ${year} sonu itibarıyla yaşı`, value: `${Math.floor(ageInMonths/12)} yaş, ${ageInMonths % 12} aylık` },
            status: { type: 'result', label: 'Kayıt Durumu', value: resultText, isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "MEB İlkokul ve Ana Sınıfı Kayıt Yaşı Kriterleri",
        content: (
          <>
            <p>
              Milli Eğitim Bakanlığı'nın yönetmeliğine göre, okullara başlama yaşı ilgili eğitim-öğretim yılının <strong>30 Eylül</strong> tarihi itibarıyla tamamlanan ay üzerinden hesaplanır.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                <li><strong>72 aydan büyük çocuklar:</strong> İlkokul 1. sınıfa kayıtları zorunludur.</li>
                <li><strong>69-71 aylık çocuklar:</strong> İlkokul 1. sınıfa kayıtları zorunludur, ancak veli dilekçesiyle kayıtları bir yıl ertelenebilir.</li>
                <li><strong>66-68 aylık çocuklar:</strong> Veli onayı ile ilkokul 1. sınıfa başlayabilirler. Veli istemezse ana sınıfına yönlendirilirler.</li>
                <li><strong>57-65 aylık çocuklar:</strong> Ana sınıfına kayıt olabilirler.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Kayıt erteleme dilekçesi nereye verilir?",
        answer: "Çocuğunuzun 69, 70 veya 71 aylık olması durumunda kaydını bir yıl erteletmek isterseniz, dilekçenizi çocuğunuzun e-okul sistemi tarafından otomatik olarak atandığı ilkokulun müdürlüğüne vermeniz gerekmektedir."
      },
      {
        question: "Çocuğumun hangi okula atandığını nasıl öğrenebilirim?",
        answer: "Çocuğunuzun hangi ilkokula yerleştirildiğini, e-Devlet kapısı üzerinden 'Milli Eğitim Bakanlığı İlköğretim Okulları Adrese Göre Kayıt Okulu Sorgulama' hizmetini kullanarak öğrenebilirsiniz."
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
        resultTitle="Okula Başlama Durumu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}