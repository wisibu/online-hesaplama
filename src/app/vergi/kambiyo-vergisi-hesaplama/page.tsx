import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const KAMBIYO_VERGISI_ORANI = 0.003; // Binde 3

const pageConfig = {
  title: "Kambiyo Vergisi (BSMV) Hesaplama | OnlineHesaplama",
  description: "Döviz veya altın alım işlemlerinde ödenen BSMV (Binde 3) tutarını kolayca hesaplayın.",
  keywords: ["kambiyo vergisi hesaplama", "döviz alım vergisi", "bsmv hesaplama", "binde 3 vergi"],
  calculator: {
    title: "Kambiyo Alım Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Satın alınan döviz veya altın tutarını girerek kambiyo vergisini (BSMV) hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Alınan Döviz/Altın Tutarı (TL)', type: 'number', placeholder: '10000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const amount = Number(inputs.amount);

        if (isNaN(amount) || amount <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }

        const taxAmount = amount * KAMBIYO_VERGISI_ORANI;
        const totalAmount = amount + taxAmount;

        const summary: CalculationResult['summary'] = {
            baseAmount: { type: 'info', label: 'İşlem Tutarı', value: formatCurrency(amount) },
            taxRate: { type: 'info', label: 'Vergi Oranı', value: `Binde 3 (%${KAMBIYO_VERGISI_ORANI * 100})` },
            taxAmount: { type: 'info', label: 'Kambiyo Vergisi (BSMV)', value: formatCurrency(taxAmount) },
            totalAmount: { type: 'result', label: 'Vergi Dahil Toplam Maliyet', value: formatCurrency(totalAmount), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Kambiyo Vergisi Nedir?",
        content: (
          <p>
            Kambiyo vergisi, aslında Banka ve Sigorta Muameleleri Vergisi'nin (BSMV) bir türüdür ve kambiyo işlemleri, yani döviz ve efektif alım satımları üzerinden alınır. Türkiye'de yerleşik kişilerin bankalar veya yetkili müesseseler (döviz büroları) aracılığıyla yaptıkları döviz ve altın alımlarında, işlem tutarı üzerinden <strong>binde 3 (%0.3)</strong> oranında vergi kesilir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu vergi döviz satarken de alınıyor mu?",
        answer: "Hayır. Kambiyo vergisi sadece döviz veya altın alım işlemlerinde uygulanır. Döviz veya altın satarken bu vergi kesilmez."
      },
      {
        question: "Vergiden istisna olan durumlar var mı?",
        answer: "Evet. Sanayicilerin ve ihracatçıların döviz alımları, bankaların kendi aralarındaki işlemleri ve Hazine ve Maliye Bakanlığı'nın belirlediği diğer bazı özel durumlar bu vergiden muaftır."
      },
      {
        question: "Kredi kartıyla yapılan yurt dışı harcamaları bu vergiye tabi mi?",
        answer: "Kredi kartıyla yapılan yurt dışı harcamaları doğrudan döviz alımı sayılmadığı için bu binde 3'lük vergiye tabi değildir. Ancak bankalar, bu harcamaları TL'ye çevirirken kendi kur marjlarını uygulayabilirler."
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
        resultTitle="Vergi Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}