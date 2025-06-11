import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Yakıt Tüketimi ve Yolculuk Maliyeti Hesaplama",
  description: "Aracınızın 100 km'deki yakıt tüketimini veya planladığınız bir yolculuğun toplam yakıt maliyetini kolayca hesaplayın.",
  keywords: ["yakıt tüketimi hesaplama", "yakıt maliyeti", "ne kadar yakar", "yolculuk maliyeti", "araç yakıt hesaplama"],
  calculator: {
    title: "Yakıt Tüketimi ve Maliyet Hesaplayıcı",
    description: (
      <p className="text-sm text-gray-600">
        Yapmak istediğiniz hesaplama türünü seçin ve ilgili bilgileri girin.
      </p>
    ),
    inputFields: [
      {
        id: 'calculationType',
        label: 'Hesaplama Türü',
        type: 'select',
        options: [
          { value: 'calculateCost', label: 'Yolculuk Maliyetini Hesapla' },
          { value: 'calculateConsumption', label: 'Aracın Tüketimini Hesapla' },
        ],
        defaultValue: 'calculateCost'
      },
      // Ortak Alanlar
      { id: 'distance', label: 'Gidilecek Mesafe (km)', type: 'number', placeholder: '450' },
      { id: 'fuelPrice', label: 'Yakıt Litre Fiyatı (TL)', type: 'number', placeholder: '42.5' },

      // Yolculuk Maliyeti Hesaplama
      { id: 'consumptionPer100km_input', label: 'Araç Tüketimi (Litre / 100 km)', type: 'number', placeholder: '7.5', displayCondition: (inputs) => inputs.calculationType === 'calculateCost' },
      
      // Tüketim Hesaplama
      { id: 'fuelConsumed', label: 'Harcanan Toplam Yakıt (Litre)', type: 'number', placeholder: '35', displayCondition: (inputs) => inputs.calculationType === 'calculateConsumption' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { calculationType, distance, fuelPrice, consumptionPer100km_input, fuelConsumed } = inputs as any;

        if (!distance || !fuelPrice || distance <= 0 || fuelPrice <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen mesafe ve yakıt fiyatı için pozitif değerler girin.' } } };
        }

        if (calculationType === 'calculateCost') {
            if (!consumptionPer100km_input || consumptionPer100km_input <= 0) {
              return { summary: { error: { label: 'Hata', value: 'Lütfen araç tüketimi için geçerli bir değer girin.' } } };
            }
            const totalFuelNeeded = (distance * consumptionPer100km_input) / 100;
            const totalCost = totalFuelNeeded * fuelPrice;
            const costPerKm = totalCost / distance;

            return {
              summary: {
                totalCost: { label: 'Toplam Yolculuk Maliyeti', value: formatCurrency(totalCost), isHighlighted: true },
                totalFuel: { label: 'Gereken Toplam Yakıt', value: `${formatNumber(totalFuelNeeded)} Litre` },
                costPerKm: { label: 'Kilometre Başına Maliyet', value: formatCurrency(costPerKm) },
              }
            };
        }

        if (calculationType === 'calculateConsumption') {
            if (!fuelConsumed || fuelConsumed <= 0) {
              return { summary: { error: { label: 'Hata', value: 'Lütfen harcanan yakıt için geçerli bir değer girin.' } } };
            }
            const consumptionPer100km = (fuelConsumed / distance) * 100;
            const totalCost = fuelConsumed * fuelPrice;
            const costPerKm = totalCost / distance;

            return {
              summary: {
                consumption: { label: 'Ortalama Tüketim (100 km)', value: `${formatNumber(consumptionPer100km)} Litre`, isHighlighted: true },
                totalCost: { label: 'Toplam Yakıt Maliyeti', value: formatCurrency(totalCost) },
                costPerKm: { label: 'Kilometre Başına Maliyet', value: formatCurrency(costPerKm) },
              }
            };
        }
        
        return null;
    },
  },
  content: {
    sections: [
      {
        title: "Yakıt Tüketimi ve Maliyeti Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Bu araç, araç sahipleri için iki temel soruyu yanıtlamak üzere tasarlanmıştır:
            </p>
            <ul className="list-decimal list-inside space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                <li><strong>Yolculuk Maliyetini Hesaplama:</strong> Belirli bir mesafeyi kat etmek için ne kadar yakıt parası harcayacağınızı planlamanızı sağlar. Aracınızın fabrika verisi veya kendi ölçtüğünüz ortalama tüketim değerini (L/100km) kullanarak, yolculuğun toplam maliyetini ve ne kadar yakıta ihtiyacınız olacağını önceden görebilirsiniz.</li>
                <li><strong>Aracın Tüketimini Hesaplama:</strong> Aracınızın gerçek dünya koşullarındaki yakıt verimliliğini ölçmenize olanak tanır. Genellikle depoyu doldurduktan sonra kat edilen mesafeyi ve tekrar depoyu doldururken alınan yakıt miktarını girerek aracınızın 100 kilometrede kaç litre yaktığını (L/100km) ve kilometre başına maliyetini öğrenebilirsiniz.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Şehir içi ve şehir dışı tüketim neden farklıdır?",
        answer: "Şehir içinde sık sık dur-kalk yapılması, daha düşük viteslerde ve daha yüksek devirlerde araç kullanılması motoru daha fazla zorlar ve yakıt tüketimini artırır. Şehir dışında ise daha sabit hızlarda ve yüksek viteslerde gidildiği için motor daha verimli çalışır ve tüketim düşer."
      },
      {
        question: "Yakıt tüketimini etkileyen diğer faktörler nelerdir?",
        answer: "Lastik basıncı, araçtaki yük miktarı, klima kullanımı, agresif sürüş tarzı (ani hızlanma ve frenleme), aracın aerodinamik yapısı ve düzenli bakım yapılıp yapılmadığı gibi birçok faktör yakıt tüketimini doğrudan etkiler."
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
        resultTitle="Yakıt Tüketim Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 