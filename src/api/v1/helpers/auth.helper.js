const authModel = require('../models/auth.model');
const { sendSms } = require('../services/otp.service');
const { authFormatter } = require('../formatter/data.format');
const { randomBytes } = require('node:crypto');
const { generateUserToken } = require('../middlewares/authToken');
const { customerById } = require('./customer.helper');
const { responseFormater } = require('../formatter/response.format');

exports.addAuth = async (phone) => {
    try {
        const formattedData = await authFormatter(phone);
        const saveData = await authModel(formattedData);
        await sendSms(formattedData.phone, formattedData.otp)
        await saveData.save()
        return responseFormater(true, "otp sent successfully", { reqId: formattedData.reqId, isOnboarded: false })
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.checkAuthByPhone = async (phone) => {
    try {
        const authData = await authModel.exists({ phone });
        return authData ? authData : false;
    } catch (error) {
        return false
    }
}
exports.authByUserId = async (userId) => {
    try {
        const authData = await authModel.findOne({ userId });
        return authData ? authData : false;
    } catch (error) {
        return false
    }
}
exports.authList = async () => {
    try {
        const authData = await authModel.find();
        return authData[0] ? true : false;
    } catch (error) {
        return false
    }
}

exports.genrateOtpPhone = async (phone) => {
    const date = new Date
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
    const reqId = randomBytes(4).toString('hex')
    const updatedData = await authModel.findOne({ phone })
    if (updatedData.noOfOtp >= 10 && updatedData.date == date.getDate()) {
        return responseFormater(false, "otp limit reached. try again tomorrow", {})
    }
    updatedData.otp = otp;
    updatedData.reqId = reqId;
    updatedData.noOfOtp += 1
    updatedData.date = date.getDate();
    await updatedData.save()
    await sendSms(phone, otp)

    return responseFormater(true, "otp sent to phone", { reqId: reqId, isOnboarded: updatedData.isOnboarded })
}
exports.verifyOtp = async (reqId, otp) => {
    try {
        const newReqId = randomBytes(4).toString('hex')
        const userData = await authModel.findOne({ reqId });
        console.log("reqId===>", newReqId);
        if (!userData) {
            return responseFormater(false, "invalid request id")
        }
        if (userData.otp != otp) {
            return responseFormater(false, "invalid otp")
        }
        const customId = await customerById(userData.userId)
        let token = ""
        if (customId.status) {
            token = generateUserToken(customId.data)
        } else {
            token = generateUserToken(userData)
        }
        userData.noOfOtp = 0
        userData.otp = 0
        userData.reqId = newReqId
        await userData.save()
        return responseFormater(true, "otp verified", { token, isOnboarded: userData.isOnboarded })
    } catch (error) {
        console.log(error);
        return responseFormater(false, error.message)
    }
}
