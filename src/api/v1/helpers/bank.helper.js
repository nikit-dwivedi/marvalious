const bankModel = require("../models/bank.model");
const { bankFormatter } = require("../formatter/data.format");
const { responseFormater } = require("../formatter/response.format");

exports.addBank = async (customId, bankData, imageData) => {
    try {
        const formattedData = bankFormatter(customId, bankData, imageData);
        const saveData = new bankModel(formattedData)
        await saveData.save()
        return responseFormater(true, "bank added", saveData)
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getBank = async (customId) => {
    try {
        const bankData = await bankModel.find({ customId }).select('-_id -isActive -__v');
        return bankData ? responseFormater(true, "Bank detail", bankData) : responseFormater(false, "Bank not added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.verifyBank = async (customId) => {
    try {
        const bankCheck = await bankModel.exists({ customId })
        if (!bankCheck) {
            return responseFormater(false, "bank not added")
        }
        await bankModel.findOneAndUpdate({ customId }, { isVerified: true })
        return responseFormater(true, "bank verified")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getAllBank = async () => {
    try {
        const bankList = await bankModel.find()
        return bankList[0] ? responseFormater(true, "bank list", bankList) : responseFormater(false, "no bank found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}