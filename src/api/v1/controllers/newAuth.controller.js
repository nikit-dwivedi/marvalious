const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { customerById } = require('../helpers/customer.helper');
const { responseFormater } = require('../formatter/response.format');
const newAuthModel = require("../models/newAuth.model");
const { generateUserToken } = require('../middlewares/authToken');


exports.login = async (req, res) => {
    try {
        const body = {
            date : new Date().getDate(),
            userId: req.body.userId,
            phone: req.body.phone   
        }
        const userData = await newAuthModel.findOne({ userId: body.userId })
        if (!userData) {
            const token = generateUserToken(body)
            const data = new newAuthModel(body)
            const result = await data.save()
            return result ? success(res, "login successful", { token, name: "", profileImage: "", isOnboarded: false, occupation: "" }) : badRequest(res, "cannot login")
        } else {
            let token
            let name = ""
            let profileImage = ""
            let occupation = ""
            let isOnboarded
            const customData = await customerById({ userId: userData.userId })
            if (customData.status) {
                token = generateUserToken(customData.data)
                name = customData.name
                profileImage = customData.profileImage
                occupation = customData.occupation
                isOnboarded = true
            } else {
                isOnboarded = false
                token = generateUserToken(userData)          
            }
            return token ? success(res, "login successful", { token, name, profileImage, isOnboarded, occupation }) : badRequest(res, "cannot login")
        }
    } catch (error) {
        console.log(error);
        return unknownError(res, error.message)
    }
}


