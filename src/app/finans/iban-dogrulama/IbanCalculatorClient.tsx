'use client';

import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import { calculate } from './actions';

const IbanCalculatorClient = () => {
    const inputFields: InputField[] = [
        { id: 'iban', label: 'IBAN', type: 'text', placeholder: 'TR00 0000 0000 0000 0000 0000 00' },
    ];

    return (
        <CalculatorUI 
            title="IBAN Doğrulama Aracı"
            description={<p className="text-sm text-gray-600">Lütfen doğrulamak istediğiniz Türkiye'ye ait IBAN'ı (TR ile başlayan 26 karakter) girin.</p>}
            inputFields={inputFields} 
            calculate={calculate}
            resultTitle="IBAN Doğrulama Sonucu"
        />
    );
};

export default IbanCalculatorClient; 