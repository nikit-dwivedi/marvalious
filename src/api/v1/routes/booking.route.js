const express = require('express');
const router = express.Router();

const { createBooking, getAllSlots, bookingById, allBookings } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/createBooking', authenticateUser, createBooking)
router.get('/getDetails', authenticateUser, getAllSlots)
router.get('/bookingById', authenticateUser, bookingById)
router.get('/allBookings', authenticateUser, allBookings )


module.exports = router