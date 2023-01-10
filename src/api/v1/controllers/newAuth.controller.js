const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { customerById } = require('../helpers/customer.helper');
const { responseFormater } = require('../formatter/response.format');
const newAuthModel = require("../models/newAuth.model");
const { generateUserToken } = require('../middlewares/authToken');


exports.login = async (req, res) => {
    try {
        const data = {
            date : new Date().getDate(),
            userId: req.body.userId,
            phone: req.body.phone   
        }
        // console.log(data);
        const userData = await newAuthModel.findOne({ userId: data.userId })
        const customId = await customerById({ userId: userData.userId })
        let token = ""
        let name = ""
        let profileImage = ""
        let occupation = ""
        if (customId.status) {
            token = generateUserToken(customId.data)
            name = customId.name
            profileImage = customId.profileImage
            occupation = customId.occupation
            const saveData = new newAuthModel(data)``
            await saveData.save()
        } else {
            token = generateUserToken(userData)
        }
        return success(res, "login successful", {token , name , profileImage, occupation})
    } catch (error) {
        console.log(error);
        return unknownError(res, error.message)
    }
}


