import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'note1', label: '1. Not', type: 'number', placeholder: '85' },
  { id: 'note2', label: '2. Not', type: 'number', placeholder: '70' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
    'use server';
    const notes = Object.values(inputs)
      .map(val => Number(val))
      .filter(note => !isNaN(note) && note >= 0 && note <= 100);

    if (notes.length === 0) {
      return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen en az bir geçerli not girin.' } } };
    }
    
    const average = notes.reduce((sum, note) => sum + note, 0) / notes.length;

    const summary: CalculationResult['summary'] = {
        noteCount: { type: 'info', label: 'Toplam Not Sayısı', value: notes.length.toString() },
        average: { type: 'result', label: 'Ders Not Ortalaması', value: formatNumber(average), isHighlighted: true },
        status: { type: 'result', label: 'Durum', value: average >= 50 ? 'Geçer ✅' : 'Kalır ❌' },
    };
      
    return { summary };
}

const content = {
  sections: [
    {
      title: "e-Okul Ders Notu Nasıl Hesaplanır?",
      content: (
        <p>
          Milli Eğitim Bakanlığı'nın yönetmeliğine göre, bir dersteki dönem sonu puanı, tüm yazılı sınav puanları ile performans çalışmalarından (proje, ödev, performans görevi) alınan puanların aritmetik ortalamasıyla hesaplanır. Yani, tüm notlar toplanır ve toplam not sayısına bölünür. Bu hesaplayıcı, bu basit ama önemli işlemi sizin için otomatik olarak yapar.
        </p>
      )
    }
  ],
  faqs: [
    {
      question: "Kaç tane yazılı ve performans notu girmeliyim?",
      answer: "Dersten aldığınız tüm yazılı ve performans notlarını girmelisiniz. Hesap makinemizdeki '+ Not Ekle' butonunu kullanarak ihtiyacınız kadar not girişi yapabilirsiniz."
    },
    {
      question: "Sözlü notları da dahil mi?",
      answer: "Evet, yeni yönetmeliklerde 'sözlü notu' terimi yerine 'performans notu' veya 'performans çalışması' ifadeleri kullanılmaktadır. Öğretmeninizin verdiği tüm performans notlarını bu hesaplamaya dahil etmelisiniz."
    }
  ]
};

export const metadata: Metadata = {
  title: "e-Okul Not Ortalaması Hesaplama | OnlineHesaplama",
  description: "e-Okul sistemiyle uyumlu, yazılı ve performans notlarınızı girerek ders notu ortalamanızı kolayca hesaplayın. Lise ve ortaokul için uygundur.",
  keywords: ["e-okul not hesaplama", "e-okul ortalama", "yazılı ortalaması hesaplama", "performans notu hesaplama"],
  openGraph: {
    title: "e-Okul Not Ortalaması Hesaplama | OnlineHesaplama",
    description: "e-Okul sistemiyle uyumlu, yazılı ve performans notlarınızı girerek ders notu ortalamanızı kolayca hesaplayın. Lise ve ortaokul için uygundur.",
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="e-Okul Not Ortalaması Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Yazılı ve performans notlarınızı girerek ders ortalamanızı hesaplayın. İhtiyacınız kadar not alanı ekleyebilirsiniz.
          </p>
        }
        inputFields={inputFields}
        calculate={calculate}
        resultTitle="e-Okul Not Sonuçları"
        dynamicFieldsConfig={{
          type: 'single',
          buttonLabel: 'Not Ekle',
          fieldLabel: 'Not',
          fieldPrefix: 'note'
        }}
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}