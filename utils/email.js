const nodemailer = require('nodemailer');

const email = async (options) => {
  //Create the transpoter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Declare the email options
  const mailOptions = {
    from: 'Support <sopport@mailhiker.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = email;
