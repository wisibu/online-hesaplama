'use client';

import { useState, useEffect } from 'react';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

const worldClocks = [
    { city: 'İstanbul', timezone: 'Europe/Istanbul' },
    { city: 'Londra', timezone: 'Europe/London' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Moskova', timezone: 'Europe/Moscow' },
    { city: 'Pekin', timezone: 'Asia/Shanghai' },
    { city: 'Sidney', timezone: 'Australia/Sydney' },
];

const Clock = ({ timezone, isLocal = false }: { timezone: string, isLocal?: boolean }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = new Date().toLocaleTimeString('tr-TR', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setTime(newTime);
        }, 1000);
        return () => clearInterval(timer);
    }, [timezone]);

    return (
        <div className={`text-center p-4 rounded-lg shadow-md ${isLocal ? 'bg-blue-100 border-blue-500' : 'bg-gray-100'}`}>
            <h3 className={`font-semibold ${isLocal ? 'text-xl text-blue-800' : 'text-lg text-gray-700'}`}>
                {isLocal ? 'Yerel Saatiniz' : worldClocks.find(c => c.timezone === timezone)?.city}
            </h3>
            <p className={`font-mono ${isLocal ? 'text-6xl font-bold text-blue-900' : 'text-4xl text-gray-900'}`}>{time}</p>
        </div>
    );
};


const pageContent = {
  title: "Dünya Saatleri",
  description: "Dünyanın farklı yerlerinde saatin kaç olduğunu anlık olarak takip edin.",
  faqs: [
    {
      question: "Saatler neden sürekli güncelleniyor?",
      answer: "Bu sayfa, size en doğru ve anlık zamanı göstermek için saniye saniye güncellenen canlı bir saat uygulamasıdır. Bu sayede, gördüğünüz saatin her zaman en güncel olduğundan emin olabilirsiniz."
    },
    {
      question: "Neden bazı şehirlerde saatler bir saat farklı görünüyor?",
      answer: "Bunun nedeni Yaz Saati Uygulaması'dır (DST). Bazı ülkeler, gün ışığından daha fazla yararlanmak için yılın belirli dönemlerinde saatlerini bir saat ileri alır. Bu durum, ülkeler arasındaki saat farkını geçici olarak değiştirebilir. Listemizdeki saatler, her şehrin mevcut yerel saatini (DST dahil) yansıtır."
    }
  ]
};

export default function Page() {
  const [localTimezone, setLocalTimezone] = useState('Europe/Istanbul');

  useEffect(() => {
    // Tarayıcının saat dilimini alıyoruz
    setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{pageContent.title}</h1>
            <p className="text-center text-gray-600 mb-8">{pageContent.description}</p>
            
            <AdBanner />

            <div className="my-8">
                <Clock timezone={localTimezone} isLocal={true} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {worldClocks.filter(c => c.timezone !== localTimezone).map(clock => (
                    <Clock key={clock.timezone} timezone={clock.timezone} />
                ))}
            </div>

             <div className="mt-12">
                <RichContent sections={[]} faqs={pageContent.faqs} />
             </div>

             <AdBanner className="mt-8" />
        </div>
    </div>
  );
}