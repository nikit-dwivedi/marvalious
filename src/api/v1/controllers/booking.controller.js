const { unknownError, success, badRequest, created } = require("../helpers/response_helper")
const { parseJwt } = require("../middlewares/authToken");
const bookingModel = require("../models/booking.model");
const slabSettingModel = require("../models/slabSetting.model");



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
        return index ? success(res, "booking is created" , index) : badRequest(res, "booking not created")
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

const getBooking = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        if (!token.customId) {
            return badRequest(res, "please onboard first")
        }
        const bookingData = await slabSettingModel.find().select('-_id -__v -interest -income -locking -amount')
        return bookingData ? success(res, "here is rig details" , bookingData) : badRequest(res, "details not found")
    } catch (error) {
        badRequest(res, "something went wrong")
    }
}






module.exports = { createBooking, getBooking }