    const express = require("express");
    const router = express.Router();

    require("../v1/config/mongodb");


const newAuthRoute = require('./routes/newAuth.route')
const authRoute = require('./routes/auth.route.js')
const customerRoute = require('./routes/customer.route');
const adminRoute = require('./routes/admin.route');
const bookingRoute = require('./routes/booking.route')
const transactionRoute = require('./routes/transaction.route')


router.use('/newauth', newAuthRoute)
router.use("/auth", authRoute);
router.use('/customer', customerRoute);
router.use('/admin', adminRoute)
router.use('/booking', bookingRoute)
router.use('/transaction', transactionRoute)


module.exports = router;
