'use client';

import { formatCurrency, formatNumber } from '@/utils/formatting';
import AdBanner from './AdBanner';

export type ResultItem = {
  type: 'result' | 'info' | 'error';
  label: string;
  value: string | number;
  isHighlighted?: boolean;
  className?: string;
  note?: string;
}

export interface TableData {
    headers: string[];
    rows: (string | number)[][];
}

export interface CalculationResult {
  summary: { [key:string]: ResultItem };
  table?: TableData;
  disclaimer?: string;
}

interface CalculatorResultProps {
    result: CalculationResult | null;
    resultTitle?: string;
    tableTitle?: string;
}

const renderValue = (item: ResultItem) => {
    if (typeof item.value === 'number') {
        return formatNumber(item.value);
    }
    // Attempt to see if it's a currency string
    if (typeof item.value === 'string' && (item.value.includes('TL') || item.value.includes('₺'))) {
        // This is a simplistic check. If formatCurrency is already applied, just render.
        return item.value;
    }
    return item.value;
};

const CalculatorResult: React.FC<CalculatorResultProps> = ({ result, resultTitle = "Hesaplama Sonucu", tableTitle = "Detaylı Tablo" }) => {
    if (!result) {
        return null;
    }

    const summaryEntries = Object.entries(result.summary);
    const errorEntry = summaryEntries.find(([key, item]) => item.type === 'error');

    if (errorEntry) {
        const [key, errorItem] = errorEntry;
        return (
            <div id="result" className="mt-8 bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 max-w-md w-full mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{resultTitle}</h2>
                <div key={key} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-700">{errorItem.label}: <span className="font-normal">{errorItem.value}</span></p>
                </div>
            </div>
        );
    }

    return (
        <div id="result" className="mt-8 bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 max-w-md w-full mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{resultTitle}</h2>

            <div className="space-y-4">
                {summaryEntries.map(([key, item]) => {
                    const baseClasses = "flex justify-between items-start text-sm md:text-base py-3 px-4 rounded-lg";
                    const typeClasses = {
                        result: "bg-blue-50 border border-blue-200 text-blue-900",
                        info: "bg-gray-50 text-gray-800",
                        error: "" // Handled above
                    };
                    const highlightClass = item.isHighlighted ? 'font-bold text-lg' : 'font-normal';

                    return (
                        <div key={key} className={`${baseClasses} ${typeClasses[item.type]} ${item.className || ''}`}>
                            <span className="font-medium text-gray-600">{item.label}</span>
                            <div className="text-right">
                                <span className={`${highlightClass}`}>{renderValue(item)}</span>
                                {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>

            {result.table && (
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{tableTitle}</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    {result.table.headers.map((header) => (
                                        <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {result.table.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
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
             {result.disclaimer && <p className="text-xs text-gray-500 mt-6 text-center">{result.disclaimer}</p>}
            
            <div className="my-6">
                <AdBanner
                    data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ''}
                    data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT || ''}
                />
            </div>
        </div>
    );
};

export default CalculatorResult; 