const { adminFormatter, slabSettingFormatter } = require("../formatter/data.format")
const { responseFormater } = require("../formatter/response.format")
const { generateAdminToken } = require("../middlewares/authToken")
const adminModel = require("../models/admin.model")
const balanceModel = require("../models/balance.model")
const bankModel = require("../models/bank.model")
const kycModel = require("../models/kyc.model")
const slabModel = require("../models/slab.model")
const slabSettingModel = require("../models/slabSetting.model")

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


exports.settlementInBalance = async () => {
    try {
        const balanceList = await balanceModel.find({ profit: { $gt: 0 } })
        if (balanceList) {
            for (const balanceData of balanceList) {
                const customId = balanceList[balanceData].customId
                const bankData = await bankModel.findOne({ customId })
                if (bankData) {
                    const kycDetail = await kycModel.find({ isVerified: true }, { customId })
                    if (kycDetail) {
                        const data = {
                            customId: balanceList[i].customId,
                            amount: parseInt(balanceList[i].profit)
                        }
                        const settlementData = new settlementModel(data)
                        formattedData = await settlementData.save()
                        const balanceDetails = await balanceModel.findOne({ customId })
                        const profit = 0
                        balanceDetails.profit = profit
                        await balanceDetails.save()
                    }
                }
            }
            
        }
    } catch (error) {
        
    }
}