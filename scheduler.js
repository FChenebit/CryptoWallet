const request = require('./request.js');
const compute = require('./compute.js');
const log = require('./log.js');
const mail = require('./mail.js');

console.log(`scheduler ${process.argv[2]}`);

request.requestCrypto()
  .then((answer) => {
    const computeResult = compute.computeCurrencyAndTotalValue(answer);
    let mailBody = `Total value of my crypto wallet : ${computeResult.TOTAL.toFixed(2)}\n\n`;
    const currencyCodes = Object.keys(computeResult);
    currencyCodes.forEach((currencyCode) => {
      if (currencyCode !== 'TOTAL') {
        mailBody += `Value for ${currencyCode} : ${computeResult[currencyCode].toFixed(2)}\n`;
      }
    });

    mail.sendMail(`Normal Report From CryptoWallet from ${process.env.ENVIRONMENT}`, mailBody);
  })
  .catch((error) => log.logMessage(error));
