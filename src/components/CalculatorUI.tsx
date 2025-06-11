'use client';

import { useState, ReactNode, useEffect } from 'react';
import AdBanner from './AdBanner';
import { formatCurrency, formatNumber } from '@/utils/formatting';

export interface InputField {
  id: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'date' | 'checkbox';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  defaultValue?: string | number | boolean;
  defaultChecked?: boolean;
  note?: string;
  props?: { [key: string]: any };
  displayCondition?: { field: string; value: any };
  dependentField?: string;
  dependentOptions?: { [key: string]: { value: string | number; label: string }[] };
}

export interface ResultItem {
  label: string;
  value: string | number;
  isHighlighted?: boolean;
}

export interface ErrorItem {
  error: { label: string; value: string };
}

export interface InfoItem {
  info: { label: string; value: string };
}

export interface TableData {
    headers: string[];
    rows: (string | number)[][];
}

export interface CalculationResult {
  summary: { [key: string]: ResultItem | ErrorItem | InfoItem };
  table?: TableData;
  disclaimer?: string;
}

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
  inputFields: initialFields, 
  calculate, 
  description,
  resultTitle = "Hesaplama Sonucu",
  tableTitle = "Detaylı Tablo",
  dynamicFieldsConfig,
}) => {
  
  const buildInitialInputs = (fields: InputField[]) => {
    const initialInputs: { [key: string]: string | number | boolean } = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialInputs[field.id] = field.defaultChecked ?? false;
      } else {
        initialInputs[field.id] = field.defaultValue ?? '';
      }
    });
    return initialInputs;
  };

  const [inputFields, setInputFields] = useState(initialFields);
  const [inputs, setInputs] = useState<{ [key: string]: string | number | boolean }>(buildInitialInputs(inputFields));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updatedFields = [...initialFields];
    // This effect ensures that dependent select options are updated when the parent changes
    initialFields.forEach((field, index) => {
      if (field.dependentField && field.dependentOptions) {
        const parentValue = inputs[field.dependentField];
        if (parentValue) {
          updatedFields[index] = { ...field, options: field.dependentOptions[parentValue.toString()] || [] };
        }
      }
    });
    setInputFields(updatedFields);
  }, [inputs, initialFields]);


  const handleInputChange = (id: string, value: string | boolean) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddField = () => {
    if (!dynamicFieldsConfig) return;

    const prefix = dynamicFieldsConfig.fieldPrefix;
    const nextId = (inputFields.filter(f => f.id.startsWith(prefix)).length) + 1;

    let newFields: InputField[] = [];

    if (dynamicFieldsConfig.type === 'single') {
      newFields = [
        ...inputFields,
        { 
          id: `${prefix}${nextId}`, 
          label: `${dynamicFieldsConfig.fieldLabel} ${nextId}`, 
          type: 'number', 
          placeholder: dynamicFieldsConfig.fieldPlaceholder || '' 
        }
      ];
    } else { // paired
       if (!dynamicFieldsConfig.pairedFieldPrefix || !dynamicFieldsConfig.pairedFieldLabel) return;
       const pairedPrefix = dynamicFieldsConfig.pairedFieldPrefix;
      newFields = [
        ...inputFields,
        { 
          id: `${prefix}${nextId}`, 
          label: `${dynamicFieldsConfig.fieldLabel} ${nextId}`, 
          type: 'number', 
          placeholder: dynamicFieldsConfig.fieldPlaceholder || ''
        },
        { 
          id: `${pairedPrefix}${nextId}`, 
          label: `${dynamicFieldsConfig.pairedFieldLabel} ${nextId} (%)`, 
          type: 'number', 
          placeholder: dynamicFieldsConfig.pairedFieldPlaceholder || ''
        },
      ];
    }
    setInputFields(newFields);
  };
  
  const handleRemoveField = () => {
    if (!dynamicFieldsConfig) return;
    const fieldsToRemove = dynamicFieldsConfig.type === 'paired' ? 2 : 1;
    
    const lastField = inputFields[inputFields.length - 1];
    const initialFieldsCount = initialFields.length;
    
    // Don't remove the initial fields
    if (inputFields.length <= initialFieldsCount) return;


    const newFields = inputFields.slice(0, -fieldsToRemove);
    setInputFields(newFields);

    // Also remove the values from the inputs state
    const newInputs = { ...inputs };
    for (let i = 0; i < fieldsToRemove; i++) {
        delete newInputs[inputFields[inputFields.length - 1 - i].id];
    }
    setInputs(newInputs);
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    const parsedInputs: { [key: string]: string | number | boolean } = { ...inputs };
    for (const field of inputFields) {
      if (field.type === 'number' && typeof inputs[field.id] === 'string') {
        const parsedValue = parseFloat(inputs[field.id] as string);
        if (isNaN(parsedValue)) {
           setResult({ summary: { error: { error: {label: 'Geçersiz Girdi', value: `Lütfen "${field.label}" için geçerli bir sayı girin.`} } }});
           setIsLoading(false);
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
        setResult({ summary: { error: { error: {label: 'Hesaplama Hatası', value: 'Beklenmedik bir hata oluştu.'} } }});
    }
    setIsLoading(false);
  };
  
  const handleClear = () => {
    setInputFields(initialFields);
    setInputs(buildInitialInputs(initialFields));
    setResult(null);
    setIsLoading(false);
  };

  const visibleFields = inputFields.filter(field => {
    if (!field.displayCondition) return true;
    return inputs[field.displayCondition.field] === field.displayCondition.value;
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{title}</h1>
        {description && <div className="text-center text-gray-600 mb-6">{description}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Input Form */}
          <div className="space-y-4">
            {visibleFields.map((field) => (
              <div key={field.id}>
                 {field.type === 'checkbox' ? (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={field.id}
                            checked={inputs[field.id] as boolean}
                            onChange={(e) => handleInputChange(field.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor={field.id} className="ml-2 block text-sm font-medium text-gray-700">
                            {field.label}
                        </label>
                    </div>
                ) : (
                    <>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {field.type === 'select' && field.options ? (
                           <select
                              id={field.id}
                              value={inputs[field.id] as string | number}
                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition"
                            >
                              <option value="" disabled>{field.placeholder || 'Seçim yapın...'}</option>
                              {field.options.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.id}
                            value={inputs[field.id] as string | number}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            {...field.props}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition"
                          />
                        )}
                    </>
                )}
                {field.note && <p className="mt-1 text-xs text-gray-500">{field.note}</p>}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleCalculate} disabled={isLoading} className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105 disabled:bg-gray-400">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Hesapla'}
              </button>
              <button onClick={handleClear} className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition">
                Temizle
              </button>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner min-h-[200px] flex flex-col justify-center">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">{resultTitle}</h2>
            {isLoading ? (
              <p className="text-center text-gray-500">Hesaplanıyor...</p>
            ) : result && result.summary ? (
              <div className="space-y-3">
                {Object.entries(result.summary).map(([key, item]) => {
                  if ('error' in item && item.error) {
                    return (
                      <div key={key} className="text-center bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg">
                        <strong className="font-semibold">{item.error.label}:</strong> {item.error.value}
                      </div>
                    )
                  }
                  if ('info' in item && item.info) {
                     return (
                      <div key={key} className="text-center bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-lg">
                        <strong className="font-semibold">{item.info.label}:</strong> {item.info.value}
                      </div>
                    )
                  }
                  const resultItem = item as ResultItem;
                  return (
                    <div key={key} className={`flex justify-between items-center p-3 rounded-lg ${resultItem.isHighlighted ? 'bg-blue-100' : 'bg-white'}`}>
                      <span className="text-gray-600 font-medium">{resultItem.label}</span>
                      <span className={`font-bold text-lg ${resultItem.isHighlighted ? 'text-blue-700' : 'text-gray-800'}`}>{resultItem.value}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400">Sonuçları görmek için lütfen değerleri girip hesapla butonuna basın.</p>
            )}
          </div>
        </div>

        {/* Reklam alanı: Sadece bir hesaplama sonucu varsa gösterilir. */}
        {result && (
            <div className="mt-8">
                <AdBanner
                    data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""}
                    data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ""}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    style={{ display: 'block' }}
                />
            </div>
        )}

        {/* Result Table */}
        {result && result.table && result.table.rows.length > 0 && (
          <div className="mt-8 overflow-x-auto">
             <h3 className="text-xl font-semibold text-gray-800 mb-4">{tableTitle}</h3>
             <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {result.table.headers.map((header) => (
                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculatorUI; 