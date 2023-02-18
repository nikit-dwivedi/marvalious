const { responseFormater } = require('../formatter/response.format');
const ejs = require('ejs')
const fs = require('fs')
const puppeteer = require('puppeteer')
const path = require('path');
const { sendMailToCustomer } = require('../services/otp.service');
const configModel = require('../models/config.model');

exports.makePdf = async (name, email, phone, amount) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    const receiptNo = await this.createReferenceNo()
    const details = {
        name: name,
        email: email,
        phone: phone,
        date: new Date().toLocaleDateString('en-IN'),
        referenceNo: receiptNo,
        amountInWords: this.amountInWords(amount) + " ONLY",
        amount: amount
    }
    await page.goto(`http://139.59.60.119:4201/v1/customer/render?name=${details.name}&email=${details.email}&phone=${details.phone}&date=${details.date}&referenceNo=${details.referenceNo}&amountInWords=${details.amountInWords}&amount=${details.amount}`, {
        waitUntil: 'networkidle0'
    })
    const pdf = await page.pdf({
        printBackground: true,
        format: 'Letter'
    })
    await browser.close()
    await fs.writeFileSync("./src/api/v1/RECEIPT/receipt.pdf", pdf, {}, (err) => {
        if (err) {
            return responseFormater(false, err.message)
        }
    })
    let attachment = fs.readFileSync('./src/api/v1/RECEIPT/receipt.pdf').toString("base64");
    await sendMailToCustomer(attachment, 'receipt.pdf', email)
    fs.unlinkSync('./src/api/v1/RECEIPT/receipt.pdf')
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


this.createReferenceNo = async () => {
    const configData = await configModel.findOne()
    let referenceNo = configData.systemReferenceNo
    let receiptNo = ""
    if (referenceNo.toString().length == 3) {
        receiptNo = `00${referenceNo}`
    } else if (referenceNo.toString().length == 4) {
        receiptNo = `0${referenceNo}`
    } else {
        receiptNo = referenceNo
    }
    referenceNo += 1
    configData.systemReferenceNo = referenceNo
    await configData.save()
    return receiptNo
}

this.amountInWords = (num) => {
    var a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    var b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.toUpperCase();
    

}