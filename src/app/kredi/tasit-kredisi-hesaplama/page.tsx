'use client';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const Page = () => {
  const title = "Taşıt Kredisi Hesaplama";
  const inputFields: InputField[] = JSON.parse(`[{"id":"amount","label":"Kredi Tutarı (₺)","type":"number","placeholder":"150000"},{"id":"interest","label":"Aylık Faiz Oranı (%)","type":"number","placeholder":"1.25"},{"id":"term","label":"Vade (Ay)","type":"number","placeholder":"48"}]`);
  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    try { const a=Number(inputs.amount),r=Number(inputs.interest)/100,t=Number(inputs.term);if(a<=0||r<=0||t<=0)return null;const m=a*r*Math.pow(1+r,t)/(Math.pow(1+r,t)-1);return{monthly:{label:'Aylık Taksit',value:m.toFixed(2),unit:'₺'},total:{label:'Toplam Ödeme',value:(m*t).toFixed(2),unit:'₺'}} } catch (e) { console.error(e); return null; }
  };
  const description = null;

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default Page;
