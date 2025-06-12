import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatDate } from '@/utils/formatting';

const pageConfig = {
  title: "Adet Günü ve Yumurtlama Tarihi Hesaplama | OnlineHesaplama",
  description: "Son adet tarihinizi ve döngü sürenizi girerek bir sonraki adet başlangıç tarihinizi, yumurtlama gününüzü ve doğurganlık döneminizi kolayca hesaplayın.",
  keywords: ["adet günü hesaplama", "yumurtlama hesaplama", "doğurganlık dönemi", "regl takvimi", "periyot hesaplama"],
  calculator: {
    title: "Adet Günü ve Yumurtlama Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Son adetinizin ilk gününü ve döngü sürenizi girerek tahmini tarihleri öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'sonAdetTarihi', label: 'Son Adetinizin İlk Günü', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'donguSuresi', label: 'Ortalama Adet Döngüsü Süresi (Gün)', type: 'number', defaultValue: '28' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { sonAdetTarihi: sonAdetTarihiStr, donguSuresi } = inputs as { sonAdetTarihi: string, donguSuresi: number };
        
        if (!sonAdetTarihiStr || !donguSuresi || donguSuresi < 15 || donguSuresi > 45) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tarih ve döngü süresi (15-45 gün arası) girin.' } } };
        }

        const sonAdet = new Date(sonAdetTarihiStr);
        
        const sonrakiAdet = new Date(sonAdet);
        sonrakiAdet.setDate(sonrakiAdet.getDate() + Number(donguSuresi));

        const yumurtlamaGunu = new Date(sonrakiAdet);
        yumurtlamaGunu.setDate(yumurtlamaGunu.getDate() - 14);

        const dogurganBaslangic = new Date(yumurtlamaGunu);
        dogurganBaslangic.setDate(dogurganBaslangic.getDate() - 5);
        
        const dogurganBitis = new Date(yumurtlamaGunu);
        dogurganBitis.setDate(dogurganBitis.getDate() + 1);

        const summary: CalculationResult['summary'] = {
            sonrakiAdet: { type: 'result', label: "Tahmini Sonraki Adet Tarihi", value: formatDate(sonrakiAdet), isHighlighted: true },
            yumurtlamaGunu: { type: 'info', label: "Tahmini Yumurtlama Günü", value: formatDate(yumurtlamaGunu) },
            dogurganlikAraligi: { type: 'info', label: "Doğurganlık Penceresi (Tahmini)", value: `${formatDate(dogurganBaslangic)} - ${formatDate(dogurganBitis)}` },
        };
          
        return { summary, disclaimer: "Bu hesaplama yalnızca tahmini değerler sunar ve tıbbi bir teşhis veya doğum kontrol yöntemi olarak kullanılmamalıdır. Adet düzensizlikleriniz veya sağlık endişeleriniz için lütfen bir doktora danışın." };
    },
  },
  content: {
    sections: [
      {
        title: "Adet Döngüsü ve Yumurtlama Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Adet döngüsü hesaplaması, bir kadının doğurganlık döngüsünü anlamasına yardımcı olan bir yöntemdir. Hesaplama şu adımlarla yapılır:
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Sonraki Adet Tarihi:</strong> Son adetinizin başladığı güne, ortalama döngü süreniz eklenerek bulunur. Örneğin, 28 günlük bir döngünüz varsa, bir sonraki adetiniz 28 gün sonra başlayacaktır.</li>
                <li><strong>Yumurtlama Günü:</strong> Yumurtlama (ovülasyon), genellikle bir sonraki adet kanaması başlamadan yaklaşık 14 gün önce gerçekleşir. Bu nedenle, tahmini sonraki adet tarihinden 14 gün çıkarılarak bulunur.</li>
                <li><strong>Doğurganlık Penceresi:</strong> Kadınların hamile kalma olasılığının en yüksek olduğu dönemdir. Sperm, kadın vücudunda 5 güne kadar yaşayabilirken, yumurta hücresi sadece 24 saat canlı kalır. Bu nedenle, doğurganlık penceresi genellikle yumurtlama gününden önceki 5 günü ve yumurtlama gününü kapsar.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplama yöntemi ne kadar güvenilirdir?",
        answer: "Bu yöntem, adet döngüleri düzenli olan kadınlar için iyi bir tahmin sunar. Ancak stres, hastalık, yaşam tarzı değişiklikleri gibi birçok faktör döngü süresini ve yumurtlama zamanını etkileyebilir. Bu nedenle sonuçlar her zaman %100 doğru olmayabilir."
      },
      {
        question: "Bu hesaplayıcı doğum kontrol yöntemi olarak kullanılabilir mi?",
        answer: "Kesinlikle hayır. Bu hesaplayıcı, yalnızca bilgi ve takip amaçlıdır. Doğurganlık dönemini tahmin etse de, hamileliği önlemek için güvenilir bir yöntem değildir. Etkili doğum kontrol yöntemleri için bir sağlık profesyoneline danışmanız çok önemlidir."
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
        resultTitle="Döngü Takvimi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}