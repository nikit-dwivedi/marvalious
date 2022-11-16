const { authByUserId } = require("../helpers/auth.helper");
const { addBank, getBank } = require("../helpers/bank.helper");
const { onboardCustomer, addNewAddress, getAddress, customerById, removeAddress } = require("../helpers/customer.helper");
const { addKyc, getKyc } = require("../helpers/kyc.helper");
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { parseJwt } = require("../middlewares/authToken");

module.exports = {
    onboard: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const authData = await authByUserId(token.userId)
            const { status, message, data } = await onboardCustomer(token.userId, authData.phone, req.body);
            return status ? success(res, message, data) : badRequest(res, message);
        } catch (error) {
            return unknownError(res, "unknown error")
        }
    },
    getCustomerById: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            const { status, message, data } = await customerById(token.userId)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error)
        }
    },
    addKycDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, data } = await addKyc(token.customId, req.body, req.files)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    getKycDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, data } = await getKyc(token.customId)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    addBankDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, data } = await addBank(token.customId, req.body)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    getBankDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, data } = await getBank(token.customId)
            return status ? success(res, message, data) : badRequest(res, message, data)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
}