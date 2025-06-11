import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim | OnlineHesaplama',
  description: 'Bizimle iletişime geçin. Soru, öneri veya geri bildirimlerinizi bekliyoruz.',
};

export default function IletisimPage() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            İletişime Geçin
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Soru, öneri veya iş birliği talepleriniz için bize ulaşmaktan çekinmeyin.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* İletişim Bilgileri */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">İletişim Bilgileri</h2>
              <p className="mt-2 text-gray-600">
                Aşağıdaki e-posta adresi üzerinden bize doğrudan ulaşabilirsiniz.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700">E-Posta Adresimiz</h3>
                <a href="mailto:iletisim@onlinehesaplama.net" className="text-blue-600 hover:underline">
                  iletisim@onlinehesaplama.net
                </a>
              </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Geri Bildirim</h2>
                 <p className="mt-2 text-gray-600">
                    Platformumuzu geliştirmemize yardımcı olacak her türlü geri bildirime açığız. Hesaplama araçlarımızla ilgili deneyimlerinizi, karşılaştığınız sorunları veya yeni araç önerilerinizi bizimle paylaşmanızdan mutluluk duyarız.
                </p>
            </div>
          </div>

          {/* İletişim Formu */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Mesaj Gönderin</h2>
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="name" className="sr-only">Adınız</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  placeholder="Adınız"
                  className="block w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">E-Posta</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="E-Posta Adresiniz"
                  className="block w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Mesajınız</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Mesajınız"
                  className="block w-full px-4 py-3 rounded-md shadow-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Mesajı Gönder
                </button>
              </div>
               <p className="text-xs text-center text-gray-500">
                  Bu form şu anda aktif değildir. Lütfen bizimle e-posta yoluyla iletişime geçin.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 