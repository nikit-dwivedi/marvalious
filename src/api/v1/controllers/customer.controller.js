const { authByUserId } = require("../helpers/auth.helper");
const { addBank, getBank } = require("../helpers/bank.helper");
const { onboardCustomer, addNewAddress, getAddress, customerById, removeAddress } = require("../helpers/customer.helper");
const { addKyc, getKyc } = require("../helpers/kyc.helper");
const { addNominee, getNominee, editNominee } = require("../helpers/nominee.helper");
const { addPartner, getPartnerOfUser } = require("../helpers/partner.helper");
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { getSlabSettingById, changeSlabToBooked, getAllSlabSetting } = require("../helpers/slab.helper");
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
            return status ? success(res, message, data) : badRequest(res, message)
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
            const { status, message } = await addKyc(token.customId, req.body)
            return status ? success(res, message) : badRequest(res, message)
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
            return status ? success(res, message, data) : badRequest(res, message)
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
            const { status, message } = await addBank(token.customId, req.body)
            return status ? success(res, message) : badRequest(res, message)
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
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    addNomineeDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, } = await addNominee(token.customId, req.body)
            return status ? success(res, message) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    getNomineeDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message, data } = await getNominee(token.customId)
            console.log(data);
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    changeNomineeDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const { status, message } = await editNominee(token.customId, req.body)
            return status ? success(res, message) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    getRifInfo: async (req, res) => {
        try {
            const { rigSettingId } = req.params
            const { status, message, data } = await getSlabSettingById(rigSettingId)
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    purchaseRig: async (req, res) => {
        try {
            const { rigSettingId } = req.body
            const { status: rigStatus, message: rigMessage, data: rigData } = await getSlabSettingById(rigSettingId)
            if (!rigStatus) {
                return badRequest(res, rigMessage)
            }
            const token = parseJwt(req.headers.authorization)
            const { status, message } = await addPartner(token.customId, rigData)
            if (!status) {
                return badRequest(res, message)
            }
            if ((rigData._doc.availableSlot + 1) % rigData.slot == 0) {
                await changeSlabToBooked()
            }
            return success(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    getAllRigOfUser: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization);
            const { status, message, data } = await getPartnerOfUser(token.customId)
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    },
    allRigSetting: async (req, res) => {
        try {
            const { status, message, data } = await getAllSlabSetting()
            return status ? success(res, message, data) : badRequest(res, message)
        } catch (error) {
            return unknownError(res, error.message)
        }
    }
}