'use client';

import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import { calculate } from './actions';

const BilesikBuyumeClient = () => {

  const inputFields: InputField[] = [
    {
      id: 'calculationType',
      label: 'Hesaplama Türü',
      type: 'select',
      options: [
        { value: 'futureValue', label: 'Gelecekteki Değeri Hesapla' },
        { value: 'cagr', label: 'Yıllık Büyüme Oranını (CAGR) Hesapla' },
      ],
      defaultValue: 'futureValue'
    },
    { id: 'initialValue', label: 'Başlangıç Değeri (₺)', type: 'number', placeholder: '1000' },
    { id: 'finalValue', label: 'Bitiş Değeri (₺)', type: 'number', placeholder: '2000', displayCondition: { field: 'calculationType', value: 'cagr' } },
    { id: 'growthRate', label: 'Yıllık Büyüme Oranı (%)', type: 'number', placeholder: '10', displayCondition: { field: 'calculationType', value: 'futureValue' } },
    { id: 'periods', label: 'Dönem Sayısı (Yıl)', type: 'number', placeholder: '5' },
  ];

  return (
    <CalculatorUI
      title="Bileşik Büyüme Hesaplama"
      description={
        <p className="text-sm text-gray-600">
          Hesaplamak istediğiniz değeri seçin ve gerekli alanları doldurun.
        </p>
      }
      inputFields={inputFields}
      calculate={calculate}
    />
  );
};

export default BilesikBuyumeClient; 