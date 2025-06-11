import type { Metadata } from 'next';
import AsiTakvimiClient from './AsiTakvimiClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
    title: "Bebek ve Çocuk Aşı Takvimi Hesaplama | Sağlık Bakanlığı 2024",
    description: "Çocuğunuzun doğum tarihini girerek T.C. Sağlık Bakanlığı'nın güncel aşı takvimine göre olması gereken aşıları ve tarihlerini öğrenin.",
    keywords: ["aşı takvimi hesaplama", "bebek aşıları", "çocuk aşı takvimi", "sağlık bakanlığı aşı", "aşı zamanları"],
    content: {
        sections: [
            {
                title: "Türkiye Çocukluk Dönemi Aşı Takvimi",
                content: (
                    <>
                        <p>
                            Aşılar, çocukları ciddi ve bulaşıcı hastalıklardan korumanın en etkili yoludur. Türkiye'de Sağlık Bakanlığı tarafından uygulanan ulusal aşı takvimi, çocukların doğumdan itibaren belirli aralıklarla aşılanmasını öngörür. Bu takvim, toplum sağlığını korumak ve salgın hastalıkları önlemek için kritik öneme sahiptir.
                        </p>
                        <p className="mt-2">
                            Aşağıdaki hesaplayıcı, çocuğunuzun doğum tarihine göre hangi aşıyı ne zaman olması gerektiğini size özel olarak listeler. Bu takvim, Sağlık Bakanlığı'nın en güncel verilerine dayanmaktadır.
                        </p>
                    </>
                )
            }
        ],
        faqs: [
            {
                question: "Aşılar neden bu kadar önemli?",
                answer: "Aşılar, vücudun belirli mikroplara karşı bağışıklık kazanmasını sağlar. Çocukları menenjit, kızamık, çocuk felci, tetanoz gibi hayati tehlike taşıyan hastalıklardan korur. Aşılar sayesinde bu hastalıkların çoğu artık çok nadir görülmektedir."
            },
            {
                question: "Aşıların yan etkileri var mıdır?",
                answer: "Aşı sonrası hafif ateş, aşı yerinde kızarıklık veya şişlik gibi hafif yan etkiler görülebilir. Bu durum normaldir ve genellikle kısa sürede geçer. Ciddi yan etkiler ise çok nadirdir. Aşıların sağladığı faydalar, olası risklerden kat kat fazladır."
            },
            {
                question: "Aşıları nerede yaptırabilirim?",
                answer: "Ulusal aşı takvimindeki aşılar, Aile Sağlığı Merkezleri'nde (Sağlık Ocakları) ücretsiz olarak yapılmaktadır."
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
            <AsiTakvimiClient />
            <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
        </>
    );
}