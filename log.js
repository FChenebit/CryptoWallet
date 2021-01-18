const mail = require('./mail.js');

console.log(`env : ${process.env.ENVIRONMENT}`);

exports.logMessage = async function logMessage(message) {
  if (process.env.ENVIRONMENT === 'PRODUCTION') {
    mail.sendMail('Log on crypotowarning server', message).catch((e) => console.log(`error ${e} when sending ${message} with mail to user`));
  } else {
    console.log(`Log : ${message}`);
  }
};
