const { authByUserId } = require("../helpers/auth.helper");
const { addBank, getBank } = require("../helpers/bank.helper");
const { onboardCustomer, addNewAddress, getAddress, customerById, removeAddress } = require("../helpers/customer.helper");
const { addKyc, getKyc } = require("../helpers/kyc.helper");
const { addNominee, getNominee, editNominee } = require("../helpers/nominee.helper");
const { addPartner, getPartnerOfUser } = require("../helpers/partner.helper");
const { unknownError, success, badRequest } = require("../helpers/response_helper");
const { getSlabSettingById, changeSlabToBooked, getAllSlabSetting } = require("../helpers/slab.helper");
const { parseJwt } = require("../middlewares/authToken");
const kycModel = require("../models/kyc.model")
const { nomineeModel } = require("../models/nominee.model")
const { responseFormater } = require('../formatter/response.format');
const customerModel = require('../models/customer.model');
const bankModel = require("../models/bank.model");
const bookingModel = require("../models/booking.model");
const transactionModel = require("../models/transaction.model")

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
            const { status, message, data } = await addBank(token.customId, req.body)
            return status ? success(res, message, data) : badRequest(res, message)
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
    editBankDetails: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const bankId = req.params.bankId
            const bankData = await bankModel.findOne({ bankId })
            if (bankData) {
                const bankName = req.body.bankName
                const accountNumber = req.body.accountNumber
                const ifsc = req.body.ifsc
                const accountHolderName = req.body.accountHolderName
                const isActive = req.body.isActive
                if (bankName) {
                    bankData.bankName = bankName
                }
                if (accountNumber) {
                    bankData.accountNumber = accountNumber
                }
                if (ifsc) {
                    bankData.ifsc = ifsc
                }
                if (accountHolderName) {
                    bankData.accountHolderName = accountHolderName
                }
                if (isActive) {
                    bankData.isActive = isActive
                }
                const bankDetails = await bankData.save()
                bankDetails ? success(res, "bank details updated") : badRequest(res, "bank details cannot be edited")
            }
        } catch (error) {
            console.log(error.message);
            return badRequest(res, "something went wrong")
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
            const rigSettingId = req.params.rigSettingId
            const { status: rigStatus, message: rigMessage, data: rigData } = await getSlabSettingById(rigSettingId)
            if (!rigStatus) {
                return badRequest(res, rigMessage)
            }
            const token = parseJwt(req.headers.authorization)
            const { status, message } = await addPartner(token.customId, rigData)
            // console.log(rigData);
            if (!status) {
                return badRequest(res, message)
            }
            if ((rigData._doc.availableSlot + 1) % rigData.slot == 0) {
                await changeSlabToBooked()
            }
            if (addPartner) {
                const rigId = rigSettingId
                // const amount = rigData.amount 
                const customId = token.customId
                await bookingModel.findOneAndUpdate({ rigId }, { isPurchased: true })
                const transactionDetails = await transactionModel.findOne({ customId }) 
                const totalAmount = rigData.amount
                transactionDetails.amount += totalAmount
                transactionDetails.save()

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
    },

    addKycAndNominee: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const customId = token.customId
            const kycCheck = await kycModel.findOne({ customId })
            if (!kycCheck) {
                const kycData = {
                    customId: customId,
                    name: req.body.name,
                    occupation: req.body.occupation,
                    selfie: req.body.selfie,
                    aadhaarNumber: req.body.aadhaarNumber,
                    aadhaarFront: req.body.aadhaarFront,
                    aadhaarBack: req.body.aadhaarBack,
                    panNumber: req.body.panNumber,
                    panFront: req.body.panFront
                }
                //   console.log(kycData);     
                const nomineeData = {
                    customerId: customId,
                    nomineeName: req.body.nomineeName,
                    nomineeRelation: req.body.nomineeRelation,
                    nomineeAadhaarNo: req.body.nomineeAadhaarNo
                }
                const formattedData = new kycModel(kycData)
                await formattedData.save()
                const customerId = token.customId
                const profileImage = req.body.selfie
                await customerModel.findOneAndUpdate({ customerId }, { profileImage })
                const formattedNomineeData = new nomineeModel(nomineeData)
                await formattedNomineeData.save()
                const data = { formattedData, formattedNomineeData }
                return data ? success(res, "kyc and nominee added") : badRequest(res, "kyc and nominee cannot be added")
            } else {
                badRequest(res, "kyc is already added")
            }
        } catch (error) {
            console.log(error);
            return badRequest(res, "something went wrong")
        }
    },

    getKycAndNominee: async (req, res) => {
        try {
            const token = parseJwt(req.headers.authorization)
            if (!token.customId) {
                return badRequest(res, "please onboard first")
            }
            const customId = token.customId
            const customerId = token.customId
            const kycData = await kycModel.findOne({ customId })
            const nomineeData = await nomineeModel.findOne({ customerId })
            const data = {
                kyc: kycData,
                nominee: nomineeData
            }
            if (data.kyc && data.nominee) {
                return success(res, "here is the kyc and nominee details", data)
            } else {
                return badRequest(res, "details not found")
            }
        } catch (error) {
            return badRequest(res, "something went wrong")
        }
    }


}