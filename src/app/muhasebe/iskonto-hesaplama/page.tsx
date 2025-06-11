import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "İskonto (İndirim) Hesaplama | OnlineHesaplama",
  description: "Bir ürünün fiyatı üzerinden tekli veya çoklu (zincirleme) iskonto oranlarına göre indirim tutarını ve net fiyatı anında hesaplayın.",
  keywords: ["iskonto hesaplama", "indirim hesaplama", "yüzde indirim", "zincirleme iskonto"],
  calculator: {
    title: "İskonto Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Fiyat ve iskonto oran(lar)ını girerek indirimli tutarı hesaplayın. Zincirleme indirim için "İskonto Ekle" butonunu kullanabilirsiniz.
      </p>
    ),
    inputFields: [
      { id: 'price', label: 'Fiyat (Liste Fiyatı)', type: 'number', placeholder: '1000' },
      { id: 'discount1', label: '1. İskonto Oranı (%)', type: 'number', placeholder: '20' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const price = Number(inputs.price);
        if (isNaN(price) || price <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir fiyat girin.' } } };
        }

        let currentPrice = price;
        const discountRates = Object.keys(inputs)
          .filter(key => key.startsWith('discount'))
          .sort((a, b) => {
              const numA = parseInt(a.replace('discount', ''), 10);
              const numB = parseInt(b.replace('discount', ''), 10);
              return numA - numB;
          })
          .map(key => Number(inputs[key] || 0) / 100);

        if (discountRates.some(isNaN) || discountRates.some(rate => rate < 0)) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli, negatif olmayan iskonto oranları girin.' } } };
        }

        for (const rate of discountRates) {
            if (rate > 0) {
                currentPrice = currentPrice * (1 - rate);
            }
        }
        
        const totalDiscountAmount = price - currentPrice;

        const summary: CalculationResult['summary'] = {
            originalPrice: { label: 'Liste Fiyatı', value: formatCurrency(price) },
            totalDiscount: { label: 'Toplam İndirim Tutarı', value: formatCurrency(totalDiscountAmount) },
            finalPrice: { label: 'İskontolu Net Fiyat', value: formatCurrency(currentPrice) },
            discountCount: { label: 'Uygulanan İskonto Sayısı', value: `${discountRates.filter(r => r > 0).length} adet` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "İskonto Nedir ve Nasıl Hesaplanır?",
        content: (
          <p>
            İskonto, bir mal veya hizmetin liste fiyatı üzerinden yapılan indirimdir. Ticarette satışları artırmak, müşteri sadakati oluşturmak veya nakit akışını hızlandırmak gibi amaçlarla kullanılır. Tekli iskonto, liste fiyatı üzerinden tek bir yüzde oranının uygulanmasıyla hesaplanır. <strong>Zincirleme iskonto</strong> ise, bir fiyata art arda birden fazla indirim uygulanmasıdır. Önemli olan nokta, ikinci iskontonun ilk indirim yapıldıktan sonraki ara tutar üzerinden hesaplanmasıdır, başlangıçtaki liste fiyatı üzerinden değil.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "%20 + %10 indirim, %30 indirim anlamına mı gelir?",
        answer: "Hayır, bu yaygın bir yanılgıdır. Zincirleme iskontoda indirimler toplanmaz. Örneğin, 100 TL'lik bir ürüne önce %20 indirim yapıldığında fiyat 80 TL'ye düşer. Sonraki %10'luk indirim bu 80 TL üzerinden yapılır (8 TL indirim) ve net fiyat 72 TL olur. Eğer %30 indirim yapılsaydı net fiyat 70 TL olurdu. Görüldüğü gibi, zincirleme iskonto, oranların toplamından daha az bir indirime tekabül eder."
      },
      {
        question: "İskonto ve KDV ilişkisi nasıldır?",
        answer: "Genellikle, bir faturada önce iskontolar uygulanarak vergisiz net tutar bulunur, daha sonra bu net tutar üzerinden KDV hesaplanarak faturanın genel toplamına ulaşılır. Yani KDV, indirimler düşüldükten sonraki fiyat üzerinden hesaplanır."
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
        resultTitle="İskonto Sonuçları"
        dynamicFieldsConfig={{
          type: 'single',
          buttonLabel: 'İskonto Ekle',
          fieldLabel: 'İskonto Oranı',
          fieldPlaceholder: '10',
          fieldPrefix: 'discount'
        }}
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 