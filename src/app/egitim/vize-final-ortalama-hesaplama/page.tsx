import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Vize Final Not Ortalaması Hesaplama | OnlineHesaplama",
  description: "Vize ve final notlarınızı ve ağırlık yüzdelerini girerek ders ortalamanızı, harf notunuzu ve geçme durumunuzu hesaplayın. Finalde kaç almanız gerektiğini öğrenin.",
  keywords: ["vize final hesaplama", "ders ortalaması hesaplama", "harf notu hesaplama", "finalde kaç almalıyım"],
  calculator: {
    title: "Vize Final Ortalama Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Notlarınızı ve ağırlıkları girerek ders sonu ortalamanızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'vizeNotu', label: 'Vize Notu', type: 'number', placeholder: '70' },
      { id: 'vizeYuzdesi', label: 'Vize Etki Yüzdesi (%)', type: 'number', placeholder: '40' },
      { id: 'finalNotu', label: 'Final Notu', type: 'number', placeholder: '85' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { vizeNotu, vizeYuzdesi, finalNotu } = inputs as { vizeNotu: number, vizeYuzdesi: number, finalNotu: number };

        if ([vizeNotu, vizeYuzdesi, finalNotu].some(v => v === null || isNaN(v) || v < 0 )) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanlara pozitif sayısal değerler girin.' } } };
        }
        
        if (vizeYuzdesi > 100) {
             return { summary: { error: { label: 'Hata', value: 'Vize etki yüzdesi 100\'den büyük olamaz.' } } };
        }
        
        const finalYuzdesi = 100 - vizeYuzdesi;
        const ortalama = (vizeNotu * (vizeYuzdesi / 100)) + (finalNotu * (finalYuzdesi / 100));
        
        const getHarfNotu = (ort: number) => {
            if (ort >= 90) return 'AA';
            if (ort >= 85) return 'BA';
            if (ort >= 80) return 'BB';
            if (ort >= 75) return 'CB';
            if (ort >= 65) return 'CC';
            if (ort >= 58) return 'DC';
            if (ort >= 50) return 'DD';
            if (ort >= 40) return 'FD';
            return 'FF';
        };

        const harfNotu = getHarfNotu(ortalama);
        const gectiMi = (ortalama >= 50 && finalNotu >= 50) ? 'Geçtiniz ✅' : 'Kaldınız ❌';

        const summary = {
            ortalama: { label: 'Ders Sonu Ortalaması', value: formatNumber(ortalama, 2), isHighlighted: true },
            harfNotu: { label: 'Harf Notu (Tahmini)', value: harfNotu },
            durum: { label: 'Geçme Durumu', value: gectiMi },
            finalEtki: { label: 'Final Etki Yüzdesi', value: `%${finalYuzdesi}`},
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Ders Ortalaması Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Bir dersteki dönem sonu başarı puanı, genellikle vize ve final sınavlarının belirli yüzdelerle ağırlıklandırılmasıyla hesaplanır. En yaygın yöntem aşağıdaki gibidir:
            </p>
            <p className="font-mono bg-gray-100 p-4 rounded-lg my-2 text-center">
              Ortalama = (Vize Notu × Vize Yüzdesi) + (Final Notu × Final Yüzdesi)
            </p>
            <p>Örneğin, vize notunuz 70 ve %40 etkiliyse, final notunuz da 85 ve %60 etkiliyse hesaplama şöyle olur: (70 * 0.40) + (85 * 0.60) = 28 + 51 = 79. Ortalamanız 79 (CB) olur.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Finalden en az kaç almam gerekir?",
        answer: "Bu, üniversitenizin yönetmeliğine bağlıdır. Genellikle, bir dersi geçmek için hem dönem sonu ortalamanızın hem de final sınav notunuzun belirli bir barajın (örneğin 50) üzerinde olması gerekir. Sadece ortalamanızın yetmesi yeterli olmayabilir, finalden de minimum geçme notunu almanız gerekebilir."
      },
      {
        question: "Bütünleme sınavı notu final yerine mi geçer?",
        answer: "Evet, çoğu üniversitede final sınavına girmeyen veya finalde başarısız olan öğrenciler için yapılan bütünleme sınavından alınan not, doğrudan final notu yerine geçer ve dönem sonu ortalaması bu yeni nota göre tekrar hesaplanır."
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
        resultTitle="Ders Başarı Durumu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}