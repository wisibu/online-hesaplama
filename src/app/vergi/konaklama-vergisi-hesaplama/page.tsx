import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const KONAKLAMA_VERGISI_ORANI = 0.02;

const pageConfig = {
  title: "Konaklama Vergisi Hesaplama | OnlineHesaplama",
  description: "Otel, motel, tatil köyü gibi konaklama tesislerine ödeyeceğiniz tutar üzerinden %2'lik konaklama vergisini anında hesaplayın.",
  keywords: ["konaklama vergisi hesaplama", "otel vergisi", "%2 konaklama vergisi", "turizm vergisi"],
  calculator: {
    title: "Konaklama Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        KDV hariç konaklama bedelini girerek vergi tutarını ve KDV dahil toplam ödemeyi hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Konaklama Bedeli (KDV Hariç)', type: 'number', placeholder: '1000' },
      { id: 'kdvRate', label: 'Konaklama KDV Oranı (%)', type: 'number', placeholder: '10', defaultValue: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const amount = Number(inputs.amount);
        const kdvRate = Number(inputs.kdvRate) / 100;

        if (isNaN(amount) || amount <= 0 || isNaN(kdvRate) || kdvRate < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir bedel ve KDV oranı girin.' } } };
        }

        const taxAmount = amount * KONAKLAMA_VERGISI_ORANI;
        const kdvAmount = amount * kdvRate;
        const totalAmount = amount + taxAmount + kdvAmount;

        const summary = {
            baseAmount: { label: 'KDV Hariç Konaklama Bedeli', value: formatCurrency(amount) },
            tax: { label: `Konaklama Vergisi (%${KONAKLAMA_VERGISI_ORANI * 100})`, value: formatCurrency(taxAmount) },
            kdv: { label: `KDV Tutarı (%${kdvRate * 100})`, value: formatCurrency(kdvAmount) },
            total: { label: 'Toplam Ödenecek Tutar', value: formatCurrency(totalAmount), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Konaklama Vergisi Nedir?",
        content: (
          <p>
            Konaklama vergisi, Türkiye'de otel, motel, tatil köyü, pansiyon, apart otel gibi konaklama tesislerinde verilen geceleme hizmetlerinden alınan bir vergidir. Bu vergi, konaklama bedelinin KDV hariç tutarı üzerinden <strong>%2</strong> oranında hesaplanır. Verginin mükellefi konaklama hizmetini sunan tesis iken, vergi yükü hizmeti alan kişiye yansıtılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Konaklama vergisi KDV dahil fiyattan mı hesaplanır?",
        answer: "Hayır, bu önemli bir ayrıntıdır. Konaklama vergisi, hizmetin Katma Değer Vergisi (KDV) hariç bedeli üzerinden hesaplanır. Faturada önce konaklama vergisi eklenir, daha sonra genel toplam üzerinden KDV hesaplanmaz; KDV yine vergisiz ana tutar üzerinden hesaplanır."
      },
      {
        question: "Hangi hizmetler konaklama vergisine tabidir?",
        answer: "Tesis bünyesinde sunulan yeme, içme, aktivite, eğlence hizmetleri ve havuz, spor, termal alanların kullanımı gibi tüm hizmetler, konaklama hizmetiyle birlikte tek bir paket olarak satılıyorsa (örneğin 'her şey dahil' konsepti), bu hizmetlerin tamamı konaklama vergisine tabidir."
      },
       {
        question: "Öğrenci yurtları veya kamplar bu vergiye tabi mi?",
        answer: "Hayır. Öğrenci yurtları, pansiyonları ve kamplarında öğrencilere verilen hizmetler konaklama vergisinden istisnadır."
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
        resultTitle="Konaklama Vergisi Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}