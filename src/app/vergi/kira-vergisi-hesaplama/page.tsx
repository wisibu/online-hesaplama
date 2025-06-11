import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';
import { calculateIncomeTax, TaxBreakdown } from '@/utils/tax';

const KONUT_ISTISNA_2024 = 33000;
const GOTURU_GIDER_ORANI = 0.15;

const pageConfig = {
  title: "Kira Geliri Vergisi Hesaplama (GMSİ) 2024 | OnlineHesaplama",
  description: "2024 yılı için elde ettiğiniz konut kira gelirinizin vergisini (Gayrimenkul Sermaye İradı) götürü veya gerçek gider yöntemine göre hesaplayın.",
  keywords: ["kira vergisi hesaplama", "gmsi hesaplama", "kira gelir vergisi", "götürü gider", "gerçek gider"],
  calculator: {
    title: "Konut Kira Geliri Vergisi Hesaplama (GMSİ)",
    description: (
      <p className="text-sm text-gray-600">
        Yıllık kira gelirinizi ve gider yönteminizi seçerek ödemeniz gereken gelir vergisini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'annualIncome', label: 'Yıllık Toplam Kira Geliri (TL)', type: 'number', placeholder: '120000' },
      { id: 'expenseMethod', label: 'Gider Yöntemi', type: 'select', options: [
        { value: 'goturu', label: 'Götürü Gider Yöntemi (%15)' },
        { value: 'gercek', label: 'Gerçek Gider Yöntemi' },
      ]},
      { id: 'realExpenses', label: 'Belgelenmiş Yıllık Giderler (TL)', type: 'number', placeholder: '25000', displayCondition: { field: 'expenseMethod', value: 'gercek' } },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { annualIncome, expenseMethod, realExpenses } = inputs;
        const income = Number(annualIncome);
        const expenses = Number(realExpenses || 0);

        if (isNaN(income) || income <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir yıllık gelir tutarı girin.' } } };
        }

        if (income <= KONUT_ISTISNA_2024) {
             return { summary: { info: { label: 'Bilgi', value: `Yıllık geliriniz ${formatCurrency(KONUT_ISTISNA_2024)} olan istisna tutarının altında olduğu için vergiye tabi değildir.` } } };
        }

        const incomeAfterExemption = income - KONUT_ISTISNA_2024;
        let deductibleExpense = 0;
        if(expenseMethod === 'goturu') {
            deductibleExpense = incomeAfterExemption * GOTURU_GIDER_ORANI;
        } else {
            deductibleExpense = expenses;
        }

        const taxableIncome = incomeAfterExemption - deductibleExpense;
        
        if (taxableIncome <= 0) {
            return { summary: { info: { label: 'Bilgi', 'value': 'Giderler düşüldükten sonra vergiye tabi matrah kalmamıştır.' } } };
        }

        const taxData = calculateIncomeTax(taxableIncome);

        const summary = {
            annualIncome: { label: 'Yıllık Kira Geliri', value: formatCurrency(income) },
            exemption: { label: '2024 Konut İstisnası', value: formatCurrency(KONUT_ISTISNA_2024) },
            incomeAfterExemption: { label: 'İstisna Sonrası Gelir', value: formatCurrency(incomeAfterExemption) },
            deductibleExpense: { label: 'İndirilen Gider', value: formatCurrency(deductibleExpense) },
            taxableBase: { label: 'Vergi Matrahı', value: formatCurrency(taxableIncome) },
            totalTax: { label: 'Hesaplanan Gelir Vergisi', value: formatCurrency(taxData.totalTax), isHighlighted: true },
        };
        
        const table: CalculationResult['table'] = {
            headers: ['Vergi Dilimi', 'Bu Dilimdeki Matrah', 'Hesaplanan Vergi'],
            rows: taxData.breakdown.map((b: TaxBreakdown) => [b.bracket, formatCurrency(b.taxable), formatCurrency(b.tax)])
        };

        return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Kira Geliri Vergisi (GMSİ) Nedir?",
        content: (
          <p>
            Gayrimenkul Sermaye İradı (GMSİ), kişilerin sahip oldukları konut, işyeri gibi gayrimenkulleri kiraya vermeleri sonucu elde ettikleri gelirlerdir. Bu gelirler, Gelir Vergisi Kanunu'na göre belirli kurallar çerçevesinde vergilendirilir. Konut kira gelirleri için her yıl bir istisna tutarı belirlenir. Yıllık geliriniz bu tutarın altındaysa beyanname vermenize gerek yoktur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Götürü gider ve gerçek gider yöntemi arasındaki fark nedir?",
        answer: "<strong>Götürü Gider:</strong> Hiçbir belgeye ihtiyaç duymadan, istisna sonrası kira gelirinizin %15'ini doğrudan gider olarak düşebildiğiniz pratik bir yöntemdir. <strong>Gerçek Gider:</strong> Kiraya verilen mülk için yapılan aydınlatma, ısıtma, sigorta, faiz, amortisman gibi belgelendirilmiş tüm giderlerinizi gelirden düşebildiğiniz yöntemdir. Genellikle yüksek masrafı olanlar için daha avantajlıdır."
      },
      {
        question: "2024 yılı için konut kira geliri istisnası ne kadar?",
        answer: "2024 yılında elde edilen konut kira gelirleri için istisna tutarı 33.000 TL'dir. Yıllık kira geliriniz bu rakamın üzerindeyse beyanname vermeniz gerekmektedir."
      },
      {
        question: "İşyeri kira gelirlerinde istisna var mı?",
        answer: "Hayır. Konut kira geliri istisnası, işyeri kira gelirleri için uygulanmaz. İşyeri kiralarında, kiracı tarafından ödenen stopaj (vergi kesintisi) daha sonra mülk sahibinin ödeyeceği vergiden mahsup edilir."
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
        resultTitle="Kira Vergisi Hesaplama Sonucu"
        tableTitle="Gelir Vergisi Dilim Detayları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}