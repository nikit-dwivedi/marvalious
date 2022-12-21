const { getAllCustomer } = require("../helpers/customer.helper")
const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { addSlab, getSlab, addSlabSetting } = require("../helpers/slab.helper")
const { getSlabSettingById, changeSlabToBooked } = require("../helpers/slab.helper");
const { addPartner } = require("../helpers/partner.helper");
const balanceModel = require('../models/balance.model')
const customerModel = require("../models/customer.model")
const slabSettingModel = require("../models/slabSetting.model")
const bookingModel = require("../models/booking.model")
const partnerModel = require("../models/patner.model");
const transactionModel = require('../models/transaction.model')
const kycModel = require("../models/kyc.model");

exports.registerAdmin = async (req, res) => {
    try {

    } catch (error) {

    }
}

exports.addRigsAmount = async (req, res) => {
    try {
        const { numberOfRig } = req.body
        const { status, message, data } = await addSlab(numberOfRig)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.getRigs = async (req, res) => {
    try {
        const { status, message, data } = await getSlab();
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.addRigSetting = async (req, res) => {
    try {
        const { status, message } = await addSlabSetting(req.body)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.editRigSetting = async (req, res) => {
    try {
        const slabSettingId = req.params.slabSettingId
        const slabSettingData = await slabSettingModel.findOne({ slabSettingId })
        if (slabSettingData) {
            const amount = req.body.amount
            const percent = req.body.percent
            const interest = req.body.interest
            const income = req.body.income
            const locking = req.body.locking
            const slot = req.body.slot
            const bookingPerCharge = req.body.bookingPerCharge
            if (amount) {
                slabSettingData.amount = amount
            }
            if (percent) {
                slabSettingData.percent = percent
            }
            if (interest) {
                slabSettingData.interest = interest
            }
            if (income) {
                slabSettingData.income = income
            }
            if (locking) {
                slabSettingData.locking = locking
            }
            if (slot) {
                slabSettingData.slot = slot
            }
            if (bookingPerCharge) {
                slabSettingData.bookingPerCharge = bookingPerCharge
            }
            const rigData = await slabSettingData.save()
            rigData ? success(res, "rig setting updated") : badRequest(res, "rig setting cannot be updated")
        }
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

exports.getAllCustomer = async (req, res) => {
    try {
        const customerdata = await customerModel.find()
        return customerdata[0] ? success(res, "here are all the customers", customerdata) : badRequest(res, "customers not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}


exports.addPartnershipByAdmin = async (req, res) => {
    try {
        const rigSettingId = req.body.rigSettingId
        const { status: rigStatus, message: rigMessage, data: rigData } = await getSlabSettingById(rigSettingId)
        if (!rigStatus) {
            return badRequest(res, rigMessage)
        }
        const customId = req.body.customId
        const { status, message } = await addPartner(customId, rigData)
        if (!status) {
            return badRequest(res, message)
        }
        if ((rigData._doc.availableSlot + 1) % rigData.slot == 0) {
            await changeSlabToBooked()
        }
        if (addPartner) {
            const rigId = rigSettingId
            await bookingModel.findOneAndUpdate({ rigId }, { isPurchased: true })
            const data = {
                customId: token.customId,
                type: "Invested",
                amount: rigData.amount
            }
            const transaction = new transactionModel(data)
            await transaction.save()
        }
        return success(res, message)
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

exports.editKycVerified = async (req, res) => {
    try {
        const customId = req.params.customId
        const kycData = await kycModel.findOne({ customId })
        if (kycData) {
            const isVerified = req.body.isVerified
            if (isVerified) {
                kycData.isVerified = isVerified
            }
            const formattedKyc = await kycData.save()
            return formattedKyc ? success(res, "kyc is verified") : badRequest(res, "kyc cannot be verified")
        } else {
            return badRequest(res, "kyc not found")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.getAllKyc = async (req, res) => {
    try {
        let isVerified = req.body.isVerified
        if (isVerified == "true") {
            const kycDetails = await kycModel.find({ isVerified: true })
            return kycDetails ? success(res, "here is the kyc details", kycDetails) : badRequest(res, "kyc details not found")
        } else {
            const kycData = await kycModel.find({ isVerified: false })
            return kycData ? success(res, "here is the kyc details", kycData) : badRequest(res, "kyc details not found")
        }
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went  wrong")
    }
}

exports.getBalanceById = async (req, res) => {
    try {
        const customId = req.params.customId
        const balanceDetails = await balanceModel.findOne({ customId })
        return balanceDetails ? success(res, "here is the balance") : badRequest(res, "balance not found")
    } catch (error) {
        console.log(error.message);
        badRequest(res, "something went wrong")
    }
}


exports.allBalance = async (req, res) => {
    try {
        const balanceDetails = await balanceModel.find()
        return balanceDetails[0] ? success(res, "here is the all balance", balanceDetails) : badRequest(res, "balance not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}