const { partnerFormatter, partnershipFormatter } = require("../formatter/data.format");
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
        const partnerList = await partnerModel.find({ customId }).select("-_id -__v").sort({ createdAt: -1 })
        const partnerInfo = await Promise.all(partnerList.map(async(partner) => {        
            const currentTime = new Date().getTime()
            const createdAt = new Date(partner.createdAt).getTime()
            let noOfDays = Math.round((currentTime - createdAt) / (24 * 60 * 60 * 1000))
            if(noOfDays>5){
                noOfDays = 0
            } else {
                noOfDays = 5 - noOfDays
            }
            return partnershipFormatter(partner, noOfDays)
        }))
        return partnerInfo[0] ? responseFormater(true, "Purchased rig list", partnerInfo) : responseFormater(false, "no rig purchased")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
