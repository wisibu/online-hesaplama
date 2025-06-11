import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Ne Zaman Emekli Olurum? (Emeklilik Hesaplama) | OnlineHesaplama",
  description: "Doğum tarihi, sigorta başlangıç tarihi ve prim gün sayınıza göre ne zaman emekli olabileceğinizi yaklaşık olarak hesaplayın.",
  keywords: ["emeklilik hesaplama", "ne zaman emekli olurum", "eyt hesaplama", "emeklilik yaşı", "sgk emeklilik"],
  calculator: {
    title: "Ne Zaman Emekli Olurum?",
    description: (
      <p className="text-sm text-gray-600">
        Sigorta bilgilerinizi girerek emeklilik için kalan sürenizi ve gerekli şartları öğrenin. Bu araç bir simülasyondur ve yasal geçerliliği yoktur.
      </p>
    ),
    inputFields: [
      { 
        id: 'gender', 
        label: 'Cinsiyet', 
        type: 'select', 
        options: [
          { value: 'male', label: 'Erkek' },
          { value: 'female', label: 'Kadın' }
        ] 
      },
      { id: 'birthDate', label: 'Doğum Tarihiniz', type: 'date' },
      { id: 'insuranceStartDate', label: 'İlk Sigortalı Olduğunuz Tarih', type: 'date' },
      { id: 'premiumDays', label: 'Toplam Prim Gün Sayınız (Yaklaşık)', type: 'number', placeholder: '5000' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      
      const { gender, birthDate, insuranceStartDate, premiumDays } = inputs;
      const startDate = new Date(insuranceStartDate as string);
      
      if (!birthDate || !insuranceStartDate || !premiumDays) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doldurun.' } } };
      }
      
      const premium = Number(premiumDays);
      let requiredAge = 0;
      let requiredPremiumDays = 0;
      let info = "";

      // 8 Eylül 1999 öncesi (EYT kapsamı)
      if (startDate < new Date('1999-09-09')) {
        requiredPremiumDays = 5000; // En düşükten başlar, başlangıca göre artar
        if (gender === 'male') {
           // 23.05.2002'deki duruma göre 25 yılı tamamlama
           requiredAge = 0; // Yaş şartı yok
           info = "8 Eylül 1999 öncesi sigortalı olduğunuz için EYT kapsamında olabilirsiniz. 25 yıl sigortalılık süresi ve kademeli prim günü şartını tamamladığınızda yaş aranmaksızın emekli olabilirsiniz.";
        } else { // Kadın
           requiredAge = 0; // Yaş şartı yok
           info = "8 Eylül 1999 öncesi sigortalı olduğunuz için EYT kapsamında olabilirsiniz. 20 yıl sigortalılık süresi ve kademeli prim günü şartını tamamladığınızda yaş aranmaksızın emekli olabilirsiniz.";
        }
      } else { // 9 Eylül 1999 sonrası
        requiredPremiumDays = 7000;
        if (gender === 'male') {
          requiredAge = 60;
        } else { // Kadın
          requiredAge = 58;
        }
        info = "Normal emeklilik şartlarına tabisiniz. Gerekli yaş ve prim gün sayısını tamamlamanız gerekmektedir.";
      }

      const remainingPremiumDays = Math.max(0, requiredPremiumDays - premium);
      
      const summary: CalculationResult['summary'] = {
        info: { label: 'Emeklilik Durumunuz', value: info },
        requiredAge: { label: 'Gerekli Yaş Şartı', value: requiredAge > 0 ? `${requiredAge} yaş` : "Yaş Şartı Yok" },
        requiredPremiumDays: { label: 'Gerekli Prim Günü', value: `${requiredPremiumDays} gün` },
        currentPremiumDays: { label: 'Mevcut Prim Gününüz', value: `${premium} gün` },
        remainingPremiumDays: { label: 'Eksik Prim Gününüz', value: `${remainingPremiumDays} gün`, isHighlighted: remainingPremiumDays > 0 },
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "Türkiye'de Emeklilik Sistemi ve Şartları",
        content: (
          <p>
            Türkiye'de emeklilik, Sosyal Güvenlik Kurumu (SGK) çatısı altında toplanan 4A (SSK), 4B (Bağ-Kur) ve 4C (Emekli Sandığı) statülerine göre belirlenir. Emekli olabilmek için genel olarak üç temel şart bulunur: belirli bir yaşı tamamlamak, belirli bir süre sigortalı olmak ve belirli bir gün sayısınca prim ödemiş olmak. Bu şartlar, sigorta başlangıç tarihine, cinsiyete ve sigorta statüsüne göre büyük farklılıklar göstermektedir. Özellikle 8 Eylül 1999 tarihi, emeklilik sisteminde bir milat kabul edilir ve bu tarihten önce veya sonra sigortalı olanlar için farklı kurallar geçerlidir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "EYT (Emeklilikte Yaşa Takılanlar) nedir?",
        answer: "EYT, 8 Eylül 1999 tarihinden önce sigortalı olmuş ancak emeklilik için gereken prim günü ve sigortalılık süresini doldurmalarına rağmen, sonradan getirilen yaş şartı nedeniyle emekli olamayan kişileri ifade eder. 2023'te yapılan yasal düzenleme ile bu durumdaki kişiler için yaş şartı kaldırılmıştır."
      },
      {
        question: "Prim günüm eksikse ne yapabilirim?",
        answer: "Eksik prim günlerini tamamlamak için çalışmaya devam edebilir veya belirli şartlar altında askerlik borçlanması, doğum borçlanması gibi hizmet borçlanması yöntemleriyle prim günü satın alabilirsiniz."
      },
      {
        question: "Bu hesaplama sonuçları kesin midir?",
        answer: "Hayır. Bu hesaplama aracı, genel ve basitleştirilmiş bilgilere dayanarak bir tahmin sunar. Farklı sigorta statüleri, hizmet birleştirmeleri, borçlanmalar gibi kişiye özel durumlar sonucu etkileyebilir. Kesin bilgi için her zaman Sosyal Güvenlik Kurumu'na (SGK) başvurmanız önerilir."
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
        resultTitle="Emeklilik Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 