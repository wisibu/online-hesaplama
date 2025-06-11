import { formatCurrency } from "@/utils/formatting";

// 2024 Yılı Gelir Vergisi Dilimleri
const taxBrackets2024 = [
  { limit: 110000, rate: 0.15 },
  { limit: 230000, rate: 0.20 },
  { limit: 580000, rate: 0.27 },
  { limit: 3000000, rate: 0.35 },
  { limit: Infinity, rate: 0.40 },
];

export interface TaxBreakdown {
  bracket: string;
  taxable: number;
  tax: number;
}

export interface IncomeTaxResult {
  totalTax: number;
  breakdown: TaxBreakdown[];
}

export const calculateIncomeTax = (taxableIncome: number): IncomeTaxResult => {
  let totalTax = 0;
  let remainingIncome = taxableIncome;
  let previousLimit = 0;
  const breakdown: TaxBreakdown[] = [];

  for (const bracket of taxBrackets2024) {
    if (remainingIncome <= 0) break;

    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.limit - previousLimit
    );
    
    const taxInBracket = taxableInBracket * bracket.rate;
    totalTax += taxInBracket;

    const lowerBound = formatCurrency(previousLimit);
    const upperBound = bracket.limit === Infinity ? 'üzeri' : formatCurrency(bracket.limit);

    breakdown.push({
      bracket: `%${bracket.rate * 100} Vergi Dilimi (${lowerBound} - ${upperBound})`,
      taxable: taxableInBracket,
      tax: taxInBracket,
    });
    
    remainingIncome -= taxableInBracket;
    previousLimit = bracket.limit;
  }

  return { totalTax, breakdown };
};