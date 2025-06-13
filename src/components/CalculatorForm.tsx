'use client';

import { useState, useEffect, ReactNode } from 'react';

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
  dependentOptions?: { [key:string]: { value: string | number; label: string }[] };
}

interface CalculatorFormProps {
    initialFields: InputField[];
    onCalculate: (inputs: { [key: string]: string | number | boolean }) => void;
    onClear: () => void;
    isLoading: boolean;
    description?: ReactNode;
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

const CalculatorForm: React.FC<CalculatorFormProps> = ({ 
    initialFields, 
    onCalculate, 
    onClear, 
    isLoading, 
    description,
    dynamicFieldsConfig 
}) => {
    const [inputFields, setInputFields] = useState(initialFields);
    const [inputs, setInputs] = useState<{ [key: string]: string | number | boolean }>(buildInitialInputs(inputFields));

    useEffect(() => {
        setInputs(buildInitialInputs(inputFields));
    }, [inputFields]);
    
    useEffect(() => {
        const updatedFields = [...initialFields];
        initialFields.forEach((field, index) => {
            if (field.dependentField && field.dependentOptions) {
                const parentValue = inputs[field.dependentField];
                if (parentValue !== undefined) {
                    const options = field.dependentOptions[parentValue.toString()] || [];
                    updatedFields[index] = { ...field, options };
                }
            }
        });
        setInputFields(updatedFields);
    }, [inputs, initialFields]);
    

    const handleInputChange = (id: string, value: string | boolean) => {
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleAddField = () => {
        if (!dynamicFieldsConfig) return;
        const prefix = dynamicFieldsConfig.fieldPrefix;
        const nextId = (inputFields.filter(f => f.id.startsWith(prefix)).length) + 1;
        let newFields: InputField[] = [];
        if (dynamicFieldsConfig.type === 'single') {
            newFields = [...inputFields, { id: `${prefix}${nextId}`, label: `${dynamicFieldsConfig.fieldLabel} ${nextId}`, type: 'number', placeholder: dynamicFieldsConfig.fieldPlaceholder || '' }];
        } else {
            if (!dynamicFieldsConfig.pairedFieldPrefix || !dynamicFieldsConfig.pairedFieldLabel) return;
            const pairedPrefix = dynamicFieldsConfig.pairedFieldPrefix;
            newFields = [...inputFields, { id: `${prefix}${nextId}`, label: `${dynamicFieldsConfig.fieldLabel} ${nextId}`, type: 'number', placeholder: dynamicFieldsConfig.fieldPlaceholder || '' }, { id: `${pairedPrefix}${nextId}`, label: `${dynamicFieldsConfig.pairedFieldLabel} ${nextId} (%)`, type: 'number', placeholder: dynamicFieldsConfig.pairedFieldPlaceholder || '' }];
        }
        setInputFields(newFields);
    };
    
    const handleRemoveField = () => {
        if (!dynamicFieldsConfig || inputFields.length <= initialFields.length) return;
        const fieldsToRemove = dynamicFieldsConfig.type === 'paired' ? 2 : 1;
        const newFields = inputFields.slice(0, -fieldsToRemove);
        const removedFields = inputFields.slice(-fieldsToRemove);
        setInputFields(newFields);
        setInputs(prev => {
            const newInputs = { ...prev };
            removedFields.forEach(field => delete newInputs[field.id]);
            return newInputs;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(inputs);
    };
    
    const handleInternalClear = () => {
        setInputFields(initialFields);
        setInputs(buildInitialInputs(initialFields));
        onClear();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 max-w-md w-full mx-auto">
            {description && <div className="mb-6">{description}</div>}
            <div className="grid grid-cols-1 gap-y-5">
                {inputFields.map((field) => {
                    const shouldDisplay = field.displayCondition ? inputs[field.displayCondition.field] === field.displayCondition.value : true;
                    if (!shouldDisplay) return null;
                    return (
                        <div key={field.id} className={field.type === 'checkbox' ? 'flex items-center' : ''}>
                            {field.type !== 'checkbox' && <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>}
                            {field.type === 'select' ? (
                                <select
                                    id={field.id}
                                    name={field.id}
                                    className="mt-1 max-w-xs w-full"
                                    value={inputs[field.id] as string}
                                    onChange={e => handleInputChange(field.id, e.target.value)}
                                    {...field.props}
                                >
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    id={field.id}
                                    name={field.id}
                                    className="mr-2"
                                    checked={!!inputs[field.id]}
                                    onChange={e => handleInputChange(field.id, e.target.checked)}
                                    {...field.props}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    name={field.id}
                                    className="mt-1 max-w-xs w-full"
                                    value={inputs[field.id] as string | number}
                                    onChange={e => handleInputChange(field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    {...field.props}
                                />
                            )}
                            {field.note && <div className="text-xs text-gray-500 mt-1">{field.note}</div>}
                        </div>
                    );
                })}
            </div>

            {dynamicFieldsConfig && (
                <div className="mt-4 flex items-center space-x-3">
                    <button type="button" onClick={handleAddField} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        + {dynamicFieldsConfig.buttonLabel}
                    </button>
                    {inputFields.length > initialFields.length && (
                        <button type="button" onClick={handleRemoveField} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                            - Son Alanı Kaldır
                        </button>
                    )}
                </div>
            )}
            
            <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
                <button type="submit" disabled={isLoading} className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Hesaplanıyor...
                        </>
                    ) : 'Hesapla'}
                </button>
                <button type="button" onClick={handleInternalClear} className="w-full md:w-auto text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Temizle
                </button>
            </div>
        </form>
    );
};

export default CalculatorForm; 