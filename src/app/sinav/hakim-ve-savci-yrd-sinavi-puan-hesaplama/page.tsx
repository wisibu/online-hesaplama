import type { Metadata } from 'next';
import HakimSavciClient from './HakimSavciClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Adli/İdari Yargı Hakim ve Savcı Yardımcılığı Sınavı Puan Hesaplama | OnlineHesaplama",
  description: "Adli Yargı, İdari Yargı ve Adli Yargı-Avukat sınav türlerine göre Genel Yetenek, Genel Kültür ve Alan Bilgisi testlerindeki netlerinizi girerek puanınızı hesaplayın.",
  keywords: ["hakimlik sınavı puan hesaplama", "savcılık sınavı puan hesaplama", "adli yargı", "idari yargı", "hakim ve savcı yardımcılığı"],
  content: {
    sections: [
      {
        title: "Hakim ve Savcı Yardımcılığı Sınav Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Adli Yargı, İdari Yargı ve Adli Yargı-Avukatlık Sınavları, çoktan seçmeli sorulardan oluşan ve 3 oturumda yapılan testlerden oluşur. Puanlama, 100 tam puan üzerinden yapılır ve her sınav türünün kendine özgü puan hesaplama yöntemi vardır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her test bölümü için doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
              <li><strong>Ağırlıklı Puan:</strong> Her test bölümünden alınan standart puanlar, ilgili sınav türü için belirlenmiş katsayılarla çarpılarak toplanır ve adayın ağırlıklı puanı elde edilir.</li>
              <li><strong>Nihai Puan:</strong> Ağırlıklı puan, belirli bir formül kullanılarak 100'lük puan sistemine dönüştürülür. Sınavda başarılı sayılmak için en az 70 puan almak gerekmektedir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavda başarılı olmak için baraj puanı nedir?",
        answer: "Yazılı yarışma sınavında Genel Yetenek ve Genel Kültür Testi ile Alan Bilgisi Testinden alınan puanların ortalamasına göre, 100 tam puan üzerinden en az 70 puan almak gerekmektedir."
      },
      {
        question: "Alan Bilgisi testlerinin ağırlığı ne kadardır?",
        answer: "Puan hesaplamasında Alan Bilgisi testlerinin ağırlığı, Genel Yetenek ve Genel Kültür testlerine göre çok daha yüksektir. Bu nedenle alan testlerindeki başarı, sıralamada belirleyici rol oynar."
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
      <HakimSavciClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 