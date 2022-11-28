const { nomineeFormatter } = require("../formatter/data.format")
const { responseFormater } = require("../formatter/response.format")
const { nomineeModel } = require("../models/nominee.model")

exports.addNominee = async (customerId, bodyData) => {
    try {
        const nomineeCheck = await nomineeModel.exists({ customerId })
        if (nomineeCheck) {
            return responseFormater(false, "Cannot add multiple nominee")
        }
        const formattedData = nomineeFormatter(customerId, bodyData)
        const saveData = new nomineeModel(formattedData)
        await saveData.save()
        return responseFormater(true, "nominee added")
    }
    catch (error) {
        return responseFormater(true, error.message)
    }
}
exports.getNominee = async (customerId) => {
    try {
        const nomineeData = await nomineeModel.findOne({ customerId }).select("-_id -__v")
        return nomineeData ? responseFormater(true, "nominee details", nomineeData) : responseFormater(false, "nominee not added")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
exports.editNominee = async (customerId, nomineeData) => {
    try {
        const nomineeCheck = await nomineeModel.exists({ customerId })
        if (!nomineeCheck) {
            return responseFormater(false, "nominee not added")
        }
        const { name, relation, aadhaarNo } = nomineeData
        const query = Object.create({})
        if (name) {
            query.name = name
        }
        if (relation) {
            query.relation = relation
        }
        if (aadhaarNo) {
            query.aadhaarNo = aadhaarNo
        }
        await nomineeModel.findOneAndUpdate({ customerId }, query)
        return responseFormater(false, "nominee updated")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}