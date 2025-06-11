import type { Metadata } from 'next';
import IcNveDisIskontoClient from './IcNveDisIskontoClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "İç ve Dış İskonto Hesaplama | OnlineHesaplama",
  description: "Bir alacak senedinin veya çekin vadesinden önce paraya çevrilmesi durumunda uygulanacak iç iskonto veya dış iskonto tutarını ve net bugünkü değerini hesaplayın.",
  keywords: ["iç iskonto hesaplama", "dış iskonto hesaplama", "senet kırdırma", "çek kırdırma", "iskonto hesaplama"],
  content: {
    sections: [
      {
        title: "İskonto Nedir? İç ve Dış İskonto Arasındaki Fark",
        content: (
          <>
            <p>
              İskonto, gelecekteki bir alacağın bugünkü değerini hesaplama işlemidir. Başka bir deyişle, bir senedin veya çekin vadesi gelmeden önce banka veya faktoring şirketleri tarafından paraya çevrilmesi sırasında yapılan kesintiyi ifade eder. Bu kesintinin hesaplanmasında iki temel yöntem kullanılır:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li><strong>Dış İskonto (Basit İskonto):</strong> Bu yöntemde faiz, senedin üzerinde yazılı olan nominal değer (vade sonundaki değer) üzerinden hesaplanır. Hesaplaması daha basittir ve genellikle kısa vadeli işlemlerde kullanılır. Kesinti tutarı daha yüksek olabilir.</li>
              <li><strong>İç İskonto (Gerçek İskonto):</strong> Bu yöntemde ise faiz, senedin bugünkü peşin değeri üzerinden hesaplanır. Yani, nominal değerden düşülecek faiz, peşin değerin bir fonksiyonudur. Finansal olarak daha doğru bir yöntem olarak kabul edilir ve genellikle daha adil bir sonuç verir.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi iskonto türü daha avantajlıdır?",
        answer: "Genellikle, aynı oran ve koşullar altında, iç iskonto yöntemi borçlu (senedi kırdıran) için daha avantajlıdır çünkü yapılacak kesinti (iskonto tutarı) dış iskonto yöntemine göre daha düşüktür. Bu da senedi kırdıranın eline daha fazla para geçmesi anlamına gelir."
      },
      {
        question: "Bu hesap makinesi hangi durumlar için kullanılır?",
        answer: "Vadeli bir ticari alacağınız (çek, senet vb.) varsa ve vadesini beklemeden nakit ihtiyacınızı karşılamak için bir finans kurumuna başvurmayı düşünüyorsanız, bu araçla elinize geçecek net tutarı önceden tahmin edebilirsiniz."
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
      <IcNveDisIskontoClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}