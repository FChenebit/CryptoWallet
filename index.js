const log = require('./log.js');
const request = require('./request.js');
const database = require('./database.js');

log.logMessage('test log message');
request.requestCrypto()
  .then((answer) => log.logMessage(answer))
  .catch((error) => log.logMessage(error));

database.getCurrencyRate('NOW')
  .then((res) => console.log(res.rows[0]))
  .catch((e) => console.error(e.stack));
