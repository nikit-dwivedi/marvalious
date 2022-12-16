const express = require('express');
const router = express.Router();

const { createBooking, getBooking } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/createBooking', authenticateUser, createBooking)
router.get('/getDetails', authenticateUser, getBooking)


module.exports = router