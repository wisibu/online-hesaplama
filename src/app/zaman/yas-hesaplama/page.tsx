import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Yaş Hesaplama Aracı | Doğum Gününe Kaç Gün Kaldı?",
  description: "Doğum tarihinizi girerek tam yaşınızı yıl, ay ve gün olarak öğrenin. Toplam yaşadığınız gün, saat, dakika ve bir sonraki doğum gününüze kalan süreyi hesaplayın.",
  keywords: ["yaş hesaplama", "kaç yaşındayım", "doğum günü hesaplama", "yıl ay gün hesaplama", "yaşını hesapla"],
  calculator: {
    title: "Yaş Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Doğum tarihinizi girin ve kaç yaşında olduğunuzu, ne kadar yaşadığınızı ve bir sonraki doğum gününüzün ne zaman olduğunu anında öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'birthDate', label: 'Doğum Tarihiniz', type: 'date', defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 25)).toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { birthDate } = inputs;

        if (!birthDate) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen doğum tarihinizi seçin.' } } };
        }
        
        const today = new Date();
        today.setUTCHours(12,0,0,0);
        const start = new Date(`${birthDate}T12:00:00Z`);

        if (start > today) {
             return { summary: { error: { label: 'Hata', value: 'Doğum tarihi bugünden sonra olamaz.' } } };
        }

        // Detailed Age Calculation
        let years = today.getUTCFullYear() - start.getUTCFullYear();
        let months = today.getUTCMonth() - start.getUTCMonth();
        let days = today.getUTCDate() - start.getUTCDate();

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 0);
            days += lastMonth.getUTCDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        // Total Time Lived
        const totalDaysLived = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalHoursLived = totalDaysLived * 24;
        const totalMinutesLived = totalHoursLived * 60;

        // Next Birthday
        const nextBirthday = new Date(today.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 12, 0, 0, 0);
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getUTCFullYear() + 1);
        }
        const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const nextBirthdayDayOfWeek = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(nextBirthday);


        const summary = {
            age: { label: 'Yaşınız', value: `${years} yıl, ${months} ay, ${days} gün`, isHighlighted: true },
            nextBirthday: { label: 'Sonraki Doğum Günü', value: `${daysToNextBirthday} gün sonra (${nextBirthdayDayOfWeek})`},
            totalMonths: { label: 'Toplam Ay', value: `${formatNumber(years * 12 + months)} ay` },
            totalDays: { label: 'Toplam Gün', value: `${formatNumber(totalDaysLived)} gün` },
            totalHours: { label: 'Toplam Saat', value: `${formatNumber(totalHoursLived)} saat` },
            totalMinutes: { label: 'Toplam Dakika', value: `${formatNumber(totalMinutesLived)} dakika` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Tam Yaş Nasıl Hesaplanır?",
        content: (
          <p>
            Yaş hesaplama, genellikle iki tarih arasındaki yıl farkını almaktan ibaret gibi görünse de, doğru bir sonuç için aylar ve günler de hesaba katılmalıdır. Bu araç, doğum tarihinizi bugünün tarihinden çıkararak tam yaşınızı yıl, ay ve gün olarak hassas bir şekilde belirler. Artık yılları (29 Şubat) otomatik olarak dikkate alarak, yaşadığınız her bir günü sayar ve size en doğru sonucu sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Doğum saatimi girmem gerekiyor mu?",
        answer: "Hayır, doğum saatiniz yaşınızı gün bazında etkilemez. Hesaplayıcımız sadece doğum tarihinizi (gün, ay, yıl) kullanarak doğru sonucu bulur."
      },
      {
        question: "Bir sonraki doğum günüm hangi güne denk geliyor?",
        answer: "Hesaplayıcımız, yaşınızı hesaplamanın yanı sıra bir sonraki doğum gününüzün hangi güne denk geldiğini (Pazartesi, Salı vb.) de size gösterir. Böylece planlarınızı önceden yapabilirsiniz."
      },
       {
        question: "Çin takvimine göre yaş hesaplıyor musunuz?",
        answer: "Hayır, bu araç Miladi takvime göre yaş hesaplaması yapmaktadır. Çin takvimi gibi farklı takvim sistemleri, yaşı farklı metotlarla hesaplayabilir."
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
        resultTitle="Yaşınız ve Detaylar"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}