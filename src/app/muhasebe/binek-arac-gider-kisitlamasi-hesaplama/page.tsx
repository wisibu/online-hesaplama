import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import BinekAracGiderClient from './BinekAracGiderClient';

const pageConfig = {
  title: "Binek Araç Gider Kısıtlaması Hesaplama | OnlineHesaplama",
  description: "Şirketinize ait binek araçların amortisman, kira ve diğer giderleri için yasal olarak kabul edilen maksimum gider kısıtlaması tutarlarını hesaplayın.",
  keywords: ["binek araç gider kısıtlaması", "gider kısıtlaması hesaplama", "amortisman kısıtlaması", "araç kira gider kısıtlaması", "vergi avantajı"],
  content: {
    sections: [
        {
            title: "Binek Araç Gider Kısıtlaması Nedir?",
            content: (
              <>
                <p>
                  Vergi Usul Kanunu'na göre, şirketlerin faaliyetlerinde kullandıkları binek otomobillerin bazı giderleri vergi matrahından indirilirken belirli sınırlamalara tabidir. Bu düzenleme, özellikle lüks araç giderlerinin vergi avantajı olarak kullanılmasını önlemeyi amaçlar.
                </p>
                <p className="mt-2">
                  Kısıtlamalar temel olarak üç alanda uygulanır:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Kira Giderleri:</strong> Binek araç kiralamalarında, KDV hariç aylık kira bedelinin belirli bir tutarı (2024 için 26.000 TL) aşan kısmı gider olarak kabul edilmez.</li>
                    <li><strong>Satın Alma Giderleri (Amortisman):</strong> Araç satın alımlarında, ÖTV ve KDV'nin doğrudan gider yazılabileceği veya maliyete eklenebileceği durumlar vardır. Maliyete eklendiğinde ise amortismana tabi tutar için bir üst sınır (2024 için ÖTV+KDV dahil 1.500.000 TL) bulunur.</li>
                    <li><strong>Diğer Giderler:</strong> Akaryakıt, bakım, onarım gibi masrafların %70'i gider olarak yazılabilirken, %30'u Kanunen Kabul Edilmeyen Gider (KKEG) olarak dikkate alınır.</li>
                </ul>
              </>
            )
        }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcıdaki limitler güncel mi?",
        answer: "Evet, bu hesaplayıcı 2024 yılı için geçerli olan Hazine ve Maliye Bakanlığı tarafından duyurulan en güncel yasal limitleri kullanmaktadır. Limitler her yıl yeniden değerleme oranına göre güncellenmektedir."
      },
      {
        question: "Kanunen Kabul Edilmeyen Gider (KKEG) ne anlama geliyor?",
        answer: "KKEG, ticari kazancın tespitinde indirimi yasal olarak kabul edilmeyen harcamalardır. Gider kısıtlamasını aşan tutarlar KKEG olarak kaydedilir ve şirketin vergi matrahına eklenerek vergilendirilir. Bu durum, şirketin ödeyeceği kurumlar vergisini artırır."
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
      <BinekAracGiderClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}