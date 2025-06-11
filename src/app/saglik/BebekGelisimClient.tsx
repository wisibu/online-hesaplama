'use client';

import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import { calculateBebekGelisim } from './bebekGelisimActions';

type GelisimType = 'boy' | 'kilo';

interface BebekGelisimClientProps {
    type: GelisimType;
}

const pageDetails = {
    boy: {
        title: "Bebek Boyu Hesaplama",
        description: "Bebeğinizin boyunu ve diğer bilgilerini girerek DSÖ persentil değerini öğrenin.",
        unit: "cm",
    },
    kilo: {
        title: "Bebek Kilosu Hesaplama",
        description: "Bebeğinizin kilosunu ve diğer bilgilerini girerek DSÖ persentil değerini öğrenin.",
        unit: "kg",
    }
}

const BebekGelisimClient: React.FC<BebekGelisimClientProps> = ({ type }) => {
    const details = pageDetails[type];
    
    const inputFields: InputField[] = [
        { id: 'birthDate', label: 'Doğum Tarihi', type: 'date', defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0] },
        { id: 'cinsiyet', label: 'Cinsiyet', type: 'select', options: [{ value: 'kiz', label: 'Kız' }, { value: 'erkek', label: 'Erkek' }], defaultValue: 'kiz' },
        { id: 'olcum', label: `Ölçüm (${details.unit})`, type: 'number', placeholder: type === 'boy' ? '75' : '10' },
    ];

    return (
        <CalculatorUI
            title={details.title}
            description={details.description}
            inputFields={inputFields}
            calculate={calculateBebekGelisim.bind(null, type)}
            resultTitle="Gelişim Analizi Sonucu"
        />
    );
};

export default BebekGelisimClient; 