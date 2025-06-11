import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | OnlineHesaplama',
  description: 'OnlineHesaplama.net olarak gizliliğinize nasıl saygı duyduğumuzu ve verilerinizi nasıl koruduğumuzu öğrenin.',
};

const pageContent = {
  title: "Gizlilik Politikası",
  sections: [
    {
      title: "1. Giriş",
      content: (
        <p>
          OnlineHesaplama.net ("biz", "sitemiz", "platform") olarak, kullanıcılarımızın ("siz") gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, sitemizi ziyaret ettiğinizde veya hesaplama araçlarımızı kullandığınızda hangi bilgileri topladığımızı, bu bilgileri nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.
        </p>
      )
    },
    {
      title: "2. Toplanan Bilgiler",
      content: (
        <>
            <p className="mb-4">
                Platformumuz, temel işlevini yerine getirmek için minimum düzeyde veri toplama prensibiyle çalışır.
            </p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Girdiğiniz Veriler:</strong> Hesaplama araçlarımızı kullanırken girdiğiniz veriler (örneğin, maaş tutarı, kredi vadesi, doğum tarihi gibi) yalnızca ilgili hesaplamayı yapmak için kullanılır. Bu veriler sunucularımızda saklanmaz veya kaydedilmez. Hesaplama işlemi tamamlandıktan sonra verileriniz kaybolur.</li>
                <li><strong>Log Dosyaları ve Analitik:</strong> Birçok web sitesi gibi biz de standart log dosyaları kullanırız. Bu dosyalar; IP adresleri, tarayıcı türü, internet servis sağlayıcısı (ISP), tarih/zaman damgaları, yönlendiren/çıkış sayfaları ve tıklama sayısı gibi kişisel olarak tanımlanabilir olmayan bilgileri içerir. Bu bilgiler, siteyi yönetmek, trendleri analiz etmek ve demografik bilgi toplamak için kullanılır. Bu veriler, kişisel kimliğinizi ortaya çıkaracak şekilde kullanılmaz. Google Analytics gibi üçüncü taraf hizmetleri kullanarak sitemizin kullanımı hakkında anonim veriler toplayabiliriz.</li>
                <li><strong>Çerezler (Cookies):</strong> Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanabilir. Çerezler, tercihlerinizi hatırlamak ve gelecekteki ziyaretlerinizi kişiselleştirmek için bilgisayarınızda saklanan küçük metin dosyalarıdır. Tarayıcınızın ayarlarından çerezleri devre dışı bırakabilirsiniz, ancak bu durum sitenin bazı özelliklerinin düzgün çalışmamasına neden olabilir.</li>
            </ul>
        </>
      )
    },
    {
        title: "3. Bilgilerin Kullanımı",
        content: (
          <p>
            Topladığımız kişisel olmayan veriler yalnızca site içi analiz, performans ölçümü ve hizmet kalitesini artırma amacıyla kullanılır. Hesaplama araçlarına girdiğiniz kişisel veriler hiçbir şekilde üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.
          </p>
        )
      },
    {
      title: "4. Üçüncü Taraf Bağlantıları",
      content: (
        <p>
            Sitemiz, diğer web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik uygulamalarından biz sorumlu değiliz. Başka bir siteye geçtiğinizde, o sitenin gizlilik politikasını okumanızı öneririz.
        </p>
      )
    },
    {
        title: "5. Gizlilik Politikasındaki Değişiklikler",
        content: (
          <p>
            Bu Gizlilik Politikası'nı zaman zaman güncelleyebiliriz. Yapılan değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer. Politikayı düzenli olarak gözden geçirmeniz tavsiye edilir.
          </p>
        )
      },
      {
        title: "6. İletişim",
        content: (
          <p>
            Gizlilik Politikamız ile ilgili herhangi bir sorunuz veya endişeniz varsa, lütfen <a href="mailto:iletisim@onlinehesaplama.net" className="text-blue-600 hover:underline">iletisim@onlinehesaplama.net</a> adresinden bizimle iletişime geçin.
          </p>
        )
      }
  ]
};

export default function GizlilikPolitikasiPage() {
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