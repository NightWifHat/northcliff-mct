/**
 * Currency formatting utilities for Northcliff MCT
 * Default: South African Rand (ZAR)
 */

/**
 * Format amount as South African Rand
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string (e.g., "R2 250,00")
 */
export const formatZAR = (amount, showDecimals = true) => {
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
  
  // Replace "ZAR" with "R" for cleaner display
  return formatter.format(amount).replace('ZAR', 'R').trim()
}

/**
 * Format amount as Euro
 * @param {number} amount - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string (e.g., "€1 500,00")
 */
export const formatEUR = (amount, showDecimals = true) => {
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
  
  return formatter.format(amount)
}

/**
 * Format hourly rate as South African Rand
 * @param {number} amount - The hourly rate amount
 * @returns {string} Formatted string (e.g., "R500 p/h")
 */
export const formatZARHourly = (amount) => {
  return `${formatZAR(amount, false)} p/h`
}

/**
 * Default export for convenience
 */
export default {
  formatZAR,
  formatEUR,
  formatZARHourly,
}
