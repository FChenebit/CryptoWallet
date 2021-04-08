const mail = require('./mail.js');

exports.logMessage = async function logMessage(message) {
  if (process.env.ENVIRONMENT === 'PRODUCTION') {
    mail.sendMail('Error on crypotowarning server', 'An error has occured on cryptowarning, go check logs messages')
      .catch((e) => console.log(`error ${e} when sending ${message} with mail to user\n`));
  }
  console.log(`Log : ${message}\n`);
};
