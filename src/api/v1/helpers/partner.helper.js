const { partnerFormatter } = require("../formatter/data.format");
const { responseFormater } = require("../formatter/response.format");
const partnerModel = require("../models/patner.model")

exports.addPartner = async (customId, rigData) => {
    try {
        const formattedData = partnerFormatter(customId, rigData)
        const saveData = new partnerModel(formattedData);
        await saveData.save()
        return responseFormater(true, "Rig purchased")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.getPartnerOfUser = async (customId) => {
    try {
        const partnerData = await partnerModel.find({ customId }).select("-_id -__v");
        return partnerData[0] ? responseFormater(true, "Purchased rig list", partnerData) : responseFormater(false, "no rig purchased")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}