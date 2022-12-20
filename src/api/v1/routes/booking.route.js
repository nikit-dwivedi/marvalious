const express = require('express');
const router = express.Router();

const { createBooking, getAllSlots, bookingById, allBookings, allBookingUser } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/createBooking', authenticateUser, createBooking)
router.get('/getAllSlots', authenticateUser, getAllSlots)
router.get('/bookingById', authenticateUser, bookingById)
router.get('/allBookings', authenticateUser, allBookings)
router.get('/bookingByUser', authenticateUser, allBookingUser )


module.exports = router