/**
 * Utility functions for formatting numbers and currency in Indonesian Rupiah
 */

/**
 * Format a number with abbreviations for large values
 * Trillions -> T, Billions -> M (Miliar)
 * @param value - The number to format (in Billions)
 * @returns Formatted string with abbreviation
 */
export const formatNumber = (value: number, language: 'id' | 'en' = 'id'): string => {
    if (value === 0) return '0';

    if (language === 'en') {
        const usdAmount = (value * 1000000000) / 16000;
        if (usdAmount >= 1000000) {
            return `${(usdAmount / 1000000).toFixed(1)} M`;
        } else if (usdAmount >= 1000) {
            return `${(usdAmount / 1000).toFixed(1)} K`;
        }
        return `${usdAmount.toFixed(0)}`;
    }

    if (value >= 1000) {
        const trillions = value / 1000;
        return `${trillions.toFixed(1)} T`;
    } else {
        return `${value.toFixed(0)} M`;
    }
};

export const formatCurrency = (value: number, compact: boolean = true, language: 'id' | 'en' = 'id'): string => {
    if (language === 'en') {
        return `$${formatNumber(value, 'en')}`;
    }
    
    if (compact) {
        return `Rp ${formatNumber(value, 'id')}`;
    } else {
        const billions = value;
        const formatted = new Intl.NumberFormat('id-ID').format(billions);
        return `Rp ${formatted} Miliar`;
    }
};

export const formatAxis = (value: number, language: 'id' | 'en' = 'id'): string => {
    if (value === 0) return '0';
    return formatNumber(value, language);
};

export const formatMultiplier = (value: number): string => {
    return `${value.toFixed(1)}x`;
};
