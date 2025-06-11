export const formatCurrency = (value: number | string, currency: string = 'TRY'): string => {
  const numberValue = typeof value === 'string' ? parseFloat(value.toString().replace(/,/g, '')) : value;
  if (isNaN(numberValue)) {
    return '';
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const formatNumber = (value: number | string, decimalPlaces: number = 2): string => {
  const numberValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.-]+/g,"")) 
    : value;

  if (isNaN(numberValue)) {
    return '';
  }

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };
  
  return new Intl.NumberFormat('tr-TR', options).format(numberValue);
};

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

export const formatDuration = (totalMinutes: number): string => {
    if (totalMinutes < 0) return "0 Dakika";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    let result = "";
    if (hours > 0) {
        result += `${hours} Saat `;
    }
    if (minutes > 0 || hours === 0) {
        result += `${minutes} Dakika`;
    }
    return result.trim();
}; 