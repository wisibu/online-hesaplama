import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı için geçerli limitler
const GIDER_KISIT_ORANI = 0.70; // Giderlerin %70'i indirilebilir, %30'u KKEG
const KIRA_LIMITI = 26000; // Aylık Kiralama Gider Limiti (KDV Hariç)
const OTV_KDV_LIMITI = 690000; // KKEG olarak dikkate alınacak ÖTV+KDV toplamı
const AMORTISMAN_LIMITI_OTV_KDV_DAHIL = 1500000; // ÖTV ve KDV maliyete eklendiğinde amortisman sınırı
const AMORTISMAN_LIMITI_DAHIL_OLMAYAN = 690000; // ÖTV ve KDV maliyete eklenmediğinde amortisman sınırı

const pageConfig = {
  title: "Binek Araç Gider Kısıtlaması Hesaplama | OnlineHesaplama",
  description: "Şirketinize ait binek araçların amortisman, kira ve diğer giderleri için yasal olarak kabul edilen maksimum gider kısıtlaması tutarlarını hesaplayın.",
  keywords: ["binek araç gider kısıtlaması", "gider kısıtlaması hesaplama", "amortisman kısıtlaması", "araç kira gider kısıtlaması", "vergi avantajı"],
  calculator: {
    title: "Binek Araç Gider Kısıtlaması Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Aracın edinim şeklini seçin ve ilgili tutarları girerek Kanunen Kabul Edilmeyen Gider (KKEG) tutarını hesaplayın.
      </p>
    ),
    inputFields: [
       { id: 'acquisitionType', label: 'Edinim Şekli', type: 'select', options: [
           { value: 'purchase', label: 'Satın Alma' },
           { value: 'rental', label: 'Kiralama' }
       ], defaultValue: 'purchase' },
       
       { id: 'carCost', label: 'Araç Maliyeti (ÖTV+KDV Hariç)', type: 'number', placeholder: '1000000', displayCondition: { field: 'acquisitionType', value: 'purchase' } },
       { id: 'otvKdvTotal', label: 'Toplam ÖTV ve KDV Tutarı', type: 'number', placeholder: '900000', displayCondition: { field: 'acquisitionType', value: 'purchase' } },
       { id: 'otvKdvChoice', label: 'ÖTV ve KDV için Tercih', type: 'select', options: [
         { value: 'cost', label: 'Maliyete Ekle' },
         { value: 'expense', label: 'Doğrudan Gider Yaz' },
       ], defaultValue: 'cost', displayCondition: { field: 'acquisitionType', value: 'purchase' } },
        
       { id: 'monthlyRent', label: 'Aylık Kira Bedeli (KDV Hariç)', type: 'number', placeholder: '30000', displayCondition: { field: 'acquisitionType', value: 'rental' } },
        
       { id: 'otherExpenses', label: 'Yakıt, Bakım vb. Diğer Giderler (KDV Hariç)', type: 'number', placeholder: '5000' },
 
     ] as InputField[],
     calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';

         const { acquisitionType } = inputs;
         let kkeg = 0;
         let deductible = 0;
         const summary: CalculationResult['summary'] = {};
 
         if (acquisitionType === 'purchase') {
             const carCost = Number(inputs.carCost);
             const otvKdvTotal = Number(inputs.otvKdvTotal);
             const otvKdvChoice = inputs.otvKdvChoice;
             const otherExpenses = Number(inputs.otherExpenses);
 
             if (isNaN(carCost) || isNaN(otvKdvTotal) || isNaN(otherExpenses)) return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen satın alma için tüm sayısal alanları doldurun.'}}};

             let totalCostForAmortization = carCost;
             let amortismanSiniri = AMORTISMAN_LIMITI_DAHIL_OLMAYAN;
 
             if (otvKdvChoice === 'cost') {
                 totalCostForAmortization += otvKdvTotal;
                 amortismanSiniri = AMORTISMAN_LIMITI_OTV_KDV_DAHIL;
             } else { // Doğrudan gider yazma tercihi
                 const otvKdvKkeg = Math.max(0, otvKdvTotal - OTV_KDV_LIMITI);
                 const otvKdvDeductible = otvKdvTotal - otvKdvKkeg;
                 kkeg += otvKdvKkeg;
                 deductible += otvKdvDeductible;
                 summary.otvKdvSummary = { type: 'info', label: 'ÖTV+KDV Gideri KKEG', value: formatCurrency(otvKdvKkeg) };
             }
             
             const amortismanKkeg = Math.max(0, totalCostForAmortization - amortismanSiniri);
             const amortismanDeductible = totalCostForAmortization - amortismanKkeg;
             kkeg += amortismanKkeg;
             deductible += amortismanDeductible;
             summary.amortizationSummary = { type: 'info', label: 'Amortisman KKEG', value: formatCurrency(amortismanKkeg) };
             
             if(otherExpenses > 0) {
                const otherExpensesKkeg = otherExpenses * (1 - GIDER_KISIT_ORANI);
                kkeg += otherExpensesKkeg;
                deductible += otherExpenses * GIDER_KISIT_ORANI;
                summary.otherExpensesSummary = { type: 'info', label: 'Diğer Giderler KKEG (%30)', value: formatCurrency(otherExpensesKkeg) };
             }
 
         } else { // Kiralama
             const monthlyRent = Number(inputs.monthlyRent);
             const otherExpenses = Number(inputs.otherExpenses);
             
             if (isNaN(monthlyRent) || isNaN(otherExpenses)) return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen kiralama için tüm sayısal alanları doldurun.'}}};

             if(monthlyRent > 0) {
                const rentKkeg = Math.max(0, monthlyRent - KIRA_LIMITI);
                kkeg += rentKkeg;
                deductible += monthlyRent - rentKkeg;
                summary.rentSummary = { type: 'info', label: 'Aylık Kira KKEG', value: formatCurrency(rentKkeg) };
             }
 
             if(otherExpenses > 0) {
                const otherExpensesKkeg = otherExpenses * (1 - GIDER_KISIT_ORANI);
                kkeg += otherExpensesKkeg;
                deductible += otherExpenses * GIDER_KISIT_ORANI;
                summary.otherExpensesSummary = { type: 'info', label: 'Diğer Giderler KKEG (%30)', value: formatCurrency(otherExpensesKkeg) };
             }
         }
         
         summary.totalDeductible = { type: 'info', label: 'Toplam İndirilebilir Gider', value: formatCurrency(deductible) };
         summary.totalKkeg = { type: 'result', label: 'Toplam KKEG', value: formatCurrency(kkeg), isHighlighted: true };
           
         return { summary };
     },
  },
  content: {
    sections: [
        {
            title: "Binek Araç Gider Kısıtlaması Nedir?",
            content: (
              <>
                <p>
                  Vergi Usul Kanunu'na göre, şirketlerin faaliyetlerinde kullandıkları binek otomobillerin bazı giderleri vergi matrahından indirilirken belirli sınırlamalara tabidir. Bu düzenleme, özellikle lüks araç giderlerinin vergi avantajı olarak kullanılmasını önlemeyi amaçlar.
                </p>
                <p className="mt-2">
                  Kısıtlamalar temel olarak üç alanda uygulanır:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong>Kira Giderleri:</strong> Binek araç kiralamalarında, KDV hariç aylık kira bedelinin belirli bir tutarı (2024 için 26.000 TL) aşan kısmı gider olarak kabul edilmez.</li>
                    <li><strong>Satın Alma Giderleri (Amortisman):</strong> Araç satın alımlarında, ÖTV ve KDV'nin doğrudan gider yazılabileceği veya maliyete eklenebileceği durumlar vardır. Maliyete eklendiğinde ise amortismana tabi tutar için bir üst sınır (2024 için ÖTV+KDV dahil 1.500.000 TL) bulunur.</li>
                    <li><strong>Diğer Giderler:</strong> Akaryakıt, bakım, onarım gibi masrafların %70'i gider olarak yazılabilirken, %30'u Kanunen Kabul Edilmeyen Gider (KKEG) olarak dikkate alınır.</li>
                </ul>
              </>
            )
        }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcıdaki limitler güncel mi?",
        answer: "Evet, bu hesaplayıcı 2024 yılı için geçerli olan Hazine ve Maliye Bakanlığı tarafından duyurulan en güncel yasal limitleri kullanmaktadır. Limitler her yıl yeniden değerleme oranına göre güncellenmektedir."
      },
      {
        question: "Kanunen Kabul Edilmeyen Gider (KKEG) ne anlama geliyor?",
        answer: "KKEG, ticari kazancın tespitinde indirimi yasal olarak kabul edilmeyen harcamalardır. Gider kısıtlamasını aşan tutarlar KKEG olarak kaydedilir ve şirketin vergi matrahına eklenerek vergilendirilir. Bu durum, şirketin ödeyeceği kurumlar vergisini artırır."
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
        description={pageConfig.calculator.description}
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate}
        resultTitle="Gider Kısıtlama Sonucu (2024 Yılı)"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}