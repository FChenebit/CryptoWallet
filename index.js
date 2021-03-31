const log = require('./log.js');
const request = require('./request.js');
const database = require('./database.js');

// log.logMessage('test log message');
request.requestCrypto()
  .then((answer) => log.logMessage(`answer : ${JSON.stringify(answer)}`))
  .catch((error) => log.logMessage(error));

async function getAllDataFromDatabase() {
  try {
    await database.start();
    const res = await database.getCurrencyRate(new Date('2020-12-29'));
    await database.end();
    return res;
  } catch (err) {
    log.logMessage(err);
    await database.end();
    throw err; // else promise is not rejected but solved
  }
}

/*getAllDataFromDatabase()
  .then((res) => { console.log(`TFC${JSON.stringify(res.rows)}`); })
  .catch((e) => console.error(e.stack));
*/