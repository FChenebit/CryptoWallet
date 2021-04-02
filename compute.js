exports.computeCurrencyAndTotalValue = function computeCurrencyAndTotalValue(requestAnswer) {
  let total = 0;
  const totalByCurrencyCodes = {};
  const currencyCodes = Object.keys(requestAnswer);
  currencyCodes.forEach((currencyCode) => {
    const quantity = parseFloat(process.env[currencyCode]);
    const rate = parseFloat(requestAnswer[currencyCode]);
    totalByCurrencyCodes[currencyCode] = rate * quantity;
    console.log(`test message : quantity : ${quantity}, orignal quantity : ${process.env[currencyCode]}, rate : ${rate}, original rate : ${requestAnswer[currencyCode]}, value : ${rate * quantity}, totalByCurrencyCodes[currencyCode] : ${totalByCurrencyCodes[currencyCode]}\n`);
    total += rate * quantity;
  });

  const allEnvs = Object.keys(process.env);
  allEnvs.forEach((curEnv) => {
    console.log(`current env : ${curEnv}, value : ${process.env[curEnv]}, type of : ${typeof (process.env[curEnv])}`);
  });

  totalByCurrencyCodes.TOTAL = total;

  return totalByCurrencyCodes;
};
