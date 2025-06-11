import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';

export const metadata: Metadata = {
  title: 'Hakkımızda | OnlineHesaplama',
  description: 'OnlineHesaplama.net, kullanıcıların günlük yaşamlarında ve profesyonel işlerinde ihtiyaç duydukları hesaplamaları hızlı, doğru ve kolay bir şekilde yapmalarını sağlayan bir platformdur.',
};

const pageContent = {
  title: "Hakkımızda",
  sections: [
    {
      title: "Misyonumuz",
      content: (
        <p>
          Misyonumuz, en karmaşık hesaplamaları bile herkes için anlaşılır ve erişilebilir kılmaktır. Finansal planlamadan sağlık takibine, akademik hesaplamalardan vergi beyanlarına kadar geniş bir yelpazede, güvenilir ve kullanıcı dostu araçlar sunarak insanların hayatını kolaylaştırmayı hedefliyoruz. Herkesin doğru bilgiye anında ulaşma hakkı olduğuna inanıyor ve bu doğrultuda platformumuzu sürekli olarak geliştiriyoruz.
        </p>
      )
    },
    {
      title: "Vizyonumuz",
      content: (
        <p>
          Vizyonumuz, Türkiye'nin en çok tercih edilen ve en güvenilir online hesaplama platformu olmaktır. Teknolojiyi ve yenilikçi yaklaşımları kullanarak, kullanıcılarımızın değişen ihtiyaçlarına anında yanıt veren çözümler üretmeyi amaçlıyoruz. Hesaplama araçlarımızın kapsamını sürekli genişleterek, her alanda akla gelen ilk başvuru kaynağı olmayı ve insanların finansal okuryazarlığına katkıda bulunmayı hedefliyoruz.
        </p>
      )
    },
    {
      title: "Değerlerimiz",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Kullanıcı Odaklılık:</strong> Tüm geliştirmelerimizin merkezinde kullanıcılarımızın ihtiyaçları ve geri bildirimleri yer alır.</li>
          <li><strong>Doğruluk ve Güvenilirlik:</strong> Sunduğumuz tüm hesaplama araçlarının güncel ve güvenilir verilerle çalıştığından emin oluruz.</li>
          <li><strong>Erişilebilirlik:</strong> Platformumuzu, herkesin kolayca kullanabileceği basit ve anlaşılır bir arayüzle tasarlarız.</li>
          <li><strong>Sürekli Gelişim:</strong> Teknolojiyi yakından takip eder, yeni hesaplama araçları ekler ve mevcut araçlarımızı sürekli olarak iyileştiririz.</li>
          <li><strong>Şeffaflık:</strong> Hesaplamaların nasıl yapıldığına dair bilgilendirici içerikler sunarak kullanıcılarımıza karşı şeffaf bir duruş sergileriz.</li>
        </ul>
      )
    }
  ]
};

export default function HakkimizdaPage() {
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