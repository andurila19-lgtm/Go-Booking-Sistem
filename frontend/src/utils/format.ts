/**
 * Formats a number into Indonesian Rupiah (IDR) currency format.
 * Example: 1200000 -> Rp1.200.000
 */
export const formatIDR = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price).replace('IDR', 'Rp');
};

/**
 * Calculates booking summary including tax and service fees.
 */
export const calculateBookingSummary = (pricePerNight: number, nights: number = 1) => {
    const subtotal = pricePerNight * nights;
    const tax = Math.round(subtotal * 0.11); // PPN 11%
    const serviceFee = Math.round(subtotal * 0.05); // Service Fee 5%
    const total = subtotal + tax + serviceFee;

    return {
        subtotal,
        tax,
        serviceFee,
        total
    };
};
