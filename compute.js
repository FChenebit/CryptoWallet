const log = require('./log.js');

exports.computeCurrencyAndTotalValue = function computeCurrencyAndTotalValue(requestAnswer) {
  let total = 0;
  const totalByCurrencyCodes = {};
  const currencyCodes = Object.keys(requestAnswer);
  currencyCodes.forEach((currencyCode) => {
    const quantity = parseFloat(process.env[currencyCode]);
    const rate = parseFloat(requestAnswer[currencyCode]);
    totalByCurrencyCodes[currencyCode] = rate * quantity;
    total += rate * quantity;
  });

  totalByCurrencyCodes.TOTAL = total;

  return totalByCurrencyCodes;
};

exports.computeHistoryForCurrency = function computeHistoryForCurrency(actualValue,
  historicCurrencyRatesByPeriod) {
  const ratesPeriodsByCurency = {};
  const periods = Object.keys(historicCurrencyRatesByPeriod);
  const periodDates = {};
  periods.forEach((period) => {
    const historicalCurrencyRates = historicCurrencyRatesByPeriod[period];
    historicalCurrencyRates.forEach((historicalCurrencyRate) => {
      const currency = historicalCurrencyRate.currency_code;
      if (!ratesPeriodsByCurency[currency]) {
        ratesPeriodsByCurency[currency] = {};
      }
      if (!periodDates[period]) {
        periodDates[period] = historicalCurrencyRate.rate_date;
      } else if (periodDates[period].getTime() !== historicalCurrencyRate.rate_date.getTime()) {
        log.logMessage(`date error in this period : ${JSON.stringify(historicalCurrencyRate)}`);
      }
      ratesPeriodsByCurency[currency][period] = historicalCurrencyRate.rate_value;
    });
  });
  return { ratesPeriodsByCurency: ratesPeriodsByCurency, periodDates: periodDates };
};
