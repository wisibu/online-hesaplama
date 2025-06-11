import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Gün Doğumu ve Gün Batımı Saatleri | OnlineHesaplama",
  description: "Gün doğumu ve gün batımı saatleri nasıl hesaplanır? Bulunduğunuz konuma özel en doğru vakitleri öğrenmek için en iyi kaynaklar ve yöntemler.",
  keywords: ["gün doğumu hesaplama", "gün batımı saati", "güneşin doğuşu", "güneşin batışı", "akşam ezanı vakti"],
};

const pageContent = {
  title: "Gün Doğumu ve Gün Batımı Vakitleri",
  description: "Güneşin doğuş ve batış saatleri, Dünya'nın kendi ekseni etrafındaki dönüşü, Güneş etrafındaki yörüngesi ve coğrafi konuma (enlem ve boylam) bağlı olarak her gün değişen astronomik olaylardır.",
  sections: [
    {
      title: "Konumunuza Özel Vakitleri Nasıl Öğrenebilirsiniz?",
      content: (
        <div className="space-y-4">
          <p>
            Gün doğumu ve gün batımı saatleri, karmaşık astronomik formüllerle hesaplanır ve en doğru sonuçlar için bulunduğunuz yerin enlem ve boylam bilgisi gereklidir. Bu nedenle, bu bilgiyi size en hassas şekilde sunabilecek güvenilir hava durumu ve astronomi web sitelerini kullanmanızı öneririz.
          </p>
          <p>
            Aşağıdaki popüler ve güvenilir servislerden birini kullanarak şehriniz, hatta mahalleniz için güncel ve dakik gün doğumu/batımı bilgilerine ulaşabilirsiniz:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.timeanddate.com/sun/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-center bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            >
              Time and Date
            </a>
            <a 
              href="https://www.accuweather.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              AccuWeather
            </a>
             <a 
              href="https://www.mgm.gov.tr/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-center bg-sky-700 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-800 transition-colors"
            >
              Meteoroloji Genel Müdürlüğü
            </a>
          </div>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "Gün batımı ve akşam ezanı aynı şey midir?",
      answer: "Evet, İslam'da akşam namazının vakti, güneşin ufukta tamamen kaybolmasıyla, yani astronomik gün batımıyla başlar. Dolayısıyla akşam ezanı, gün batımı vaktinde okunur."
    },
    {
      question: "Yaz ve kış aylarında günlerin uzayıp kısalmasının sebebi nedir?",
      answer: "Bu durumun sebebi, Dünya'nın eksen eğikliğidir. Dünya, Güneş etrafında dönerken yaklaşık 23.5 derecelik bir eğimle durur. Bu eğiklik nedeniyle, yılın farklı zamanlarında Kuzey ve Güney yarımküreler Güneş'e doğru farklı açılarla yönelir. Bir yarımküre Güneş'e daha fazla eğik olduğunda yaz mevsimini yaşar ve günler uzar; daha az eğik olduğunda ise kış mevsimini yaşar ve günler kısalır."
    },
    {
      question: "'Alacakaranlık' (twilight) nedir?",
      answer: "Alacakaranlık, Güneş battıktan sonra veya doğmadan önce gökyüzünün tamamen karanlık olmadığı ara dönemdir. Güneş ufkun altında olmasına rağmen, atmosferdeki yansımalar nedeniyle gökyüzü aydınlık kalır. Sabah alacakaranlığına 'şafak', akşamkine ise 'gurub' da denir."
    }
  ]
};

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{pageContent.title}</h1>
        <p className="text-center text-gray-600 mb-6">{pageContent.description}</p>
        <AdBanner />
        <div className="mt-8">
           <RichContent sections={pageContent.sections} faqs={pageContent.faqs} />
        </div>
        <AdBanner className="mt-8" />
      </div>
    </div>
  );
} 