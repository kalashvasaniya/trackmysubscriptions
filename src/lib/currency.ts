// Currency codes and symbols
export const currencies: Record<
  string,
  { name: string; symbol: string; locale: string }
> = {
  USD: { name: "US Dollar", symbol: "$", locale: "en-US" },
  EUR: { name: "Euro", symbol: "€", locale: "de-DE" },
  GBP: { name: "British Pound", symbol: "£", locale: "en-GB" },
  JPY: { name: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
  CAD: { name: "Canadian Dollar", symbol: "C$", locale: "en-CA" },
  AUD: { name: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  CHF: { name: "Swiss Franc", symbol: "CHF", locale: "de-CH" },
  CNY: { name: "Chinese Yuan", symbol: "¥", locale: "zh-CN" },
  INR: { name: "Indian Rupee", symbol: "₹", locale: "en-IN" },
  MXN: { name: "Mexican Peso", symbol: "MX$", locale: "es-MX" },
  BRL: { name: "Brazilian Real", symbol: "R$", locale: "pt-BR" },
  KRW: { name: "South Korean Won", symbol: "₩", locale: "ko-KR" },
  SGD: { name: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
  HKD: { name: "Hong Kong Dollar", symbol: "HK$", locale: "zh-HK" },
  SEK: { name: "Swedish Krona", symbol: "kr", locale: "sv-SE" },
  NOK: { name: "Norwegian Krone", symbol: "kr", locale: "nb-NO" },
  DKK: { name: "Danish Krone", symbol: "kr", locale: "da-DK" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$", locale: "en-NZ" },
  ZAR: { name: "South African Rand", symbol: "R", locale: "en-ZA" },
  RUB: { name: "Russian Ruble", symbol: "₽", locale: "ru-RU" },
  TRY: { name: "Turkish Lira", symbol: "₺", locale: "tr-TR" },
  PLN: { name: "Polish Zloty", symbol: "zł", locale: "pl-PL" },
  THB: { name: "Thai Baht", symbol: "฿", locale: "th-TH" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM", locale: "ms-MY" },
  PHP: { name: "Philippine Peso", symbol: "₱", locale: "en-PH" },
  CZK: { name: "Czech Koruna", symbol: "Kč", locale: "cs-CZ" },
  ILS: { name: "Israeli Shekel", symbol: "₪", locale: "he-IL" },
  AED: { name: "UAE Dirham", symbol: "د.إ", locale: "ar-AE" },
  SAR: { name: "Saudi Riyal", symbol: "﷼", locale: "ar-SA" },
}

// Mock exchange rates (relative to USD)
// In production, these would come from an API
const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1325.5,
  SGD: 1.34,
  HKD: 7.82,
  SEK: 10.42,
  NOK: 10.58,
  DKK: 6.87,
  NZD: 1.64,
  ZAR: 18.75,
  RUB: 89.5,
  TRY: 30.25,
  PLN: 4.02,
  THB: 35.5,
  IDR: 15650,
  MYR: 4.72,
  PHP: 56.25,
  CZK: 22.85,
  ILS: 3.72,
  AED: 3.67,
  SAR: 3.75,
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  if (fromCurrency === toCurrency) return amount

  const fromRate = exchangeRates[fromCurrency] || 1
  const toRate = exchangeRates[toCurrency] || 1

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

export function formatCurrency(
  amount: number,
  currency: string,
  options?: { compact?: boolean },
): string {
  const currencyInfo = currencies[currency] || currencies.USD

  try {
    const formatter = new Intl.NumberFormat(currencyInfo.locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: options?.compact ? 0 : 2,
      maximumFractionDigits: options?.compact ? 0 : 2,
      notation: options?.compact ? "compact" : "standard",
    })

    return formatter.format(amount)
  } catch {
    // Fallback for unsupported currencies
    return `${currencyInfo.symbol}${amount.toFixed(2)}`
  }
}

export function getCurrencySymbol(currency: string): string {
  return currencies[currency]?.symbol || currency
}

export function getCurrencyList(): { code: string; name: string; symbol: string }[] {
  return Object.entries(currencies).map(([code, info]) => ({
    code,
    name: info.name,
    symbol: info.symbol,
  }))
}

// Fetch real exchange rates from a free API
export async function fetchExchangeRates(
  baseCurrency: string = "USD",
): Promise<Record<string, number> | null> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY

  if (!apiKey) {
    console.warn("No exchange rate API key configured, using mock rates")
    return exchangeRates
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates")
    }

    const data = await response.json()
    return data.conversion_rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return null
  }
}
