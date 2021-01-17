const nodemailer = require('nodemailer');

exports.sendMail = async function sendMail(subject, body) {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_SMTP,
    port: process.env.PORT_SMTP,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_SMTP,
      pass: process.env.PASS_SMTP,
    },
  });

  const mailOptions = {
    from: process.env.FROM,
    to: process.env.TO,
    subject: subject,
    text: body,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent: ${info.response}`);
};
