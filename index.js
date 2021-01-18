const mail = require('./mail.js');

console.log(`hello world ${process.env.HOST_SMTP}`);
mail.sendMail('TestSubject', 'testbody').then(() => console.log('OK')).catch((e) => console.log(`error ${e}`));
