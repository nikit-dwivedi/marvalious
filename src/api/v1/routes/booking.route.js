const express = require('express');
const router = express.Router();

const {createBooking } = require("../controllers/booking.controller")
const { authenticateUser } = require('../middlewares/authToken');



router.post('/createBooking', authenticateUser, createBooking)


module.exports = router