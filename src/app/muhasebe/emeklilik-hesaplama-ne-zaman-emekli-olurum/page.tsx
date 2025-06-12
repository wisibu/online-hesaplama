import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Ne Zaman Emekli Olurum? | e-Devlet SGK Emeklilik Hesaplama",
  description: "Emeklilik tarihinizi en doğru şekilde öğrenin. SGK'nın resmi 'Ne Zaman Emekli Olurum?' uygulamasına e-Devlet üzerinden nasıl ulaşacağınızı öğrenin.",
  keywords: ["ne zaman emekli olurum", "emeklilik hesaplama", "sgk emeklilik", "e-devlet", "EYT", "emeklilik yaşı"],
};

const pageContent = {
  title: "Ne Zaman Emekli Olurum? En Doğru Hesaplama",
  description: (
    <p className="text-center text-gray-600 mb-6">
      Emeklilik hesaplaması; sigorta başlangıç tarihiniz, prim günleriniz, yaşınız, cinsiyetiniz ve hizmet türünüz gibi birçok faktöre bağlı karmaşık bir süreçtir. 
      <br />
      Bu nedenle, en doğru ve kişisel bilgiyi doğrudan <strong>Sosyal Güvenlik Kurumu'nun (SGK) resmi servisinden</strong> almanız kritik öneme sahiptir.
    </p>
  ),
  sections: [
    {
      title: "Resmi ve Güvenilir Hesaplama İçin e-Devlet'i Kullanın",
      content: (
        <div className="space-y-4 text-center">
          <p>
            SGK, tüm sigorta bilgilerinizi içeren ve size özel emeklilik tarihinizi ve koşullarınızı sunan bir online hizmete sahiptir. Yanlış hesaplamalarla hayal kırıklığı yaşamamak için aşağıdaki adımları izleyerek resmi sorgulamayı yapmanızı önemle tavsiye ederiz.
          </p>
          <a 
            href="https://www.turkiye.gov.tr/sgk-ne-zaman-emekli-olurum" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg"
          >
            e-Devlet ile "Ne Zaman Emekli Olurum?" Sorgula
          </a>
          <p className="text-sm text-gray-600">
            Yukarıdaki bağlantıya tıkladıktan sonra e-Devlet şifrenizle giriş yaparak hizmet dökümünüze göre emeklilik şartlarınızı (yaş, prim günü, hizmet yılı) anında öğrenebilirsiniz.
          </p>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "Bu sitede neden bir hesaplayıcı yok?",
      answer: "Emeklilik mevzuatı, özellikle 1999, 2008 ve sonrasındaki değişiklikler ile Emeklilikte Yaşa Takılanlar (EYT) düzenlemesi gibi çok sayıda kural ve istisna içermektedir. İnternet üzerindeki üçüncü parti hesaplayıcılar, tüm bu kişiye özel durumları (staj, askerlik/doğum borçlanması, farklı sigorta kolları vb.) %100 doğrulukla simüle edemeyebilir. Vereceğimiz eksik veya yanlış bir bilgi, planlarınızı olumsuz etkileyebilir. Bu sorumlulukla, sizi en güvenilir kaynak olan SGK'nın kendi sistemine yönlendiriyoruz."
    },
    {
      question: "Emeklilik için temel şartlar nelerdir?",
      answer: "Türkiye'de emeklilik için temel olarak üç şartın aynı anda sağlanması gerekir: <strong>1) Yaş:</strong> Kanunların belirlediği emeklilik yaşını doldurmak. <strong>2) Prim Ödeme Gün Sayısı:</strong> Sigortalılık süresince adınıza ödenen toplam prim günü sayısını tamamlamak. <strong>3) Sigortalılık Süresi:</strong> İlk sigorta başlangıç tarihinize göre büyük farklılıklar gösterir."
    },
    {
      question: "EYT (Emeklilikte Yaşa Takılanlar) düzenlemesi beni kapsıyor mu?",
      answer: "EYT düzenlemesi, 8 Eylül 1999 tarihinden önce sigorta başlangıcı olanları kapsar. Bu tarihten önce sigortalı olup prim günü ve sigortalılık süresi şartlarını tamamlayanlar, yaş şartı aranmaksızın emekli olabilmektedir. Kapsamda olup olmadığınızın en kesin sonucunu yine e-Devlet üzerindeki SGK uygulamasından alabilirsiniz."
    }
  ]
};

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">{pageContent.title}</h1>
        {pageContent.description}
        <div className="mt-8">
           <RichContent sections={pageContent.sections} faqs={pageContent.faqs} />
        </div>
        <div className="mt-8">
            <AdBanner
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""}
                data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ""}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
      </div>
    </div>
  );
} 