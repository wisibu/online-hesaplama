import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Kredi Kartı Gecikme Faizi Hesaplama (Akdi & Gecikme) | OnlineHesaplama",
  description: "Kredi kartı borcunuzun asgari ödemesini geciktirdiğinizde uygulanacak akdi faiz ve gecikme faizi tutarlarını güncel oranlarla anında hesaplayın.",
  keywords: ["kredi kartı gecikme faizi hesaplama", "kredi kartı faiz hesaplama", "asgari ödeme gecikme faizi", "akdi faiz", "gecikme cezası"],
  calculator: {
    title: "Kredi Kartı Gecikme Faizi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kredi kartı dönem borcunuzu veya asgari tutarı ödemediğinizde ne kadar faiz işleyeceğini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'debt', label: 'Toplam Kredi Kartı Borcu (₺)', type: 'number', placeholder: 'Örn: 5000' },
      { id: 'minPayment', label: 'Asgari Ödeme Tutarı (₺)', type: 'number', placeholder: 'Örn: 1500' },
      { id: 'paymentMade', label: 'Yaptığınız Ödeme (₺)', type: 'number', placeholder: 'Örn: 0' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const debt = Number(inputs.debt);
      const minPayment = Number(inputs.minPayment);
      const paymentMade = Number(inputs.paymentMade);
      
      if (debt <= 0 || minPayment <= 0 || paymentMade < 0) {
        return null;
      }

      // TCMB tarafından belirlenen oranlar (Aralık 2023 itibarıyla, oranlar değişebilir)
      const AKDI_FAIZ_ORANI = 0.0368; // %3.68
      const GECIKME_FAIZ_ORANI = 0.0398; // %3.98

      let akdiFaizTutari = 0;
      let gecikmeFaiziTutari = 0;

      if (paymentMade < minPayment) {
        // Asgari tutardan az ödeme yapıldıysa veya hiç yapılmadıysa
        const kalanAsgari = minPayment - paymentMade;
        gecikmeFaiziTutari = kalanAsgari * GECIKME_FAIZ_ORANI;

        const asgariDisiKalan = debt - minPayment;
        if(asgariDisiKalan > 0){
          akdiFaizTutari = asgariDisiKalan * AKDI_FAIZ_ORANI;
        }
      } else {
        // Asgari tutar ve üzeri ödeme yapıldıysa
        const kalanBorc = debt - paymentMade;
        if (kalanBorc > 0) {
          akdiFaizTutari = kalanBorc * AKDI_FAIZ_ORANI;
        }
      }
      
      const toplamFaiz = akdiFaizTutari + gecikmeFaiziTutari;

      const summary = {
        akdiFaiz: { label: `Akdi Faiz Tutarı (%${(AKDI_FAIZ_ORANI * 100).toFixed(2)})`, value: formatCurrency(akdiFaizTutari) },
        gecikmeFaizi: { label: `Gecikme Faizi Tutarı (%${(GECIKME_FAIZ_ORANI * 100).toFixed(2)})`, value: formatCurrency(gecikmeFaiziTutari) },
        toplamFaiz: { label: 'Toplam Faiz Tutarı', value: formatCurrency(toplamFaiz) },
      };

      return { summary };
    },
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
    <CalculatorUI 
      title={pageConfig.calculator.title} 
      inputFields={pageConfig.calculator.inputFields} 
      calculate={pageConfig.calculator.calculate} 
      description={pageConfig.calculator.description} 
    />
  );
}