'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı için geçerli limitler
const GIDER_KISIT_ORANI = 0.70; // Giderlerin %70'i indirilebilir, %30'u KKEG
const KIRA_LIMITI = 26000; // Aylık Kiralama Gider Limiti (KDV Hariç)
const OTV_KDV_LIMITI = 690000; // KKEG olarak dikkate alınacak ÖTV+KDV toplamı
const AMORTISMAN_LIMITI_OTV_KDV_DAHIL = 1500000; // ÖTV ve KDV maliyete eklendiğinde amortisman sınırı
const AMORTISMAN_LIMITI_DAHIL_OLMAYAN = 690000; // ÖTV ve KDV maliyete eklenmediğinde amortisman sınırı

const BinekAracGiderClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
       { id: 'acquisitionType', label: 'Edinim Şekli', type: 'select', options: [
           { value: 'purchase', label: 'Satın Alma' },
           { value: 'rental', label: 'Kiralama' }
       ], defaultValue: 'purchase' },
       
       { id: 'carCost', label: 'Araç Maliyeti (ÖTV+KDV Hariç)', type: 'number', placeholder: '1000000', displayCondition: (inputs) => inputs.acquisitionType === 'purchase' },
       { id: 'otvKdvTotal', label: 'Toplam ÖTV ve KDV Tutarı', type: 'number', placeholder: '900000', displayCondition: (inputs) => inputs.acquisitionType === 'purchase' },
       { id: 'otvKdvChoice', label: 'ÖTV ve KDV için Tercih', type: 'select', options: [
         { value: 'cost', label: 'Maliyete Ekle' },
         { value: 'expense', label: 'Doğrudan Gider Yaz' },
       ], defaultValue: 'cost', displayCondition: (inputs) => inputs.acquisitionType === 'purchase' },
        
       { id: 'monthlyRent', label: 'Aylık Kira Bedeli (KDV Hariç)', type: 'number', placeholder: '30000', displayCondition: (inputs) => inputs.acquisitionType === 'rental' },
        
       { id: 'otherExpenses', label: 'Yakıt, Bakım vb. Diğer Giderler (KDV Hariç)', type: 'number', placeholder: '5000' },
 
     ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
         const { acquisitionType } = inputs;
         let kkeg = 0;
         let deductible = 0;
         const summary: { [key: string]: { label: string, value: string, isHighlighted?: boolean } } = {};
 
         if (acquisitionType === 'purchase') {
             const carCost = Number(inputs.carCost);
             const otvKdvTotal = Number(inputs.otvKdvTotal);
             const otvKdvChoice = inputs.otvKdvChoice;
             const otherExpenses = Number(inputs.otherExpenses);
 
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
                 summary.otvKdvSummary = { label: 'ÖTV+KDV Gideri KKEG', value: formatCurrency(otvKdvKkeg) };
             }
             
             const amortismanKkeg = Math.max(0, totalCostForAmortization - amortismanSiniri);
             const amortismanDeductible = totalCostForAmortization - amortismanKkeg;
             kkeg += amortismanKkeg;
             deductible += amortismanDeductible;
             summary.amortizationSummary = { label: 'Amortisman KKEG', value: formatCurrency(amortismanKkeg) };
             
             const otherExpensesKkeg = otherExpenses * (1 - GIDER_KISIT_ORANI);
             kkeg += otherExpensesKkeg;
             deductible += otherExpenses * GIDER_KISIT_ORANI;
             summary.otherExpensesSummary = { label: 'Diğer Giderler KKEG (%30)', value: formatCurrency(otherExpensesKkeg) };
 
         } else { // Kiralama
             const monthlyRent = Number(inputs.monthlyRent);
             const otherExpenses = Number(inputs.otherExpenses);
             
             const rentKkeg = Math.max(0, monthlyRent - KIRA_LIMITI);
             kkeg += rentKkeg;
             deductible += monthlyRent - rentKkeg;
             summary.rentSummary = { label: 'Aylık Kira KKEG', value: formatCurrency(rentKkeg) };
 
             const otherExpensesKkeg = otherExpenses * (1 - GIDER_KISIT_ORANI);
             kkeg += otherExpensesKkeg;
             deductible += otherExpenses * GIDER_KISIT_ORANI;
             summary.otherExpensesSummary = { label: 'Diğer Giderler KKEG (%30)', value: formatCurrency(otherExpensesKkeg) };
         }
         
         summary.totalDeductible = { label: 'Toplam İndirilebilir Gider', value: formatCurrency(deductible) };
         summary.totalKkeg = { label: 'Toplam KKEG', value: formatCurrency(kkeg), isHighlighted: true };
           
         return { summary };
     };

    const handleCalculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const calculationResult = await calculate(inputs);
        setResult(calculationResult);
        return calculationResult;
    };

    return (
        <CalculatorUI 
            title="Binek Araç Gider Kısıtlaması Hesaplama"
            description={
              <p className="text-sm text-gray-600">
                Aracın edinim şeklini seçin ve ilgili tutarları girerek Kanunen Kabul Edilmeyen Gider (KKEG) tutarını hesaplayın.
              </p>
            }
            inputFields={inputFields} 
            calculate={handleCalculate}
            resultTitle="Gider Kısıtlama Sonucu (2024 Yılı)"
        />
    );
};

export default BinekAracGiderClient; 