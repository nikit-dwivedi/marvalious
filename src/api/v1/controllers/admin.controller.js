const { getAllCustomer } = require("../helpers/customer.helper")
const { data2CSV, writeCsv, getAllCount } = require('../helpers/admin.helper')
const { success, badRequest, unknownError } = require("../helpers/response_helper")
const { addSlab, getSlab, addSlabSetting } = require("../helpers/slab.helper")
const { getSlabSettingById, changeSlabToBooked } = require("../helpers/slab.helper");
const { parseJwt } = require("../middlewares/authToken");
const { addPartner } = require("../helpers/partner.helper");
const slabModel = require("../models/slab.model")
const balanceModel = require('../models/balance.model')
const customerModel = require("../models/customer.model")
const slabSettingModel = require("../models/slabSetting.model")
const bookingModel = require("../models/booking.model")
const partnerModel = require("../models/patner.model");
const transactionModel = require('../models/transaction.model')
const kycModel = require("../models/kyc.model");
const bankModel = require("../models/bank.model");
const settlementModel = require("../models/settlement.model")
const { roiPartnership } = require("../helpers/Roi.helper")
const configModel = require('../models/config.model');
const { nomineeModel } = require("../models/nominee.model");
const fs = require('fs');
const { responseFormater } = require("../formatter/response.format");
const { makePdf } = require("../RECEIPT/receipt")

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

