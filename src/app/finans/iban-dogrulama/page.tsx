import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import IbanCalculatorClient from './IbanCalculatorClient';

const pageConfig = {
  title: "IBAN Doğrulama ve Sorgulama Aracı | OnlineHesaplama",
  description: "Girdiğiniz Türkiye'ye ait bir IBAN'ın (Uluslararası Banka Hesap Numarası) doğruluğunu anında kontrol edin. IBAN formatını ve kontrol basamaklarını sorgulayın.",
  keywords: ["iban doğrulama", "iban sorgulama", "iban kontrol", "geçerli iban"],
  content: {
    sections: [
        {
            title: "IBAN Nasıl Doğrulanır?",
            content: (
              <>
                <p>
                  IBAN (International Bank Account Number), para transferlerinin hatasız ve hızlı bir şekilde yapılmasını sağlayan uluslararası bir standarttır. Türkiye'deki IBAN'lar 26 karakterden oluşur ve 'TR' ile başlar. Bir IBAN'ın doğruluğu, sadece karakter sayısına bakılarak değil, aynı zamanda karmaşık bir matematiksel algoritma (MOD 97) ile de kontrol edilir.
                </p>
                <p className="mt-2">
                  Bu algoritma, IBAN içerisindeki kontrol basamakları (TR'den sonraki iki rakam) ile diğer basamaklar arasında bir tutarlılık arar. Bizim aracımız, bu standart kontrolü sizin için saniyeler içinde gerçekleştirir.
                </p>
              </>
            )
        }
    ],
    faqs: [
      {
        question: "Bu araç IBAN'ın kime ait olduğunu gösterir mi?",
        answer: "Hayır. Bu doğrulama aracı, banka veya kişi bilgisi sağlamaz. Yalnızca girdiğiniz IBAN'ın formatının ve kontrol basamaklarının matematiksel olarak doğru olup olmadığını teyit eder. IBAN'ın aktif bir hesaba ait olup olmadığını veya sahibini göstermez."
      },
      {
        question: "IBAN'ım neden geçersiz çıkıyor?",
        answer: "Eğer IBAN'ınız geçersiz çıkıyorsa, bunun birkaç sebebi olabilir: Rakamları eksik veya yanlış yazmış olabilirsiniz, boşlukları yanlış bırakmış olabilirsiniz veya IBAN tamamen hatalı olabilir. Lütfen numaranızı kontrol edip tekrar deneyin."
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
      <IbanCalculatorClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}