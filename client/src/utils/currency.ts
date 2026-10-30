/**
 * Formats integer Paise to Indian Rupee formatted string (e.g., 65000 -> ₹650 or ₹650.00)
 */
export function formatINR(paise: number, showDecimals = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Converts integer Paise to Rupees numeric float
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Converts input Rupees float/integer to integer Paise
 */
export function rupeesToPaise(rupees: number | string): number {
  const parsed = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}
