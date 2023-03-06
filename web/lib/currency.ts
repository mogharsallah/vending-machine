const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export const formatCurrency = (currency: number = 0) => currencyFormatter.format(currency / 100)