exports.editRigs = async (req, res) => {
    try {
        const rigData = await slabModel.findOne()
        if (rigData) {
            const numberOfRig = req.body.numberOfRig
            if (!(typeof numberOfRig === "undefined")) {
                rigData.totalSlab = numberOfRig
                rigData.freeSlab = numberOfRig
                rigData.bookedSlab = 0
                await rigData.save()
                return rigData ? success(res, "rig edited") : badRequest(res, "rigs cannot be edited")
            } else {
                return badRequest(res, "invalid input")
            }
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
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
        const slabSettingList = await slabSettingModel.find().select("-_id -__v").sort()
        let settingList = []
        for (const slabData of slabSettingList) {
            let slotCalculator = 1 / ((slabData.percent * 1) / 100)
            const slabDetails = await slabModel.findOne()
            const slot = parseInt(slabDetails.freeSlab * slotCalculator)
            settingList.push({
                "slabSettingId": slabData.slabSettingId,
                "amount": slabData.amount,
                "percent": slabData.percent,
                "interest": slabData.interest,
                "income": slabData.income,
                "locking": slabData.locking,
                "slotBookingCharge": slabData.slotBookingCharge,
                "slot": slot
            })
        }
        return settingList[0] ? success(res, "here is the rig settings", settingList) : badRequest(res, "rig setting not found")
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
        return badRequest(res, "something went wrong")
    }
}
exports.deleteRigSetting = async (req, res) => {
    try {
        const slabSettingId = req.params.slabSettingId
        const slabSettingData = await slabSettingModel.findByIdAndDelete({ slabSettingId })
        return slabSettingData ? success(res, "rig setting deleted") : badRequest(res, "rig setting cannot be deleted")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.getAllCustomer = async (req, res) => {
    try {
        const customerdata = await customerModel.find().sort({ createdAt: -1 }).select("-_id -__v")
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
            // const rigId = rigSettingId
            const balanceData = await balanceModel.findOne({ customId })
            if (balanceData) {
                balanceData.investAmount = balanceData.investAmount + rigData.amount
                await balanceData.save()
            }
            // await bookingModel.findOneAndUpdate({ rigId }, { isPurchased: true })
            const data = {
                customId: customId,
                type: "Invested",
                amount: rigData.amount
            }
            const transaction = new transactionModel(data)
            await transaction.save()
        }
        const customerData = await customerModel.findOne({ customerId: customId }).select("name email phone")
        await makePdf(customerData.name, customerData.email, customerData.phone, rigData.amount)
        return success(res, message)
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}
exports.allPartnership = async (req, res) => {
    try {
        const partnerList = await partnerModel.find().sort({ createdAt: -1 })
        return partnerList[0] ? success(res, "here is the partner details", partnerList) : badRequest(res, "partner details could not found")
    } catch (error) {
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
        return badRequest(res, "something went  wrong")
    }
}

exports.getBalanceUser = async (req, res) => {
    try {
        const customId = req.params.customId
        const balanceDetails = await balanceModel.findOne({ customId })
        return balanceDetails ? success(res, "here is the balance", balanceDetails) : badRequest(res, "balance not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.allBalance = async (req, res) => {
    try {
        const balanceDetails = await balanceModel.find().select("-_id -__v")
        return balanceDetails[0] ? success(res, "balance details", balanceDetails) : badRequest(res, "balance not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.editBalance = async (req, res) => {
    try {
        const customId = req.params.customId
        const balanceData = await balanceModel.findOne({ customId })
        console.log(balanceData);
        if (balanceData) {
            const investAmount = req.body.investAmount
            const profit = req.body.profit
            if (!(typeof investAmount === undefined)) {
                balanceData.investAmount = investAmount
            }
            if (!(typeof profit === undefined)) {   
                balanceData.profit = profit
            }
            await balanceData.save()
            return balanceData ? success(res, "balance edited", balanceData) : badRequest(res, "balance cannot be edited")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}


exports.getKycById = async (req, res) => {
    try {
        const customId = req.params.customId
        const kycData = await kycModel.findOne({ customId }).select("-_id -__v")
        const nomineeData = await nomineeModel.findOne({ customerId: customId }).select("-_id -__v")
        if (kycData && nomineeData) {
            const data = {
                customId: kycData.customId,
                name: kycData.name,
                occupation: kycData.occupation,
                selfie: kycData.selfie,
                aadhaarNumber: kycData.aadhaarNumber,
                aadhaarFront: kycData.aadhaarFront,
                aadhaarBack: kycData.aadhaarBack,
                panNumber: kycData.panNumber,
                panFront: kycData.panFront,
                nomineeName: nomineeData.nomineeName,
                nomineeRelation: nomineeData.nomineeRelation,
                nomineeAadhaarNo: nomineeData.nomineeAadhaarNo
            }
            return success(res, "here is the kyc and nominee details", data)
        } else {
            return badRequest(res, "details not found")
        }
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
        const rigData = await partnerModel.find({ customId }).sort({createdAt:-1})
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
        const balanceList = await balanceModel.find({ profit: { $gt: 0 } })
        let formattedData;
        if (balanceList) {
            for (const balanceData of balanceList) {
                const customId = balanceData.customId
                const partnerData = await partnerModel.findOne({ isActive: true }, { customId })
                if (partnerData) {
                    const bankData = await bankModel.findOne({ customId })
                    if (bankData) {
                        const kycDetail = await kycModel.findOne({ isVerified: true }, { customId })
                        if (kycDetail) {
                            const data = {
                                customId: customId,
                                amount: parseInt(balanceData.profit)
                            }
                            const settlementData = new settlementModel(data)
                            formattedData = await settlementData.save()
                            const balanceDetails = await balanceModel.findOne({ customId })
                            const profit = 0
                            balanceDetails.profit = profit
                            await balanceDetails.save()
                        }
                    }
                }
            }
            return formattedData ? success(res, "settlement created") : badRequest(res, "settlement cannot be created")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.getAllSettlement = async (req, res) => {
    try {
        const settlementList = await settlementModel.find({ status: 'Processing' }).select("-_id -__v -createdAt -updatedAt")
        let settlementInfo = []
        for (const settleData of settlementList) {
            const customerData = await customerModel.findOne({ customId: settleData.customId }).select("-_id -__v -userId -email -city -occupation -profileImage -isVerified -createdAt -updatedAt")
            const bodyData = {
                customId: settleData.customId,
                name: customerData.name,
                phone: customerData.phone,
                type: settleData.type,
                amount: settleData.amount,
                status: settleData.status
            }
            settlementInfo.push(bodyData)
        }
        return settlementInfo[0] ? success(res, "here is the settlement details", settlementInfo) : badRequest(res, "settlement details not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.editSettlement = async (req, res) => {
    try {
        const settlementList = await settlementModel.find({ status: 'Processing' })
        let settledData;
        // let result
        if (settlementList) {
            for (i = 0; i < settlementList.length; i++) {
                settledData = settlementList[i]
                settledData.status = 'Settled'
                await settledData.save()
            }
            return success(res, "settled")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.editSettlementById = async (req, res) => {
    try {
        const customId = req.params.customId
        const settlementData = await settlementModel.findOne({ customId, status: 'Processing' })
        if (settlementData) {
            settlementData.status = 'Settled'
            await settlementData.save()
            return settlementData ? success(res, "settled") : badRequest(res, "could not settled")
        }
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.kycDelete = async (req, res) => {
    try {
        const customId = req.params.customId
        const kycDetails = await kycModel.findOneAndDelete({ customId: customId })
        const nomineeDetails = await nomineeModel.findOneAndDelete({ customerId: customId })
        return success(res, "kyc deleted")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}
// exports.DailyRoi = async (req, res) => {
//     try {
//         const currentDate = new Date().getTime() - (5 * 24 * 60 * 60 * 1000)
//         let newdate = new Date(currentDate)
//         const partnershipList = await partnerModel.find({ createdAt: { $lte: newdate } })  
//         if (partnershipList) {
//             for (i = 0; i < partnershipList.length; i++) {
//                 const partnership = partnershipList[i]
//                 const principleAmount = partnership.slabInfo.amount
//                 const rate = partnership.slabInfo.interest
//                 const time = 1
//                 const SI = ((principleAmount * rate * time / 100) / 12) / 30
//                 partnership.profit = partnership.profit + SI
//                 await partnership.save()
//                 const customId = partnership.customId
//                 const balanceData = await balanceModel.findOne({ customId })
//                 balanceData.profit = balanceData.profit + SI
//                 await balanceData.save()
//                 const data = {
//                     customId: customId,
//                     type: 'Credited',
//                     amount: SI,
//                 }
//                 const updateTransaction = new transactionModel(data)
//                 await updateTransaction.save()
//             }
//             return success(res, "Roi is created")
//         }
//     } catch (error) {
//         console.log(error);
//         return badRequest(res , "something went wrong")
//     }
// }

exports.DailyRoi = async (req, res) => {
    try {
        const currentDate = new Date().getTime() - (5 * 24 * 60 * 60 * 1000)
        let newdate = new Date(currentDate)
        await roiPartnership(newdate)
        return success(res, "Roi is created")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

exports.addConfig = async (req, res) => {
    try {
        let configData = await configModel.findOne()
        if (configData) {
            const version = req.body.version
            const tittle = req.body.tittle
            const message = req.body.message
            if (version) {
                configData.version = version
            }
            if (tittle) {
                configData.title = tittle
            }
            if (message) {
                configData.message = message
            }
        } else {
            const data = {
                version: req.body.version,
                tittle: req.body.tittle,
                message: req.body.message
            }
            configData = new configModel(data)
        }
        const formattedData = await configData.save()
        return formattedData ? success(res, "configuaration added") : badRequest("cannot added config")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.getConfig = async (req, res) => {
    try {
        const configData = await configModel.findOne()
        return configData ? success(res, "config details", configData) : badRequest(res, "config details cannot found")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.createBookingByAdmin = async (req, res) => {
    try {
        const customId = req.params.customId
        const data = req.body
        let index = {}
        for (let rigId in data) {
            const slabSettingId = rigId
            const slot = data[rigId]
            const rigDetails = await slabSettingModel.findOne({ slabSettingId })
            const percent = rigDetails.percent
            const bookingAmount = rigDetails.slotBookingCharge * slot
            data.slot = slot
            data.percent = percent
            data.bookingAmount = bookingAmount
            data.customId = customId
            data.rigId = rigId
            const remainingAmount = rigDetails.amount * slot - bookingAmount
            data.remainingAmount = remainingAmount
            index = new bookingModel(data)
            await index.save()
            const customerData = await customerModel.findOne({ customerId: customId }).select("name email phone")
            await makePdf(customerData.name, customerData.email, customerData.phone, bookingAmount)
        }
        return index ? success(res, "booking is created") : badRequest(res, "booking not created")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.getAllBooking = async (req, res) => {
    try {
        const customId = req.params.customId
        const bookingList = await bookingModel.find({ customId, isPurchased: false }).sort({createdAt:-1})
        return bookingList[0] ? success(res, "booking details", bookingList) : badRequest(res, "booking cannot be found")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.purchaseBooking = async (req, res) => {
    try {
        const customId = req.params.customId
        const bookingId = req.body._id
        const rigSettingId = req.body.rigSettingId
        const { status: rigStatus, message: rigMessage, data: rigData } = await getSlabSettingById(rigSettingId)
        if (!rigStatus) {
            return badRequest(res, rigMessage)
        }
        const { status, message } = await addPartner(customId, rigData)      
        if (!status) {
            return badRequest(res, message)
        }
        if ((rigData._doc.availableSlot + 1) % rigData.slot == 0) {
            await changeSlabToBooked()
        }
        if (addPartner) {
            // const rigId = rigSettingId
            const balanceData = await balanceModel.findOne({ customId: customId })
            if (balanceData) {
                balanceData.investAmount = balanceData.investAmount + rigData.amount
                await balanceData.save()
            }
            await bookingModel.findOneAndUpdate({ _id: bookingId }, { isPurchased: true })
            const data = {
                customId: customId,
                type: "Invested",
                amount: rigData.amount
            }
            const transaction = new transactionModel(data)
            await transaction.save()
        }
        const bookingData = await bookingModel.findOne({ customId: customId }).select("remainingAmount")
        const customerData = await customerModel.findOne({ customerId: customId }).select("name email phone")
        await makePdf(customerData.name, customerData.email, customerData.phone, bookingData.remainingAmount)
        return success(res, message)
    } catch (error) {
        console.log(error);
        return badRequest(res, "Something went wrong")
    }
}

exports.bookingRejectedByAdmin = async (req, res) => {
    try {
        const customId = req.params.customId
        const _id = req.body._id
        const bookingData = await bookingModel.findById(_id)
        if (bookingData) {
            bookingData.isRejected = true
            await bookingData.save()
            const balanceData = await balanceModel.findOne({ customId })
            if (balanceData) {
                const profit = bookingData.bookingAmount * 90 / 100
                balanceData.profit = balanceData.profit + profit
                await balanceData.save()
            }
            const profit = bookingData.bookingAmount * 90 / 100
            let type = 'Booking Settled'
            const data = {
                customId: customId,
                type: type,
                amount: profit
            }
            const transaction = new transactionModel(data)
            await transaction.save()
            return success(res, "booking withdraw")
        }
    } catch (error) {

    }
}

exports.totalInvestedAmount = async (req, res) => {
    try {
        const totalInvestedAmount = await partnerModel.aggregate([{ $group: { _id: null, totalAmount: { $sum: "$slabInfo.amount" } } }])
        return totalInvestedAmount[0] ? success(res, "total invested amount", totalInvestedAmount[0]) : badRequest(res, "invested amount not found")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.totalBookingAmount = async (req, res) => {
    try {
        const totalBookingAmount = await bookingModel.aggregate([{$match: {$and : [{isPurchased:false},{isRejected:false}]}}, { $group: { _id: null, totalAmount: { $sum: "$bookingAmount" } } }])
        return totalBookingAmount[0] ? success(res, "total booking amount", totalBookingAmount[0]) : badRequest(res, "booking amount not found")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}


exports.convertSettlementToCSV = async (req, res) => {
    try {
        const settlementList = await settlementModel.find({ status: 'Processing' })
        let csvData = []
        for (const settlementData of settlementList) {
            const userData = await customerModel.findOne({ customId: settlementData.customId })
            const bankData = await bankModel.findOne({ customId: settlementData.customId })
            const amount = settlementData.amount
            const { name, phone } = userData
            const { bankName, accountNumber, ifsc, accountHolderName, upiId } = bankData
            const bodyData = { name, phone, amount, bankName, accountNumber, ifsc, accountHolderName, upiId, }
            csvData.push(bodyData)
            const path = './settlements.csv'
            const subject = "Below is your settlement report"
            const filename = "settlements.csv"
            await data2CSV(csvData, path, subject, filename)
        }
        return csvData ? success(res, "converted to csv file",) : badRequest(res, "not converted to csv")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.createCustomerReport = async (req, res) => {
    try {
        const customerList = await customerModel.find().select("-_id -__v -userId -updatedAt -isVerified -profileImage -customerId").sort({ createdAt: -1 })
        const newData = customerList.map((investorData) => {
            investorData._doc.createdAt = new Date(investorData._doc.createdAt).toLocaleDateString('en-IN')
            return investorData._doc
        })
        const path = "./customer.csv"
        const subject = "Below is your customer report"
        const filename = "customer.csv"
        await data2CSV(newData, path, subject, filename)
        return success(res, "converted to csv file")
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}

exports.totalCounts = async (req, res) => {
    try {
        const { status, message, data } = await getAllCount()
        return status ? success(res, message, data) : badRequest(res , message)
    } catch (error) {
        return badRequest(res, "Something went wrong")
    }
}