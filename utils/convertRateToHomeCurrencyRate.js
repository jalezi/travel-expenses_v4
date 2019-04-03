module.exports = (rates, homeCurrency, invoiceCurrency) => {
  homeCurrency = homeCurrency.toUpperCase();
  invoiceCurrency = invoiceCurrency.toUpperCase();
  const homeCurrencyRate = rates[homeCurrency];
  const convertedRate = 1 / homeCurrencyRate;
  const baseRate = rates[invoiceCurrency];
  const invoiceRate = Number((baseRate * convertedRate).toFixed(2));
  return invoiceRate;
}
