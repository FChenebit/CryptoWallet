const mail = require('./mail.js');

exports.logMessage = async function logMessage(message) {
  if (process.env.ENVIRONMENT === 'PRODUCTION') {
    mail.sendMail('Log on crypotowarning server', message).catch((e) => console.log(`error ${e} when sending ${message} with mail to user\n`));
  } else {
    console.log(`Log : ${message}\n`);
  }
};
