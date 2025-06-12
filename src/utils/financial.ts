import { formatCurrency } from './formatting';

/**
 * Anüite (eşit taksitli) kredi detaylarını hesaplar.
 * @param principal Kredi anapara tutarı.
 * @param monthlyInterestRate Aylık faiz oranı (örn: 0.035 for 3.5%).
 * @param term Toplam vade (ay olarak).
 * @returns Aylık taksit, toplam geri ödeme, toplam faiz ve ödeme planını içeren bir nesne.
 */
export const calculateLoanDetails = (principal: number, monthlyInterestRate: number, term: number) => {
    // Gelen faiz oranı zaten ondalık formatta (örn: 0.035)
    const rate = monthlyInterestRate;

    const monthlyPayment = (principal * rate) / (1 - Math.pow(1 + rate, -term));
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principal;
    
    let remainingPrincipal = principal;
    const paymentSchedule = Array.from({ length: term }, (_, i) => {
        const interestForMonth = remainingPrincipal * rate;
        const principalForMonth = monthlyPayment - interestForMonth;
        remainingPrincipal -= principalForMonth;
        
        return [
            i + 1,
            formatCurrency(monthlyPayment),
            formatCurrency(principalForMonth),
            formatCurrency(interestForMonth),
            formatCurrency(Math.max(0, remainingPrincipal)),
        ];
    });

    return { 
        monthlyPayment, 
        totalPayment, 
        totalInterest, 
        paymentSchedule 
    };
}; 