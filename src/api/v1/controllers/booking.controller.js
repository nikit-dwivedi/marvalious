const { success, badRequest } = require("../helpers/response_helper")
const { parseJwt } = require("../middlewares/authToken");
const { getSlabSettingById, changeSlabToBooked, getAllSlabSetting } = require("../helpers/slab.helper");
const { addPartner, getPartnerOfUser } = require("../helpers/partner.helper");
const balanceModel = require("../models/balance.model");
const bookingModel = require("../models/booking.model");
const slabSettingModel = require("../models/slabSetting.model");
const transactionModel = require("../models/transaction.model");



const createBooking = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const customId = token.customId
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

        }
        return index ? success(res, "booking is created") : badRequest(res, "booking not created")
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

const getAllSlots = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const bookingData = await slabSettingModel.find().select('-_id -__v -interest -income -locking -amount -slot')
        return bookingData[0] ? success(res, "here is rig details", bookingData) : badRequest(res, "details not found")
    } catch (error) {
        badRequest(res, "something went wrong")
    }
}
const allBookings = async (req, res) => {
    try {
        const bookingData = await bookingModel.find()
        return bookingData ? success(res, "here is all the bookings", bookingData) : badRequest(res, "booking not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}
const allBookingUser = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const customId = token.customId
        const bookingData = await bookingModel.find({ customId :customId, isPurchased: false , isRejected:false})
        return bookingData[0] ? success(res, "here is all the bookings", bookingData) : badRequest(res, "booking not found")
    } catch (error) {
        return badRequest(res, "something went wrong")
    }
}

const bookingRejected = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const customId = token.customId
        const id = req.params.bookingId
        const bookingData = await bookingModel.findById(id)
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
            console.log(transaction);
            await transaction.save()
            return success(res, "booking withdraw")
        }
    } catch (error) {
        console.log(error);
        return badRequest(res, "something went wrong")
    }
}

const purchaseBooking = async (req, res) => {
    try {
        const rigSettingId = req.body.rigSettingId
        const bookingId = req.body._id
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
            if (addPartner) {
                // const rigId = rigSettingId
                const balanceData = await balanceModel.findOne({ customId: token.customId })
                if (balanceData) {
                    balanceData.investAmount = balanceData.investAmount + rigData.amount
                    await balanceData.save()
                }
                await bookingModel.findOneAndUpdate({ _id: bookingId }, { isPurchased: true })
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
        return badRequest(res, "something went wrong")
    }
}










module.exports = { createBooking, getAllSlots, allBookings, allBookingUser, bookingRejected, purchaseBooking }