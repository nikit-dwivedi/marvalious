const { genrateOtpPhone, addAuth, verifyOtp, checkAuthByPhone, checkAuthByEmail, genrateOtpEmail, checkLogin } = require("../helpers/auth.helper")
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const authModel = require("../models/auth.model");

module.exports = {
    login: async (req, res) => {
        try {
            const { phone, ...garbage } = req.body
            if (!phone || Object.entries(garbage)[0]) {
                return badRequest(res, "please provide proper data");
            }
            const userCheck = await checkAuthByPhone(phone);
            if (!userCheck) {
                const { status: rStatus, message: rMessage, data: rData } = await addAuth(phone)
                return rStatus ? success(res, rMessage, rData) : badRequest(res, rMessage);
            }
            let { status, message, data } = await genrateOtpPhone(phone);
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            console.log(error);
            return unknownError(res, error.message)
        }
    },
    verifyUserOtp: async (req, res) => {
        try {
            const { reqId, otp } = req.body
            const { status, message, data } = await verifyOtp(reqId, otp);
            return status ? success(res, message, data) : badRequest(res, message);
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
}