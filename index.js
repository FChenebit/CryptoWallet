const log = require('./log.js');
const request = require('./request.js');

log.logMessage('test log message');
request.requestCrypto()
  .then((answer) => log.logMessage(answer))
  .catch((error) => log.logMessage(error));
