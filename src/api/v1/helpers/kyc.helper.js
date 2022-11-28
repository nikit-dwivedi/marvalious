const kycModel = require('../models/kyc.model');
const { responseFormater } = require('../formatter/response.format');
const { kycFormatter } = require('../formatter/data.format');

exports.addKyc = async (customId, kycData, imageData) => {
    try {
        const kycCheck = await kycModel.exists({ customId })
        if (kycCheck) {
            return responseFormater(false, "Kyc already added")
        }
        const formattedData = kycFormatter(customId, kycData, imageData);
        const saveData = new kycModel(formattedData)
        await saveData.save()
        return responseFormater(true, "kyc added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getKyc = async (customId) => {
    try {
        const kycData = await kycModel.findOne({ customId }).select("-_id -createdAt -updatedAt -__v");
        return kycData ? responseFormater(true, "kyc detail", kycData) : responseFormater(false, "Kyc not completed")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.verifyKyc = async (customId) => {
    try {
        const kycCheck = await kycModel.exists({ customId })
        if (!kycCheck) {
            return responseFormater(false, "Kyc not completed")
        }
        await kycModel.findOneAndUpdate({ customId }, { isVerified: true })
        return responseFormater(true, "kyc verified")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getAllKyc = async () => {
    try {
        const kycList = await kycModel.find()
        return kycList[0] ? responseFormater(true, "kyc list", kycList) : responseFormater(false, "no kyc found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}