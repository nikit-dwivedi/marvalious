const { responseFormater } = require('../formatter/response.format');
const ejs = require('ejs')
const fs = require('fs')
const { writeFile} = require('fs');
const puppeteer = require('puppeteer')
const path = require('path');
const { uploadFile } = require('../services/upload.service');
const { sendMailToCustomer } = require('../services/otp.service');

exports.makePdf = async (name, email, phone, bookingAmount ) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const details = {
        name: name,
        email: email, 
        phone: phone,
        date: new Date().toLocaleDateString('en-IN'),
        referenceNo: "00201",
        amountInWords: "Indian Rupee Eight Thousand Only",
        amount: bookingAmount
    }
    await page.goto(`http://localhost:4201/v1/customer/render?name=${details.name}&email=${details.email}&phone=${details.phone}&date=${details.date}&referenceNo=${details.referenceNo}&amountInWords=${details.amountInWords}&amount=${details.amount}`, {
        waitUntil: 'networkidle0'
    })
    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter'
    })
    await browser.close()
    writeFile("./src/api/v1/RECEIPT/report.pdf", pdf, {}, (err) => {
        if (err) {
            console.log(err);
            return console.error('error')
        }
        return responseFormater(true , "done")
    })
    // await uploadFile("./src/api/v1/RECEIPT/report.pdf")
    const filePath = path.join(__dirname, "./report.pdf")
    let attachment = fs.readFileSync(filePath).toString("base64"); 
    console.log("=============================================================",attachment);
    await sendMailToCustomer(attachment, "Receipt", 'receipt.pdf', email)
}
exports.renderPage = (req, res) => {
    const details = { 
        name: req.query.name,
        email: req.query.email,
        phone: req.query.phone,
        date: req.query.date,
        referenceNo: req.query.referenceNo,
        amountInWords: req.query.amountInWords,
        amount: req.query.amount
    }
    const filePath = path.join(__dirname, "./receipt.ejs")
    ejs.renderFile(filePath, { details }, (err, html) => {
        if (err) {
            return res.send(err.message)
        }
        return res.send(html)
    })
}