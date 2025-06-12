import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatDuration } from '@/utils/formatting';

const pageConfig = {
  title: "Yolculuk Süresi Hesaplama | OnlineHesaplama",
  description: "Gidilecek mesafe, ortalama hız ve mola süresini girerek toplam seyahat sürenizi ve tahmini varış zamanınızı kolayca hesaplayın.",
  keywords: ["yolculuk süresi hesaplama", "seyahat süresi", "varış zamanı hesaplama", "mesafe hız zaman"],
  calculator: {
    title: "Yolculuk Süresi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Seyahat planınızı yapmak için bilgileri girin ve toplam süreyi öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'distance', label: 'Mesafe (km)', type: 'number', placeholder: '500' },
      { id: 'speed', label: 'Ortalama Hız (km/s)', type: 'number', placeholder: '90' },
      { id: 'breakTime', label: 'Toplam Mola Süresi (Dakika)', type: 'number', placeholder: '45' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const distance = Number(inputs.distance);
        const speed = Number(inputs.speed);
        const breakTime = Number(inputs.breakTime); // Dakika

        if (isNaN(distance) || isNaN(speed) || isNaN(breakTime) || distance <= 0 || speed <= 0 || breakTime < 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli değerler girin (Mesafe ve Hız > 0).' } } };
        }

        // Süre (saat) = Mesafe / Hız
        const travelTimeHours = distance / speed;
        const travelTimeMinutes = travelTimeHours * 60;
        
        const totalTravelTimeMinutes = travelTimeMinutes + breakTime;
        
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + totalTravelTimeMinutes * 60000);

        const summary: CalculationResult['summary'] = {
            totalTime: { type: 'result', label: 'Toplam Yolculuk Süresi (Mola Dahil)', value: formatDuration(totalTravelTimeMinutes), isHighlighted: true },
            drivingTime: { type: 'info', label: 'Sürüş Süresi', value: formatDuration(travelTimeMinutes) },
            arrivalTime: { type: 'info', label: 'Tahmini Varış Zamanı', value: arrivalTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yolculuk Süresi Nasıl Hesaplanır?",
        content: (
          <p>
            Temel fizik formülü olan <strong>Süre = Mesafe / Hız</strong> kullanılarak bir yolculuğun ne kadar süreceği hesaplanır. Bu hesaplama, yolculuk boyunca ortalama bir hızla gidildiği varsayımına dayanır. Daha gerçekçi bir sonuç elde etmek için, bu temel sürüş süresine planlanan mola süreleri de eklenir. Hesaplayıcımız, bu basit adımları izleyerek size toplam seyahat sürenizi ve anlık zamana göre tahmini varış saatinizi sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ortalama hız nedir, nasıl belirlenir?",
        answer: "Ortalama hız, yolculuk boyunca yaptığınız toplam mesafenin, bu mesafeyi katetmek için geçen toplam süreye bölünmesiyle bulunur. Şehir içi trafik, yol çalışmaları, hız limitleri gibi faktörler ortalama hızı düşürebilir. Genellikle şehirler arası yollarda 90-110 km/s, otoyollarda ise 120-140 km/s gibi bir ortalama hız varsaymak gerçekçi bir tahmin sağlar."
      },
      {
        question: "Tahmini varış zamanı anlık olarak mı hesaplanıyor?",
        answer: "Evet, hesapla butonuna tıkladığınız anda mevcut yerel saatiniz üzerine, hesaplanan toplam yolculuk süresi eklenerek tahmini varış zamanı bulunur. Bu, yolculuğa hemen başladığınız varsayımına dayanır."
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
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Seyahat Planı"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 