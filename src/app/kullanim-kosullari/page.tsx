import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | OnlineHesaplama',
  description: 'OnlineHesaplama.net platformunun kullanım koşulları. Sitemizi kullanarak bu koşulları kabul etmiş sayılırsınız.',
};

const pageContent = {
  title: "Kullanım Koşulları",
  sections: [
    {
      title: "1. Taraflar ve Tanımlar",
      content: (
        <p>
          İşbu Kullanım Koşulları, OnlineHesaplama.net (bundan sonra "Site" olarak anılacaktır) ile Site'yi kullanan kişi (bundan sonra "Kullanıcı" olarak anılacaktır) arasındaki ilişkileri düzenlemektedir. Site'yi kullanmanız, bu koşulları okuduğunuz ve kabul ettiğiniz anlamına gelir.
        </p>
      )
    },
    {
      title: "2. Hizmetlerin Tanımı",
      content: (
        <p>
          Site, finans, sağlık, eğitim, vergi ve diğer çeşitli kategorilerde online hesaplama araçları sunan bir platformdur. Bu araçlar tarafından sağlanan tüm sonuçlar ve veriler yalnızca bilgilendirme amaçlıdır. Sağlanan bilgiler, profesyonel, yasal, finansal veya tıbbi tavsiye niteliği taşımaz.
        </p>
      )
    },
    {
        title: "3. Sorumluluğun Reddi",
        content: (
          <p>
            Site'de yer alan hesaplama araçlarının sonuçlarının doğruluğu ve güncelliği için azami özen gösterilmekle birlikte, bu sonuçların hatasız olduğu garanti edilmez. Hesaplamalar, genel kabul görmüş formüllere ve güncel verilere dayanmaktadır ancak bireysel durumunuzun özel koşullarını yansıtmayabilir. Bu nedenle, Site'den elde edilen bilgilere dayanarak finansal veya yasal kararlar almadan önce mutlaka bir uzmana danışmanız tavsiye edilir. Site, hesaplama sonuçlarının kullanılmasından doğabilecek doğrudan veya dolaylı hiçbir zarardan sorumlu tutulamaz.
          </p>
        )
      },
    {
      title: "4. Kullanıcı Yükümlülükleri",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>Kullanıcı, Site'yi yalnızca yasal amaçlarla kullanacağını kabul eder.</li>
          <li>Kullanıcı, Site'nin altyapısına zarar verebilecek veya aşırı yük bindirebilecek herhangi bir eylemde bulunamaz.</li>
          <li>Kullanıcı, Site üzerinden sağlanan verileri girerken doğru bilgi vermekle yükümlüdür. Yanlış bilgi girişinden kaynaklanan hatalı sonuçlardan Kullanıcı'nın kendisi sorumludur.</li>
        </ul>
      )
    },
    {
        title: "5. Fikri Mülkiyet Hakları",
        content: (
          <p>
            Site'nin tasarımı, içeriği, metinleri, görselleri, logoları ve hesaplama araçlarının kodları dahil olmak üzere tüm unsurları OnlineHesaplama.net'e aittir ve fikri mülkiyet yasaları tarafından korunmaktadır. Bu materyallerin izinsiz olarak kopyalanması, çoğaltılması, dağıtılması veya kullanılması kesinlikle yasaktır.
          </p>
        )
      },
      {
        title: "6. Değişiklikler",
        content: (
          <p>
            Site, işbu Kullanım Koşulları'nı herhangi bir zamanda önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Değişiklikler, Site'de yayınlandığı anda yürürlüğe girer. Site'yi kullanmaya devam etmeniz, değiştirilmiş koşulları kabul ettiğiniz anlamına gelir.
          </p>
        )
      },
      {
        title: "7. Yürürlük",
        content: (
          <p>
            Bu Kullanım Koşulları, Kullanıcı'nın Site'yi kullanmaya başladığı andan itibaren süresiz olarak yürürlüğe girer.
          </p>
        )
      }
  ]
};

export default function KullanimKosullariPage() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
          {pageContent.title}
        </h1>
        <RichContent sections={pageContent.sections} />
      </div>
    </div>
  );
} 