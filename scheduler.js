const request = require('./request.js');
const database = require('./database.js');
const compute = require('./compute.js');
const log = require('./log.js');
const mail = require('./mail.js');

const mode = process.argv[2];

async function normalSchedule() {
  const oneWeekAgoMin = new Date();
  oneWeekAgoMin.setDate(oneWeekAgoMin.getDate() - 10);
  const oneWeekAgoMax = new Date();
  oneWeekAgoMax.setDate(oneWeekAgoMax.getDate() - 4);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoMin = new Date(oneMonthAgo);
  oneMonthAgoMin.setDate(oneMonthAgoMin.getDate() - 7);
  const oneMonthAgoMax = new Date(oneMonthAgo);
  oneMonthAgoMax.setDate(oneMonthAgoMax.getDate() + 7);

  const sixMonthAgo = new Date();
  sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
  const sixMonthAgoMin = new Date(sixMonthAgo);
  sixMonthAgoMin.setDate(sixMonthAgoMin.getDate() - 15);
  const sixMonthAgoMax = new Date(sixMonthAgo);
  sixMonthAgoMax.setDate(sixMonthAgoMax.getDate() + 15);

  const oneYearAgo = new Date();
  oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);
  const oneYearAgoMin = new Date(oneYearAgo);
  oneYearAgoMin.setDate(oneYearAgoMin.getDate() - 30);
  const oneYearAgoMax = new Date(oneYearAgo);
  oneYearAgoMax.setDate(oneYearAgoMax.getDate() + 30);

  await database.start();

  const [requestAnswer,
    archiveOneWeekAgo,
    archiveOneMonthAgo,
    archiveSixMonthAgo,
    archiveOneYearAgo] = await Promise.all([
    request.requestCrypto(),
    database.getCurrencyRate(oneWeekAgoMin, oneWeekAgoMax),
    database.getCurrencyRate(oneMonthAgoMin, oneMonthAgoMax),
    database.getCurrencyRate(sixMonthAgoMin, sixMonthAgoMax),
    database.getCurrencyRate(oneYearAgoMin, oneYearAgoMax),
  ]);

  const ratesRowByPeriod = {};

  if (archiveOneWeekAgo.rows.length > 0) {
    ratesRowByPeriod.OneWeekAgo = archiveOneWeekAgo.rows;
  }

  if (archiveOneMonthAgo.rows.length > 0) {
    ratesRowByPeriod.OneMonthAgo = archiveOneMonthAgo.rows;
  }

  if (archiveSixMonthAgo.rows.length > 0) {
    ratesRowByPeriod.SixMonthAgo = archiveSixMonthAgo.rows;
  }

  if (archiveOneYearAgo.rows.length > 0) {
    ratesRowByPeriod.OneYearAgo = archiveOneYearAgo.rows;
  }

  console.log(`request anser : ${JSON.stringify(requestAnswer)}`);
  console.log(`One Week : ${JSON.stringify(archiveOneWeekAgo.rows)}`);
  console.log(`One Month : ${JSON.stringify(archiveOneMonthAgo.rows)}`);
  console.log(`Six Month : ${JSON.stringify(archiveSixMonthAgo.rows)}`);
  console.log(`One year : ${JSON.stringify(archiveOneYearAgo.rows)}`);
  console.log(`database result : ${JSON.stringify(ratesRowByPeriod)}`);

  const historyForCurrencyAndPeriod = compute.computeHistoryForCurrency(requestAnswer,
    ratesRowByPeriod);
  const { ratesPeriodsByCurency, periodDates } = historyForCurrencyAndPeriod;
  console.log(`historyForCurrency : ${JSON.stringify(historyForCurrencyAndPeriod)}`);

  const computeResult = compute.computeCurrencyAndTotalValue(requestAnswer);

  let mailBody = `Total value of my crypto wallet : ${computeResult.TOTAL.toFixed(2)}\n\n`;
  const currencyCodes = Object.keys(computeResult);
  const allInserts = [];
  currencyCodes.forEach((currencyCode) => {
    if (currencyCode !== 'TOTAL') {
      mailBody += `Value for ${currencyCode} : ${computeResult[currencyCode].toFixed(2)} `;
      if (ratesPeriodsByCurency[currencyCode]) {
        const periods = Object.keys(ratesPeriodsByCurency[currencyCode]);
        periods.forEach((period) => {
          const historicRate = parseFloat(ratesPeriodsByCurency[currencyCode][period]);
          const deltaPercent = ((computeResult[currencyCode] - historicRate) / historicRate) * 100;
          mailBody += `${period} rate : ${historicRate.toFixed(2)} ; delta percent : ${deltaPercent.toFixed(2)} `;
        });
      } else {
        log.logMessage(`Value in API not in database : ${currencyCode}`);
      }
      mailBody += '\n';
      allInserts.push(database.saveCurrentRate(currencyCode,
        computeResult[currencyCode], new Date()));
    }
  });

  await Promise.all(allInserts);

  mailBody += `for infomration, period dates : ${JSON.stringify(periodDates)}`;

  console.log(`mail body : ${mailBody}`);
  mail.sendMail(`Normal Report From CryptoWallet from ${process.env.ENVIRONMENT}`, mailBody);
  database.end();
}

if (mode === 'NORMAL') {
  normalSchedule()
    .then(console.log('after normal'))
    .catch((error) => {
      log.logMessage(` error : ${error} ; stack : ${error.stack}`);
      database.end();
    });
} else {
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
}
