const sgMail = require('@sendgrid/mail');
const { get } = require('./axios.service');
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const textlocalapi = process.env.TEXTLOCALAPI;

const sendMail = async (attachment) => {
    try {
        const msg = {
            to: 'care.marvellous.info@gmail.com',
            from: 'nikitdwivedi@fabloplatforms.com',
            subject: 'Hello attachment',
            text: 'Below is your settlement report',
            attachments: [{
                content: attachment,
                filename:"settlements.csv",
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
 
module.exports = { sendMail, sendSms }


