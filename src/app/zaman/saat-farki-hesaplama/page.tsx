import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const timezones = [
    { value: 'Europe/Istanbul', label: 'Türkiye (İstanbul)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Europe/London', label: 'Londra (GMT)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Asia/Shanghai', label: 'Şanghay' },
    { value: 'Australia/Sydney', label: 'Sidney' },
];

const getTimeInZone = (zone: string) => {
    return new Date().toLocaleTimeString('tr-TR', { timeZone: zone, hour: '2-digit', minute: '2-digit' });
}

const getOffset = (zone: string) => {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: zone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}

const pageConfig = {
  title: "Saat Farkı Hesaplama | Ülkeler ve Şehirler Arası Zaman Farkı",
  description: "İki farklı şehir veya saat dilimi arasındaki zaman farkını anında öğrenin. Dünya saatleri ve uluslararası toplantı planlaması için pratik bir araç.",
  keywords: ["saat farkı hesaplama", "dünya saatleri", "zaman farkı", "utc farkı", "gmt farkı", "şehirler arası saat farkı"],
  calculator: {
    title: "Saat Farkı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Saat farkını öğrenmek istediğiniz iki konumun saat dilimini seçin.
      </p>
    ),
    inputFields: [
      { id: 'zone1', label: 'Konum 1', type: 'select', options: timezones, defaultValue: 'Europe/Istanbul' },
      { id: 'zone2', label: 'Konum 2', type: 'select', options: timezones, defaultValue: 'Europe/London' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { zone1, zone2 } = inputs as { zone1: string, zone2: string };
        if (!zone1 || !zone2) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen iki konum da seçin.' } } };
        }
        
        const offset1 = getOffset(zone1);
        const offset2 = getOffset(zone2);
        const diff = offset1 - offset2;

        const zone1Label = timezones.find(tz => tz.value === zone1)?.label || zone1;
        const zone2Label = timezones.find(tz => tz.value === zone2)?.label || zone2;
        
        const summary = {
            time1: { label: `${zone1Label} Yerel Saati`, value: getTimeInZone(zone1) },
            time2: { label: `${zone2Label} Yerel Saati`, value: getTimeInZone(zone2) },
            difference: { label: 'Saat Farkı', value: `${zone1Label}, ${zone2Label}'dan ${Math.abs(diff)} saat ${diff > 0 ? 'ileri' : 'geri'}.` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Saat Dilimi (Timezone) Nedir?",
        content: (
          <p>
            Saat dilimi, Dünya üzerindeki her bir bölgenin yerel saatinin aynı olduğu coğrafi bir alandır. Dünya, 24 ana saat dilimine ayrılmıştır. Bu sistem, uluslararası iletişim ve seyahati kolaylaştırmak için oluşturulmuştur. Tüm saat dilimleri, Eşgüdümlü Evrensel Zaman (UTC) temel alınarak belirlenir. Örneğin, Türkiye'nin saat dilimi UTC+3'tür, yani Türkiye saati UTC'den 3 saat ileridedir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "GMT ve UTC arasındaki fark nedir?",
        answer: "Pratikte günlük kullanım için GMT (Greenwich Mean Time) ve UTC (Coordinated Universal Time) genellikle birbirinin yerine kullanılır. Ancak teknik olarak UTC, atomik saatlerle ölçülen daha hassas bir zaman standardıdır, GMT ise Greenwich, Londra'daki Kraliyet Gözlemevi'nden geçen meridyene dayalı astronomik bir zamandır. Modern dünyada zaman standardı olarak UTC kabul edilir."
      },
      {
        question: "Yaz saati uygulaması (DST) nedir?",
        answer: "Yaz saati uygulaması (Daylight Saving Time), gün ışığından daha fazla yararlanmak amacıyla saatlerin ilkbaharda bir saat ileri, sonbaharda ise bir saat geri alınmasıdır. Bu uygulama tüm ülkelerde geçerli değildir ve uygulanan ülkelerde saat farkı hesaplamalarını etkileyebilir. (Not: Türkiye'de 2016'dan beri kalıcı yaz saati uygulanmaktadır ve saatler değiştirilmemektedir.)"
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
        resultTitle="Zaman Farkı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}