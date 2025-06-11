import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// 2024 ÖTV Oranları (Binek Otomobiller için)
const otvRates = {
  petrol: {
    '1600-': [
      { max_price: 184000, rate: 0.45 },
      { max_price: 220000, rate: 0.50 },
      { max_price: 250000, rate: 0.60 },
      { max_price: 280000, rate: 0.70 },
      { max_price: Infinity, rate: 0.80 },
    ],
    '1601-2000': [
        { max_price: Infinity, rate: 1.50 }
    ],
    '2001+': [
        { max_price: Infinity, rate: 2.20 }
    ],
  },
  hybrid: {
    '1800-': [ // Elektrik motor gücü 50kW'ı geçip, motor silindir hacmi 1600 cm³'ü geçmeyen
        { max_price: 228000, rate: 0.45 },
        { max_price: 350000, rate: 0.50 },
        { max_price: Infinity, rate: 0.80 },
    ],
    '1801-2500': [ // Elektrik motor gücü 100kW'ı geçip, motor silindir hacmi 1800 cm³ ila 2500 cm³ arasında olan
        { max_price: Infinity, rate: 1.50 }
    ],
  },
  electric: {
      '160-': [ // Motor gücü 160 kW'ı geçmeyenler
        { max_price: 1450000, rate: 0.10 },
        { max_price: Infinity, rate: 0.40 },
      ],
      '160+': [ // Motor gücü 160 kW'ı geçenler
        { max_price: 1350000, rate: 0.50 },
        { max_price: Infinity, rate: 0.60 },
      ]
  }
};


