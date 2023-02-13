const express = require('express');
const router = express.Router();

const { createBooking, getAllSlots, allBookings, allBookingUser, bookingRejected, purchaseBooking } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/createBooking', authenticateUser, createBooking)
router.get('/getAllSlots', authenticateUser, getAllSlots)
router.get('/allBookings',  allBookings)
router.get('/bookingByUser', authenticateUser, allBookingUser)
router.post('/rejected/:bookingId', authenticateUser, bookingRejected)
router.post('/purchase', authenticateUser, purchaseBooking)



module.exports = router