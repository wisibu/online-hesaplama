import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "KDV Hesaplama (Dahil ve Hariç) | OnlineHesaplama",
  description: "KDV dahil fiyattan KDV hariç tutarı veya KDV hariç fiyattan KDV dahil tutarı %1, %10, %20 oranlarıyla anında hesaplayın.",
  keywords: ["kdv hesaplama", "kdv dahil hariç hesaplama", "kdv oranı", "kdv bulma"],
  calculator: {
    title: "KDV Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama türünü seçin, tutarı ve KDV oranını girerek sonucu anında görün.
      </p>
    ),
    inputFields: [
      {
        id: 'calculationType',
        label: 'Hesaplama Yönü',
        type: 'select',
        options: [
          { value: 'exclude', label: 'KDV Hariç Fiyattan KDV Dahil Fiyat Hesaplama' },
          { value: 'include', label: 'KDV Dahil Fiyattan KDV Hariç Fiyat Hesaplama' },
        ],
        defaultValue: 'exclude',
      },
      { id: 'amount', label: 'Tutar (TL)', type: 'number', placeholder: '1000' },
      {
        id: 'kdvRate',
        label: 'KDV Oranı',
        type: 'select',
        options: [
          { value: '0.20', label: 'Genel Oran (%20)' },
          { value: '0.10', label: 'İndirimli Oran (%10)' },
          { value: '0.01', label: 'İndirimli Oran (%1)' },
        ],
        defaultValue: '0.20',
      },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { calculationType, amount, kdvRate } = inputs;
        const numAmount = Number(amount);
        const numKdvRate = Number(kdvRate);

        if (isNaN(numAmount) || numAmount <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }

        let basePrice, kdvAmount, totalPrice;

        if (calculationType === 'exclude') { // Hariçten Dahile
            basePrice = numAmount;
            kdvAmount = basePrice * numKdvRate;
            totalPrice = basePrice + kdvAmount;
        } else { // Dahilden Harice
            totalPrice = numAmount;
            basePrice = totalPrice / (1 + numKdvRate);
            kdvAmount = totalPrice - basePrice;
        }
        
        const summary: CalculationResult['summary'] = {
            basePrice: { type: 'info', label: 'KDV Hariç Tutar (Matrah)', value: formatCurrency(basePrice) },
            kdvAmount: { type: 'info', label: `KDV Tutarı (%${numKdvRate * 100})`, value: formatCurrency(kdvAmount) },
            totalPrice: { type: 'result', label: 'KDV Dahil Toplam Tutar', value: formatCurrency(totalPrice), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "KDV (Katma Değer Vergisi) Nedir?",
        content: (
          <p>
            Katma Değer Vergisi (KDV), bir mal veya hizmetin üretilip tüketiciye ulaşana kadar olan her aşamada eklenen değer üzerinden alınan bir dolaylı vergidir. Nihai olarak vergiyi ödeyen kişi ise ürünü veya hizmeti satın alan son tüketicidir. İşletmeler, müşterilerinden tahsil ettikleri KDV'yi, kendi alışları sırasında ödedikleri KDV'den mahsup ederek kalan tutarı devlete öderler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Türkiye'deki güncel KDV oranları nelerdir?",
        answer: "Türkiye'de üç temel KDV oranı bulunmaktadır: %1 (temel gıda maddeleri, gazete gibi ürünler), %10 (gıda ürünlerinin bir kısmı, sinema, tiyatro gibi hizmetler) ve %20 (genel oran; mobilya, beyaz eşya, elektronik ürünler ve diğer birçok mal ve hizmet için geçerlidir)."
      },
      {
        question: "KDV Hariç fiyattan KDV Dahil fiyat nasıl bulunur?",
        answer: "Çok basit. KDV Hariç Fiyat x (1 + KDV Oranı) = KDV Dahil Fiyat. Örneğin, 1.000 TL'lik bir ürüne %20 KDV eklenecekse, hesaplama 1.000 x (1 + 0.20) = 1.200 TL şeklinde yapılır."
      },
      {
        question: "KDV Dahil fiyattan KDV Hariç fiyat nasıl bulunur?",
        answer: "Bu hesaplama da oldukça basittir. KDV Dahil Fiyat / (1 + KDV Oranı) = KDV Hariç Fiyat. Örneğin, KDV dahil fiyatı 1.200 TL olan ve %20 KDV'ye tabi bir ürünün KDV hariç fiyatı 1.200 / (1 + 0.20) = 1.000 TL olarak bulunur."
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
        resultTitle="KDV Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
