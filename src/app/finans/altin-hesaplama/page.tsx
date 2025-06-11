import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Altın Fiyatı Hesaplama (Gram, Çeyrek, Yarım, Tam) | OnlineHesaplama",
  description: "Canlı ve güncel kurlara yakın değerlerle gram, çeyrek, yarım, tam ve cumhuriyet altını fiyatlarını anında hesaplayın. Altın miktarını girin, TL karşılığını öğrenin.",
  keywords: ["altın hesaplama", "gram altın fiyatı", "çeyrek altın fiyatı", "yarım altın", "tam altın", "altın çevirici"],
  calculator: {
    title: "Altın Fiyatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplamak istediğiniz altın miktarını ve türünü girin. (Not: Kurlar yaklaşık değerlerdir.)
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Miktar', type: 'number', placeholder: '10' },
      { 
        id: 'goldType', 
        label: 'Altın Türü', 
        type: 'select',
        options: [
            { value: 'gram', label: 'Gram Altın' },
            { value: 'ceyrek', label: 'Çeyrek Altın' },
            { value: 'yarim', label: 'Yarım Altın' },
            { value: 'tam', label: 'Tam Altın' },
            { value: 'cumhuriyet', label: 'Cumhuriyet Altını' },
        ],
        defaultValue: 'gram'
      },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const amount = Number(inputs.amount);
      const goldType = String(inputs.goldType);

      if (isNaN(amount) || amount <= 0) {
        return null;
      }

      // Yaklaşık güncel kurlar (Bu değerler statiktir ve güncellenmelidir)
      const rates = {
        gram: 2450.00,
        ceyrek: 4080.00,
        yarim: 8160.00,
        tam: 16275.00,
        cumhuriyet: 17000.00,
      };

      const rate = rates[goldType as keyof typeof rates];
      if (!rate) return null;

      const totalValue = amount * rate;
      
      const summary = {
        totalValue: { label: 'Toplam Tutar', value: formatCurrency(totalValue), isHighlighted: true },
        amount: { label: 'Miktar', value: `${amount} ${goldType}` },
        rate: { label: 'Birim Fiyatı (Yaklaşık)', value: formatCurrency(rate) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Altın Türleri ve Anlamları",
        content: (
          <>
            <p>
              Altın, hem bir yatırım aracı hem de hediye olarak Türkiye'de büyük bir kültürel öneme sahiptir. Piyasada farklı gramaj ve ayarlarda birçok altın türü bulunmaktadır.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Gram Altın:</strong> Genellikle 1, 2.5, 5, 10, 20, 50 ve 100 gram şeklinde üretilen, saflığı 24 ayar olan altın türüdür. Yatırım için en çok tercih edilen türlerden biridir.</li>
              <li><strong>Çeyrek Altın:</strong> Yaklaşık 1.75 gram ağırlığında ve 22 ayar saflığındadır. Düğün, nişan gibi özel günlerde en çok hediye edilen altın türüdür.</li>
              <li><strong>Yarım Altın:</strong> Yaklaşık 3.50 gram ağırlığında ve 22 ayar saflığındadır. Çeyrek altının iki katıdır.</li>
              <li><strong>Tam Altın:</strong> Yaklaşık 7.00 gram ağırlığında ve 22 ayar saflığındadır.</li>
              <li><strong>Cumhuriyet Altını:</strong> Darphane tarafından basılan, üzerinde Atatürk portresi bulunan resmi bir altın türüdür. Ata Lirası olarak da bilinir ve yaklaşık 7.216 gram ağırlığındadır.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcıdaki kurlar güncel mi?",
        answer: "Bu hesaplayıcıdaki kurlar, güncel piyasa değerlerine yakın, temsili ve statik değerlerdir. Anlık ve kesin alım-satım işlemleri için lütfen yetkili döviz büroları veya bankanız ile iletişime geçin."
      },
      {
        question: "22 ayar ile 24 ayar arasındaki fark nedir?",
        answer: "Ayar, altının saflık derecesini belirtir. 24 ayar altın %99.99 saf altını ifade ederken, 22 ayar altın %91.6 oranında saf altın içerir, geri kalanı diğer metallerle (genellikle bakır, gümüş) karıştırılarak daha dayanıklı hale getirilir. Takılarda genellikle 22 ayar kullanılır."
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
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}