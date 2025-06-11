import type { Metadata } from 'next';
import AytClient from './AytClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "AYT Puan Hesaplama 2024 | OnlineHesaplama",
  description: "YKS'nin ikinci oturumu olan AYT puanınızı, OBP ve TYT puanınızı ekleyerek Sayısal (SAY), Sözel (SÖZ), Eşit Ağırlık (EA) ve DİL yerleştirme puanlarınızı hesaplayın.",
  keywords: ["ayt puan hesaplama", "yks puan hesaplama", "ayt yerleştirme puanı", "sayısal puan hesaplama", "eşit ağırlık puan hesaplama", "sözel puan hesaplama", "dil puan hesaplama", "obp"],
  content: {
    sections: [
      {
        title: "AYT ve YKS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Alan Yeterlilik Testi (AYT), Yükseköğretim Kurumları Sınavı'nın (YKS) ikinci ve en önemli oturumudur. Üniversite bölümlerinin büyük çoğunluğu AYT puanı ile öğrenci kabul eder. AYT puanı, adayın girdiği testlerdeki netlerine, TYT puanının %40'ına ve Ortaöğretim Başarı Puanı'na (OBP) göre hesaplanır.
            </p>
            <p className="mt-2">
              Hesaplama şu adımlarla yapılır:
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her ders için, doğru sayısından yanlış sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
              <li><strong>Ham Puanın Hesaplanması:</strong> Her puan türü (SAY, SÖZ, EA, DİL) için ilgili derslerin netleri, ÖSYM'nin belirlediği katsayılarla çarpılarak toplanır.</li>
              <li><strong>Yerleştirme Puanının Hesaplanması:</strong> Ham puana, TYT puanının %40'ı ve OBP'nin 0.12 katsayısıyla çarpılmış hali eklenir. Böylece nihai yerleştirme puanı ortaya çıkar.</li>
            </ol>
            <p className="mt-2">
              Bu hesaplayıcı, güncel katsayılara göre tahmini bir sonuç verir. Katsayılar her yıl sınavın zorluk derecesine göre değişebilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "OBP (Ortaöğretim Başarı Puanı) nedir ve nasıl etkiler?",
        answer: "OBP, lise diploma notunuzun 5 ile çarpılmasıyla elde edilen puandır (en fazla 500). Bu puanın 0.12 ile çarpılmış hali (en fazla 60 puan), AYT yerleştirme puanınıza doğrudan eklenir ve sıralamanızı önemli ölçüde etkiler."
      },
      {
        question: "AYT'de baraj puanı var mı?",
        answer: "AYT'de bir programa yerleşebilmek için ilgili puan türünde (SAY, SÖZ, EA, DİL) en az 180 ham puan barajını geçmek gerekiyordu. Ancak son düzenlemelerle birlikte bu baraj puanları kaldırılmıştır. Yine de üniversitelerin ve bölümlerin kendi başarı sırası barajları olabilir."
      },
      {
        question: "TYT puanım AYT'yi nasıl etkiliyor?",
        answer: "TYT puanınız, AYT yerleştirme puanınızın %40'ını oluşturur. TYT'de yüksek bir puan almak, AYT sıralamanızı ve yerleşme şansınızı doğrudan artırır."
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
      <AytClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}