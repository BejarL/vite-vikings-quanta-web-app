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

const inviteHTML = `
        <div>Hello There Testing</div>
    `

//is used to invite a user
const sendInvite = async (email, workspace_id) => {
    try {
 
        const info = await transporter.sendMail({
            from: `Quanta Time Tracker <quantatimetracker@gmail.com>`,
            to: email,
            subject: "Invitation To Join Workspace",
            html: inviteHTML
        })
        
        console.log(info.messageId)
    } catch (err) {
        console.log(err);
    }
}

exports.sendInvite = sendInvite;