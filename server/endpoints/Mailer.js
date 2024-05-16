const mailer = require('nodemailer');

require("dotenv").config();

//server settings for gmail
const transporter = mailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
})

//is used to send emails. 
//takes in 3 variables, 1 being the email address to send to, 2nd being the body content of the email, 3rd being the subject
const sendEmail = async (email, html, subject) => {
  try {
    const info = await transporter.sendMail({
        from: `Quanta Time Tracker <quantatimetracker@gmail.com>`,
        to: email,
        subject: subject,
        html: html
    })
  } catch (err) {
    console.log(err);
  }
}

exports.sendEmail = sendEmail;