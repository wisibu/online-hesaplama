import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const calculateAmortization = (cost: number, salvage: number, life: number, method: 'straight-line' | 'declining-balance') => {
    const table: TableData = {
        headers: ["Yıl", "Yıl Başı Değeri", "Amortisman Gideri", "Birikmiş Amortisman", "Yıl Sonu Değeri"],
        rows: []
    };

    let bookValue = cost;
    let accumulatedAmortization = 0;

    if (method === 'straight-line') {
        const annualDepreciation = (cost - salvage) / life;
        for (let i = 1; i <= life; i++) {
            const beginningValue = bookValue;
            let depreciationExpense = annualDepreciation;

            if (bookValue - depreciationExpense < salvage) {
                depreciationExpense = bookValue - salvage;
            }
            if(depreciationExpense < 0) depreciationExpense = 0;

            accumulatedAmortization += depreciationExpense;
            bookValue -= depreciationExpense;
            
            table.rows.push([i, formatCurrency(beginningValue), formatCurrency(depreciationExpense), formatCurrency(accumulatedAmortization), formatCurrency(bookValue)]);
        }
    } else { // Declining Balance
        const rate = (1 / life) * 2;
        for (let i = 1; i <= life; i++) {
            const beginningValue = bookValue;
            let depreciationExpense = beginningValue * rate;

            if (bookValue - depreciationExpense < salvage) {
                depreciationExpense = bookValue - salvage;
            }
             if(depreciationExpense < 0) depreciationExpense = 0;

            accumulatedAmortization += depreciationExpense;
            bookValue -= depreciationExpense;

            table.rows.push([i, formatCurrency(beginningValue), formatCurrency(depreciationExpense), formatCurrency(accumulatedAmortization), formatCurrency(bookValue)]);
        }
    }

    return table;
};

const pageConfig = {
  title: "Amortisman Hesaplama | OnlineHesaplama",
  description: "Duran varlıklarınız için Normal (Doğrusal) veya Azalan Bakiyeler yöntemine göre yıllık amortisman giderini ve birikmiş amortismanı kolayca hesaplayın.",
  keywords: ["amortisman hesaplama", "normal amortisman", "azalan bakiyeler yöntemi", "duran varlık", "muhasebe"],
  calculator: {
    title: "Amortisman Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Varlığın maliyetini, faydalı ömrünü ve diğer bilgilerini girerek amortisman tablosunu oluşturun.
      </p>
    ),
    inputFields: [
      { id: 'cost', label: 'Varlığın Maliyeti (TL)', type: 'number', placeholder: '50000' },
      { id: 'salvage', label: 'Hurda Değeri (Kalıntı Değer) (TL)', type: 'number', placeholder: '5000' },
      { id: 'life', label: 'Faydalı Ömür (Yıl)', type: 'number', placeholder: '5' },
      { id: 'method', label: 'Amortisman Yöntemi', type: 'select', options: [
          { value: 'straight-line', label: 'Normal (Doğrusal) Amortisman' },
          { value: 'declining-balance', label: 'Azalan Bakiyeler Yöntemi' }
        ], defaultValue: 'straight-line' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const cost = Number(inputs.cost);
        const salvage = Number(inputs.salvage);
        const life = Number(inputs.life);
        const method = inputs.method as 'straight-line' | 'declining-balance';


        if (isNaN(cost) || isNaN(salvage) || isNaN(life) || cost <= 0 || life <= 0 || salvage < 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları geçerli pozitif değerlerle doldurun.' } } };
        }
        if (salvage >= cost) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Hurda değeri, varlık maliyetinden küçük olmalıdır.' } } };
        }

        const table = calculateAmortization(cost, salvage, life, method);
          
        return { 
            summary: {
                totalDepreciation: { type: 'result', label: 'Toplam Amortisman Gideri', value: formatCurrency(cost - salvage), isHighlighted: true },
                finalValue: { type: 'info', label: 'Faydalı Ömür Sonu Değeri', value: formatCurrency(salvage) }
            },
            table 
        };
    },
  },
  content: {
    sections: [
      {
        title: "Amortisman Nedir?",
        content: (
          <p>
            Amortisman, bir işletmenin satın aldığı ve bir yıldan uzun süre kullanmayı planladığı duran varlıkların (bina, makine, taşıt, demirbaş vb.) maliyetinin, bu varlığın beklenen kullanım süresi (faydalı ömür) boyunca sistematik olarak gidere dönüştürülmesi işlemidir. Bu sayede, varlığın maliyeti tek bir seferde gider yazılmaz, kullanıldığı yıllara yayılarak hem gelir-gider tablosu daha doğru bir görünüm kazanır hem de vergi matrahı etkilenir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Normal Amortisman ve Azalan Bakiyeler Yöntemi arasındaki fark nedir?",
        answer: "<strong>Normal (Doğrusal) Amortisman:</strong> En yaygın yöntemdir. Varlığın maliyetinden hurda değeri çıkarılır ve kalan tutar faydalı ömre bölünür. Her yıl eşit miktarda amortisman gideri yazılır. <br/><strong>Azalan Bakiyeler Yöntemi:</strong> Varlığın ilk yıllarında daha fazla, son yıllarında daha az amortisman gideri yazılmasını sağlar. Normal amortisman oranının iki katı bir oran, varlığın her yılki net defter değeri üzerinden uygulanır. Özellikle teknolojik olarak çabuk eskiyen varlıklar için tercih edilebilir."
      },
      {
        question: "Faydalı ömür ve hurda değeri ne anlama geliyor?",
        answer: "<strong>Faydalı Ömür:</strong> Bir varlığın işletme tarafından verimli bir şekilde kullanılmasının beklendiği süredir. Bu süreler Vergi Usul Kanunu (VUK) tebliğleriyle belirlenir. <br/><strong>Hurda Değeri (Kalıntı Değer):</strong> Varlığın faydalı ömrü sonundaki tahmini satış veya elden çıkarma değeridir. Bu değer, amortismana tabi tutulacak toplam tutarı azaltır."
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
        resultTitle="Amortisman Planı"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}