const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host:process.env.SMPT_HOST,
    port:process.env.SMPT_PORT,
    service:process.env.SMPT_SERVICE,
    auth: {
      user:"jacksongeorgeg87@gmail.com",
      pass:"kbdbaplxlsuclzac",


    },
  });

  const mailOptions = {
    from: "jacksongeorgeg87@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error in sending email  ' + error);
      return true;
    } else {
     console.log('Email sent: ' + info.response);
     return false;
    }
   });
};

module.exports = sendEmail;