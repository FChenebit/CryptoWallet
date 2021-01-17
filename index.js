const mail = require('./mail.js');

console.log('hello world');
mail.sendMail('TestSubject', 'testbody').then(() => console.log('OK')).catch((e) => console.log(`error ${e}ù));
