const { unknownError, success, badRequest, created } = require("../helpers/response_helper")
const { parseJwt } = require("../middlewares/authToken");
const bookingModel = require("../models/booking.model");
const slabSettingModel = require("../models/slabSetting.model");
const bookingTransactionModel = require("../models/bookingTransaction.model")
const { addRigSetting } = require("./admin.controller");


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
            const totalAmount = rigDetails.bookingPerCharge * slot
            data.slot = slot
            data.percent = percent
            data.totalAmount = totalAmount
            data.customId = customId
            data.rigId = rigId
            index= new bookingModel(data)
             await index.save()             

        }
        return index ? success(res, "booking is created") : badRequest(res, "booking not created")
    } catch (error) {
        console.log(error.message);
        return badRequest(res, "something went wrong")
    }
}

const getBookingTransaction = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}






module.exports = {createBooking }