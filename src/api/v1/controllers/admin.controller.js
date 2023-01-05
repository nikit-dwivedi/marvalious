const { getAllCustomer } = require("../helpers/customer.helper")
const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { addSlab, getSlab, addSlabSetting } = require("../helpers/slab.helper")
const { getSlabSettingById, changeSlabToBooked } = require("../helpers/slab.helper");
const { parseJwt } = require("../middlewares/authToken");
const { addPartner } = require("../helpers/partner.helper");
const balanceModel = require('../models/balance.model')
const customerModel = require("../models/customer.model")
const slabSettingModel = require("../models/slabSetting.model")
const bookingModel = require("../models/booking.model")
const partnerModel = require("../models/patner.model");
const transactionModel = require('../models/transaction.model')
const kycModel = require("../models/kyc.model");
const bankModel = require("../models/bank.model");
const settlementModel = require("../models/settlement.model")

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

exports.getAllRigSetting = async (req, res) => {
    try {
        const rigData = await slabSettingModel.find()
        return rigData[0] ? success(res, "here is the rig settings", rigData) : badRequest(res, "rig setting not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
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
            const slotBookingCharge = req.body.slotBookingCharge
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
            if (slotBookingCharge) {
                slabSettingData.slotBookingCharge = slotBookingCharge
            }
            const rigData = await slabSettingData.save()
            rigData ? success(res, "rig setting updated") : badRequest(res, "rig setting cannot be updated")
        }
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}
exports.deleteRigSetting = async (req, res) => {
    try {
        const slabSettingId = req.params.slabSettingId
        const slabSettingData = await slabSettingModel.findByIdAndDelete({ slabSettingId })
        return slabSettingData ? success(res, "rig setting deleted"): badRequest(res, "rig setting cannot be deleted")
    } catch (error) {
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
            if (isVerified == true) {
                kycData.isVerified = isVerified
                const formattedKyc = await kycData.save()
                return success(res, "kyc is verified")
            } else {
                kycData.isVerified = isVerified
                const formattedKyc = await kycData.save()
                return success(res, "kyc is rejected")
            }
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

        if (isVerified == true) {
            const kycDetails = await kycModel.find({ isVerified: true })
            return kycDetails[0] ? success(res, "here is the kyc details", kycDetails) : badRequest(res, "kyc details not found")
        } else {
            const kycData = await kycModel.find({ isVerified: false })
            return kycData[0] ? success(res, "here is the kyc details", kycData) : badRequest(res, "kyc details not found")
        }
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went  wrong")
    }
}

exports.getBalanceUser = async (req, res) => {
    try {
        const customId = req.params.customId
        const balanceDetails = await balanceModel.findOne({ customId })
        return balanceDetails ? success(res, "here is the balance", balanceDetails) : badRequest(res, "balance not found")
    } catch (error) {
        console.log(error.message);
        badRequest(res, "something went wrong")
    }
}

exports.allBalance = async (req, res) => {
    try {
        const balanceDetails = await balanceModel.find()
        return balanceDetails[0] ? success(res, "balance details", balanceDetails) : badRequest(res, "balance not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.editBalance = async (req, res) => {
    try {
        const customId = req.params.customId
        const balanceData = await balanceModel.findOne({ customId })
        if (balanceData) {
            const investAmount = req.body.investAmount
            const profit = req.body.profit
            if (investAmount) {
                balanceData.investAmount = investAmount
            }
            if (profit) {
                balanceData.profit = profit
            }
            const editBalance = new balanceModel(balanceData)
            const saveBalance = editBalance.save()
            return saveBalance ? success(res, "balance edited") : badRequest(res, "balance cannot be edited")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}


exports.getKycById = async (req, res) => {
    try {
        const customId = req.params.customId
        const kycData = await kycModel.findOne({ customId })
        return kycData ? success(res, "here is the kyc details", kycData) : badRequest(res, "kyc cannot found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.getBankById = async (req, res) => {
    try {
        const customId = req.params.customId
        const bankData = await bankModel.findOne({ customId })
        return bankData ? success(res, "here is the bank details", bankData) : badRequest(res, "bank details cannot found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.customerId
        const customerData = await customerModel.findOne({ customerId })
        return customerData ? success(res, "here is the customer details", customerData) : badRequest(res, "customer details cannot found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}


exports.getCustomerPurchaseRigs = async (req, res) => {
    try {
        const customId = req.params.customId
        const rigData = await partnerModel.find({ customId })
        return rigData[0] ? success(res, "here is the purchsed rigs", rigData) : badRequest(res, "details not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}


exports.getCustomerBookedRigs = async (req, res) => {
    try {
        const customId = req.params.customId
        const bookedData = await bookingModel.find({ customId })
        return bookedData[0] ? success(res, "here is the booked rigs", bookedData) : badRequest(res, "booking not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.createSettlement = async (req, res) => {       // ==============for profit only===============//
    try {
        const balanceList = await balanceModel.find()
        let formattedData;
        if (balanceList) {
            for (i = 0; i < balanceList.length; i++) {
                const customId = balanceList[i].customId
                // console.log("customId=======>",customId);
                const bankData = await bankModel.findOne({ customId })
                // console.log("bankData===>",bankData);
                if (bankData) {
                    const kycDetail = await kycModel.find({ isVerified: true }, { customId })
                    // console.log("kycDetail====>",kycDetail);
                    if (kycDetail) {
                        const data = {
                            customId: balanceList[i].customId,
                            amount: balanceList[i].profit
                        }
                        const settlementData = new settlementModel(data)
                        formattedData = await settlementData.save()
                        const balanceDetails = await balanceModel.findOne({ customId })
                        const profit = 0
                        balanceDetails.profit[i] = profit
                        const updateProfit = new balanceModel(balanceDetails)
                        await updateProfit.save()
                    }
                }
            }
            return formattedData ? success(res, "settlement created") : badRequest(res, "settlement cannot be created")
        }
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

exports.getAllSettlement = async (req, res) => {
    try {
        const settlementData = await settlementModel.find()
        return settlementData[0] ? success(res, "here is the settlement details", settlementData) : badRequest(res, "settlement details not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.editSettlement = async (req, res) => {
    try {
        const settlementList = await settlementModel.find({ status: 'Processing' })
        let settledData;
        console.log(settlementList);
        if (settlementList) {
            for (i = 0; i < settlementList.length; i++) {
                settledData = settlementList[i]
                settledData.status = 'Settled'
            }
            return settledData.save() ? success(res, "settled") : badRequest(res, "settlement not settled")
        }
    } catch (error) {
        console.log(error);
        return badRequest(res, "something went wrong")
    }
}

exports.kycDelete = async (req, res) => {
    try {
        const customId = req.params.customId
        const kycDetails = await kycModel.findByIdAndDelete(customId)
        return kycDetails ? success(res, "kyc deleted") : badRequest(res, "bank cannot be deleted")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}




