import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Kaç Gün Kaldı Hesaplama | Geri Sayım Aracı",
  description: "Belirlediğiniz bir tarihe kaç gün, kaç hafta veya kaç ay kaldığını anında hesaplayan geri sayım aracı.",
  keywords: ["kaç gün kaldı", "geri sayım hesaplama", "tarih sayacı", "sınava kaç gün kaldı", "tatile kaç gün kaldı"],
  calculator: {
    title: "Kaç Gün Kaldı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Gelecekteki bir tarihi seçerek o güne ne kadar zaman kaldığını öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'targetDate', label: 'Hedef Tarih', type: 'date', defaultValue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';

        const { targetDate } = inputs;

        if (!targetDate) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen bir hedef tarih seçin.' } } };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const target = new Date(`${targetDate}T00:00:00`);

        if (target < today) {
             return { summary: { error: { label: 'Hata', value: 'Hedef tarih geçmiş bir tarih olamaz.' } } };
        }

        const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        const targetUTC = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());

        const dayDifference = Math.round((targetUTC - todayUTC) / (1000 * 60 * 60 * 24));

        if(dayDifference === 0) {
            return { summary: { info: { label: 'Bugün!', value: 'Seçtiğiniz tarih bugün.' } } };
        }

        let years = target.getFullYear() - today.getFullYear();
        let months = target.getMonth() - today.getMonth();
        let days = target.getDate() - today.getDate();

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
            days += lastMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const summary = {
            totalDays: { label: 'Kalan Toplam Gün', value: `${formatNumber(dayDifference)} gün`, isHighlighted: true },
            totalWeeks: { label: 'Kalan Toplam Hafta', value: `${formatNumber(Math.floor(dayDifference / 7))} hafta, ${dayDifference % 7} gün` },
            detailedDifference: { label: 'Kalan Süre (Yıl, Ay, Gün)', value: `${years} yıl, ${months} ay, ${days} gün` },
        };

        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Geri Sayım Nasıl Çalışır?",
        content: (
          <p>
            Geri sayım hesaplayıcımız, bugünün tarihi ile belirlediğiniz hedef tarih arasındaki zaman farkını hesaplar. Bu hesaplama, artık yılları (29 Şubat içeren yıllar) ve ayların farklı gün sayılarını dikkate alarak size en doğru sonucu verir. Sonuçlar hem toplam gün sayısı olarak hem de daha anlamlı bir döküm olan yıl, ay ve gün olarak gösterilir. Bu araçla sınav tarihinize, tatilinize, doğum gününüze veya herhangi bir önemli etkinliğe ne kadar süre kaldığını kolayca takip edebilirsiniz.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavıma kaç gün kaldığını nasıl hesaplarım?",
        answer: "Çok basit! Hedef Tarih alanına sınavınızın tarihini girin ve 'Hesapla' düğmesine tıklayın. Kalan gün, hafta ve ay bilgisini anında görebilirsiniz."
      },
      {
        question: "Bu araç tatil planlaması için kullanılabilir mi?",
        answer: "Kesinlikle. Tatile çıkacağınız tarihi seçerek önünüzde ne kadar zaman olduğunu görebilir ve hazırlıklarınızı buna göre planlayabilirsiniz."
      },
      {
        question: "Hesaplama güncel tarihi mi baz alıyor?",
        answer: "Evet, hesaplama her zaman bulunduğunuz günün tarihini başlangıç noktası olarak alır ve seçtiğiniz gelecekteki tarihe olan farkı hesaplar."
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
        resultTitle="Kalan Süre"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 