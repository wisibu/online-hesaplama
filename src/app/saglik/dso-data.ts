export interface PercentileData {
    ay: number;
    p3: number;
    p15: number;
    p50: number;
    p85: number;
    p97: number;
}

// Boy (cm) - Kız
export const boyPercentilesKiz: PercentileData[] = [
    { ay: 0, p3: 45.4, p15: 47.4, p50: 49.9, p85: 52.4, p97: 54.4 },
    { ay: 1, p3: 49.8, p15: 52.0, p50: 54.7, p85: 57.4, p97: 59.5 },
    { ay: 2, p3: 53.0, p15: 55.4, p50: 58.4, p85: 61.4, p97: 63.8 },
    // ...
    { ay: 36, p3: 85.5, p15: 88.7, p50: 93.0, p85: 97.3, p97: 100.3 }
];

// Boy (cm) - Erkek
export const boyPercentilesErkek: PercentileData[] = [
    { ay: 0, p3: 46.1, p15: 48.2, p50: 50.8, p85: 53.4, p97: 55.4 },
    { ay: 1, p3: 50.8, p15: 53.1, p50: 55.8, p85: 58.5, p97: 60.6 },
    { ay: 2, p3: 54.4, p15: 56.9, p50: 59.9, p85: 62.9, p97: 65.2 },
    // ...
    { ay: 36, p3: 86.9, p15: 90.2, p50: 94.5, p85: 98.8, p97: 101.8 }
];

// Kilo (kg) - Kız
export const kiloPercentilesKiz: PercentileData[] = [
    { ay: 0, p3: 2.4, p15: 2.8, p50: 3.4, p85: 4.1, p97: 4.8 },
    { ay: 1, p3: 3.2, p15: 3.6, p50: 4.5, p85: 5.4, p97: 6.1 },
    { ay: 2, p3: 4.0, p15: 4.5, p50: 5.6, p85: 6.6, p97: 7.5 },
    // ...
    { ay: 36, p3: 11.3, p15: 12.3, p50: 14.0, p85: 16.1, p97: 17.9 }
];

// Kilo (kg) - Erkek
export const kiloPercentilesErkek: PercentileData[] = [
    { ay: 0, p3: 2.5, p15: 2.9, p50: 3.5, p85: 4.3, p97: 5.0 },
    { ay: 1, p3: 3.4, p15: 3.9, p50: 4.8, p85: 5.7, p97: 6.5 },
    { ay: 2, p3: 4.4, p15: 5.0, p50: 6.0, p85: 7.1, p97: 8.0 },
    // ...
    { ay: 36, p3: 11.8, p15: 12.9, p50: 14.6, p85: 16.7, p97: 18.5 }
]; 