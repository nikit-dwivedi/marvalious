const { customerFormatter } = require('../formatter/data.format');
const { responseFormater } = require('../formatter/response.format');
const { generateUserToken, parseJwt } = require('../middlewares/authToken');
const authModel = require('../models/auth.model');
const customerModel = require('../models/customer.model');


exports.onboardCustomer = async (userId, phone, bodyData) => {
    try {
        const userCheck = await customerModel.findOne({ userId: userId })
        if (userCheck) {
            return { status: false, message: "customer already onboarded" }
        }

        const formattedData = customerFormatter(userId, phone, bodyData);
        const token = generateUserToken(formattedData)
        const saveData = new customerModel(formattedData);
        await markUserOnboarded(userId);
        await saveData.save()
        return responseFormater(true, "succesfully onboarded", { token, profileImage: saveData.profileImage, name: saveData.name })
    } catch (error) {
        console.log(error);
        return { status: false, message: error.message }
    }
}
exports.customerById = async (userId) => {
    try {
        const customerData = await customerModel.findOne({ userId }).select('-_id -__v -createdAt -updatedAt')
        if (!customerData) {
            return { status: false, message: "customer not found", data: {} }
        }
        return { status: true, message: "customer info", data: customerData }
    } catch (error) {
        return { status: false, message: "something went wrong", data: error }
    }
}
exports.getAllCustomer = async () => {
    try {
        const costomerList = await customerModel.find()
        return costomerList[0] ? responseFormater(true, "customer list", costomerList) : responseFormater(false, "no costomer found")
    } catch (error) {
        return responseFormater(false, error.message)
    }
}
const markUserOnboarded = async (userId) => {
    try {
        await authModel.findOneAndUpdate({ userId: userId }, { isOnboarded: true })
        return true
    } catch (error) {
        return false
    }
}
