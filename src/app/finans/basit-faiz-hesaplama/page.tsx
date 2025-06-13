'use client';

import CalculatorLayout from '@/components/CalculatorLayout';

const relatedTools = [
  {
    title: 'Bileşik Faiz Hesaplama',
    href: '/finans/bilesik-faiz-hesaplama',
  },
  {
    title: 'Kredi Hesaplama',
    href: '/kredi/kredi-hesaplama',
  },
  {
    title: 'Mevduat Faizi Hesaplama',
    href: '/finans/mevduat-faizi-hesaplama',
  },
];

export default function BasitFaizHesaplama() {
  return (
    <CalculatorLayout
      title="Basit Faiz Hesaplama"
      description="Basit faiz yöntemiyle yatırımınızın ne kadar getiri sağlayacağını kolayca hesaplayın."
      category="Finans"
      path="/finans/basit-faiz-hesaplama"
      keywords="basit faiz hesaplama, faiz hesaplama"
      relatedTools={relatedTools}
    >
      <div className="space-y-6">
        <div className="form-group">
          <label htmlFor="anapara" className="block text-sm font-medium text-gray-700">
            Anapara Tutarı (₺)
          </label>
          <input
            type="number"
            id="anapara"
            name="anapara"
            min="0"
            step="0.01"
            placeholder="Örn: 10000"
            className="mt-1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="faizOrani" className="block text-sm font-medium text-gray-700">
            Yıllık Faiz Oranı (%)
          </label>
          <input
            type="number"
            id="faizOrani"
            name="faizOrani"
            min="0"
            max="100"
            step="0.01"
            placeholder="Örn: 45"
            className="mt-1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="sure" className="block text-sm font-medium text-gray-700">
            Vade Süresi
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              id="sure"
              name="sure"
              min="1"
              placeholder="Örn: 12"
              className="mt-1"
              required
            />
            <select
              id="sureBirim"
              name="sureBirim"
              className="mt-1"
              defaultValue="ay"
            >
              <option value="gun">Gün</option>
              <option value="ay">Ay</option>
              <option value="yil">Yıl</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          Hesapla
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Sonuçlar</h2>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Anapara:</span>
              <span className="font-medium">₺0.00</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Faiz Tutarı:</span>
              <span className="font-medium">₺0.00</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Toplam Tutar:</span>
              <span className="font-medium">₺0.00</span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Basit Faiz Nedir?</h2>
          <p className="text-gray-600 mb-4">
            Basit faiz, bir yatırımın veya kredinin sadece başlangıçtaki anapara tutarı üzerinden hesaplanan faiz türüdür. 
            Bu yöntemde, kazanılan faizler anaparaya eklenmez ve sonraki dönemlerde bu faizler üzerinden tekrar faiz işletilmez.
          </p>
          <p className="text-gray-600">
            Basit faiz hesaplama formülü: Faiz Tutarı = Anapara × Faiz Oranı × Süre
          </p>
        </div>
      </div>
    </CalculatorLayout>
  );
}
