const { unknownError, success, badRequest, created } = require("../helpers/response_helper")
const { parseJwt } = require("../middlewares/authToken");
const bookingModel = require("../models/booking.model")



const addBooking = async (req, res) => {
    try {
        const data = req.body
        const bookingData = new bookingModel(data)
        await bookingData.save()
        return bookingData ? created(res, "booking added") : badRequest(res, "cannot added booking")
    } catch (error) {
        return badRequest("something went wrong")
    }
}


const getBookings = async (req, res) => {
    try {
        const data = await bookingModel.find()
        data ? success(res, "here all the bookings", data) : badRequest(res, "cannot get bookings")
    } catch (error) {
        return badRequest("something went wrong")
    }
}

const bookingById = async (req, res) => {
    try {
        const bookingId  = req.params.bookingId
        const data = await bookingModel.findById( bookingId )
        data ? success(res, "here is the booking", data) : badRequest(res, "cannot get bookings")
    } catch (error) {
        return badRequest("something went wrong")
    }
}


module.exports = { addBooking, getBookings, bookingById }