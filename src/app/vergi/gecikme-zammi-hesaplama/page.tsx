import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Gecikme Zammı Hesaplama (Vergi, SGK) | OnlineHesaplama",
  description: "Vadesi geçmiş vergi, SGK primi ve diğer kamu borçlarınız için ödemeniz gereken gecikme zammı tutarını güncel oranlarla hesaplayın.",
  keywords: ["gecikme zammı hesaplama", "vergi gecikme faizi", "sgk gecikme zammı", "kamu alacağı"],
  calculator: {
    title: "Gecikme Zammı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Borç tutarını, vade tarihini ve ödeme tarihini girerek gecikme zammını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Borç Tutarı (Anapara)', type: 'number', placeholder: '10000' },
      { id: 'dueDate', label: 'Vade Tarihi', type: 'date' },
      { id: 'paymentDate', label: 'Ödeme Tarihi', type: 'date' },
      { id: 'rate', label: 'Aylık Gecikme Zammı Oranı (%)', type: 'number', placeholder: '4.5' },

    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const principal = Number(inputs.principal);
        const dueDate = new Date(inputs.dueDate as string);
        const paymentDate = new Date(inputs.paymentDate as string);
        const monthlyRate = Number(inputs.rate) / 100;

        if (isNaN(principal) || principal <= 0 || isNaN(dueDate.getTime()) || isNaN(paymentDate.getTime())) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli değerler girin.' } } };
        }
        if (paymentDate <= dueDate) {
            return { summary: { info: { type: 'info', label: 'Bilgi', value: 'Ödeme tarihi vade tarihinden sonra olmalıdır. Gecikme zammı hesaplanmadı.' } } };
        }

        let totalInterest = 0;
        let currentDate = new Date(dueDate);
        
        // Ayları hesapla
        while (currentDate < paymentDate) {
            const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
            if (nextMonth > paymentDate) break;
            totalInterest += principal * monthlyRate;
            currentDate = nextMonth;
        }

        // Kalan günleri hesapla
        const remainingDays = (paymentDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        if (remainingDays > 0) {
            const dailyRate = monthlyRate / 30;
            totalInterest += principal * dailyRate * remainingDays;
        }

        const totalPayment = principal + totalInterest;

        const summary: CalculationResult['summary'] = {
            principal: { type: 'info', label: 'Borç Anapara', value: formatCurrency(principal) },
            interest: { type: 'info', label: 'Hesaplanan Gecikme Zammı', value: formatCurrency(totalInterest) },
            total: { type: 'result', label: 'Toplam Ödenecek Tutar', value: formatCurrency(totalPayment), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Gecikme Zammı Nedir ve Nasıl Hesaplanır?",
        content: (
          <p>
            Gecikme zammı, vadesinde ödenmeyen kamu alacakları (vergi, SGK primi, harçlar vb.) için vade tarihinden ödendiği tarihe kadar geçen süre için uygulanan bir tür cezai faizdir. 6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'a göre düzenlenir. Hesaplama, her ay için ayrı ayrı yapılır. Ay kesirleri (yani tam ay olmayan günler) için ise günlük olarak zam hesaplanır. Aylık zam oranı, günlük orana çevrilirken ay 30 gün olarak kabul edilir. Bu hesaplayıcı, bu karmaşık süreci sizin için otomatikleştirir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Güncel gecikme zammı oranı nedir?",
        answer: "Gecikme zammı oranı, Cumhurbaşkanı Kararı ile belirlenir ve Resmi Gazete'de yayımlanarak yürürlüğe girer. Oranlar zamanla değişebilir. Bu nedenle hesaplama yaparken, borcun ait olduğu dönemdeki geçerli oranı kullanmak önemlidir. Hesaplayıcımızda güncel oranı manuel olarak girebilirsiniz."
      },
      {
        question: "Gecikme zammı ve gecikme faizi aynı şey midir?",
        answer: "İki kavram sıkça karıştırılsa da teknik olarak farklıdırlar. Gecikme zammı, vadesinde ödenmeyen amme alacakları için uygulanırken; gecikme faizi, vergi ziyaı cezasının uygulandığı durumlar veya normal vade tarihinden sonra yapılan tarhiyatlar için hesaplanır. Ancak halk arasında genellikle her ikisi de benzer anlamda kullanılır."
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
        resultTitle="Borç Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 