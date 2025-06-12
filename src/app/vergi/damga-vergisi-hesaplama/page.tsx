import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const stampDutyRates = {
    'contracts': 0.00948,       // Sözleşmeler, taahhütnameler, temliknameler
    'payroll': 0.00759,         // Maaş, ücret, gündelik, ikramiye ödemeleri
    'rent_contract': 0.00189,   // Kira sözleşmeleri
    'customs': 0.00759,         // Gümrük idarelerine verilen beyannameler
    'other': 0.00948          // Diğer
};

const pageConfig = {
  title: "Damga Vergisi Hesaplama | OnlineHesaplama",
  description: "Sözleşme, maaş bordrosu, kira kontratı gibi belgeleriniz için 2024 yılı oranlarına göre damga vergisi tutarını anında hesaplayın.",
  keywords: ["damga vergisi hesaplama", "sözleşme vergisi", "damga vergisi oranı", "kira kontratı damga vergisi"],
  calculator: {
    title: "Damga Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Belge türünü ve matrahı (vergiye tabi tutar) girerek ödenecek damga vergisini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Vergiye Tabi Tutar (Matrah)', type: 'number', placeholder: '100000' },
      { id: 'documentType', label: 'Belge Türü', type: 'select', options: [
        { value: 'contracts', label: 'Sözleşme, Taahhütname, Temlikname' },
        { value: 'payroll', label: 'Maaş, Ücret, İkramiye Bordrosu' },
        { value: 'rent_contract', label: 'Kira Sözleşmesi' },
        { value: 'customs', label: 'Gümrük Beyannameleri' },
        { value: 'other', label: 'Diğer Belgeler (Genel Oran)' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const amount = Number(inputs.amount);
        const docType = inputs.documentType as keyof typeof stampDutyRates;

        if (isNaN(amount) || amount <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }

        const rate = stampDutyRates[docType];
        const taxAmount = amount * rate;

        const summary: CalculationResult['summary'] = {
            baseAmount: { type: 'info', label: 'Vergi Matrahı', value: formatCurrency(amount) },
            rate: { type: 'info', label: 'Uygulanan Oran', value: `‰ ${rate * 1000}` },
            tax: { type: 'result', label: 'Hesaplanan Damga Vergisi', value: formatCurrency(taxAmount), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Damga Vergisi Nedir?",
        content: (
          <p>
            Damga Vergisi, kişiler ve kurumlar arasındaki hukuki ve ticari işlemleri belgeleyen kağıtlar üzerinden alınan bir vergi türüdür. Sözleşmeler, anlaşmalar, maaş bordroları, faturalar, temliknameler ve daha birçok belge bu vergiye tabidir. Verginin matrahı genellikle belgede belirtilen para tutarıdır ve oran, belgenin türüne göre kanunla belirlenmiş binde oranlar üzerinden hesaplanır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Damga vergisini kim öder?",
        answer: "Damga Vergisi Kanunu'na göre vergiyi, belgeleri imzalayan taraflar öder. Genellikle, eğer sözleşmede aksi belirtilmemişse, taraflar vergiyi eşit olarak paylaşır veya bir taraf üstlenir."
      },
      {
        question: "Her belgeden damga vergisi alınır mı?",
        answer: "Hayır. Damga Vergisi Kanunu'na ekli (2) sayılı tabloda damga vergisinden istisna edilen belgeler listelenmiştir. Örneğin, ticari ve zirai kazançla ilgili olmayan makbuzlar ve bazı dernek ve vakıfların işlemleri gibi durumlar vergiden muaftır. Her zaman belgenin içeriği ve tarafların durumu önemlidir."
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
        resultTitle="Vergi Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
