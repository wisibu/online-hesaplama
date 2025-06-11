import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const tevkifatRates = [
    { value: '2/10', label: '2/10 Tevkifat' },
    { value: '3/10', label: '3/10 Tevkifat' },
    { value: '4/10', label: '4/10 Tevkifat' },
    { value: '5/10', label: '5/10 Tevkifat (Yapım İşleri vb.)' },
    { value: '7/10', label: '7/10 Tevkifat (Fason Tekstil vb.)' },
    { value: '9/10', label: '9/10 Tevkifat (Güvenlik, Temizlik vb.)' },
    { value: '10/10', label: 'Tam Tevkifat' },
];

const pageConfig = {
  title: "KDV Tevkifatı Hesaplama | OnlineHesaplama",
  description: "Farklı tevkifat oranlarına (%20 KDV üzerinden) göre alıcı ve satıcının ödeyeceği KDV tutarlarını kolayca hesaplayın.",
  keywords: ["kdv tevkifatı hesaplama", "tevkifatlı fatura", "kdv 2 beyannamesi", "2/10 tevkifat", "9/10 tevkifat"],
  calculator: {
    title: "KDV Tevkifatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        KDV hariç işlem bedelini ve tevkifat oranını seçerek KDV dağılımını görün.
      </p>
    ),
    inputFields: [
      { id: 'baseAmount', label: 'İşlem Bedeli (KDV Hariç)', type: 'number', placeholder: '1000' },
      { id: 'kdvRate', label: 'Genel KDV Oranı (%)', type: 'number', defaultValue: '20' },
      { id: 'tevkifatRate', label: 'Tevkifat Oranı', type: 'select', options: tevkifatRates },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { baseAmount, kdvRate, tevkifatRate } = inputs;
        const amount = Number(baseAmount);
        const kdvR = Number(kdvRate) / 100;
        const tevkifatR_str = tevkifatRate as string;

        if (isNaN(amount) || amount <= 0 || isNaN(kdvR) || kdvR <=0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli tutar ve KDV oranı girin.' } } };
        }
        
        const [numerator, denominator] = tevkifatR_str.split('/').map(Number);
        const tevkifatOrani = numerator / denominator;

        const totalKdv = amount * kdvR;
        const tevkifEdilenKdv = totalKdv * tevkifatOrani; // Alıcının sorumlu olduğu (KDV-2)
        const saticiKdv = totalKdv - tevkifEdilenKdv; // Satıcının beyan edeceği (KDV-1)
        const toplamFatura = amount + totalKdv;

        const summary = {
            base: { label: 'KDV Hariç Tutar', value: formatCurrency(amount) },
            totalKdv: { label: `Hesaplanan KDV (%${kdvR * 100})`, value: formatCurrency(totalKdv) },
            tevkifatRate: { label: 'Tevkifat Oranı', value: `${numerator}/${denominator}` },
            sellerKdv: { label: 'Satıcının Beyan Edeceği KDV', value: formatCurrency(saticiKdv) },
            buyerKdv: { label: 'Alıcının Sorumlu Olduğu KDV (Tevkif Edilen)', value: formatCurrency(tevkifEdilenKdv), isHighlighted: true },
            total: { label: 'Fatura Genel Toplamı', value: formatCurrency(toplamFatura) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "KDV Tevkifatı Nedir?",
        content: (
          <p>
            KDV Tevkifatı, bir mal veya hizmet bedeli üzerinden hesaplanan Katma Değer Vergisi'nin, alıcı ve satıcı arasında kanunen belirlenmiş oranlarda paylaştırılarak her ikisi tarafından da ayrı ayrı vergi dairesine ödenmesidir. Bu mekanizmanın temel amacı, devlete ödenecek olan KDV'nin tahsilatını garanti altına almaktır. Özellikle belirli hizmet sektörlerinde (yapım işleri, danışmanlık, temizlik, güvenlik vb.) ve KDV alacağını takip etmenin zor olduğu durumlarda uygulanır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Tevkifatlı faturada KDV nasıl gösterilir?",
        answer: "Tevkifatlı bir faturada, işlem bedeli, hesaplanan KDV oranı ve tutarı normal şekilde belirtilir. Faturanın alt kısmında ise '.../... oranında tevkifat uygulanmıştır. Tevkif edilen KDV tutarı: ... TL' gibi bir ibare yer alır. Satıcı, KDV'nin sadece kendi payına düşen kısmını tahsil eder."
      },
      {
        question: "Alıcı ve satıcı KDV'yi nasıl beyan eder?",
        answer: "<strong>Satıcı:</strong> Kendi payına düşen (tahsil ettiği) KDV'yi normal KDV-1 Beyannamesi ile beyan eder. <strong>Alıcı:</strong> Satıcıdan tevkif ettiği (kesinti yaptığı) KDV'yi ise KDV-2 Beyannamesi (Sorumlu Sıfatıyla Beyan) ile kendi vergi dairesine beyan edip öder."
      },
      {
        question: "En yaygın tevkifat oranları hangi işler için geçerlidir?",
        answer: "<strong>9/10:</strong> Özel güvenlik ve temizlik hizmetleri. <strong>7/10:</strong> Fason olarak yaptırılan tekstil ve konfeksiyon işleri. <strong>5/10:</strong> Yapım işleri ile bu işlere ilişkin mimarlık ve mühendislik hizmetleri. <strong>2/10:</strong> Avukatlık, danışmanlık gibi serbest meslek faaliyetleri."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="KDV Tevkifatı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}