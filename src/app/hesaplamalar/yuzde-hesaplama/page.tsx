import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import YuzdeHesaplamaClient from './YuzdeHesaplamaClient';

const pageConfig = {
  title: "Yüzde Hesaplama Aracı | OnlineHesaplama",
  description: "Bir sayının belirtilen yüzdesini bulma, yüzde olarak ifade etme, artış veya azalış yüzdesini hesaplama gibi tüm yüzde işlemlerini kolayca yapın.",
  keywords: ["yüzde hesaplama", "yüzde bulma", "yüzde artış", "yüzde azalış", "bir sayının yüzdesi"],
  content: {
    sections: [
        {
            title: "Yüzde Nedir ve Nasıl Hesaplanır?",
            content: (
              <>
                <p>
                  'Yüzde', bir bütünün 100 eşit parçaya bölündüğünde o parçalardan kaç tanesini temsil ettiğini gösteren bir orandır. "%" sembolü ile gösterilir. Günlük hayattan finansa, bilimden istatistiğe kadar çok geniş bir kullanım alanına sahiptir.
                </p>
                <p className="mt-2">
                  Temel yüzde hesaplamaları şunlardır:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Bir Sayının Yüzdesini Bulma:</strong> Bir sayıyı yüzde oranıyla çarpıp 100'e bölerek bulunur. (Örn: 500'ün %20'si = 500 * 20 / 100 = 100).</li>
                    <li><strong>Bir Sayının Başka Bir Sayıya Oranını Yüzde Olarak Bulma:</strong> İlk sayıyı ikinci sayıya bölüp 100 ile çarparak bulunur. (Örn: 20, 50'nin yüzde kaçıdır? = (20 / 50) * 100 = %40).</li>
                    <li><strong>Yüzdesel Değişimi (Artış/Azalış) Bulma:</strong> Yeni değer ile eski değer arasındaki farkı eski değere bölüp 100 ile çarparak bulunur.</li>
                </ul>
              </>
            )
        }
    ],
    faqs: [
      {
        question: "Bu araçla hangi yüzde hesaplamalarını yapabilirim?",
        answer: "Bu çok amaçlı araçla; bir sayının belirtilen bir yüzdesini, bir sayının başka bir sayının yüzde kaçı olduğunu, bir sayıdan belirli bir yüzdeyle artırılmış veya azaltılmış yeni değeri ve iki sayı arasındaki yüzde değişimi (artış/azalış) hesaplayabilirsiniz."
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
      <YuzdeHesaplamaClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 