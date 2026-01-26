/**
 * Utility functions for formatting numbers and currency in Indonesian Rupiah
 */

/**
 * Format a number with abbreviations for large values
 * Trillions -> T, Billions -> M (Miliar)
 * @param value - The number to format (in Billions)
 * @returns Formatted string with abbreviation
 */
export const formatNumber = (value: number): string => {
    if (value === 0) return '0';

    // Values are in Billions (1000 = 1 Trillion)
    if (value >= 1000) {
        // Convert to Trillions
        const trillions = value / 1000;
        return `${trillions.toFixed(1)} T`;
    } else {
        // Already in Billions, show as M (Miliar)
        return `${value.toFixed(0)} M`;
    }
};

/**
 * Format a number as Indonesian Rupiah currency
 * @param value - The number to format (in Billions)
 * @param compact - Whether to use abbreviated format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, compact: boolean = true): string => {
    if (compact) {
        return `Rp ${formatNumber(value)}`;
    } else {
        // Full format with thousand separators
        const billions = value;
        const formatted = new Intl.NumberFormat('id-ID').format(billions);
        return `Rp ${formatted} Miliar`;
    }
};

/**
 * Format a number for chart axis display
 * @param value - The number to format
 * @returns Formatted string for axis
 */
export const formatAxis = (value: number): string => {
    if (value === 0) return '0';
    return formatNumber(value);
};

/**
 * Format a multiplier (e.g., MOIC, TVPI)
 * @param value - The multiplier value
 * @returns Formatted string with 'x' suffix
 */
export const formatMultiplier = (value: number): string => {
    return `${value.toFixed(1)}x`;
};
