const express = require('express');
const router = express.Router();

const { addBooking, getBookings, bookingById } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/addBooking', authenticateUser,addBooking)
router.get('/allBookings', authenticateUser, getBookings)
router.get('/bookingByid/:bookingId', authenticateUser, bookingById)


module.exports = router