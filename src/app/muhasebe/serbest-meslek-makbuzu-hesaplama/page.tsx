import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Serbest Meslek Makbuzu (SMM) Hesaplama | OnlineHesaplama",
  description: "Brütten nete veya netten brüte serbest meslek makbuzu hesaplayın. Stopaj (%20) ve KDV (%20) kesintilerini dahil ederek doğru tutarı bulun.",
  keywords: ["serbest meslek makbuzu hesaplama", "smm hesaplama", "brütten nete makbuz", "netten brüte makbuz", "makbuz KDV stopaj"],
  calculator: {
    title: "Serbest Meslek Makbuzu (SMM) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama yönünü ve tutarı girerek makbuzunuzun tüm kalemlerini görün.
      </p>
    ),
    inputFields: [
      { id: 'calculationType', label: 'Hesaplama Yönü', type: 'select', options: [
        { value: 'grossToNet', label: 'Brütten Nete' },
        { value: 'netToGross', label: 'Netten Brüte' },
      ]},
      { id: 'amount', label: 'Tutar (TL)', type: 'number', placeholder: '10000' },
      { id: 'kdvRate', label: 'KDV Oranı (%)', type: 'number', placeholder: '20' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const calculationType = inputs.calculationType as 'grossToNet' | 'netToGross';
        const amount = Number(inputs.amount);
        const kdvRate = Number(inputs.kdvRate) / 100;
        const stopajRate = 0.20; // Sabit %20

        if (isNaN(amount) || amount <= 0 || isNaN(kdvRate) || kdvRate < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tutar ve KDV oranı girin.' } } };
        }

        let brütUcret: number, stopaj: number, netUcret: number, kdv: number, tahsilEdilecekTutar: number;

        if (calculationType === 'grossToNet') {
            brütUcret = amount;
            stopaj = brütUcret * stopajRate;
            netUcret = brütUcret - stopaj;
            kdv = brütUcret * kdvRate;
            tahsilEdilecekTutar = netUcret + kdv;
        } else { // netToGross (Tahsil edilecek tutardan brüte)
            tahsilEdilecekTutar = amount;
            brütUcret = tahsilEdilecekTutar / (1 - stopajRate + kdvRate);
            stopaj = brütUcret * stopajRate;
            netUcret = brütUcret - stopaj;
            kdv = brütUcret * kdvRate;
        }

        const summary = {
            brütUcret: { label: 'Brüt Ücret', value: formatCurrency(brütUcret) },
            stopaj: { label: `Gelir Vergisi Stopajı (%${stopajRate * 100})`, value: formatCurrency(stopaj) },
            netUcret: { label: 'Net Ücret', value: formatCurrency(netUcret) },
            kdv: { label: `Hesaplanan KDV (%${kdvRate * 100})`, value: formatCurrency(kdv) },
            tahsilEdilecekTutar: { label: 'Müşteriden Tahsil Edilecek Tutar', value: formatCurrency(tahsilEdilecekTutar) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Serbest Meslek Makbuzu (SMM) Nedir?",
        content: (
          <p>
            Serbest Meslek Makbuzu (SMM), serbest meslek erbabının (avukat, doktor, mali müşavir, danışman, sanatçı vb.) mesleki faaliyetleri karşılığında yaptığı tahsilatlar için düzenlediği değerli bir evraktır. Bu makbuz, hem gelirin belgelendirilmesi hem de vergi kesintilerinin (stopaj ve KDV) hesaplanıp gösterilmesi açısından zorunludur. Hesaplama, genellikle brüt ücret üzerinden yapılır ve bu tutardan stopaj düşülüp KDV eklenerek müşteriden tahsil edilecek nihai rakam bulunur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Stopajı kim, KDV'yi kim öder?",
        answer: "Stopaj, hizmeti alan (müşteri) tarafından hizmeti verenin (serbest meslek erbabı) adına vergi dairesine ödenen bir gelir vergisi kesintisidir. KDV ise, hizmetin bedeline eklenerek yine hizmeti alan (müşteri) tarafından hizmeti verene ödenir. Hizmeti veren de bu KDV'yi daha sonra devlete beyan edip öder. Yani aslında her iki vergiyi de dolaylı veya doğrudan müşteri ödemiş olur."
      },
      {
        question: "Netten brüte hesaplama hangi durumlarda kullanılır?",
        answer: "Netten brüte hesaplama, genellikle serbest meslek erbabının müşteri ile 'ele geçecek net tutar' üzerinden anlaşması durumunda kullanılır. Örneğin, bir danışman müşterisine 'Bu iş için elime net 10.000 TL geçecek' dediğinde, bu net tutarı alabilmek için makbuzun brüt tutarının ne olması gerektiğini bu hesaplama yöntemiyle bulur."
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
        resultTitle="Makbuz Detayları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}