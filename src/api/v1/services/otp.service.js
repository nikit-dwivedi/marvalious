const sgMail = require('@sendgrid/mail');
const { get } = require('./axios.service');
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const textlocalapi = process.env.TEXTLOCALAPI;

const sendMail = async (attachment, subject, filename) => {
    try {
        let msg = {
            to: 'care.marvellous.info@gmail.com',
            from: 'acc.marvellous.info@gmail.com',
            subject: subject,
            text: 'Below is your report',
            attachments: [{
                content: attachment,
                filename: filename,
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                disposition: "attachment"
            }]
            // templateId: 'd-4aae71d774b945e48cf3c6cdbc8dee0e',
            // dynamicTemplateData: {
            //     otp: otp,
            // },
        }
        await sgMail.send(msg)
    } catch (error) {
        console.log(error.message);
    }
}
const sendMailToAdmin = async (name) => {
    try {
        let msg = {
            to: 'care.marvellous.info@gmail.com',
            from: 'acc.marvellous.info@gmail.com',
            subject: 'User onboarded',
            text: `A new user ${name} has onboarded`,
        }
        await sgMail.send(msg)
    } catch (error) {
        console.log(error.message);
    }
}

const sendMailToCustomer = async (attachment,filename , to) => {
    try {
        let msg = {
            to: to,
            from: 'acc.marvellous.info@gmail.com',
            subject: "Receipt From Marvellous Info Soft",
            text: `Thank you for signing up on Marvellous Mining.\n\nWe are committed to your regular earnings.\n\nDo not hesitate to contact us for any queries.(8962281128)`,
            attachments: [{
                content: attachment,
                filename: filename,
                type: "application/pdf",
                disposition: "attachment"
            }]
            // templateId: 'd-4aae71d774b945e48cf3c6cdbc8dee0e',
            // dynamicTemplateData: {
            //     otp: otp,
            // },
        }
        await sgMail.send(msg)
    } catch (error) {
        
        console.log(error.message);
    }
}


const sendSms = async (number, otp) => {
    try {
        let resposne = await get(`https://api.textlocal.in/send/?apikey=${textlocalapi}=&numbers=${number}&sender=FABLOP&message=` +
            encodeURIComponent(
                `Greetings from Marvellous, ${otp} is your verification code to login into Marvellous Mining.`
            ))
        // console.log(resposne);
    } catch (error) {
        console.log(error)
    }
}

module.exports = { sendMail, sendSms, sendMailToAdmin, sendMailToCustomer }


