import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const GUMRUK_VERGI_ORANI_AB = 0.18; // %18 (AB'den geliyorsa)
const GUMRUK_VERGI_ORANI_DIGER = 0.30; // %30 (Diğer ülkelerden geliyorsa)
const DAMGA_VERGISI = 29.20; // 2024 yılı için maktu damga vergisi

const pageConfig = {
  title: "Gümrük Vergisi Hesaplama (Yolcu Beraberi) | OnlineHesaplama",
  description: "Yurt dışından getirdiğiniz ürünler için 2024 yılı güncel oranlarına göre yaklaşık gümrük vergisi, ÖTV ve KDV tutarını hesaplayın.",
  keywords: ["gümrük vergisi hesaplama", "yurt dışı alışveriş vergisi", "yolcu beraberi eşya"],
  calculator: {
    title: "Gümrük Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Ürün bedeli ve menşe bilgilerini girerek yaklaşık vergi tutarını hesaplayın. Bu hesaplama posta/hızlı kargo ile gelen ürünler içindir.
      </p>
    ),
    inputFields: [
      { id: 'itemValue', label: 'Ürünün Faturadaki Değeri (€)', type: 'number', placeholder: '100' },
      { id: 'shippingCost', label: 'Kargo ve Diğer Giderler (€)', type: 'number', placeholder: '20' },
      { id: 'exchangeRate', label: 'Avro Kuru (TL)', type: 'number', placeholder: '35.5' },
      { id: 'originCountry', label: 'Ürünün Geldiği Ülke', type: 'select', options: [
        { value: 'ab', label: 'Avrupa Birliği Üyesi Ülke' },
        { value: 'diger', label: 'Diğer Ülkeler' },
      ]},
      { id: 'hasOtv', label: 'Ürün ÖTV\'ye tabi mi?', type: 'checkbox', defaultChecked: false },
      { id: 'otvRate', label: 'ÖTV Oranı (%)', type: 'number', placeholder: '20', displayCondition: { field: 'hasOtv', value: true } },

    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { itemValue, shippingCost, exchangeRate, originCountry, hasOtv, otvRate } = inputs;
        const val = Number(itemValue);
        const ship = Number(shippingCost);
        const rate = Number(exchangeRate);
        const otvR = Number(otvRate || 0) / 100;

        if (isNaN(val) || val <= 0 || isNaN(ship) || ship < 0 || isNaN(rate) || rate <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli değerler girin.' } } };
        }
        
        const totalValueEUR = val + ship;
        if (totalValueEUR > 1500) {
            return { summary: { error: { label: 'Uyarı', value: '1500 Avro üzerindeki gönderiler için ticari beyan gerekir, bu hesaplayıcı uygun değildir.' } } };
        }

        const gümrükMatrahi = totalValueEUR * rate;
        const gümrükVergiOrani = originCountry === 'ab' ? GUMRUK_VERGI_ORANI_AB : GUMRUK_VERGI_ORANI_DIGER;
        const gümrükVergisi = gümrükMatrahi * gümrükVergiOrani;

        let otvVergisi = 0;
        let kdvMatrahi = gümrükMatrahi + gümrükVergisi;
        if (hasOtv) {
            const otvMatrahi = gümrükMatrahi;
            otvVergisi = otvMatrahi * otvR;
            kdvMatrahi += otvVergisi;
        }
        
        const kdvVergisi = kdvMatrahi * 0.20; // %20 KDV
        const toplamVergi = gümrükVergisi + otvVergisi + kdvVergisi + DAMGA_VERGISI;
        const toplamMaliyet = gümrükMatrahi + toplamVergi;

        const summary: CalculationResult['summary'] = {
            totalValue: { label: 'Ürünün Toplam Değeri (€)', value: `€${val + ship}` },
            taxBase: { label: 'Gümrük Vergisi Matrahı (TL)', value: formatCurrency(gümrükMatrahi) },
            customsDuty: { label: `Gümrük Vergisi (%${gümrükVergiOrani * 100})`, value: formatCurrency(gümrükVergisi) },
            vat: { label: 'KDV (%20)', value: formatCurrency(kdvVergisi) },
            stampDuty: { label: 'Damga Vergisi', value: formatCurrency(DAMGA_VERGISI) },
            totalTax: { label: 'Toplam Vergi Yükü', value: formatCurrency(toplamVergi), isHighlighted: true },
            totalCost: { label: 'Genel Toplam (Maliyet)', value: formatCurrency(toplamMaliyet) },
        };

        if (hasOtv) {
            summary.otv = { label: `ÖTV (%${otvR * 100})`, value: formatCurrency(otvVergisi) };
        }
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yurt Dışından Gelen Ürünler İçin Vergi Hesaplama",
        content: (
          <p>
            Yurt dışından posta veya hızlı kargo ile kişisel kullanım için getirilen ürünlerin vergilendirilmesi belirli kurallara tabidir. Değeri 150 Avro'yu geçmeyen ürünler için, geldiği ülkeye göre tek ve maktu bir gümrük vergisi uygulanır. Avrupa Birliği'nden geliyorsa %18, diğer ülkelerden geliyorsa %30 oranında vergi alınır. Bu vergi, ürün bedeli ve kargo ücreti toplamı üzerinden hesaplanır. Ayrıca, bu tutara ek olarak ÖTV'ye tabi ürünler için ÖTV ve tüm bu vergiler eklendikten sonraki toplam üzerinden KDV alınır. Bu hesaplayıcı, bu süreci basitleştirerek size yaklaşık bir maliyet sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "150 Avro sınırı ne anlama geliyor?",
        answer: "Posta veya hızlı kargo ile gelen ve değeri 150 Avro'yu aşmayan ürünler için basitleştirilmiş gümrük işlemi uygulanır ve yukarıdaki tek oranlı vergi alınır. Değeri 1500 Avro'ya kadar olan ürünler için ise daha detaylı bir beyan ve farklı vergi oranları gerekebilir. Bu hesaplayıcı 150 Avro altı gönderiler için tasarlanmıştır."
      },
      {
        question: "Hangi ürünler için ek ÖTV ödenir?",
        answer: "Kozmetik ürünleri, bazı elektronik cihazlar (cep telefonu hariç), kürkler, alkollü içecekler ve tütün ürünleri gibi lüks veya özel tüketim malları ek olarak Özel Tüketim Vergisi'ne (ÖTV) tabidir. ÖTV oranları ürünün türüne göre değişir."
      },
      {
        question: "Cep telefonu getirmek serbest mi?",
        answer: "Hayır. Posta veya kargo yoluyla yurt dışından cep telefonu getirmek yasaktır. Yolcu beraberi getirilen telefonların ise belirli bir süre içinde IMEI kaydının yapılması ve harcının ödenmesi gerekmektedir."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Yaklaşık Gümrük Vergisi Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}