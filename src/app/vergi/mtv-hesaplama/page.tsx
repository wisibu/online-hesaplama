import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// Data based on Vergi Sirküleri 119 for 2024
const mtvDataPre2018 = {
  '0-1300':      [3359, 2343, 1308, 987, 347],
  '1301-1600':   [5851, 4387, 2544, 1798, 690],
  '1601-1800':   [10342, 8078, 4758, 2896, 1120],
  '1801-2000':   [16296, 12546, 7374, 4387, 1728],
  '2001-2500':   [24439, 17741, 11085, 6620, 2617],
  '2501-3000':   [34081, 29646, 18519, 9956, 3654],
  '3001-3500':   [51903, 46702, 28129, 14037, 5148],
  '3501-4000':   [81611, 70470, 41500, 18519, 7374],
  '4001+':       [133572, 100164, 59319, 26654, 10342],
};

const mtvDataPost2018 = {
  '0-1300': {
    '0-180600':     [3359, 2343, 1308, 987, 347],
    '180600-316400': [3692, 2576, 1437, 1088, 383],
    '316400+':      [4032, 2809, 1573, 1188, 413],
  },
  '1301-1600': {
    '0-180600':     [5851, 4387, 2544, 1798, 690],
    '180600-316400': [6439, 4828, 2801, 1972, 754],
    '316400+':      [7026, 5265, 3050, 2153, 823],
  },
  '1601-1800': {
    '0-452800':     [11374, 8894, 5227, 3189, 1235],
    '452800+':      [12413, 9697, 5710, 3484, 1348],
  },
  '1801-2000': {
    '0-452800':     [17920, 13800, 8111, 4828, 1898],
    '452800+':      [19553, 15061, 8848, 5265, 2072],
  },
  '2001-2500': {
    '0-565500':     [26885, 19517, 12193, 7282, 2880],
    '565500+':      [29332, 21290, 13299, 7948, 3142],
  },
  '2501-3000': {
    '0-1131800':    [37485, 32615, 20373, 10957, 4016],
    '1131800+':     [40898, 35575, 22227, 11955, 4383],
  },
  '3001-3500': {
    '0-1131800':    [57093, 51374, 30944, 15446, 5657],
    '1131800+':     [62289, 56039, 33756, 16845, 6179],
  },
  '3501-4000': {
    '0-1811800':    [89767, 77517, 45649, 20373, 8111],
    '1811800+':     [97937, 84560, 49807, 22227, 8848],
  },
  '4001+': {
    '0-2151400':    [146932, 110177, 65252, 29326, 11374],
    '2151400+':     [160285, 120196, 71186, 31991, 12413],
  },
};

const ageBrackets = [
  { value: '0', label: '1-3 yaş' },
  { value: '1', label: '4-6 yaş' },
  { value: '2', label: '7-11 yaş' },
  { value: '3', label: '12-15 yaş' },
  { value: '4', label: '16 yaş ve üzeri' },
];

const ccBrackets = [
  { value: '0-1300', label: '1300 cc ve altı' },
  { value: '1301-1600', label: '1301 - 1600 cc' },
  { value: '1601-1800', label: '1601 - 1800 cc' },
  { value: '1801-2000', label: '1801 - 2000 cc' },
  { value: '2001-2500', label: '2001 - 2500 cc' },
  { value: '2501-3000', label: '2501 - 3000 cc' },
  { value: '3001-3500', label: '3001 - 3500 cc' },
  { value: '3501-4000', label: '3501 - 4000 cc' },
  { value: '4001+', label: '4001 cc ve üzeri' },
];

const valueBracketsByCC = {
    '0-1300': [{value: '0-180600', label: '180.600 TL\'ye kadar'}, {value: '180600-316400', label: '180.601 TL - 316.400 TL arası'}, {value: '316400+', label: '316.400 TL üzeri'}],
    '1301-1600': [{value: '0-180600', label: '180.600 TL\'ye kadar'}, {value: '180600-316400', label: '180.601 TL - 316.400 TL arası'}, {value: '316400+', label: '316.400 TL üzeri'}],
    '1601-1800': [{value: '0-452800', label: '452.800 TL\'ye kadar'}, {value: '452800+', label: '452.800 TL üzeri'}],
    '1801-2000': [{value: '0-452800', label: '452.800 TL\'ye kadar'}, {value: '452800+', label: '452.800 TL üzeri'}],
    '2001-2500': [{value: '0-565500', label: '565.500 TL\'ye kadar'}, {value: '565500+', label: '565.500 TL üzeri'}],
    '2501-3000': [{value: '0-1131800', label: '1.131.800 TL\'ye kadar'}, {value: '1131800+', label: '1.131.800 TL üzeri'}],
    '3001-3500': [{value: '0-1131800', label: '1.131.800 TL\'ye kadar'}, {value: '1131800+', label: '1.131.800 TL üzeri'}],
    '3501-4000': [{value: '0-1811800', label: '1.811.800 TL\'ye kadar'}, {value: '1811800+', label: '1.811.800 TL üzeri'}],
    '4001+': [{value: '0-2151400', label: '2.151.400 TL\'ye kadar'}, {value: '2151400+', label: '2.151.400 TL üzeri'}],
};


