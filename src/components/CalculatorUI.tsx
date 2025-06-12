'use client';

import { useState, useTransition, ReactNode } from 'react';
import CalculatorForm, { InputField } from './CalculatorForm';
import CalculatorResult, { CalculationResult, TableData, ResultItem } from './CalculatorResult';

interface CalculatorUIProps {
  title: string;
  inputFields: InputField[];
  calculate: (inputs: { [key: string]: string | number | boolean }) => Promise<CalculationResult | null>;
  description?: ReactNode;
  resultTitle?: string;
  tableTitle?: string;
  dynamicFieldsConfig?: {
    type: 'single' | 'paired';
    buttonLabel: string;
    fieldLabel: string;
    fieldPlaceholder?: string;
    fieldPrefix: string;
    pairedFieldLabel?: string;
    pairedFieldPlaceholder?: string;
    pairedFieldPrefix?: string;
  };
}

const CalculatorUI: React.FC<CalculatorUIProps> = ({ 
  title, 
  inputFields, 
  calculate, 
  description,
  resultTitle,
  tableTitle,
  dynamicFieldsConfig,
}) => {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<CalculationResult | null>(null);

    const handleCalculate = (inputs: { [key: string]: string | number | boolean }) => {
        startTransition(async () => {
            const parsedInputs: { [key: string]: string | number | boolean } = { ...inputs };
            for (const field of inputFields) {
                if (field.type === 'number' && typeof inputs[field.id] === 'string') {
                    const parsedValue = parseFloat(inputs[field.id] as string);
                    if (isNaN(parsedValue)) {
                        setResult({ summary: { error: { type: 'error', label: 'Geçersiz Girdi', value: `Lütfen "${field.label}" için geçerli bir sayı girin.`} } });
                        return;
                    }
                    parsedInputs[field.id] = parsedValue;
                }
            }
            try {
                const calculationResult = await calculate(parsedInputs);
                setResult(calculationResult);
            } catch (error) {
                console.error("Calculation failed", error);
                setResult({ summary: { error: { type: 'error', label: 'Hesaplama Hatası', value: 'Beklenmedik bir hata oluştu.'} } });
            }
        });
    };

    const handleClear = () => {
        setResult(null);
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-center">{title}</h1>
            <CalculatorForm
                initialFields={inputFields}
                onCalculate={handleCalculate}
                onClear={handleClear}
                isLoading={isPending}
                description={description}
                dynamicFieldsConfig={dynamicFieldsConfig}
            />
            <CalculatorResult
                result={result}
                resultTitle={resultTitle}
                tableTitle={tableTitle}
            />
        </div>
    );
};

export default CalculatorUI;
export type { InputField } from './CalculatorForm';
export type { CalculationResult, TableData, ResultItem } from './CalculatorResult'; 