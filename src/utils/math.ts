/**
 * Bir sayının faktöriyelini BigInt kullanarak hesaplar.
 * Negatif sayılar için 0n döndürür.
 * @param n Hesaplanacak pozitif tam sayı.
 * @returns n'in faktöriyelinin BigInt değeri.
 */
export const factorial = (n: number): bigint => {
    if (n < 0) return 0n;
    if (n === 0) return 1n;
    let result = 1n;
    for (let i = 2; i <= n; i++) {
        result *= BigInt(i);
    }
    return result;
};

/**
 * n'in r'li permütasyonunu BigInt kullanarak verimli bir şekilde hesaplar.
 * @param n Toplam eleman sayısı.
 * @param r Seçilecek eleman sayısı.
 * @returns P(n, r) permütasyonunun BigInt değeri.
 */
export const calculatePermutation = (n: number, r: number): bigint => {
    if (r < 0 || r > n) return 0n;
    if (r === 0) return 1n;

    let result = 1n;
    for (let i = 0; i < r; i++) {
        result *= BigInt(n - i);
    }
    return result;
};

/**
 * n'in r'li kombinasyonunu BigInt kullanarak verimli bir şekilde hesaplar.
 * @param n Toplam eleman sayısı.
 * @param r Seçilecek eleman sayısı.
 * @returns C(n, r) kombinasyonunun BigInt değeri.
 */
export const calculateCombination = (n: number, r: number): bigint => {
    if (r < 0 || r > n) {
        return 0n;
    }
    // C(n, r) = C(n, n-r) özelliğini kullanarak daha az işlem yap
    if (r > n / 2) {
        r = n - r;
    }
    if (r === 0) {
        return 1n;
    }
    // C(n,r) = P(n,r) / r!
    const permutation = calculatePermutation(n, r);
    const rFactorial = factorial(r);
    
    return permutation / rFactorial;
}; 