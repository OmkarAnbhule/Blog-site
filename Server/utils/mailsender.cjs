require('dotenv').config();
const nodemailer = require('nodemailer');
const mailSender = async (email, title, body) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_API_ID,
        pass: process.env.EMAIL_API_KEY
      }
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.EMAIL_API_ID,
      to: email,
      subject: title,
      html: body,
    });
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
module.exports = mailSender;