const pageConfig = {
  title: "ÖTV ve KDV Hesaplama (Sıfır Araç) | OnlineHesaplama",
  description: "Sıfır araba alırken ödeyeceğiniz Özel Tüketim Vergisi (ÖTV) ve Katma Değer Vergisi (KDV) tutarlarını 2024 güncel oranlarına göre hesaplayın.",
  keywords: ["ötv hesaplama", "araç ötv", "sıfır araba vergisi", "ötv kdv hesaplama"],
  calculator: {
    title: "Sıfır Araç ÖTV ve KDV Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Aracın KDV ve ÖTV hariç anahtar teslim fiyatını ve türünü girerek vergiler dahil satış fiyatını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'basePrice', label: 'Aracın Vergisiz Fiyatı (TL)', type: 'number', placeholder: '500000' },
      { id: 'vehicleType', label: 'Araç Türü', type: 'select', options: [
          { value: 'petrol', label: 'Benzinli / Dizel' },
          { value: 'hybrid', label: 'Hibrit' },
          { value: 'electric', label: 'Elektrikli' }
      ]},
      { id: 'engineSize', label: 'Motor Silindir Hacmi', type: 'select', options: [
          { value: '1600-', label: '1600 cm³ ve altı' },
          { value: '1601-2000', label: '1601 - 2000 cm³ arası' },
          { value: '2001+', label: '2001 cm³ ve üzeri' },
      ], displayCondition: { field: 'vehicleType', value: 'petrol' }},
      { id: 'hybridEngineSize', label: 'Motor Silindir Hacmi', type: 'select', options: [
          { value: '1800-', label: '1800 cm³ ve altı (Elektrik Motoru > 50kW)' },
          { value: '1801-2500', label: '1801 - 2500 cm³ arası (Elektrik Motoru > 100kW)' },
      ], displayCondition: { field: 'vehicleType', value: 'hybrid' }},
      { id: 'electricEnginePower', label: 'Motor Gücü', type: 'select', options: [
          { value: '160-', label: '160 kW ve altı' },
          { value: '160+', label: '160 kW üzeri' },
      ], displayCondition: { field: 'vehicleType', value: 'electric' }},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const basePrice = Number(inputs.basePrice);
        const vehicleType = inputs.vehicleType as 'petrol' | 'hybrid' | 'electric';

        if (isNaN(basePrice) || basePrice <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir fiyat girin.' } } };
        }

        let rateBrackets: { max_price: number, rate: number }[] | undefined;
        let engineSpec: string | number | boolean | undefined;

        if (vehicleType === 'petrol') {
            engineSpec = inputs.engineSize;
            rateBrackets = otvRates.petrol[engineSpec as keyof typeof otvRates.petrol];
        } else if (vehicleType === 'hybrid') {
            engineSpec = inputs.hybridEngineSize;
            rateBrackets = otvRates.hybrid[engineSpec as keyof typeof otvRates.hybrid];
        } else if (vehicleType === 'electric') {
            engineSpec = inputs.electricEnginePower;
            rateBrackets = otvRates.electric[engineSpec as keyof typeof otvRates.electric];
        }
        
        if (!rateBrackets || !engineSpec) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen araç özelliklerini tam seçin.' } } };
        }

        const otvRate = rateBrackets.find(r => basePrice <= r.max_price)?.rate ?? 0;
        
        if (otvRate === 0) {
             return { summary: { error: { label: 'Hata', value: 'Uygun bir ÖTV oranı bulunamadı. Lütfen bilgileri kontrol edin.' } } };
        }
        
        const otvAmount = basePrice * otvRate;
        const kdvMatrah = basePrice + otvAmount;
        const kdvAmount = kdvMatrah * 0.20; // Assuming 20% VAT
        const totalPrice = kdvMatrah + kdvAmount;

        const summary = {
            basePrice: { label: 'Aracın Vergisiz Fiyatı', value: formatCurrency(basePrice) },
            otvRate: { label: 'Uygulanan ÖTV Oranı', value: `%${otvRate * 100}` },
            otvAmount: { label: 'ÖTV Tutarı', value: formatCurrency(otvAmount) },
            otvKdvMatrah: { label: 'KDV Matrahı (Araç + ÖTV)', value: formatCurrency(kdvMatrah) },
            kdvAmount: { label: 'KDV Tutarı (%20)', value: formatCurrency(kdvAmount) },
            totalPrice: { label: 'Vergiler Dahil Satış Fiyatı', value: formatCurrency(totalPrice), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Özel Tüketim Vergisi (ÖTV) Nedir?",
        content: (
          <p>
            Özel Tüketim Vergisi (ÖTV), belirli lüks veya sağlığa/çevreye zararlı ürünlerden alınan bir harcama vergisidir. Sıfır kilometre araçlar da bu kapsama girer. Araçlarda ÖTV, motor silindir hacmi, aracın cinsi (binek, ticari), yakıt türü (benzinli, dizel, hibrit, elektrikli) ve en önemlisi aracın vergisiz satış fiyatına göre değişen oranlarda uygulanır. Bu karmaşık yapı, aracın nihai satış fiyatını önemli ölçüde etkiler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "KDV, ÖTV'li fiyata mı uygulanır?",
        answer: "Evet. Bu, vergiden vergi alınması olarak bilinen bir durumdur. Sıfır araçlarda KDV hesaplanırken, aracın vergisiz fiyatı ile ÖTV tutarı toplanır ve bu toplam üzerinden KDV (%20) hesaplanır. Bu durum, aracın toplam maliyetini ciddi şekilde artırır."
      },
      {
        question: "Hibrit ve elektrikli araçlarda ÖTV avantajı var mı?",
        answer: "Evet, devlet çevre dostu teknolojileri teşvik etmek amacıyla elektrikli ve hibrit araçlara daha düşük ÖTV oranları uygulamaktadır. Özellikle tamamen elektrikli araçlarda, motor gücüne ve vergisiz fiyata bağlı olarak oranlar %10'a kadar düşebilmektedir. Hibrit araçlarda ise motor hacmi ve elektrik motor gücüne göre avantajlı dilimler mevcuttur."
      },
       {
        question: "ÖTV indirimi kimler için geçerlidir?",
        answer: "Engellilik oranı %90 ve üzerinde olan malul ve engelliler, beş yılda bir defaya mahsus olmak üzere sıfır araç alımlarında ÖTV'den tamamen muaftır. Ayrıca şehit yakınları ve gaziler için de ÖTV istisnaları bulunmaktadır."
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