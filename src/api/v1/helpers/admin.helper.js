const { adminFormatter, slabSettingFormatter } = require("../formatter/data.format")
const { responseFormater } = require("../formatter/response.format")
const { generateAdminToken } = require("../middlewares/authToken")
const adminModel = require("../models/admin.model")
const balanceModel = require("../models/balance.model")
const bankModel = require("../models/bank.model")
const customerModel = require("../models/customer.model")
const settlementModel = require('../models/settlement.model')
const kycModel = require("../models/kyc.model")
const slabModel = require("../models/slab.model")
const slabSettingModel = require("../models/slabSetting.model")
const { Parser } = require('@json2csv/plainjs')
const fs = require('fs')
const {sendMail} = require('../services/otp.service')
const partnerModel = require("../models/patner.model")
const { response } = require("express")



exports.register = async (phone) => {
    try {
        const formattedData = adminFormatter(phone)
        const saveData = new adminModel(formattedData);
        await saveData.save()
        await sendSms(phone, formattedData.otp)
        return responseFormater(true, "admin added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.genrateOtpPhone = async (phone) => {
    try {
        const date = new Date
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        const updatedData = await adminModel.findOne({ phone })
        if (updatedData.noOfOtp >= 10 && updatedData.date == date.getDate()) {
            return responseFormater(false, "otp limit reached. try again tomorrow", {})
        }
        updatedData.otp = otp;
        updatedData.reqId = reqId;
        updatedData.noOfOtp += 1
        updatedData.date = date.getDate();
        await updatedData.save()
        await sendSms(phone, otp)

        return responseFormater(true, "otp sent to phone", { reqId: reqId })
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.verifyOtp = async (reqId, otp) => {
    try {
        const newReqId = randomBytes(4).toString('hex')
        const newOtp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const userData = await adminModel.findOne({ reqId });
        if (!userData) {
            return responseFormater(false, "invalid request id")
        }
        if (userData.otp != otp) {
            return responseFormater(false, "invalid otp")
        }
        const token = generateAdminToken(userData)
        userData.noOfOtp = 0
        userData.otp = newOtp
        userData.reqId = newReqId
        await userData.save()
        return responseFormater(true, "otp verified", { token, isOnboarded: userData.isOnboarded })
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.addSlab = async (value) => {
    try {
        const slabData = await slabModel.findOne()
        if (slabData) {
            slabData.totalSlab += value
            slabData.freeSlab += value
        }
        slabData.totalSlab = value
        slabData.freeSlab = value
        await slabData.save()
        return responseFormater(true, "Rig added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.addSlabSetting = async (settingData) => {
    try {
        const formattedData = slabSettingFormatter(settingData)
        const saveData = new slabSettingModel(formattedData)
        await saveData.save()
        return responseFormater(true, "setting added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.updateSlabSetting = async (slabSettingId, updatedData) => {
    try {
        const settingData = await slabSettingModel.findOne({ slabSettingId })
        if (!settingData) {
            return responseFormater(false, "invalid id provided")
        }
        if (updatedData.amount) {
            settingData.amount = updatedData.amount
        }
        if (updatedData.intrest) {
            settingData.intrest = updatedData.intrest
        }
        if (updatedData.locking) {
            settingData.locking = updatedData.locking
        }
        await settingData.save()
        return responseFormater(true, "settings updated")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.data2CSV = async (data, path, subject , filename) => {
    try {
        const parser = new Parser();
        const csv = parser.parse(data);
        this.writeCsv(csv, path)
        let attachment = fs.readFileSync(path).toString("base64");
        await sendMail(attachment, subject, filename)
        fs.unlinkSync(path)
    } catch (error) {
        console.log(error);
        console.log(error.message);
    }
}

exports.writeCsv = (data, path) => {
    fs.writeFileSync(path, data)
}


exports.getAllCount = async () => {
    try {
        const partners = await customerModel.countDocuments()
        const totalPendingKyc = await kycModel.countDocuments({ isVerified : false })
        const totalKyc = await kycModel.countDocuments({})
        const settlements = await settlementModel.countDocuments()
        const partnerships = await partnerModel.countDocuments() 
        const totalCounts = {
            partners, totalPendingKyc, totalKyc, settlements, partnerships
        }    
        return totalCounts ? responseFormater(true, "all counts", totalCounts):responseFormater(false, "no counts")
    } catch (error) {
       return responseFormater(false ,error.message)   
    }
}