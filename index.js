const log = require('./log.js');
const request = require('./request.js');
const database = require('./database.js');

log.logMessage('test log message');
request.requestCrypto()
  .then((answer) => log.logMessage(answer))
  .catch((error) => log.logMessage(error));

async function getAllDataFromDatabase() {
  try {
    await database.start();
    const res = await database.getCurrencyRate('NOW');
    await database.end();
    return res;
  } catch (err) {
    log.logMessage(err);
    return {};
  }
}

getAllDataFromDatabase()
  .then((res) => { console.log(res.rows[0]); })
  .catch((e) => console.error(e.stack));