const pageConfig = {
  title: "MTV Hesaplama 2024 | Motorlu Taşıtlar Vergisi Sorgulama",
  description: "Aracınızın yaşına, motor hacmine ve tescil tarihine göre 2024 yılı için güncel Motorlu Taşıtlar Vergisi (MTV) tutarını anında hesaplayın.",
  keywords: ["mtv hesaplama", "motorlu taşıtlar vergisi", "2024 mtv", "araç vergisi", "mtv sorgulama"],
  calculator: {
    title: "Motorlu Taşıtlar Vergisi (MTV) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Aracınızın bilgilerini seçerek 2024 yılı için ödemeniz gereken yıllık ve 6 aylık MTV tutarını kolayca öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'registrationDate', label: 'Aracın İlk Tescil Tarihi', type: 'select', options: [{value: 'pre2018', label: '31/12/2017 ve Öncesi'}, {value: 'post2018', label: '01/01/2018 ve Sonrası'}] },
      { id: 'vehicleAge', label: 'Araç Yaşı', type: 'select', options: ageBrackets },
      { id: 'engineCC', label: 'Motor Silindir Hacmi', type: 'select', options: ccBrackets },
      { id: 'vehicleValue', label: 'KDV Hariç Araç Değeri', type: 'select', options: [], displayCondition: { field: 'registrationDate', value: 'post2018' }, dependentField: 'engineCC', dependentOptions: valueBracketsByCC},

    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { registrationDate, vehicleAge, engineCC, vehicleValue } = inputs;

        if (!registrationDate || !vehicleAge || !engineCC) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doldurun.' } } };
        }
        
        const ageIndex = parseInt(vehicleAge as string, 10);
        let annualMtv = 0;

        if (registrationDate === 'pre2018') {
            const table = mtvDataPre2018[engineCC as keyof typeof mtvDataPre2018];
            annualMtv = table[ageIndex];
        } else {
            if (!vehicleValue) {
              return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen araç değerini seçin.' } } };
            }
            const table = mtvDataPost2018[engineCC as keyof typeof mtvDataPost2018][vehicleValue as keyof typeof mtvDataPost2018[keyof typeof mtvDataPost2018]];
            annualMtv = table[ageIndex];
        }

        if (!annualMtv) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Hesaplama yapılamadı. Lütfen girdileri kontrol edin.' } } };
        }

        const summary: CalculationResult['summary'] = {
            annualMtv: { type: 'result', label: 'Yıllık MTV Tutarı', value: formatCurrency(annualMtv), isHighlighted: true },
            installment: { type: 'info', label: '1. Taksit (Ocak)', value: formatCurrency(annualMtv / 2) },
            installment2: { type: 'info', label: '2. Taksit (Temmuz)', value: formatCurrency(annualMtv / 2) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Motorlu Taşıtlar Vergisi (MTV) Nedir?",
        content: (
          <p>
            Motorlu Taşıtlar Vergisi (MTV), Karayolları Trafik Kanunu uyarınca trafik şube veya bürolarına kayıt ve tescil edilmiş bulunan motorlu kara taşıtlarının her yıl ödemekle yükümlü olduğu bir vergi türüdür. MTV tutarı, aracın cinsi, yaşı, motor silindir hacmi ve 1 Ocak 2018'den sonra tescil edilen araçlar için ek olarak KDV'siz değeri gibi kriterlere göre belirlenir. Bu vergi, her yılın Ocak ve Temmuz aylarında iki eşit taksitte ödenir.
          </p>
        )
      },
       {
        title: "2024 MTV Hesaplaması Nasıl Yapılır?",
        content: (
          <p>
            2024 yılı için MTV hesaplaması, aracın ilk tescil tarihine göre iki farklı tarifeye dayanır:
            <br/><br/>
            <strong>1. Tescil Tarihi 31.12.2017 ve Öncesi Olan Araçlar:</strong> Bu araçlar için MTV tutarı, sadece aracın motor silindir hacmi ve yaşına göre belirlenir. Araç değeri hesaplamaya dahil edilmez.
            <br/><br/>
            <strong>2. Tescil Tarihi 01.01.2018 ve Sonrası Olan Araçlar:</strong> Bu tarihten sonra tescil edilen araçlar için hesaplama daha karmaşıktır. Motor silindir hacmi ve yaşının yanı sıra, aracın Türkiye Sigorta, Reasürans ve Emeklilik Şirketleri Birliği tarafından her yıl ilan edilen kasko değer listesindeki KDV hariç değeri de vergi tutarını etkiler.
            <br/><br/>
            Hesaplayıcımız, bu iki durumu da dikkate alarak sizin için en doğru sonucu verir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "MTV ne zaman ödenir?",
        answer: "Motorlu Taşıtlar Vergisi her yıl iki eşit taksitte ödenir. Birinci taksit Ocak ayının sonuna kadar, ikinci taksit ise Temmuz ayının sonuna kadar ödenmelidir."
      },
      {
        question: "MTV borcu nasıl sorgulanır ve ödenir?",
        answer: "MTV borcunuzu Gelir İdaresi Başkanlığı'nın (GİB) İnteraktif Vergi Dairesi web sitesi veya mobil uygulaması üzerinden, e-Devlet kapısından veya anlaşmalı bankaların internet bankacılığı kanallarından sorgulayabilir ve ödeyebilirsiniz."
      },
       {
        question: "MTV ödenmezse ne olur?",
        answer: "MTV'nin zamanında ödenmemesi durumunda, gecikme zammı uygulanır. Ayrıca, vergi borcu bulunan araçların fenni muayeneleri (TÜVTÜRK) yapılmaz ve bu araçların satışı noter tarafından gerçekleştirilmez."
      },
      {
        question: "Aracın yaşını nasıl hesaplarım?",
        answer: "MTV için araç yaşı, model yılı baz alınarak hesaplanır. İçinde bulunulan yıldan aracın model yılı çıkarılıp sonuca 1 eklenir. Örneğin, 2020 model bir aracın 2024 yılındaki vergi yaşı 5'tir (2024 - 2020 + 1)."
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
        resultTitle="2024 Yılı MTV Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}