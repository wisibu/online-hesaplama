import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency, formatNumber } from '@/utils/formatting';

const REVALUATION_RATES: { [year: number]: number } = {
  2010: 0.077,
  2011: 0.1026,
  2012: 0.078,
  2013: 0.0393,
  2014: 0.1011,
  2015: 0.0558,
  2016: 0.0383,
  2017: 0.1447,
  2018: 0.2373,
  2019: 0.2258,
  2020: 0.0911,
  2021: 0.3620,
  2022: 1.2293,
  2023: 0.5846,
};

const years = Object.keys(REVALUATION_RATES).map(Number).sort();

const pageConfig = {
  title: "Yeniden Değerleme Oranı ile Hesaplama | OnlineHesaplama",
  description: "Geçmiş yıllara ait bir tutarın, resmi yeniden değerleme oranları kullanılarak bugünkü veya gelecekteki değerini kolayca hesaplayın.",
  keywords: ["yeniden değerleme oranı", "yeniden değerleme hesaplama", "vergi", "ceza", "harç", "muhasebe"],
  calculator: {
    title: "Yeniden Değerleme Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Bir tutarın baz yılını ve hangi yıla değerleneceğini seçerek yeni değerini bulun.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Değerlenecek Tutar (TL)', type: 'number', placeholder: '1000' },
      { id: 'baseYear', label: 'Tutara Esas Yıl', type: 'select', 
        options: years.map(y => ({ value: y + 1, label: `${y + 1}` })),
        defaultValue: (new Date().getFullYear() - 1).toString()
      },
      { id: 'targetYear', label: 'Değerlenecek Yıl', type: 'select', 
        options: years.map(y => ({ value: y + 2, label: `${y + 2}` })).filter(y => y.value <= new Date().getFullYear() + 1),
        defaultValue: new Date().getFullYear().toString()
      },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { amount, baseYear, targetYear } = inputs as { amount: number, baseYear: number, targetYear: number };

        if (!amount || amount <= 0 || !baseYear || !targetYear) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doldurun.' } } };
        }
        if (targetYear <= baseYear) {
            return { summary: { error: { label: 'Hata', value: 'Değerlenecek yıl, esas yıldan büyük olmalıdır.' } } };
        }

        let currentValue = amount;
        let appliedRates = '';

        for (let year = baseYear; year < targetYear; year++) {
            const rateAnnouncedIn = year - 1;
            const rate = REVALUATION_RATES[rateAnnouncedIn];
            if (rate !== undefined) {
                currentValue *= (1 + rate);
                appliedRates += `${year} yılı için uygulanan oran (%${(rate * 100).toFixed(2)})<br/>`;
            } else {
                 return { summary: { error: { label: 'Hata', value: `${rateAnnouncedIn} yılı için yeniden değerleme oranı bulunamadı.` } } };
            }
        }

        const summary = {
            originalAmount: { label: `${baseYear} Yılı Değeri`, value: formatCurrency(amount) },
            revaluedAmount: { label: `${targetYear} Yılı Değeri`, value: formatCurrency(currentValue) },
            totalIncrease: { label: 'Toplam Artış', value: formatCurrency(currentValue - amount) },
            increaseRate: { label: 'Kümülatif Artış Oranı', value: `%${(((currentValue / amount) - 1) * 100).toFixed(2)}` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yeniden Değerleme Oranı Nedir?",
        content: (
          <p>
            Yeniden değerleme oranı, Vergi Usul Kanunu'nun 298. maddesi uyarınca her yılın Ekim ayında bir önceki yılın aynı dönemine göre Yurt İçi Üretici Fiyat Endeksi'nde (Yİ-ÜFE) meydana gelen ortalama fiyat artış oranını ifade eder. Bu oran, Hazine ve Maliye Bakanlığı tarafından Resmî Gazete'de ilan edilir ve bir sonraki takvim yılından itibaren geçerli olmak üzere birçok vergi, harç, ceza ve diğer kamusal bedellerin güncellenmesinde kullanılır. Örneğin, 2023 yılı sonunda ilan edilen oran, 2024 yılı boyunca geçerli olacak pasaport harçları, trafik cezaları, emlak vergisi gibi tutarları belirler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcı hangi amaçlarla kullanılır?",
        answer: "Bu araç, geçmiş bir yılda belirlenmiş bir parasal değerin, sonraki bir yıldaki karşılığını bulmak için kullanılır. Örneğin, 2020 yılında kesilmiş bir idari para cezasının 2024 yılında ne kadar olacağını, bir şirketin aktifindeki bir demirbaşın yeniden değerlenmiş değerini veya geçmiş yıllardaki bir harç bedelinin bugünkü tutarını hesaplamak için idealdir."
      },
      {
        question: "Yeniden Değerleme ve Enflasyon (TÜFE) aynı şey midir?",
        answer: "Hayır. Yeniden değerleme oranı, Yurt İçi Üretici Fiyat Endeksi'ne (Yİ-ÜFE) dayanırken, genel enflasyon genellikle Tüketici Fiyat Endeksi (TÜFE) ile ölçülür. Üretici ve tüketici fiyatları farklı dinamiklere sahip olduğundan, bu iki oran genellikle birbirinden farklı çıkar. Vergi ve cezaların artışında Yİ-ÜFE bazlı yeniden değerleme oranı kullanılır."
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
        resultTitle="Değerleme Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}